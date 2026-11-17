import { describe, expect, it } from "vitest";
import { normalizarUid } from "./normalizarUid";

// UID ficticios (docs/pruebas-tarjetas.md).
describe("normalizarUid", () => {
  it.each([
    // Decimal del lector (bytes en orden inverso)
    ["0729785092", "04:A3:7F:2B"],
    ["729785092", "04:A3:7F:2B"],
    ["3566231068", "1C:5E:90:D4"],
    ["1063913394", "B2:07:6A:3F"],
    // Hexadecimal manual o QR (mismo orden que NFC Tools)
    ["04a37f2b", "04:A3:7F:2B"],
    ["04-A3-7F-2B", "04:A3:7F:2B"],
    ["04:a3:7f:2b", "04:A3:7F:2B"],
    ["  0729785092  ", "04:A3:7F:2B"],
  ])("%s -> %s", (entrada, esperado) => {
    expect(normalizarUid(entrada)).toEqual({ ok: true, uid: esperado });
  });

  it.each([
    "hola",
    "",
    "4294967296", // no cabe en 4 bytes
    "04a37f2", // cantidad impar de dígitos
    "04:A3:7F", // 3 bytes
    "04:A3-7F:2B:", // separador al final
  ])("%j -> error", (entrada) => {
    expect(normalizarUid(entrada).ok).toBe(false);
  });
});
