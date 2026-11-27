import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { chromium, expect } from 'playwright/test';

const app = 'http://127.0.0.1:3000';
const evidencia = process.argv[2];
const db = (consulta) => execFileSync('psql', [
  process.env.AFOROFIT_TEST_DATABASE_URL, '-XAtv', 'ON_ERROR_STOP=1', '-c', consulta,
], { encoding: 'utf8' }).trim();

async function entrar(pagina, rol) {
  await pagina.goto(app + '/auth/login');
  await pagina.getByLabel('Correo').fill(rol + '.demo@aforofit.cl');
  await pagina.getByLabel('Contraseña', { exact: true }).fill('Solo-Pruebas-019!');
  await pagina.getByRole('button', { name: 'Ingresar', exact: true }).click();
  await pagina.waitForURL('**/' + rol);
}

async function crear(pagina, boton, nombre, ejercicio) {
  await pagina.getByRole('button', { name: boton, exact: true }).click();
  await pagina.getByLabel('Nombre de la rutina').fill(nombre);
  await pagina.getByLabel('Nombre del ejercicio').fill(ejercicio);
  await pagina.getByLabel('Carga (kg)').fill('40');
  await pagina.getByLabel('Ajustes o notas').fill('Ajuste del asiento para QA');
}

async function foto(pagina, nombre) {
  assert.deepEqual(await pagina.evaluate(() => [
    window.innerWidth,
    document.documentElement.scrollWidth,
  ]), [360, 360], 'sin desplazamiento horizontal a 360 px');
  await pagina.screenshot({ path: path.join(evidencia, nombre + '.png'), fullPage: true });
}

function cambiosVisitas(pagina) {
  let cambios = 0;
  pagina.on('websocket', (socket) => socket.on('framereceived', ({ payload }) => {
    if (typeof payload !== 'string') return;
    const [, , tema, evento] = JSON.parse(payload);
    if (evento === 'postgres_changes' && tema.startsWith('realtime:visitas-alumno-')) cambios++;
  }));
  return () => cambios;
}

const alumnoId = db(`select a.id from public.alumnos a join auth.users u on u.id = a.perfil_id
  where u.email='alumno.demo@aforofit.cl'`);
const nombreAlumno = db(`select nombre from public.alumnos where id='${alumnoId}'`);
db(`
  update public.alumnos set certificado_hasta=current_date+365 where id='${alumnoId}';
  update public.configuracion set horario=(select jsonb_object_agg(d,'{"apertura":"00:00","ultimo_ingreso":"23:59","cierre":"23:59"}'::jsonb)
    from unnest(array['lunes','martes','miercoles','jueves','viernes','sabado','domingo']) d);
  insert into public.tarjetas(uid,alumno_id,tipo) values('02:A3:7F:2B','${alumnoId}','credencial_uss');
  insert into public.visitas(alumno_id,entrada,salida) values('${alumnoId}',now()-interval '3 days 1 hour',now()-interval '3 days');
  update public.maquinas set estado='en_mantencion' where id=(select id from public.maquinas order by nombre limit 1);
`);

