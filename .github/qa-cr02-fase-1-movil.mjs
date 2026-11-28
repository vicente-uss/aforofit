import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { chromium, expect } from 'playwright/test';

const app = 'http://127.0.0.1:3000';
const api = process.env.NEXT_PUBLIC_SUPABASE_URL;
const apikey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const db = process.env.AFOROFIT_TEST_DATABASE_URL;
assert.equal(api, 'http://127.0.0.1:54321');
assert.match(db, /@127\.0\.0\.1:54322\//);

// El ensayo usa la hora real del runner y un horario abierto todo el día.
execFileSync('psql', [db, '-Xv', 'ON_ERROR_STOP=1', '-c', `
  update public.visitas set salida = entrada where salida is null;
  delete from public.turnos;
  update public.configuracion set capacidad = 1, horario = (
    select jsonb_object_agg(dia, '{"apertura":"00:00","ultimo_ingreso":"23:59","cierre":"23:59"}'::jsonb)
    from unnest(array['lunes','martes','miercoles','jueves','viernes','sabado','domingo']) as dias(dia)
  ) where id = 1;
`]);

function pdfDePrueba(tamano = 0) {
  const objetos = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] >>',
  ];
  let contenido = '%PDF-1.4\n';
  const offsets = objetos.map((objeto, indice) => {
    const offset = contenido.length;
    contenido += `${indice + 1} 0 obj\n${objeto}\nendobj\n`;
    return offset;
  });
  function indice(offset) {
    return `xref\n0 4\n0000000000 65535 f \n${offsets.map((n) =>
      `${String(n).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n${offset}\n%%EOF\n`;
  }
  if (tamano) {
    const relleno = tamano - contenido.length - indice(tamano).length;
    contenido += ('%' + ' '.repeat(62) + '\n').repeat(Math.floor(relleno / 64));
    contenido += '\n'.repeat(relleno % 64);
  }
  return Buffer.from(contenido + indice(contenido.length));
}

async function login(pagina, rol) {
  await pagina.goto(app + '/auth/login');
  await pagina.getByLabel('Correo').fill(`${rol}.demo@aforofit.cl`);
  await pagina.getByLabel('Contraseña', { exact: true }).fill('Solo-Pruebas-019!');
  await pagina.getByRole('button', { name: 'Ingresar', exact: true }).click();
  await pagina.waitForURL(`**/${rol}`);
}

async function tokenDe(rol) {
  const respuesta = await fetch(`${api}/auth/v1/token?grant_type=password`, {
    method: 'POST', headers: { apikey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: `${rol}.demo@aforofit.cl`, password: 'Solo-Pruebas-019!' }),
  });
  assert.ok(respuesta.ok, `Auth desechable: ${rol}`);
  return respuesta.json();
}

const navegador = await chromium.launch({ headless: true });
try {
  const profesor = await navegador.newPage({ viewport: { width: 360, height: 820 }, acceptDownloads: true });
  await login(profesor, 'profesor');
  await profesor.goto(app + '/profesor/inscripciones');
  const tipo = profesor.getByLabel('Tipo de persona');
  const guardar = profesor.getByRole('button', { name: 'Guardar inscripción' });
  const confirmado = profesor.getByRole('status').filter({ hasText: 'Inscripción guardada.' });
  const pdf = pdfDePrueba(10 * 1024 * 1024);
  assert.equal(pdf.length, 10 * 1024 * 1024);
  const archivo = { name: 'certificado-ficticio.pdf', mimeType: 'application/pdf', buffer: pdf };
  const hoy = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Santiago' }).format(new Date());
  const admin = await navegador.newPage({ viewport: { width: 360, height: 820 } });
  await login(admin, 'admin');
  await admin.goto(app + '/admin/habilitacion');

  async function consultarAdmin(nombre) {
    await admin.getByLabel('Buscar por nombre').fill(nombre);
    await admin.getByRole('button', { name: 'Buscar', exact: true }).click();
    await admin.getByRole('button', { name: nombre, exact: true }).click();
  }

  async function llenarFicha(nombre, rut, categoria) {
    await tipo.selectOption(categoria);
    await profesor.getByLabel('Nombre completo').fill(nombre);
    await profesor.getByLabel('RUT sin puntos y con guion').fill(rut);
    await profesor.getByLabel('Correo institucional').fill('demo@correo.uss.cl');
    await profesor.getByLabel('Fecha de nacimiento').fill('2000-01-01');
    await profesor.getByLabel('Teléfono', { exact: true }).fill('+56912345678');
    await profesor.getByLabel('Contacto de emergencia', { exact: true }).fill('Contacto ficticio');
    await profesor.getByLabel('Teléfono de emergencia').fill('+56987654321');
    await profesor.getByLabel('Enfermedades, lesiones y observaciones').fill('Ficha ficticia de prueba.');
  }

  await llenarFicha('Estudiante de prueba', '1000004-1', 'estudiante');
  await profesor.getByLabel('Carrera').fill('Informática');
  await profesor.getByLabel('Certificado médico', { exact: true }).setInputFiles(archivo);
  await profesor.getByLabel('Fecha de emisión del certificado médico').fill(hoy);
  await profesor.getByLabel('Certificado de alumno regular', { exact: true }).setInputFiles({
    ...archivo, buffer: pdfDePrueba(),
  });
  const [subida] = await Promise.all([
    profesor.waitForResponse((r) => r.request().method() === 'POST' && r.url().includes('/storage/v1/object/certificados/')),
    guardar.click(),
  ]);
  assert.ok(subida.ok(), 'Storage acepta 10 MiB exactos desde el formulario');
  await expect(confirmado).toBeVisible({ timeout: 15000 });
  const ruta = new URL(subida.url()).pathname.replace('/object/', '/object/authenticated/');
  for (const rol of ['admin', 'alumno']) {
    const { access_token } = await tokenDe(rol);
    const respuesta = await fetch(api + ruta, { headers: { apikey, Authorization: `Bearer ${access_token}` } });
    assert.ok(!respuesta.ok, `Storage bloquea al rol ${rol}`);
  }
  assert.ok(!(await fetch(api + ruta.replace('/authenticated/', '/public/'))).ok, 'Archivo sin acceso público');
  const { access_token, user } = await tokenDe('profesor');
  const grande = await fetch(`${api}/storage/v1/object/certificados/${user.id}/${crypto.randomUUID()}`, {
    method: 'POST',
    headers: { apikey, Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/pdf' },
    body: Buffer.concat([pdf, Buffer.from('\n')]),
  });
  const errorTamano = await grande.text();
  assert.ok([400, 413].includes(grande.status) && /maximum|too.large|exceed|413/i.test(errorTamano),
    `Storage rechaza un byte por sobre el máximo: ${grande.status} ${errorTamano}`);
  await profesor.reload();
  await profesor.getByLabel('Buscar inscripción por RUT').fill('1000004-1');
  await profesor.getByRole('button', { name: 'Buscar', exact: true }).click();
  await expect(profesor.getByLabel('Nombre completo')).toHaveValue('Estudiante de prueba');
  const [descarga] = await Promise.all([
    profesor.waitForEvent('download'),
    profesor.getByRole('button', { name: 'Descargar certificado médico' }).click(),
  ]);
  const bloques = [];
  for await (const bloque of await descarga.createReadStream()) bloques.push(bloque);
  assert.ok(Buffer.concat(bloques).equals(pdf), 'La descarga conserva todos los bytes');
  await profesor.getByLabel('Nombre completo').fill('Estudiante editado');
  await guardar.click();
  await expect(confirmado).toBeVisible();
  await expect(profesor.getByRole('button', { name: 'Descargar certificado de alumno regular' })).toBeVisible();
  await profesor.screenshot({ path: path.join(process.argv[2], '360-inscripcion.png'), fullPage: true });
  assert.equal(await profesor.evaluate(() => document.documentElement.scrollWidth), 360);
  await consultarAdmin('Estudiante editado');
  await expect(admin.getByText(/Certificado médico vigente hasta/)).toBeVisible();
  await expect(admin.getByRole('button', { name: 'Registrar habilitación' })).toHaveCount(0);

  // El primer retiro falla después de guardar la ficha. Al volver, se reintenta por Storage.
  const esRetiro = (req) => req.method() === 'DELETE' && new URL(req.url()).pathname === '/storage/v1/object/certificados';
  await profesor.route('**/storage/v1/object/certificados', (interceptada) => esRetiro(interceptada.request())
    ? interceptada.fulfill({ status: 503, json: { message: 'Falla de retiro de prueba' },
      headers: { 'Access-Control-Allow-Origin': app } })
    : interceptada.continue());
  await profesor.getByLabel('Certificado médico', { exact: true }).setInputFiles({ ...archivo, buffer: pdfDePrueba() });
  await profesor.getByLabel('Fecha de emisión del certificado médico').fill('2000-01-01');
  await guardar.click();
  await expect(confirmado).toContainText('El retiro de archivos se reintentará');
  await expect(profesor.getByText(/Certificado médico vencido el/)).toBeVisible();
  const descargaAnterior = () => fetch(api + ruta, { headers: { apikey, Authorization: `Bearer ${access_token}` } });
  assert.ok((await descargaAnterior()).ok, 'El archivo anterior sigue pendiente de retiro');
  await profesor.unroute('**/storage/v1/object/certificados');
  const retiro = profesor.waitForResponse((r) => esRetiro(r.request()) && r.ok());
  await profesor.reload();
  await retiro;
  await expect.poll(async () => (await descargaAnterior()).ok).toBe(false);
  await consultarAdmin('Estudiante editado');
  await expect(admin.getByText(/Certificado médico vencido el/)).toBeVisible();
  await expect(admin.getByRole('button', { name: 'Registrar habilitación' })).toHaveCount(0);

  await profesor.getByRole('button', { name: 'Nueva inscripción' }).click();
  await llenarFicha('Deportista de prueba', '1000005-K', 'deportista_destacado');
  await expect(profesor.getByText('Exento de certificado médico.')).toBeVisible();
  await guardar.click();
  await expect(confirmado).toBeVisible();
  await consultarAdmin('Deportista de prueba');
  await expect(admin.getByText('Exento de certificado médico.', { exact: true })).toBeVisible();
  await expect(admin.getByRole('button', { name: 'Registrar habilitación' })).toHaveCount(0);
  await profesor.getByRole('button', { name: 'Nueva inscripción' }).click();
  await llenarFicha('Funcionario de prueba', '1000006-8', 'funcionario_colaborador');
  await guardar.click();
  await expect(confirmado).toBeVisible();
  execFileSync('psql', [db, '-Xv', 'ON_ERROR_STOP=1', '-c', `
    update public.alumnos set certificado_emision = current_date, certificado_hasta = current_date + 365 where rut = '1000006-8';
  `]);
  await consultarAdmin('Funcionario de prueba');
  await expect(admin.getByText('Certificado médico pendiente', { exact: true })).toBeVisible();
  await expect(admin.getByRole('button', { name: 'Registrar habilitación' })).toHaveCount(0);
  await expect(profesor.getByText('Certificado médico pendiente', { exact: true })).toBeVisible();
  await admin.screenshot({ path: path.join(process.argv[2], '360-habilitacion-coherente.png'), fullPage: true });
  await consultarAdmin('Antonia Fictia Rivas');
  await admin.getByLabel('Fecha de emisión', { exact: true }).fill(hoy);
  await admin.getByRole('button', { name: 'Registrar habilitación' }).click();
  await expect(admin.getByRole('status').filter({ hasText: 'Vigencia actualizada.' })).toBeVisible();
  await expect(admin.getByText(/Certificado médico vigente hasta/)).toBeVisible();

  const pantalla = await navegador.newPage();
  const realtime = pantalla.waitForEvent('websocket', { predicate: (ws) => ws.url().includes('/realtime/v1/') });
  await pantalla.goto(app + '/aforo');
  await realtime;
  const disponibles = pantalla.getByText('Cupos disponibles', { exact: true }).first().locator('..');
  await expect(disponibles).toContainText('1');

  await profesor.bringToFront();
  await profesor.goto(app + '/ingreso');
  const abrirRut = profesor.getByRole('button', { name: 'Ingresar por RUT' });
  const input = profesor.getByLabel('RUT sin puntos y con guion');
  const registrar = profesor.getByRole('button', { name: 'Registrar', exact: true });
  await abrirRut.click();
  const teclado = profesor.getByRole('group', { name: 'Teclado para RUT' });
  for (const tecla of '1000005-K') await teclado.getByRole('button', { name: tecla, exact: true }).click();
  await expect(input).toHaveValue('1000005-K');
  await profesor.screenshot({ path: path.join(process.argv[2], '360-rut.png'), fullPage: true });
  await registrar.click();
  await expect(profesor.getByText('Bienvenido/a, Deportista de prueba')).toBeVisible();
  await expect(disponibles).toContainText('0', { timeout: 5000 });

  async function marcar(rut) {
    await abrirRut.click();
    await input.fill(rut);
    await registrar.click();
  }
  await marcar('1000004-1');
  await expect(profesor.getByText('Certificado médico vencido', { exact: true })).toBeVisible();
  await marcar('1000006-8');
  await expect(profesor.getByText('Certificado médico pendiente', { exact: true })).toBeVisible();
  await profesor.getByRole('button', { name: 'Autorizar esta visita' }).click();
  await expect(profesor.getByText('Autorización registrada para este turno.', { exact: false })).toBeVisible();
  await marcar('1000005-K');
  await expect(profesor.getByText('Hasta luego, Deportista de prueba')).toBeVisible();
  await marcar('1000006-8');
  await expect(profesor.getByText('Bienvenido/a, Funcionario de prueba')).toBeVisible();
  await consultarAdmin('Funcionario de prueba');
  await expect(admin.getByText('Certificado médico pendiente', { exact: true })).toBeVisible();
  assert.equal(await profesor.evaluate(() => document.documentElement.scrollWidth), 360);
  console.log('APROBADOS formulario, vigencia coherente entre roles y kiosco, retiro con reintento, Storage, RUT, excepción y Realtime a 360 px');
} finally {
  await navegador.close();
}
