"""Componer B5 y T3 desde los SVG aprobados y renderizar los archivos de imprenta."""
from base64 import b64encode
from pathlib import Path
import subprocess
import tempfile
import xml.etree.ElementTree as ET

import fitz
from PIL import Image, ImageDraw, ImageFont

D = Path(__file__).resolve().parent
R = D / "recursos"
S = "{http://www.w3.org/2000/svg}"
XL = "{http://www.w3.org/1999/xlink}href"
ET.register_namespace("", S[1:-1])
ET.register_namespace("xlink", XL[1:-5])

def foto_recortada():
    destino = R / "TNE-lector-recorte.jpg"
    with Image.open(R / "TNE-lector-original.jpg") as original:
        # Se conserva el LED, la mano y el reverso de la tarjeta.
        recorte = original.crop((0, 650, 1380, 1430))
        recorte.save(destino, quality=97, subsampling=0, icc_profile=original.info.get("icc_profile"))
    return "data:image/jpeg;base64," + b64encode(destino.read_bytes()).decode()

def logo(fondo, x, y, ancho):
    # Anidar los trazados originales evita la rasterización de un SVG externo.
    svg = ET.parse(R / f"logo-horizontal-on-{fondo}.svg").getroot()
    svg.attrib.update(x=str(x), y=str(y), width=str(ancho), height=str(ancho*96/310))
    return svg

def texto(root, actual):
    return next(e for e in root.iter(S+"text") if e.text == actual)

def guardar(root, nombre):
    fichero = D / (nombre+".svg")
    ET.ElementTree(root).write(fichero, encoding="utf-8", xml_declaration=True)
    return fichero

def afiche(foto):
    root = ET.parse(D.parent/"cierre-B4-1/B4.1.svg").getroot()
    root.find(".//*[@id='reserva-logo-USS']").append(logo("light",734,15,75))
    g = root.find(".//*[@id='reserva-foto-lector']")
    ET.SubElement(g,S+"image",x="34",y="711",width="90",height=str(90*780/1380),attrib={XL:foto})
    rotulo = ET.SubElement(g, S+"text", x="34", y="769", fill="#101C2C",
                           attrib={"font-family":"Barlow", "font-size":"8"})
    rotulo.text = "Foto del lector y la TNE"
    # Recuperar espacio de la franja de resultados y compartir las líneas base
    # de ambas columnas. Las coordenadas están en milímetros del A0 original.
    lineas = {865:852, 880:868, 882:869, 899:886, 902:889, 912:900,
              915:902, 936:919, 943:920, 990:964, 1009:986, 1022:1001,
              1035:1016, 1048:1031, 1078:1082, 1072:1076, 1088:1095,
              1111:1130, 1130:1147, 1142:1159, 1154:1171, 1175:1180}
    for e in root.findall(S+"text"):
        y = float(e.get("y"))
        if y in lineas:
            e.set("y", str(lineas[y]))
    resultados = root.find(S+"rect[@y='825']")
    resultados.attrib.update(y="818", height="120")
    pie = root.find(S+"rect[@y='1094']")
    pie.attrib.update(y="1113", height="76")
    titulo = texto(root, "Conclusión")
    fondo = ET.Element(S+"rect", x="0", y="1050", width="841", height="63", fill="#e6edfa")
    root.insert(list(root).index(titulo), fondo)
    creditos = [e for e in root.findall(S+"text") if e.get("y") in {"1147","1159","1171"}]
    for e, (x, y) in zip(creditos, [(34,1148),(310,1148),(585,1148),(34,1162),(310,1162)]):
        e.attrib.update(x=str(x), y=str(y))
    limite = root.find(S+"text[@y='1180']")
    limite.text = "Prototipo académico para alumnos, con datos ficticios y sin integración con sistemas institucionales USS"
    return guardar(root,"AforoFit-Afiche-A0")

