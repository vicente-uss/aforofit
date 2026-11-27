import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import { chromium } from "playwright";

const app = "http://127.0.0.1:3000";
const api = process.env.NEXT_PUBLIC_SUPABASE_URL;
const apikey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const evidencia = process.env.AFOROFIT_EVIDENCIA;
const clavePrueba = "Solo-Pruebas-019!";
const primeraFoto = "supabase/storage/maquinas/banco-plano.jpg";
const segundaFoto = "supabase/storage/maquinas/banco-declinado.jpg";

async function ingresar(pagina, rol) {
  await pagina.goto(app + "/auth/login");
  await pagina.getByLabel("Correo").fill(`${rol}.demo@aforofit.cl`);
  await pagina.getByLabel("Contraseña", { exact: true }).fill(clavePrueba);
  await pagina.getByRole("button", { name: "Ingresar", exact: true }).click();
  await pagina.waitForURL(app + "/" + rol);
}

async function token(rol) {
  const respuesta = await fetch(api + "/auth/v1/token?grant_type=password", {
    method: "POST",
    headers: { apikey, "Content-Type": "application/json" },
    body: JSON.stringify({ email: `${rol}.demo@aforofit.cl`, password: clavePrueba }),
  });
  assert.ok(respuesta.ok, `No inició sesión ${rol}: HTTP ${respuesta.status}`);
  return (await respuesta.json()).access_token;
}

async function subir(jwt, nombre, tipo, contenido) {
  return fetch(api + "/storage/v1/object/maquinas/catalogo/" + nombre, {
    method: "POST",
    headers: { apikey, Authorization: "Bearer " + jwt, "Content-Type": tipo },
    body: contenido,
  });
}

async function confirmar(pagina, ficha) {
  await ficha.getByRole("button", { name: "Eliminar", exact: true }).click();
  const dialogo = pagina.getByRole("dialog");
  await dialogo.getByRole("button", { name: "Confirmar eliminación" }).click();
  await pagina.getByText("Ficha eliminada.", { exact: true }).waitFor();
  await ficha.waitFor({ state: "detached" });
}

async function verificarFoto(ficha, nombre, archivo) {
  const imagen = ficha.getByRole("img", { name: nombre, exact: true });
  await imagen.waitFor();
  const url = await imagen.getAttribute("src");
  const respuesta = await fetch(url);
  assert.equal(respuesta.status, 200);
  assert.match(respuesta.headers.get("content-type"), /^image\/jpeg/);
  assert.deepEqual(Buffer.from(await respuesta.arrayBuffer()), await readFile(archivo));
  return url;
}

