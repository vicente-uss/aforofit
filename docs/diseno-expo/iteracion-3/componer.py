"""Composición editable de B4. Coordenadas y cuerpos expresados en milímetros."""
from pathlib import Path
import base64
from io import BytesIO
import subprocess
import xml.etree.ElementTree as ET
from PIL import Image, ImageDraw, ImageFont
from reportlab.graphics.barcode.qrencoder import QRCode, QRErrorCorrectLevel

HERE = Path(__file__).resolve().parent
FONTS = HERE.parent / "iteracion-2/fuentes"
PAPER, NAVY, BLUE, PALE, WHITE = "#f6f5f0", "#101c2c", "#184fd0", "#c9daff", "#ffffff"
URL = "https://aforofit.vercel.app/aforo"
XLINK = "{http://www.w3.org/1999/xlink}href"
ET.register_namespace("xlink", "http://www.w3.org/1999/xlink")
root = ET.Element("svg", xmlns="http://www.w3.org/2000/svg", width="841mm", height="1189mm", viewBox="0 0 841 1189")
def node(tag, parent=None, **attrs):
    return ET.SubElement(root if parent is None else parent, tag, {k:str(v) for k,v in attrs.items()})
def rect(x,y,w,h,c,**attrs):
    return node("rect",x=x,y=y,width=w,height=h,fill=c,**attrs)
def text(x,y,s,size=11,c=NAVY,title=False,maxw=None):
    name="BarlowCondensed-Bold.ttf" if title else "Barlow-Regular.ttf"
    font=ImageFont.truetype(str(FONTS/name),round(size*20))
    assert font.getlength(s)/20 <= (maxw or 812-x), s
    node("text",x=x,y=y,fill=c,**{"font-size":size,"font-family":"Barlow Condensed" if title else "Barlow","font-weight":700 if title else 400}).text=s
def lines(x,y,rows,size=11,step=14,c=NAVY,maxw=None):
    for i,s in enumerate(rows): text(x,y+i*step,s,size,c,maxw=maxw)
def photo(name,x,y,w,box=None):
    im=Image.open(HERE/"originales"/(name+".png"))
    if box: im=im.crop(box)
    buf=BytesIO()
    im.save(buf,format="PNG")
    node("image",id=name,x=x,y=y,width=w,height=w*im.height/im.width,**{XLINK:"data:image/png;base64,"+base64.b64encode(buf.getvalue()).decode()})
def qr(x,y,w):
    code=QRCode(None,QRErrorCorrectLevel.M)
    code.addData(URL)
    code.make()
    n=code.getModuleCount()
    group=node("a",**{XLINK:URL})
    g=node("g",group,transform=f"translate({x} {y}) scale({w/(n+8)})")
    node("rect",g,width=n+8,height=n+8,fill=WHITE)
    path=" ".join(f"M{c+4} {r+4}h1v1h-1z" for r in range(n) for c in range(n) if code.isDark(r,c))
    node("path",g,d=path,fill=NAVY)

def brand():
    # Geometría y atributos tomados del SVG LogoMark del producto.
    src=(HERE.parents[2]/"components/marca/logo.tsx").read_text()
    raw=src.split("<defs>",1)[1].split("</svg>",1)[0]
    raw=raw.replace('id={`marca-${id}`}','id="marca-aforofit"').replace('fill={`url(#marca-${id})`}','fill="url(#marca-aforofit)"')
    for jsx,svg in [("stopColor","stop-color"),("strokeOpacity","stroke-opacity"),("strokeWidth","stroke-width"),("strokeLinecap","stroke-linecap")]:
        raw=raw.replace(jsx,svg)
    root.append(ET.fromstring('<g id="isotipo" transform="translate(33 61) scale(1.32)"><defs>'+raw+'</g>'))

rect(0,0,841,1189,PAPER)
text(32,34,"Universidad San Sebastián   /   Sede Bellavista",11)
text(470,34,"Taller de Ingeniería de Software   ·   Grupo 6",10)
rect(737,9,72,32,"none",id="reserva-logo-USS")
brand()
text(98,119,"AforoFit",74,title=True)
text(465,100,"Cada entrada cuenta.",34,BLUE,True)
text(34,155,"Control de acceso y aforo en tiempo real",25)
for i in range(20):
    x=34+i*38.7
    node("path",d=f"M{x} 193 l6 -16 h27 l-6 16z",fill=BLUE if i<19 else PAPER,stroke=BLUE,**{"stroke-width":1.1})
