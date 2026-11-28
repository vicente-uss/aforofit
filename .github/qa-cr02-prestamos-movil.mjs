import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { randomInt } from 'node:crypto';
import path from 'node:path';
import { chromium, expect } from 'playwright/test';

const app = 'http://127.0.0.1:3000';
const db = process.env.AFOROFIT_TEST_DATABASE_URL;
assert.equal(db, 'postgresql://postgres:postgres@127.0.0.1:54322/postgres');
assert.equal(process.env.NEXT_PUBLIC_SUPABASE_URL, 'http://127.0.0.1:54321');

function sql(input) {
  execFileSync('psql', [db, '-Xv', 'ON_ERROR_STOP=1'], { input });
}

async function sinDesborde(pagina) {
  const { ancho, visible, elementos } = await pagina.evaluate(() => {
    const ancho = document.documentElement.scrollWidth;
    const visible = window.innerWidth;
    const elementos = ancho <= visible ? [] : [...document.querySelectorAll('main *')].flatMap(elemento => {
      const { right } = elemento.getBoundingClientRect();
      return right > visible ? [`${elemento.tagName} ${elemento.className} (${Math.round(right)} px)`] : [];
    }).slice(0, 8);
    return { ancho, visible, elementos };
  });
  assert.ok(ancho <= visible, `Contenido de ${ancho} px en pantalla de ${visible} px. ${elementos.join(', ')}`);
}

const pin = String(randomInt(100000, 1000000));
sql(`
  update privado.modo_admin
  set secreto_id = vault.create_secret('${pin}', 'qa_navegador_029'), vence_en = null
  where profesor_id = (select id from auth.users where email = 'profesor.demo@aforofit.cl');
  insert into public.implementos (nombre, categoria, cantidad_total, prestable) values
    ('QA 029 balón', 'QA cancha', 4, true), ('QA 029 peto', 'QA cancha', 2, true),
    ('QA 029 fijo', 'QA cancha', 1, false);
`);

