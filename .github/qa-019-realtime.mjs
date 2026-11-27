import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const app = 'http://127.0.0.1:3000';
const sql = (query) => execFileSync('psql', [
  process.env.AFOROFIT_TEST_DATABASE_URL, '-XAtv', 'ON_ERROR_STOP=1', '-c', query,
], { encoding: 'utf8' }).trim();
const pausa = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function observarCanal(pagina, canal) {
  const estado = { conectado: false, cambios: 0, eventos: [] };
  pagina.on('websocket', (socket) => {
    socket.on('framereceived', ({ payload }) => {
      if (typeof payload !== 'string') return;
      const [, , tema, evento, datos] = JSON.parse(payload);
      if (tema !== 'realtime:' + canal) return;
      if (estado.eventos.length < 15) {
        estado.eventos.push({ evento, estado: datos.status, extension: datos.extension });
      }
      if (evento === 'phx_reply' && datos.status === 'ok' && datos.response?.postgres_changes) {
        estado.conectado = true;
      }
      if (evento === 'postgres_changes' && datos.data?.record) estado.cambios++;
    });
  });
  return estado;
}

async function hasta(descripcion, verificar, plazo = 8000) {
  const inicio = performance.now();
  do {
    if (await verificar()) return Math.round(performance.now() - inicio);
    await pausa(50);
  } while (performance.now() - inicio < plazo);
  throw new Error('No se observó: ' + descripcion);
}

async function retenerLectura(pagina, tabla) {
  let resolverCaptura;
  let liberar;
  const capturada = new Promise((resolve) => { resolverCaptura = resolve; });
  const retenida = new Promise((resolve) => { liberar = resolve; });
  let primera = true;
  await pagina.route((url) => url.pathname === '/rest/v1/' + tabla, async (ruta) => {
    if (!primera) return ruta.continue();
    primera = false;
    const respuesta = await ruta.fetch();
    assert.ok(respuesta.ok());
    resolverCaptura();
    await retenida;
    await ruta.fulfill({ response: respuesta });
  });
  return { capturada, liberar };
}