const navegador = await chromium.launch({ headless: true });
try {
  const movil = await navegador.newContext({ viewport: { width: 360, height: 820 }, timezoneId: 'America/Santiago' });
  await movil.addInitScript(() => {
    const intervalo = window.setInterval.bind(window);
    window.setInterval = (fn, ms, ...args) => ms === 15000 ? 0 : intervalo(fn, ms, ...args);
  });
  const alumno = await movil.newPage();
  const cambios = cambiosVisitas(alumno);
  const rutinaDia = alumno.getByRole('region', { name: 'Mi rutina', exact: true });
  const personal = await navegador.newContext({ viewport: { width: 360, height: 820 } });
  const profesor = await personal.newPage();
  const kiosco = await personal.newPage();

  await entrar(alumno, 'alumno');
  await alumno.getByRole('link', { name: /Mis rutinas/ }).click();
  await crear(alumno, 'Crear mi rutina', 'Mi fuerza QA', 'Press propio QA');
  await alumno.getByRole('button', { name: 'Agregar ejercicio' }).click();
  await alumno.getByRole('group', { name: 'Ejercicio 2' }).getByLabel('Nombre del ejercicio').fill('Cardio QA');
  await alumno.getByRole('group', { name: 'Ejercicio 2' }).getByLabel('Medir por').selectOption('minutos');
  await alumno.getByRole('button', { name: 'Subir ejercicio 2' }).click();
  await foto(alumno, '01-editor-y-orden');
  await alumno.getByRole('button', { name: 'Guardar rutina' }).click();
  await expect(alumno.getByText('Rutina guardada.')).toBeVisible();
  await alumno.getByRole('button', { name: 'Editar', exact: true }).click();
  await alumno.getByLabel('Nombre de la rutina').fill('Mi fuerza actualizada QA');
  await alumno.getByRole('button', { name: 'Guardar rutina' }).click();
  await expect(alumno.getByRole('heading', { name: 'Mi fuerza actualizada QA' })).toBeVisible();
  await alumno.getByRole('button', { name: 'Activar', exact: true }).click();
  await expect(alumno.getByText('Alumno · Activa')).toBeVisible();
  await alumno.getByRole('link', { name: 'Volver a mi rutina del día' }).click();
  await alumno.waitForURL(app + '/alumno');
  await expect(rutinaDia.getByText('Press propio QA', { exact: true })).toBeVisible();

  await entrar(profesor, 'profesor');
  await profesor.goto(app + '/profesor/rutinas');
  await profesor.getByLabel('Nombre del alumno').fill(nombreAlumno);
  await profesor.getByRole('button', { name: 'Buscar', exact: true }).click();
  await profesor.getByRole('button', { name: new RegExp(nombreAlumno) }).click();
  await crear(profesor, 'Crear y asignar rutina', 'Asignada QA', 'Press profesor QA');
  await profesor.getByRole('button', { name: 'Guardar rutina' }).click();
  await expect(profesor.getByText('Rutina guardada y asignada.')).toBeVisible();
  await profesor.getByRole('button', { name: 'Editar', exact: true }).click();
  await profesor.getByLabel('Nombre de la rutina').fill('Asignada actualizada QA');
  await profesor.getByRole('button', { name: 'Guardar rutina' }).click();
  await expect(profesor.getByRole('heading', { name: 'Asignada actualizada QA' })).toBeVisible();
  await foto(profesor, '02-asignacion-profesor');
  await kiosco.goto(app + '/ingreso');

  async function esperarRealtime() {
    const inicial = cambios();
    await expect.poll(() => {
      if (cambios() === inicial) db(`update public.visitas set entrada=entrada where alumno_id='${alumnoId}' and salida is not null`);
      return cambios();
    }, { timeout: 20000, intervals: [400, 800] }).toBeGreaterThan(inicial);
  }

  // Una visita ficticia cerrada permite comprobar que ya está escuchando el canal.
  await esperarRealtime();
  await kiosco.bringToFront();
  const lector = kiosco.getByLabel('Lector de credenciales');
  await lector.fill('0729785092');
  const inicioTne = performance.now();
  await lector.press('Enter');
  await expect(rutinaDia.getByText('Ya entraste', { exact: true })).toBeVisible();
  await expect(rutinaDia.getByText('Mi fuerza actualizada QA', { exact: true })).toBeVisible();
  console.log('Realtime de TNE a rutina visible: ' + Math.round(performance.now() - inicioTne) + ' ms');
  await expect(rutinaDia.getByText(/Máquina en mantención/).first()).toBeVisible();
  await foto(alumno, '03-rutina-al-ingresar-y-mantencion');
  await lector.fill('0729785090');
  await lector.press('Enter');
  await expect(rutinaDia.getByRole('heading', { name: '¿Cómo estuvo tu entrenamiento de hoy?' })).toBeVisible();
  await rutinaDia.getByRole('button', { name: /Me costó/ }).click();
  await expect(rutinaDia.getByText('Feedback registrado')).toBeVisible();

  await alumno.getByRole('link', { name: /Mis rutinas/ }).click();
  await expect(alumno.getByText(/Asignada por el profesor/)).toBeVisible();
  await alumno.getByRole('button', { name: 'Activar', exact: true }).click();
  await expect(alumno.getByText('Profesor · Activa')).toBeVisible();
  await alumno.getByRole('link', { name: 'Volver a mi rutina del día' }).click();
  await alumno.waitForURL(app + '/alumno');

  async function usarQr() {
    const respuesta = alumno.waitForResponse((r) => r.url().endsWith('/rpc/generar_codigo_ingreso') && r.ok());
    await alumno.getByRole('button', { name: /Mostrar QR de ingreso|Generar otro código/ }).click();
    const { codigo } = await (await respuesta).json();
    await expect(alumno.getByText(codigo, { exact: true })).toBeVisible();
    await kiosco.getByRole('button', { name: 'Ingreso manual', exact: true }).click();
    await kiosco.getByLabel('UID o código de ingreso').fill(codigo);
    await kiosco.getByRole('button', { name: 'Registrar', exact: true }).click();
  }

  await esperarRealtime();
  await usarQr();
  await expect(rutinaDia.getByText('Ya entraste', { exact: true })).toBeVisible();
  await expect(rutinaDia.getByText('Press profesor QA', { exact: true })).toBeVisible();
  await usarQr();
  await expect(rutinaDia.getByRole('button', { name: /Me costó/ })).toBeVisible();
  await rutinaDia.getByRole('button', { name: /Me costó/ }).click();
  await expect(rutinaDia.getByText('Feedback registrado')).toBeVisible();
  await foto(alumno, '04-feedback-profesor-sin-progresion');
  assert.equal(db(`select e.carga_kg from public.rutina_ejercicios e join public.rutinas r on r.id=e.rutina_id
    where r.nombre='Asignada actualizada QA'`), '40.0');
  assert.ok(cambios() >= 5, 'alta y salida por ambos medios publicadas por Realtime con sondeo desactivado');
  await alumno.goto(app + '/profesor/rutinas');
  await alumno.waitForURL('**/alumno');
  console.log('APROBADOS editor, asignación, credencial HID simulada, canje manual del QR, Realtime, feedback y cuatro capturas a 360 px');
} finally {
  await navegador.close();
}