async function captura(pagina, archivo, ancho) {
  await pagina.setViewportSize({ width: ancho, height: 850 });
  assert.equal(await pagina.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await pagina.screenshot({ path: `${evidencia}/${archivo}.png` });
}

await mkdir(evidencia, { recursive: true });
const navegador = await chromium.launch({ headless: true });
try {
  const pagina = await navegador.newPage({ viewport: { width: 1280, height: 850 } });
  await ingresar(pagina, "admin");
  await pagina.getByRole("link", { name: "Máquinas", exact: true }).first().click();
  await pagina.waitForURL("**/admin/maquinas");
  await pagina.getByRole("button", { name: "Nueva máquina" }).click();
  await pagina.getByLabel("Nombre", { exact: true }).fill("QA Polea 021");
  await pagina.getByLabel("Patrón de movimiento").fill("Tirón");
  await pagina.getByLabel("Ajustes").fill("Asiento en posición 2");
  await pagina.getByLabel("Fotografía").setInputFiles({
    name: "falso.jpg", mimeType: "image/jpeg", buffer: Buffer.from("no es una foto"),
  });
  await pagina.getByRole("button", { name: "Guardar", exact: true }).click();
  await pagina.getByRole("alert").filter({ hasText: "Elige una foto" }).waitFor();
  await pagina.getByLabel("Fotografía").setInputFiles(primeraFoto);
  await pagina.getByRole("button", { name: "Guardar", exact: true }).click();
  await pagina.getByText("Ficha guardada.", { exact: true }).waitFor();
  await pagina.getByRole("searchbox").fill("QA Polea 021");
  let ficha = pagina.getByRole("listitem").filter({ has: pagina.getByRole("heading", { name: "QA Polea 021" }) });
  await ficha.getByText("Asiento en posición 2", { exact: false }).waitFor();
  const urlPrimera = await verificarFoto(ficha, "QA Polea 021", primeraFoto);
  await ficha.getByRole("button", { name: "Editar" }).click();
  assert.equal(await pagina.getByLabel("Patrón de movimiento").inputValue(), "Tirón");
  await pagina.getByLabel("Estado", { exact: true }).selectOption("en_mantencion");
  await pagina.getByLabel("Reemplazar fotografía").setInputFiles(segundaFoto);
  await pagina.getByRole("button", { name: "Guardar", exact: true }).click();
  await ficha.getByText("En mantención", { exact: true }).waitFor();
  assert.notEqual(await verificarFoto(ficha, "QA Polea 021", segundaFoto), urlPrimera);
  await captura(pagina, "maquinas-360", 360);
  await captura(pagina, "maquinas-1280", 1280);
  await ficha.getByRole("button", { name: "Eliminar", exact: true }).click();
  await pagina.getByRole("dialog").getByRole("button", { name: "Cancelar" }).click();
  await ficha.waitFor();
  await confirmar(pagina, ficha);
  console.log("APROBADO CA25: alta, búsqueda, edición, reemplazo HTTP, cancelación y eliminación");

  await pagina.goto(app + "/admin/implementos");
  await pagina.getByRole("button", { name: "Nuevo implemento" }).click();
  await pagina.getByLabel("Nombre", { exact: true }).fill("QA Balón HTTP");
  await pagina.getByLabel("Cantidad total").fill("-1");
  assert.equal(await pagina.getByLabel("Cantidad total").evaluate((entrada) => entrada.validity.valid), false);
  await pagina.getByLabel("Cantidad total").fill("5");
  await pagina.getByRole("button", { name: "Guardar", exact: true }).click();
  await pagina.getByText("Ficha guardada.", { exact: true }).waitFor();
  await pagina.getByRole("searchbox").fill("QA Balón HTTP");
  ficha = pagina.getByRole("listitem").filter({ has: pagina.getByRole("heading", { name: "QA Balón HTTP" }) });
  const cantidades = () => ficha.locator("dd").allTextContents();
  await ficha.waitFor();
  assert.deepEqual(await cantidades(), ["5", "5", "0"]);
  await ficha.getByRole("button", { name: "Editar" }).click();
  await pagina.getByLabel("Cantidad total").fill("3");
  await pagina.getByRole("button", { name: "Guardar", exact: true }).click();
  await ficha.getByText("3", { exact: true }).first().waitFor();
  assert.deepEqual(await cantidades(), ["3", "3", "0"]);
  await captura(pagina, "implementos-360", 360);
  await captura(pagina, "implementos-1280", 1280);
  await confirmar(pagina, ficha);
  console.log("APROBADO CA27 en interfaz: alta, consulta de cantidades, edición y eliminación");

  const anon = await navegador.newPage();
  for (const ruta of ["maquinas", "implementos"]) {
    await anon.goto(app + "/admin/" + ruta);
    await anon.waitForURL("**/auth/login");
  }
  for (const rol of ["profesor", "alumno"]) {
    const noAdmin = await navegador.newPage();
    await ingresar(noAdmin, rol);
    for (const ruta of ["maquinas", "implementos"]) {
      await noAdmin.goto(app + "/admin/" + ruta);
      await noAdmin.waitForURL(app + "/" + rol);
    }
    const respuesta = await subir(await token(rol), `denegada-${rol}.jpg`, "image/jpeg", await readFile(primeraFoto));
    assert.ok([400, 401, 403].includes(respuesta.status), `Storage permitió subir a ${rol}: HTTP ${respuesta.status}`);
    assert.match(JSON.stringify(await respuesta.json()), /row.level security|unauthorized/i);
    await noAdmin.close();
  }
  const jwt = await token("admin");
  const mime = await subir(jwt, "invalida.txt", "text/plain", "archivo de texto");
  assert.ok(!mime.ok);
  assert.match(JSON.stringify(await mime.json()), /mime|content.type/i);
  const grande = await subir(jwt, "grande.jpg", "image/jpeg", Buffer.alloc(2097153));
  assert.ok(!grande.ok);
  assert.match(JSON.stringify(await grande.json()), /payload|size|large|limit/i);
  console.log("APROBADO: rutas por rol, escritura Storage, descarga pública, MIME, tamaño y responsividad a 360/1280 px");
} finally {
  await navegador.close();
}
