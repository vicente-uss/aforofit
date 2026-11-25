import { expect, it } from "vitest";
import { esCodigoIngreso } from "./codigoQr";

it("acepta un código escrito en minúscula o escaneado", () => {
  expect(esCodigoIngreso(" h2ab3c ")).toBe(true);
});
it.each(["123456","04:A3:7F:2B","AB23FF","https://ejemplo.cl","H2O456"])("separa el código de otros datos (%s)", texto => {
  expect(esCodigoIngreso(texto)).toBe(false);
});