text(34,216,"19 dentro y un cupo libre en el escenario ilustrado. El encargado informa un límite operativo de 20 personas.",10.4)
text(34,254,"¿Cuántos siguen dentro?",25,title=True)
lines(34,278,["Se anota el ingreso en papel y luego se copia a Excel.","Sin las salidas, el conteo queda a ojo."],11.6,15,maxw=385)
text(437,247,"Objetivo",13,BLUE,True)
lines(437,269,["Registrar entradas y salidas para conocer la ocupación","y ordenar la espera. El encargado estima una asistencia","de 80 a 90 alumnos al día."],11.4,14,maxw=370)
rect(0,316,841,359,NAVY)
text(34,349,"Pantalla pública",23,WHITE,True)
text(613,349,"Rutina del alumno",20,WHITE,True)
photo("turno-llamado-escritorio",34,365,480)
photo("rutina-fotos-movil",613,365,148,(0,800,1170,2450))
lines(613,599,["Prensa de piernas: 40 kg.","Press de pecho: 20 kg."],10.4,13,WHITE)
text(34,658,"Vistas independientes del prototipo compilado localmente, con datos ficticios y respuestas controladas.",10.4,PALE)
# Un único recorrido de lectura horizontal. La miniatura del kiosco procede de un tercer escenario.
text(34,711,"Cómo se registra una visita",23,title=True)
photo("entrada-escritorio",573,691,146,(1880,490,3040,800))
text(573,748,"Kiosco · escenario independiente",9)
steps=[(34,"Credencial","TNE/TUI o QR"),(182,"Kiosco web","Recibe el código"),(328,"Supabase","Valida y guarda"),(485,"Resultado","Entrada, salida o turno"),(668,"Aforo en vivo","Realtime actualiza")]
for i,(x,a,b) in enumerate(steps):
    text(x,783,a,15,title=True)
    text(x,803,b,10.4)
    if i<4:
        nextx=steps[i+1][0]
        node("path",d=f"M{nextx-29} 779h16l-4 -3m4 3l-4 3",fill="none",stroke=BLUE,**{"stroke-width":1.2})
rect(0,825,841,137,BLUE)
text(31,912,"429",99,WHITE,True)
lines(179,865,["Comprobaciones","automatizadas locales","aprobadas"],15,17,WHITE)
text(180,936,"198 Vitest  +  231 SQL",14,WHITE)
text(428,880,"≤ 1,2 s",40,WHITE,True)
text(628,880,"< 0,1 s",40,WHITE,True)
lines(428,902,["De la luz del lector a la entrada","visible. Cota superior."],10.3,13,WHITE)
lines(628,902,["Del resultado del kiosco al aforo","en la misma máquina."],10.3,13,WHITE)
text(428,943,"Prueba en red doméstica. Video analizado a intervalos de 0,1 s.",9.3,WHITE)
text(34,990,"Qué aporta",17,title=True)
lines(34,1009,["La rutina por objetivo y nivel avisa si una máquina está en mantención.","La evaluación de dificultad orienta la progresión de cargas. El profesor","consulta el historial y registra préstamos y devoluciones parciales.","Administración gestiona certificados, horarios y capacidad."],10.3,13,maxw=388)
text(437,990,"Método y tecnologías",17,title=True)
lines(437,1009,["Entrevista, prototipo y revisión con el encargado. Estimación","de tamaño por puntos de función (FP) y líneas de código (LOC),","y de esfuerzo con COCOMO. Next.js y TypeScript en Vercel;","Supabase conserva las visitas y comunica los cambios."],10.3,13,maxw=371)
text(34,1081,"Conclusión",15,BLUE,True)
text(106,1081,"En la prueba con lector, la salida quedó registrada y el aforo volvió de una persona a cero.",12)
rect(0,1094,841,95,NAVY)
text(34,1111,"Proyecto Integrador 2026   ·   Docente Rodrigo Correa Rojas",10.2,WHITE)
lines(34,1130,["Vicente Galleguillos · Jefe de proyecto","Benjamín Velásquez · Frontend y prototipo","Isidora Moscoso · Backend y base de datos"],9.2,12,WHITE)
lines(298,1130,["Pau Urzúa · Ingreso y hardware","Bastián González · Administración y QA"],9.2,12,WHITE)
text(34,1175,"Prototipo para alumnos, sin integración USS. QR de ingreso con canje manual; prueba física de cámara pendiente.",8.7,PALE)
text(585,1126,"Ver el aforo público",13,WHITE,True)
text(585,1145,"aforofit.vercel.app/aforo",9.4,WHITE)
qr(735,1104,76)
ET.ElementTree(root).write(HERE/"B4.svg",encoding="utf-8",xml_declaration=True)
subprocess.run(["inkscape",str(HERE/"B4.svg"),"-o",str(HERE/"B4.pdf")],check=True)
subprocess.run(["pdftoppm","-scale-to","3600","-png","-singlefile",str(HERE/"B4.pdf"),str(HERE/"B4")],check=True)
# Comparación rotulada a idéntica escala.
sheet=Image.new("RGB",(1636,1188),"#ffffff")
draw=ImageDraw.Draw(sheet)
for x,label,p in [(12,"B3",HERE.parent/"iteracion-2/B3.png"),(824,"B4",HERE/"B4.png")]:
    draw.text((x,2),label,font=ImageFont.truetype(str(FONTS/"Barlow-Regular.ttf"),27),fill=NAVY)
    with Image.open(p) as page:
        page.thumbnail((800,1132),Image.Resampling.LANCZOS)
        sheet.paste(page,(x,42))
sheet.save(HERE/"Comparacion-B3-B4.png")
