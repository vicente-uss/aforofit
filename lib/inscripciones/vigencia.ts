import { fechaChilena } from "@/lib/prestamos/formulario";

export type EstadoCertificado = "pendiente" | "vencido" | "vigente" | "exento";

export type VigenciaCertificado = {
  estado_certificado: EstadoCertificado;
  certificado_emision: string | null;
  certificado_hasta: string | null;
};

export function textoVigencia({ estado_certificado, certificado_hasta }: VigenciaCertificado) {
  const fecha = certificado_hasta ? fechaChilena(certificado_hasta) : null;
  switch (estado_certificado) {
    case "pendiente": return "Certificado médico pendiente";
    case "vencido": return fecha ? `Certificado médico vencido el ${fecha}` : "Certificado médico vencido";
    case "vigente": return fecha ? `Certificado médico vigente hasta ${fecha}` : "Certificado médico vigente";
    case "exento": return "Exento de certificado médico.";
  }
}
