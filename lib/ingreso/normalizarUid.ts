// Normaliza el UID de una credencial (TNE) al formato que se guarda en `tarjetas.uid`:
// hexadecimal en mayúsculas, separado por ":" y en el mismo orden que muestra NFC Tools
// (ej. ficticio: "04:A3:7F:2B"). Detalle en docs/pruebas-tarjetas.md.
//
// Formatos aceptados:
// - Decimal (solo dígitos, hasta 10): lo que escribe el lector USB. El lector calcula el número
//   con los bytes en orden inverso (little-endian), así que se pasa a 4 bytes y se invierten.
//   Ej.: "0729785092" = 0x2B7FA304 → bytes 2B 7F A3 04 → invertidos 04:A3:7F:2B.
// - Hexadecimal, con o sin ":" o "-" (ingreso manual o QR): se deja en el mismo orden.
//   Debe tener 4, 7 o 10 bytes (los largos de UID de ISO 14443).
//
// Un texto de solo dígitos siempre se interpreta como decimal, porque es lo que entrega el lector.

export type ResultadoUid = { ok: true; uid: string } | { ok: false; error: string };

const MAX_UID_DECIMAL = 0xffffffff; // 4 bytes
const BYTES_PERMITIDOS = [4, 7, 10];

export function normalizarUid(entrada: string): ResultadoUid {
  const texto = entrada.trim();

  if (texto === "") {
    return { ok: false, error: "No se recibió ningún código." };
  }

  // Caso del lector: número decimal en little-endian.
  if (/^\d{1,10}$/.test(texto)) {
    const numero = Number(texto);
    if (numero > MAX_UID_DECIMAL) {
      return { ok: false, error: "El número es demasiado grande para un UID de 4 bytes." };
    }
    const bytes: string[] = [];
    // Se extrae el byte menos significativo primero: así queda invertido el orden.
    for (let i = 0; i < 4; i++) {
      const byte = Math.floor(numero / 256 ** i) % 256;
      bytes.push(byte.toString(16).toUpperCase().padStart(2, "0"));
    }
    return { ok: true, uid: bytes.join(":") };
  }

  // Ingreso manual o QR: hexadecimal, opcionalmente separado por ":" o "-".
  const conSeparadores = /^[0-9a-f]{2}([:-][0-9a-f]{2})+$/i.test(texto);
  const sinSeparadores = /^[0-9a-f]+$/i.test(texto);
  if (conSeparadores || sinSeparadores) {
    const hex = texto.replace(/[:-]/g, "").toUpperCase();
    const cantidadBytes = hex.length / 2;
    if (hex.length % 2 === 0 && BYTES_PERMITIDOS.includes(cantidadBytes)) {
      return { ok: true, uid: hex.match(/../g)!.join(":") };
    }
    return { ok: false, error: "El UID hexadecimal debe tener 4, 7 o 10 bytes." };
  }

  return { ok: false, error: "Formato no reconocido. Usa el lector o escribe el UID en hexadecimal." };
}
