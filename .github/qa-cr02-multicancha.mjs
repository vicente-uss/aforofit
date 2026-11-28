import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium, expect } from 'playwright/test';

const app = 'http://127.0.0.1:3000';
const api = 'http://127.0.0.1:54321';
const db = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
assert.equal(process.env.AFOROFIT_TEST_DATABASE_URL, db);
assert.equal(process.env.NEXT_PUBLIC_SUPABASE_URL, api);
const clave = 'Solo-Pruebas-019!';
const destino = process.argv[2];
const nombre = 'QA Responsable Multicancha';
const participante = 'QA Integrante ' + 'NombreLargo'.repeat(9);
const fecha = sql("select date_trunc('week', now() at time zone 'America/Santiago')::date + 14;");
const miercoles = sql(`select date '${fecha}' + 2;`);
const calendario = `${app}/profesor/multicancha?fecha=${fecha}`;

function sql(input) {
  return execFileSync('psql', [db, '-XqAtv', 'ON_ERROR_STOP=1'], { input, encoding: 'utf8' }).trim();
}

async function iniciarSesion(pagina, rol) {
  await pagina.goto(app + '/auth/login');
  await pagina.getByLabel('Correo').fill(`${rol}.demo@aforofit.cl`);
  await pagina.getByLabel('Contraseña', { exact: true }).fill(clave);
  await pagina.getByRole('button', { name: 'Ingresar', exact: true }).click();
  await expect(pagina).toHaveURL(`${app}/${rol}`);
}

async function descargar(pagina, enlace) {
  const [descarga] = await Promise.all([pagina.waitForEvent('download'), enlace.click()]);
  return readFile(await descarga.path());
}

async function comprobarAncho(pagina, etiqueta) {
  const medidas = await pagina.evaluate(() => ({ contenido: document.documentElement.scrollWidth, ventana: window.innerWidth }));
  assert.ok(medidas.contenido <= medidas.ventana, `${etiqueta}: contenido ${medidas.contenido}, vista ${medidas.ventana}`);
}

function pdfFicticio() {
  const texto = 'BT /F1 12 Tf 45 120 Td (Archivo ficticio QA 030) Tj ET\n';
  const objetos = [
    '<</Type/Catalog /Pages 2 0 R>>',
    '<</Type/Pages /Kids[3 0 R] /Count 1>>',
    '<</Type/Page /Parent 2 0 R /MediaBox[0 0 280 160] /Resources<</Font<</F1 4 0 R>>>> /Contents 5 0 R>>',
    '<</Type/Font /Subtype/Type1 /BaseFont/Helvetica>>',
    `<</Length ${texto.length}>>\nstream\n${texto}endstream`,
  ];
  let pdf = '%PDF-1.4\n';
  const tabla = objetos.map((objeto, indice) => {
    const posicion = String(pdf.length).padStart(10, '0');
    pdf += `${indice + 1} 0 obj\n${objeto}\nendobj\n`;
    return `${posicion} 00000 n \n`;
  });
  return Buffer.from(pdf + `xref\n0 6\n0000000000 65535 f \n${tabla.join('')}trailer\n<</Root 1 0 R /Size 6>>\nstartxref\n${pdf.length}\n%%EOF\n`);
}

async function subirReglamentoFicticio(archivo) {
  const apikey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const sesion = await fetch(api + '/auth/v1/token?grant_type=password', {
    method: 'POST', headers: { apikey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'profesor.demo@aforofit.cl', password: clave }),
  });
  assert.equal(sesion.status, 200);
  const { access_token: token } = await sesion.json();
  sql(`create policy qa030_subir_reglamento on storage.objects for insert to authenticated
    with check (bucket_id = 'multicancha' and name = 'reglamento.pdf' and (select privado.es_profesor()));`);
  try {
    const subida = await fetch(api + '/storage/v1/object/multicancha/reglamento.pdf', {
      method: 'POST', headers: { apikey, Authorization: `Bearer ${token}`, 'Content-Type': 'application/pdf' }, body: archivo,
    });
    assert.equal(subida.status, 200, await subida.text());
  } finally {
    sql('drop policy qa030_subir_reglamento on storage.objects;');
  }
}

