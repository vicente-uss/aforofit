import { expect, it } from "vitest";
import { errorCertificado, MAX_CERTIFICADO } from "./certificados";

it.each(["application/pdf", "image/jpeg", "image/png"])("permite un archivo %s de exactamente 10 MB", (type) => {
  expect(errorCertificado({ size: MAX_CERTIFICADO, type })).toBeNull();
});

it("rechaza un byte sobre el máximo", () => {
  expect(errorCertificado({ size: MAX_CERTIFICADO + 1, type: "application/pdf" })).toMatch(/supera/);
});

it("rechaza archivos vacíos y tipos incompatibles", () => {
  expect(errorCertificado({ size: 0, type: "image/png" })).toMatch(/vacío/);
  expect(errorCertificado({ size: 20, type: "text/html" })).toMatch(/PDF/);
});
