import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { randomInt } from 'node:crypto';
import path from 'node:path';
import { chromium, expect } from 'playwright/test';

const app = 'http://127.0.0.1:3000';
const api = process.env.NEXT_PUBLIC_SUPABASE_URL;
const apikey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const db = process.env.AFOROFIT_TEST_DATABASE_URL;
assert.equal(api, 'http://127.0.0.1:54321');
assert.match(db, /@127\.0\.0\.1:54322\//);
const pin = String(randomInt(100000, 1000000));
const pinIncorrecto = pin === '111111' ? '111112' : '111111';
const rutas = ['/admin', '/admin/habilitacion', '/admin/maquinas', '/admin/implementos', '/admin/configuracion'];

function ejecutarSql(input) {
  execFileSync('psql', [db, '-Xv', 'ON_ERROR_STOP=1'], { input });
}

async function login(pagina, rol) {
  await pagina.goto(app + '/auth/login');
  await pagina.getByLabel('Correo').fill(`${rol}.demo@aforofit.cl`);
  await pagina.getByLabel('Contraseña', { exact: true }).fill('Solo-Pruebas-019!');
  await pagina.getByRole('button', { name: 'Ingresar', exact: true }).click();
  await expect(pagina).toHaveURL(app + '/' + rol);
}

async function abrirMenu(pagina, ancho) {
  if (ancho < 1024) {
    await pagina.getByRole('button', { name: 'Abrir menú' }).click();
  }
}

async function sinDesborde(pagina) {
  assert.ok(await pagina.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
}

async function activar(pagina, ancho, probarError = false) {
  await abrirMenu(pagina, ancho);
  await pagina.getByRole('button', { name: 'Administración', exact: true }).click();
  const campo = pagina.getByLabel('PIN de seis dígitos');
  const enviar = pagina.getByRole('button', { name: 'Activar modo administrador' });
  await expect(campo).toHaveAttribute('type', 'password');
  await expect(campo).toHaveAttribute('inputmode', 'numeric');
  await sinDesborde(pagina);
  if (probarError) {
    await campo.fill(pinIncorrecto);
    await enviar.click();
    await expect(pagina.getByRole('alert').filter({ hasText: 'PIN incorrecto.' })).toBeVisible();
    await expect(pagina).toHaveURL(app + '/profesor');
  }
  await campo.fill(pin);
  await enviar.click();
  await expect(pagina).toHaveURL(app + '/admin');
}

ejecutarSql(`
  insert into privado.modo_admin (profesor_id, secreto_id)
  select id, vault.create_secret('${pin}', 'qa_navegador_028')
  from auth.users where email = 'profesor.demo@aforofit.cl';
`);

const navegador = await chromium.launch({ headless: true });
try {
  for (const ancho of [360, 1280]) {
    const pagina = await navegador.newPage({ viewport: { width: ancho, height: 820 } });
    await login(pagina, 'profesor');
    for (const ruta of rutas) {
      await pagina.goto(app + ruta);
      await expect(pagina).toHaveURL(app + '/profesor');
    }

    await activar(pagina, ancho, ancho === 360);
    for (const ruta of rutas) {
      await pagina.goto(app + ruta);
      await expect(pagina).toHaveURL(app + ruta);
      await expect(pagina.getByRole('heading', { level: 1 })).toBeVisible();
      await sinDesborde(pagina);
    }
    await pagina.reload();
    await expect(pagina.getByRole('heading', { name: 'Configuración del gimnasio' })).toBeVisible();
    await abrirMenu(pagina, ancho);
    await expect(pagina.getByRole('button', { name: 'Volver al modo profesor' })).toBeVisible();
    await pagina.screenshot({ path: path.join(process.argv[2], `modo-admin-${ancho}.png`) });

    await pagina.getByRole('button', { name: 'Volver al modo profesor' }).click();
    await expect(pagina).toHaveURL(app + '/profesor');
    await pagina.goto(app + '/admin/configuracion');
    await expect(pagina).toHaveURL(app + '/profesor');

    await activar(pagina, ancho);
    ejecutarSql("update privado.modo_admin set vence_en = now() - interval '1 second'");
    await pagina.reload();
    await expect(pagina).toHaveURL(app + '/profesor');

    await activar(pagina, ancho);
    await abrirMenu(pagina, ancho);
    await pagina.getByRole('button', { name: 'Cerrar sesión' }).click();
    await expect(pagina).toHaveURL(app + '/auth/login');
    await pagina.goto(app + '/admin/maquinas');
    await expect(pagina).toHaveURL(app + '/auth/login');

    await login(pagina, 'profesor');
    await pagina.goto(app + '/admin/implementos');
    await expect(pagina).toHaveURL(app + '/profesor');
    await pagina.close();
    console.log(`OK modo administrador a ${ancho} px`);
  }

  const alumno = await navegador.newPage();
  await login(alumno, 'alumno');
  await alumno.goto(app + '/admin/configuracion');
  await expect(alumno).toHaveURL(app + '/alumno');

  const admin = await navegador.newPage();
  await login(admin, 'admin');
  await admin.goto(app + '/admin/habilitacion');
  await expect(admin.getByRole('heading', { name: 'Habilitación de personas' })).toBeVisible();
  await expect(admin.getByRole('button', { name: 'Volver al modo profesor' })).toHaveCount(0);
  console.log('OK alumno bloqueado y administración anterior compatible');

  const token = await fetch(api + '/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: { apikey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'profesor.demo@aforofit.cl', password: 'Solo-Pruebas-019!' }),
  });
  assert.ok(token.ok);
  const { access_token } = await token.json();
  const headers = { apikey, Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' };
  const rpc = (nombre, datos = {}) => fetch(api + '/rest/v1/rpc/' + nombre, {
    method: 'POST', headers, body: JSON.stringify(datos),
  });

  const activacion = await rpc('activar_modo_admin', { p_pin: pin });
  assert.equal(await activacion.json(), 'activado');
  const salida = await fetch(api + '/auth/v1/logout?scope=local', { method: 'POST', headers });
  assert.ok(salida.ok);
  const revocado = await rpc('vencimiento_modo_admin');
  assert.equal(await revocado.json(), null);
  const escritura = await rpc('actualizar_configuracion_completa', { p_parametros: null });
  assert.match((await escritura.json()).message, /sin_permiso/);
  console.log('OK cierre de sesión revoca permisos con el token anterior');
} finally {
  await navegador.close();
}