async function main() {
  sql(`
    update public.configuracion set capacidad=1, cierre_automatico_horas=1, turno_expira_minutos=5,
      horario=(select jsonb_object_agg(d,jsonb_build_object('apertura','00:00','ultimo_ingreso','23:59','cierre','23:59'))
        from unnest(array['lunes','martes','miercoles','jueves','viernes','sabado','domingo']) d) where id=1;
    insert into public.alumnos(nombre,rut,certificado_hasta)
    values ('Lina Secreto Reserva','QA-REALTIME-2',current_date+365),('Erik Secreto Entra','QA-REALTIME-1',current_date+365);
    insert into public.tarjetas(uid,alumno_id)
    select 'FC:19:FE:0'||right(rut,1),id from public.alumnos where rut like 'QA-REALTIME-%';
  `);
  const navegador = await chromium.launch({ headless: true });
  try {
    const publico = await navegador.newContext({ timezoneId: 'UTC' });
    const profesor = await navegador.newContext({ timezoneId: 'America/Santiago' });
    for (const contexto of [publico, profesor]) {
      // Demostrar el transporte Realtime sin el sondeo de respaldo de 15 segundos.
      await contexto.addInitScript(() => {
        const original = window.setInterval.bind(window);
        window.setInterval = (fn, ms, ...args) => ms === 15000 ? 0 : original(fn, ms, ...args);
      });
    }
    const aforo = await publico.newPage();
    const espera = await profesor.newPage();
    const estadoAforo = observarCanal(aforo, 'aforo-publico');
    const estadoEspera = observarCanal(espera, 'lista-espera');
    for (const pagina of [aforo, espera]) {
      pagina.on('pageerror', (error) => console.error('Error de página:', error.message));
      pagina.on('response', (respuesta) => {
        const ruta = new URL(respuesta.url()).pathname;
        if (ruta.startsWith('/rest/v1/') && respuesta.status() >= 400) {
          console.error('Data API:', respuesta.status(), ruta);
        }
      });
    }
    const viejaAforo = await retenerLectura(aforo, 'aforo');
    await aforo.goto(app + '/aforo');
    await espera.goto(app + '/auth/login');
    await espera.getByLabel('Correo').fill('profesor.demo@aforofit.cl');
    await espera.getByLabel('Contraseña', { exact: true }).fill('Solo-Pruebas-019!');
    await espera.getByRole('button', { name: 'Ingresar', exact: true }).click();
    await espera.waitForURL('**/profesor');
    const viejaEspera = await retenerLectura(espera, 'turnos');
    await espera.goto(app + '/profesor/espera');
    await Promise.all([viejaAforo.capturada, viejaEspera.capturada]);
    await hasta('ambas suscripciones Postgres Changes', () => estadoAforo.conectado && estadoEspera.conectado, 15000);

    // El acuse de unión del canal puede llegar antes de que la réplica esté lista.
    try {
      await hasta('una actualización de prueba llega a ambos suscriptores', async () => {
        if (estadoAforo.cambios > 0 && estadoEspera.cambios > 0) return true;
        sql('update public.aforo set actualizado_en=clock_timestamp() where id=1');
        await pausa(600);
        return false;
      }, 15000);
      const cambiosIniciales = [estadoAforo.cambios, estadoEspera.cambios];
      assert.equal(sql("select privado.registrar_ingreso_en('FC:19:FE:01',clock_timestamp())->>'resultado'"), 'entrada');
      assert.equal(sql("select privado.registrar_ingreso_en('FC:19:FE:02',clock_timestamp())->>'resultado'"), 'turno');
      await hasta('ambos WebSockets y las dos pantallas muestran la espera', async () =>
        estadoAforo.cambios > cambiosIniciales[0] && estadoEspera.cambios > cambiosIniciales[1] &&
        await aforo.getByText('1 en espera', { exact: true }).isVisible() &&
        await espera.getByText('Lina S.', { exact: true }).isVisible());
    } catch (error) {
      console.error(JSON.stringify({ estadoAforo, estadoEspera }));
      console.error('Fila de aforo:', sql('select to_jsonb(a) from public.aforo a where id=1'));
      console.error('Pantalla pública:', await aforo.locator('main').innerText());
      console.error('Pantalla del profesor:', await espera.locator('main').innerText());
      throw error;
    }
    const respuestas = [
      aforo.waitForResponse((r) => r.url().includes('/rest/v1/aforo')),
      espera.waitForResponse((r) => r.url().includes('/rest/v1/turnos')),
    ];
    viejaAforo.liberar();
    viejaEspera.liberar();
    await Promise.all(respuestas);
    await pausa(500);
    assert.ok(await aforo.getByText('1 en espera', { exact: true }).isVisible());
    assert.ok(await espera.getByText('Lina S.', { exact: true }).isVisible());
    console.log('OK: ambos navegadores conservan el estado nuevo al recibir una respuesta HTTP atrasada');

    const anteriores = [estadoAforo.cambios, estadoEspera.cambios];
    sql("update public.visitas v set entrada=clock_timestamp()-interval '2 hours' from public.alumnos a where a.id=v.alumno_id and a.rut='QA-REALTIME-1' and v.salida is null");
    const latencia = await hasta('Cron cierra visita, ambos canales notifican y ambas pantallas muestran el llamado', async () =>
      estadoAforo.cambios > anteriores[0] && estadoEspera.cambios > anteriores[1] &&
      await aforo.getByText('Lina S.', { exact: true }).isVisible() &&
      await espera.getByText('Llamado', { exact: true }).isVisible() &&
      await espera.getByText('0 / 1', { exact: true }).isVisible(), 90000);
    assert.equal(await aforo.getByText('Lina Secreto Reserva', { exact: true }).count(), 0);
    assert.equal(await aforo.getByText('QA-REALTIME-2', { exact: true }).count(), 0);
    console.log('OK: Cron → WebSocket → DOM en /aforo (UTC) y /profesor/espera (Santiago), ' + latencia + ' ms desde preparar el vencimiento');
    console.log('OK: /aforo muestra solo el nombre abreviado');
  } finally {
    await navegador.close();
  }
}
const limite = setTimeout(() => { console.error('Tiempo agotado en Chromium'); process.exit(1); }, 210000);
main().then(() => clearTimeout(limite), (error) => { clearTimeout(limite); console.error(error); process.exitCode = 1; });