def triptico(foto):
    base = D.parent/"triptico/T2"
    fuera = ET.parse(base/"exterior.svg").getroot()
    anterior = next(e for e in fuera if e.tag==S+"image" and e.get(XL,"").startswith("data:image/svg+xml"))
    fuera.remove(anterior)
    fuera.append(logo("dark",206,172,48))
    texto(fuera,"Sede Bellavista").set("y","198")
    dentro = ET.parse(base/"interior.svg").getroot()
    img = next(e for e in dentro if e.tag==S+"image" and e.get("x")=="8")
    img.attrib.update(x="8",y="72",width="83",height=str(83*780/1380))
    img.set(XL,foto)
    pie=texto(dentro,"Confirmación de entrada en el kiosco.")
    pie.text="Fotografía del equipo · TNE y lector USB."
    pie.set("y","124")
    texto(dentro,"QR de respaldo").set("y","132")
    respaldo = [
        ("El alumno también puede ingresar con", "Si no tienes tu credencial, puedes"),
        ("un código de un solo uso. Se probó el", "generar un código de ingreso de un"),
        ("canje manual. La validación física por", "solo uso desde tu cuenta"),
    ]
    for i, (antes, despues) in enumerate(respaldo):
        linea = texto(dentro, antes)
        linea.text = despues
        linea.set("y", str(139 + i*5))
    dentro.remove(texto(dentro, "cámara sigue pendiente."))
    for antes,despues in [
        ("El profesor revisa el historial y el estado","El profesor revisa máquinas e historial y"),
        ("de las máquinas, registra préstamos de","registra préstamos y devoluciones parciales."),
        ("implementos y devoluciones parciales.","Administración configura horarios y capacidad"),
        ("Administración gestiona certificados.","y gestiona los certificados de los alumnos."),
        ("Otra prueba: tras «Fácil», de 40 a 42,5 kg.","Tras «Fácil»: de 40 a 42,5 kg en otra prueba.")]:
        texto(dentro,antes).text=despues
    detalle=texto(dentro,"Tras «Fácil»: de 40 a 42,5 kg en otra prueba.")
    detalle.attrib.update(fill="#184FD0",**{"font-size":"4.2","font-family":"Barlow Condensed","font-weight":"700"})
    texto(dentro,"Vistas independientes del prototipo local,").text="Capturas independientes del prototipo local,"
    return [guardar(fuera,"Triptico-exterior"),guardar(dentro,"Triptico-interior")]

def exportar(fuentes,nombre,plegable=False):
    with tempfile.TemporaryDirectory() as tmp, fitz.open() as doc:
        for svg in fuentes:
            pdf=Path(tmp)/(svg.stem+".pdf")
            subprocess.run(["inkscape",str(svg),"-o",str(pdf)],check=True)
            with fitz.open(pdf) as origen: doc.insert_pdf(origen)
            p=doc[-1]
            if plegable:
                m=3*72/25.4
                p.set_trimbox(fitz.Rect(m,m,p.rect.width-m,p.rect.height-m))
                p.set_bleedbox(p.mediabox)
        doc.save(D/(nombre+".pdf"),garbage=4,deflate=True)
    with fitz.open(D/(nombre+".pdf")) as final:
        for p,svg in zip(final,fuentes):
            factor=1.65 if plegable else 3600/p.rect.height
            p.get_pixmap(matrix=fitz.Matrix(factor,factor),alpha=False).save(svg.with_suffix(".png"))

def plegado():
    caras=[Image.open(D/("Triptico-"+s+".png")) for s in ("exterior","interior")]
    lienzo=Image.new("RGB",(1210,830),"#e3e3dc")
    titulo=ImageDraw.Draw(lienzo)
    fuente=ImageFont.truetype(str(D.parent/"iteracion-2/fuentes/Barlow-Regular.ttf"),23)
    for x,s in [(25,"Cerrado · portada"),(426,"Primera apertura · acceso y solapa")]:
        titulo.text((x,15),s,font=fuente,fill="#101c2c")
    for i,a,b,x,w in [(0,197,297,25,359),(1,0,100,426,359),(0,0,97,785,348)]:
        im=caras[i]
        panel=im.crop((round((a+3)*im.width/303),round(3*im.height/216),round((b+3)*im.width/303),round(213*im.height/216)))
        lienzo.paste(panel.resize((w,754),Image.Resampling.LANCZOS),(x,54))
    lienzo.save(D/"Triptico-plegado.png")

if __name__=="__main__":
    f=foto_recortada()
    exportar([afiche(f)],"AforoFit-Afiche-A0")
    exportar(triptico(f),"AforoFit-Triptico",plegable=True)
    plegado()
