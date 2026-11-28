export function normalizarRut(valor: string): string | null {
  const rut = valor.trim().toUpperCase();
  if (!/^[1-9][0-9]{0,7}-[0-9K]$/.test(rut)) return null;

  const [cuerpo, verificador] = rut.split("-");
  const suma = [...cuerpo].reverse().reduce((total, digito, indice) =>
    total + Number(digito) * (2 + indice % 6), 0);
  const esperado = (11 - suma % 11) % 11;
  return verificador === (esperado === 10 ? "K" : String(esperado)) ? rut : null;
}
