import assert from 'node:assert/strict';
import path from 'node:path';
import { chromium, expect } from 'playwright/test';

const app = 'http://127.0.0.1:3000';
const evidencia = process.argv[2];
const secciones = [
  'Capacidad y aforo',
  'Horarios de funcionamiento',
  'Gestión de turnos',
  'Modalidades de rutinas',
  'Progresión de cargas',
];

const navegador = await chromium.launch({ headless: true });
try {
  const admin = await navegador.newPage({ viewport: { width: 360, height: 820 } });
  await admin.goto(app + '/auth/login');
  await admin.getByLabel('Correo').fill('admin.demo@aforofit.cl');
  await admin.getByLabel('Contraseña', { exact: true }).fill('Solo-Pruebas-019!');
  await admin.getByRole('button', { name: 'Ingresar', exact: true }).click();
  await admin.waitForURL('**/admin');
  await admin.goto(app + '/admin/configuracion');
  await expect(admin.getByRole('heading', { name: 'Capacidad y aforo' })).toBeVisible();

  const guardar = admin.getByRole('button', { name: 'Guardar configuración' });
  const capacidad = admin.getByLabel('Capacidad (personas)', { exact: true });
  const umbral = admin.getByLabel('Umbral de aforo casi lleno (%)');
  const turno = admin.getByLabel('Expiración de turnos (minutos)');
  const modalidad = admin.getByLabel('Personalizadas por alumnos');
  const facilidad = admin.getByLabel('Incremento con «Fácil» (kg)');
  const apertura = admin.locator('#lunes-apertura');
  const campos = [capacidad, umbral, turno, facilidad, apertura];
  const originales = await Promise.all(campos.map((campo) => campo.inputValue()));
  const modalidadInicial = await modalidad.isChecked();
  await umbral.fill('101');
  await guardar.click();
  await expect(umbral).toHaveAttribute('aria-invalid', 'true');
  await expect(admin.getByRole('alert')).toContainText('Revisa los campos marcados');

  await capacidad.fill('23');
  await umbral.fill('75');
  await turno.fill('7');
  await modalidad.uncheck();
  await facilidad.fill('3,5');
  await apertura.fill('07:45');
  await guardar.click();
  await expect(admin.getByRole('status').filter({ hasText: 'Configuración guardada' })).toBeVisible();
  await admin.reload();
  await expect(capacidad).toHaveValue('23');
  await expect(umbral).toHaveValue('75');
  await expect(turno).toHaveValue('7');
  await expect(modalidad).not.toBeChecked();
  await expect(facilidad).toHaveValue('3.5');
  await expect(apertura).toHaveValue('07:45');

  for (const ancho of [360, 1280]) {
    await admin.setViewportSize({ width: ancho, height: 820 });
    const dimensiones = await admin.evaluate(() => [window.innerWidth, document.documentElement.scrollWidth]);
    assert.deepEqual(dimensiones, [ancho, ancho]);
    for (const [indice, titulo] of secciones.entries()) {
      const seccion = admin.locator('[data-slot="card"]').filter({ hasText: titulo });
      await expect(seccion).toBeVisible();
      await seccion.screenshot({ path: path.join(evidencia, `${ancho}-${indice + 1}-configuracion.png`) });
    }
  }
  for (const [indice, campo] of campos.entries()) await campo.fill(originales[indice]);
  await modalidad.setChecked(modalidadInicial);
  await guardar.click();
  await expect(admin.getByRole('status').filter({ hasText: 'Configuración guardada' })).toBeVisible();
  console.log('APROBADOS los cinco bloques, validación y persistencia en Chromium');
} finally {
  await navegador.close();
}