const navegador = await chromium.launch();
try {
  const profesor = await navegador.newPage({ viewport: { width: 1280, height: 900 } });
  const alumno = await navegador.newPage({ viewport: { width: 390, height: 844 } });
  await iniciarSesion(profesor, 'profesor');
  await iniciarSesion(alumno, 'alumno');
  await expect(profesor.getByRole('navigation').getByRole('link', { name: 'Multicancha', exact: true })).toBeVisible();
  await expect(alumno.getByRole('link', { name: /Mis reservas/ })).toBeVisible();
  await alumno.goto(calendario);
  await expect(alumno).toHaveURL(app + '/alumno');

  await profesor.goto(calendario);
  await expect(profesor.getByRole('heading', { name: 'Multicancha', exact: true })).toBeVisible();
  const anterior = profesor.getByRole('link', { name: 'Mes anterior' });
  const rutaAnterior = await anterior.getAttribute('href');
  await anterior.click();
  await expect(profesor).toHaveURL(app + rutaAnterior);
  await expect(profesor.getByText('Reservas y actividades', { exact: true })).toBeVisible();
  const siguiente = profesor.getByRole('link', { name: 'Mes siguiente' });
  const rutaSiguiente = await siguiente.getAttribute('href');
  await siguiente.click();
  await expect(profesor).toHaveURL(app + rutaSiguiente);
  const irAFecha = profesor.getByLabel('Ir a fecha');
  await expect(irAFecha).toHaveValue(new URL(app + rutaSiguiente).searchParams.get('fecha'));
  await irAFecha.fill(fecha);
  await profesor.getByRole('button', { name: 'Ir', exact: true }).click();
  await expect(profesor).toHaveURL(calendario);
  await profesor.getByRole('link', { name: 'Preparar reserva de 08:00–09:20' }).click();
  const nuevo = profesor.locator('#nuevo-bloque form').first();
  await expect(nuevo.getByLabel('Módulo')).toHaveValue('1');
  await nuevo.getByLabel('Nombre del responsable').fill(nombre);
  await nuevo.getByLabel('Carrera del responsable').fill('Ingeniería Ficticia');
  await nuevo.getByLabel('Correo electrónico').fill('alumno.demo@aforofit.cl');
  await nuevo.getByRole('button', { name: 'Crear reserva' }).click();
  await expect(nuevo.getByText('Reserva creada.', { exact: true })).toBeVisible();
  const reserva = profesor.locator('[data-bloque]').filter({ hasText: nombre });
  await reserva.locator('summary').first().click();
  await expect(reserva.getByText('Cuenta de alumno vinculada')).toBeVisible();
  const idReserva = await reserva.getAttribute('data-bloque');
  const provisional = (await descargar(profesor, reserva.getByRole('link', { name: 'Descargar borrador de correo' }))).toString();
  assert.match(provisional, /To: alumno\.demo@aforofit\.cl/);
  assert.match(provisional, /X-Unsent: 1/);
  assert.match(provisional, /Content-Disposition: attachment; filename="reglamento-provisional\.pdf"/);
  await reserva.getByRole('button', { name: 'Enviar confirmación por Gmail' }).click();
  await expect(reserva.getByRole('alert')).toContainText('Gmail SMTP no está configurado');
  console.log('OK creación presencial, adjunto provisional y error explícito sin credenciales SMTP');

  await nuevo.getByLabel('Tipo de bloque').selectOption('institucional');
  await nuevo.getByLabel('Nombre de la actividad').fill('QA Taller institucional');
  await nuevo.getByLabel('Hora de inicio').fill('08:10');
  await nuevo.getByLabel('Hora de término').fill('09:00');
  await nuevo.getByRole('button', { name: 'Crear bloque' }).click();
  await expect(nuevo.getByRole('alert')).toContainText('Hay un bloque activo');
  await expect(reserva).toBeVisible();
  await reserva.getByText('Editar reserva', { exact: true }).click();
  await reserva.getByLabel('Módulo').selectOption('2');
  await reserva.getByRole('button', { name: 'Guardar cambios' }).click();
  await expect(reserva.getByText('Reserva actualizada.')).toBeVisible();
  await nuevo.getByRole('button', { name: 'Crear bloque' }).click();
  await expect(profesor.getByText(/QA Taller institucional/).filter({ visible: true })).toBeVisible();
  await nuevo.getByLabel('Nombre de la actividad').fill('QA Actividad tarde');
  await nuevo.getByLabel('Hora de inicio').fill('17:00');
  await nuevo.getByLabel('Hora de término').fill('18:30');
  await nuevo.getByRole('button', { name: 'Crear bloque' }).click();
  await expect(profesor.getByText(/17:00–18:30 · QA Actividad tarde/)).toBeVisible();
  await nuevo.getByLabel('Tipo de bloque').selectOption('bloqueo');
  await nuevo.getByLabel('Motivo del bloqueo').fill('QA Bloqueo puntual');
  await nuevo.getByLabel('Hora de inicio').fill('11:05');
  await nuevo.getByLabel('Hora de término').fill('11:40');
  await nuevo.getByRole('button', { name: 'Crear bloque' }).click();
  await expect(profesor.getByText(/11:05–11:40 · QA Bloqueo puntual/)).toBeVisible();

  await nuevo.getByLabel('Tipo de bloque').selectOption('ordinaria');
  await nuevo.getByLabel('Módulo').selectOption('5');
  await nuevo.getByLabel('Nombre del responsable').fill('QA Responsable sin cuenta');
  await nuevo.getByLabel('Carrera del responsable').fill('Carrera Ficticia');
  await nuevo.getByLabel('Correo electrónico').fill('externo@example.test');
  await nuevo.getByRole('button', { name: 'Crear reserva' }).click();
  await expect(profesor.getByText(/14:30–15:50 · QA Responsable sin cuenta/)).toBeVisible();
  console.log('OK conflicto explícito, reprogramación, actividad fuera de horario, bloqueo y responsable externo');

  await alumno.goto(app + '/alumno/reservas');
  const propia = alumno.locator(`[data-reserva="${idReserva}"]`);
  await expect(alumno.locator('[data-reserva]')).toHaveCount(1);
  await expect(propia.getByText('09:30–10:50 · Confirmada')).toBeVisible();
  const pdfProvisional = await descargar(alumno, alumno.getByRole('link', { name: 'Descargar reglamento provisional' }));
  assert.match(pdfProvisional.subarray(0, 8).toString(), /^%PDF-/);
  await expect(alumno.getByRole('button', { name: /Crear reserva|Cancelar reserva|Guardar cambios/ })).toHaveCount(0);
  const privado = await alumno.request.get(`${app}/profesor/multicancha/correo/${idReserva}`, { maxRedirects: 0 });
  assert.equal(privado.status(), 307);
  await propia.getByText('Nómina (0)', { exact: true }).click();
  await propia.getByRole('button', { name: 'Agregar integrante' }).click();
  await propia.getByLabel('Nombre', { exact: true }).fill(participante);
  await propia.getByLabel('RUT').fill('12.345.678-5');
  await propia.getByLabel('Carrera', { exact: true }).fill('Fisiología Ficticia');
  await propia.getByRole('button', { name: 'Guardar nómina' }).click();
  await expect(propia.getByText('Nómina actualizada.')).toBeVisible();
  await expect(propia.getByText('Nómina (1)', { exact: true })).toBeVisible();
  await propia.getByLabel('Carrera', { exact: true }).fill('Fisioterapia Ficticia');
  await propia.getByRole('button', { name: 'Guardar nómina' }).click();
  await expect(propia.getByLabel('Carrera', { exact: true })).toHaveValue('Fisioterapia Ficticia');
  await alumno.reload();
  await propia.getByText('Nómina (1)', { exact: true }).click();
  await expect(propia.getByLabel('Carrera', { exact: true })).toHaveValue('Fisioterapia Ficticia');

  const pdf = pdfFicticio();
  await subirReglamentoFicticio(pdf);
  await profesor.goto(calendario);
  await reserva.locator('summary').first().click();
  await reserva.getByText('Nómina (1)', { exact: true }).click();
  await expect(reserva.getByLabel('Nombre', { exact: true })).toHaveValue(participante);
  const conAdjunto = (await descargar(profesor, reserva.getByRole('link', { name: 'Descargar borrador de correo' }))).toString();
  assert.match(conAdjunto, /filename="reglamento.pdf"/);
  const adjunto = conAdjunto.split('filename="reglamento.pdf"\r\n\r\n')[1].split('\r\n--')[0];
  assert.deepEqual(Buffer.from(adjunto, 'base64'), pdf);
  await alumno.reload();
  assert.deepEqual(await descargar(alumno, alumno.getByRole('link', { name: 'Descargar reglamento oficial' })), pdf);
  console.log('OK propiedad de reservas, edición de nómina, privacidad y descarga del reglamento adjunto');

  for (const ancho of [360, 390, 768, 1280, 1440]) {
    for (const pagina of [profesor, alumno]) await pagina.setViewportSize({ width: ancho, height: 900 });
    await comprobarAncho(profesor, `Multicancha ${ancho}`);
    await profesor.screenshot({ path: path.join(destino, `multicancha-profesor-${ancho}.png`), fullPage: true });
    if (!await propia.getByLabel('Nombre', { exact: true }).isVisible()) {
      await propia.getByText('Nómina (1)', { exact: true }).click();
    }
    await comprobarAncho(alumno, `Mis reservas ${ancho}`);
    await alumno.screenshot({ path: path.join(destino, `multicancha-alumno-${ancho}.png`), fullPage: true });
    console.log(`OK calendario y nómina sin desborde a ${ancho} px`);
  }

  await reserva.getByText('Cancelar reserva', { exact: true }).click();
  await reserva.getByRole('button', { name: 'Confirmar cancelación' }).click();
  await expect(profesor.getByText('Bloques cancelados (1)', { exact: true })).toBeVisible();
  await profesor.getByText('Historial de cambios', { exact: true }).click();
  await expect(profesor.getByText(/Cancelación · QA Responsable Multicancha/)).toBeVisible();
  await alumno.goto(app + '/alumno/reservas?vista=historial');
  await expect(propia.getByText('09:30–10:50 · Cancelada')).toBeVisible();
  await propia.getByText('Nómina (1)', { exact: true }).click();
  await expect(propia.getByText(participante)).toBeVisible();
  await expect(propia.getByRole('button', { name: 'Guardar nómina' })).toHaveCount(0);
  console.log('OK cancelación con confirmación e historial en ambos roles');

  const agendaMiercoles = `${app}/profesor/multicancha?fecha=${miercoles}`;
  await profesor.goto(agendaMiercoles);
  const paralelo = profesor.locator('[data-columnas="2"]').filter({ hasText: 'Gym USS' });
  await expect(paralelo.getByText('Conflicto de espacio', { exact: true })).toHaveCount(2);
  const espejo = profesor.locator('[data-serie]').filter({ hasText: 'PEFI danza urbana' });
  await expect(espejo.getByText('Sala espejo · Actividad semanal')).toBeVisible();
  for (const [vista, nombreVista] of [['semana', 'Semana'], ['mes', 'Mes']]) {
    await profesor.getByRole('navigation', { name: 'Vistas del calendario' }).getByRole('link', { name: nombreVista }).click();
    await expect(profesor).toHaveURL(`${agendaMiercoles}&vista=${vista}`);
    await expect(profesor.locator('[data-columnas="2"]').filter({ hasText: 'Gym USS' }).first()).toBeVisible();
    for (const ancho of [360, 1280]) {
      await profesor.setViewportSize({ width: ancho, height: 900 });
      await comprobarAncho(profesor, `Vista ${vista} ${ancho}`);
      await profesor.screenshot({ path: path.join(destino, `multicancha-${vista}-${ancho}.png`), fullPage: true });
    }
  }
  await profesor.goto(agendaMiercoles);
  const nuevaSerie = profesor.locator('#nuevo-bloque details').filter({ hasText: 'Nueva actividad semanal' });
  await nuevaSerie.locator('summary').click();
  await nuevaSerie.getByLabel('Nombre de la serie').fill('QA Serie de los miércoles');
  await nuevaSerie.getByLabel('Espacio').selectOption('sala_espejo');
  await nuevaSerie.getByLabel('Hora de inicio').fill('09:30');
  await nuevaSerie.getByLabel('Hora de término').fill('10:20');
  await nuevaSerie.getByRole('button', { name: 'Crear serie semanal' }).click();
  await expect(nuevaSerie.getByText('Serie semanal creada.')).toBeVisible();
  const serie = profesor.locator('[data-serie]').filter({ hasText: 'QA Serie de los miércoles' });
  await serie.locator('summary').first().click();
  await serie.getByText('Editar serie semanal', { exact: true }).click();
  await serie.getByLabel('Hora de término').fill('10:35');
  await serie.getByRole('button', { name: 'Guardar serie' }).click();
  await expect(serie.getByText(/09:30–10:35 · QA Serie/)).toBeVisible();
  const proximoMiercoles = sql(`select date '${miercoles}' + 7;`);
  await profesor.goto(`${app}/profesor/multicancha?fecha=${proximoMiercoles}`);
  await expect(serie.getByText(/09:30–10:35 · QA Serie/)).toBeVisible();
  console.log('OK solapamiento institucional, vistas paralelas y recurrencia editable');
} finally {
  await navegador.close();
}
