import assert from "node:assert/strict";
import { join } from "node:path";
import { chromium } from "playwright";

const app = "http://127.0.0.1:3000";
const api = process.env.NEXT_PUBLIC_SUPABASE_URL;
const apiKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const evidencia = process.argv[2];
const claveFicticia = "Solo-Pruebas-019!";

async function ingresar(pagina, rol) {
  await pagina.goto(app + "/auth/login");
  await pagina.getByLabel("Correo").fill(rol + ".demo@aforofit.cl");
  await pagina.getByLabel("Contraseña", { exact: true }).fill(claveFicticia);
  await pagina.getByRole("button", { name: "Ingresar", exact: true }).click();
  await pagina.waitForURL("**/" + rol);
}

async function ajustarFormulario(pagina, fecha, peso, cintura) {
  const dialogo = pagina.getByRole("dialog");
  await dialogo.getByLabel("Fecha de medición").fill(fecha);
  await dialogo.getByLabel("Peso (kg)").fill(peso);
  await dialogo.getByLabel("Estatura (cm)").fill("175");
  await dialogo.getByLabel(/Cintura/).fill(cintura);
  return dialogo;
}

async function sinDesborde(pagina) {
  assert.ok(await pagina.evaluate(() => document.documentElement.scrollWidth === 360));
}

async function datosApi(rol) {
  let token = apiKey;
  if (rol) {
    const sesion = await fetch(api + "/auth/v1/token?grant_type=password", {
      method: "POST",
      headers: { apikey: apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ email: rol + ".demo@aforofit.cl", password: claveFicticia }),
    });
    assert.equal(sesion.ok, true);
    token = (await sesion.json()).access_token;
  }
  return fetch(api + "/rest/v1/mediciones?select=id,fecha,peso_kg,estatura_cm,cintura_cm,imc", {
    headers: { apikey: apiKey, Authorization: "Bearer " + token },
  });
}

const navegador = await chromium.launch();
try {
  const movil = { viewport: { width: 360, height: 800 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, locale: "es-CL", timezoneId: "America/Santiago" };
  const pagina = await navegador.newPage(movil);
  const errores = [];
  pagina.on("pageerror", (error) => errores.push(error.message));
  await pagina.goto(app + "/alumno/medidas");
  await pagina.waitForURL("**/auth/login");
  await ingresar(pagina, "alumno");
  await pagina.getByRole("link", { name: /Registro corporal/ }).click();
  await pagina.getByText("Sin mediciones todavía").waitFor();

  const registrar = pagina.getByRole("button", { name: "Registrar medición" });
  const historial = pagina.getByRole("region", { name: "Historial" });
  await registrar.click();
  let dialogo = await ajustarFormulario(pagina, "2026-11-02", "72", "84");
  await dialogo.getByText("23,51 kg/m²").waitFor();
  await sinDesborde(pagina);
  await pagina.screenshot({ path: join(evidencia, "01-registro.png") });
  await dialogo.getByRole("button", { name: "Guardar medición" }).click();
  await pagina.getByText("Medición registrada.").waitFor();
  await registrar.click();
  dialogo = await ajustarFormulario(pagina, "2026-11-24", "70,5", "80,25");
  await dialogo.getByRole("button", { name: "Guardar medición" }).click();
  await historial.getByText("70,5 kg").waitFor();

  await pagina.reload();
  await pagina.getByRole("img", { name: "Evolución de Peso, 2 mediciones" }).waitFor();
  assert.deepEqual(await historial.locator("time").evaluateAll((fechas) => fechas.map((f) => f.dateTime)), ["2026-11-24", "2026-11-02"]);
  await pagina.getByText("-1,5 kg", { exact: true }).waitFor();
  await pagina.getByLabel("Medida del gráfico").selectOption("imc");
  await pagina.getByRole("img", { name: "Evolución de IMC, 2 mediciones" }).waitFor();
  await sinDesborde(pagina);
  await pagina.screenshot({ path: join(evidencia, "02-evolucion-historial.png"), fullPage: true });

  for (const rol of ["profesor", "admin"]) {
    const personal = await navegador.newPage(movil);
    await ingresar(personal, rol);
    await personal.goto(app + "/alumno/medidas");
    await personal.waitForURL("**/" + rol);
    await personal.close();
    const respuesta = await datosApi(rol);
    assert.equal(respuesta.ok, true);
    assert.deepEqual(await respuesta.json(), []);
  }
  const anon = await datosApi();
  assert.ok([401, 403].includes(anon.status));

  await historial.getByRole("button", { name: "Editar" }).first().click();
  dialogo = pagina.getByRole("dialog");
  await dialogo.getByLabel("Peso (kg)").fill("71");
  await dialogo.getByRole("button", { name: "Cancelar" }).click();
  await historial.getByText("70,5 kg").waitFor();
  await historial.getByRole("button", { name: "Editar" }).first().click();
  await dialogo.getByLabel("Peso (kg)").fill("71");
  await dialogo.getByRole("button", { name: "Confirmar cambios" }).click();
  await pagina.getByText("Cambios guardados.").waitFor();
  await pagina.reload();
  await historial.getByText("71 kg", { exact: true }).waitFor();
  await historial.getByText("23,18 kg/m²", { exact: true }).waitFor();

  await historial.getByRole("button", { name: "Eliminar" }).first().click();
  await dialogo.waitFor();
  await pagina.screenshot({ path: join(evidencia, "03-confirmar-eliminacion.png") });
  await dialogo.getByRole("button", { name: "Cancelar" }).click();
  assert.equal(await historial.getByRole("listitem").count(), 2);
  await historial.getByRole("button", { name: "Eliminar" }).first().click();
  await dialogo.getByRole("button", { name: "Sí, eliminar" }).click();
  await pagina.getByText("Medición eliminada.").waitFor();
  await pagina.reload();
  await pagina.getByRole("img", { name: "Evolución de Peso, 1 medición" }).waitFor();
  assert.equal(await historial.getByRole("listitem").count(), 1);
  const propias = await datosApi("alumno");
  assert.equal(propias.ok, true);
  assert.equal((await propias.json()).length, 1);
  assert.deepEqual(errores, []);
  console.log("OK: acceso por rol, registro, recarga, cálculo de IMC, gráfico, comparación, edición y eliminación a 360 px");
} finally {
  await navegador.close();
}