const navegador = await chromium.launch();
try {
  for (const ancho of [360, 1280]) {
    const pagina = await navegador.newPage({ viewport: { width: ancho, height: 820 } });
    pagina.on('dialog', dialogo => dialogo.accept());
    await pagina.goto(app + '/auth/login');
    await pagina.getByLabel('Correo').fill('profesor.demo@aforofit.cl');
    await pagina.getByLabel('Contraseña', { exact: true }).fill('Solo-Pruebas-019!');
    await pagina.getByRole('button', { name: 'Ingresar', exact: true }).click();
    await expect(pagina).toHaveURL(app + '/profesor');
    await pagina.goto(app + '/profesor/prestamos');
    const nombre = `QA Sofía ${ancho} ${'NombreLargo'.repeat(7)}`;
    const buscar = pagina.getByRole('searchbox', { name: 'Nombre del solicitante' });
    const cantidad = pagina.getByRole('spinbutton', { name: 'Cantidad · QA 029 balón', exact: true });
    const confirmar = pagina.getByRole('button', { name: 'Confirmar préstamo' });
    const garantia = pagina.getByLabel('Recibí la TNE física como garantía');
    const pendientes = pagina.getByRole('list', { name: 'Préstamos pendientes' })
      .getByRole('listitem').filter({ has: pagina.getByText(nombre, { exact: true }) });
    await buscar.fill(nombre);
    await pagina.getByRole('button', { name: 'Registrar solicitante externo' }).click();
    await pagina.getByLabel('Referencia para distinguir homónimos (opcional)').fill('QA equipo uno');
    await expect(cantidad).toBeVisible();
    await expect(pagina.getByRole('spinbutton', { name: 'Cantidad · QA 029 fijo' })).toHaveCount(0);
    await cantidad.fill('2');
    await pagina.getByRole('spinbutton', { name: 'Cantidad · QA 029 peto' }).fill('1');
    await expect(confirmar).toBeDisabled();
    await garantia.check();
    await expect(confirmar).toBeEnabled();
    await sinDesborde(pagina);
    await pagina.screenshot({ path: path.join(process.argv[2], `prestamos-identificado-${ancho}.png`) });
    await confirmar.click();
    await expect(pagina.getByText('Préstamo registrado.')).toBeVisible();
    await expect(pagina.getByRole('list', { name: 'Solicitantes recientes' }).getByText(nombre)).toBeVisible();

    await buscar.fill(nombre);
    await pagina.getByRole('list', { name: 'Coincidencias' }).getByRole('button').filter({ hasText: 'QA equipo uno' }).click();
    await expect(pagina.getByText('El solicitante tiene implementos pendientes de devolución.')).toBeVisible();
    await sinDesborde(pagina);
    await pagina.getByRole('button', { name: 'Cambiar solicitante' }).click();

    await buscar.fill(nombre);
    await pagina.getByRole('button', { name: 'Registrar otro solicitante con este nombre' }).click();
    await pagina.getByLabel('Referencia para distinguir homónimos (opcional)').fill('QA equipo dos');
    await cantidad.fill('1');
    await garantia.check();
    await confirmar.click();
    const primero = pendientes.filter({ hasText: 'QA equipo uno' });
    const segundo = pendientes.filter({ hasText: 'QA equipo dos' });
    await expect(primero).toBeVisible();
    await expect(segundo).toBeVisible();
    await primero.getByRole('spinbutton', { name: 'Devolver QA 029 balón' }).fill('1');
    await primero.getByRole('button', { name: 'Devolver cantidades indicadas' }).click();
    await expect(primero.getByText('QA 029 balón · pendientes: 1')).toBeVisible();
    await primero.getByRole('button', { name: 'Devolver todo' }).click();
    await expect(primero.getByText('TNE sin retirar')).toBeVisible();
    await expect(primero.getByRole('button', { name: 'Avisar al alumno' })).toHaveCount(0);
    await sinDesborde(pagina);
    await pagina.screenshot({ path: path.join(process.argv[2], `prestamos-garantia-${ancho}.png`) });
    await primero.getByRole('button', { name: 'Entregar TNE' }).click();
    await expect(primero).toHaveCount(0);
    await segundo.getByRole('button', { name: 'Devolver todo' }).click();
    await segundo.getByRole('button', { name: 'Entregar TNE' }).click();
    await expect(segundo).toHaveCount(0);

    await pagina.goto(app + '/admin/implementos');
    await expect(pagina).toHaveURL(app + '/profesor');
    if (ancho < 1024) await pagina.getByRole('button', { name: 'Abrir menú' }).click();
    await pagina.getByRole('button', { name: 'Administración', exact: true }).click();
    await pagina.getByLabel('PIN de seis dígitos').fill(pin);
    await pagina.getByRole('button', { name: 'Activar modo administrador' }).click();
    await expect(pagina).toHaveURL(app + '/admin');
    await pagina.goto(app + '/admin/implementos');
    await expect(pagina.getByRole('heading', { name: 'Inventario deportivo' })).toBeVisible();
    await pagina.getByRole('button', { name: 'Nuevo implemento' }).click();
    const ficha = `QA 029 foto ${ancho}`;
    await pagina.getByLabel('Nombre', { exact: true }).fill(ficha);
    await pagina.getByLabel('Categoría (opcional)').fill('QA deporte');
    await pagina.getByLabel('Cantidad total').fill('7');
    await pagina.getByLabel('Habilitado para préstamo').uncheck();
    await pagina.getByLabel('Fotografía (opcional)').setInputFiles({
      name: 'qa.png',
      mimeType: 'image/png',
      buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGMQC5vzHwADlgIIpSJ4MwAAAABJRU5ErkJggg==', 'base64'),
    });
    await sinDesborde(pagina);
    await pagina.getByRole('button', { name: 'Guardar', exact: true }).click();
    await expect(pagina.getByText('Ficha guardada.')).toBeVisible();
    const tarjeta = pagina.locator('li').filter({ has: pagina.getByRole('heading', { name: ficha, exact: true }) });
    await expect(tarjeta.getByText('QA deporte', { exact: true })).toBeVisible();
    await expect(tarjeta.getByText('No prestable')).toBeVisible();
    await expect(tarjeta.getByRole('img', { name: ficha })).toBeVisible();
    await expect.poll(() => tarjeta.getByRole('img', { name: ficha }).evaluate(img => img.naturalWidth)).toBe(1);
    await pagina.getByRole('searchbox', { name: 'Buscar por nombre o categoría' }).fill('QA deporte');
    await sinDesborde(pagina);
    await pagina.screenshot({ path: path.join(process.argv[2], `inventario-deportivo-${ancho}.png`) });
    await pagina.close();
    console.log(`OK préstamos e inventario deportivo a ${ancho} px`);
  }
} finally {
  await navegador.close();
}
