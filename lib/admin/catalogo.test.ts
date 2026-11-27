import { describe, expect, it } from "vitest";
import { cantidadInventario, extensionFoto, MAX_BYTES_FOTO, mensajeCatalogo } from "./catalogo";

describe("cantidad de inventario", () => {
  it.each(["", "-1", "1.5", "1e2", "NaN", "2147483648"])("rechaza %j", (valor) => {
    expect(cantidadInventario(valor)).toBeNull();
  });

  it.each([["0", 0], ["08", 8], ["2147483647", 2147483647]])("acepta %s", (valor, esperado) => {
    expect(cantidadInventario(valor)).toBe(esperado);
  });
});

describe("formato de foto", () => {
  const jpg = new Uint8Array([0xff, 0xd8, 0xff]);
  const png = new Uint8Array([0x89, 80, 78, 71, 13, 10, 26, 10]);
  const webp = new Uint8Array([82, 73, 70, 70, 0, 0, 0, 0, 87, 69, 66, 80]);

  it("acepta firmas JPEG, PNG y WebP", async () => {
    await expect(extensionFoto(new File([jpg], "a", { type: "image/jpeg" }))).resolves.toBe("jpg");
    await expect(extensionFoto(new File([png], "a", { type: "image/png" }))).resolves.toBe("png");
    await expect(extensionFoto(new File([webp], "a", { type: "image/webp" }))).resolves.toBe("webp");
  });

  it("rechaza un archivo vacío, una firma que contradice el MIME y un tipo no admitido", async () => {
    await expect(extensionFoto(new File([], "a", { type: "image/jpeg" }))).resolves.toBeNull();
    await expect(extensionFoto(new File([png], "a.jpg", { type: "image/jpeg" }))).resolves.toBeNull();
    await expect(extensionFoto(new File([jpg], "a.svg", { type: "image/svg+xml" }))).resolves.toBeNull();
  });

  it("aplica el límite de bytes", async () => {
    const bytes = new Uint8Array(MAX_BYTES_FOTO);
    bytes.set(jpg);
    await expect(extensionFoto(new File([bytes], "a", { type: "image/jpeg" }))).resolves.toBe("jpg");
    await expect(extensionFoto(new File([bytes, jpg], "a", { type: "image/jpeg" }))).resolves.toBeNull();
  });
});

it("distingue referencias existentes de stock insuficiente", () => {
  const referencia = { code: "23503", message: "" };
  expect(mensajeCatalogo(referencia, true)).toContain("plantilla o rutina");
  expect(mensajeCatalogo(referencia, false)).toContain("historial de préstamos");
  expect(mensajeCatalogo({ code: "23514", message: "inventario_menor_que_prestado" }, false)).toContain("unidades que siguen prestadas");
});
