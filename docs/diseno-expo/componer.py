"""Genera las tres matrices SVG. Las coordenadas están en milímetros."""
from pathlib import Path
import base64
from io import BytesIO
from xml.etree import ElementTree as ET
from PIL import Image, ImageFont
from reportlab.graphics.barcode.qrencoder import QRCode, QRErrorCorrectLevel

DIR = Path(__file__).resolve().parent
EVID = DIR.parent / "evidencia"
NAVY, BLUE, PAPER, WHITE = "#101c2c", "#2563eb", "#f6f5f0", "#ffffff"
ICE = "#c8d9ff"
URL = "https://aforofit.vercel.app/aforo"
FONT = Path("/usr/share/fonts/opentype/urw-base35")

def element(tag, **attrs):
    return ET.SubElement(root, tag, {k:str(v) for k,v in attrs.items()})

def rect(x,y,w,h,color):
    return element("rect", x=x,y=y,width=w,height=h,fill=color)

def line(x,y,w,color=NAVY):
    rect(x,y,w,0.8,color)

def txt(x,y,value,size=11,color=NAVY,bold=False,limit=0):
    font = ImageFont.truetype(str(FONT / ("NimbusSans-Bold.otf" if bold else "NimbusSans-Regular.otf")), round(size*10))
    width = font.getlength(value)/10
    assert width <= (limit or 807-x)+1, (value, width,limit or 807-x)
    el = element("text", x=x,y=y,fill=color, **{"font-family":"Nimbus Sans","font-size":size,"font-weight":"bold" if bold else "normal"})
    el.text = value

def lines(x,y,items,size=11,step=15,color=NAVY,limit=0):
    for j,value in enumerate(items):
        txt(x,y+j*step,value,size,color,limit=limit)

def photo(name,x,y,w,box=None,tag="captura"):
    im = Image.open(EVID/name).convert("RGB")
    if box: im = im.crop(box)
    buf=BytesIO()
    im.save(buf,format="PNG")
    h=w*im.height/im.width
    node=element("image",id=tag,x=x,y=y,width=w,height=h)
    node.set("{http://www.w3.org/1999/xlink}href","data:image/png;base64,"+base64.b64encode(buf.getvalue()).decode())
    return h

def qr(x,y):
    code=QRCode(None,QRErrorCorrectLevel.M)
    code.addData(URL); code.make()
    n=code.getModuleCount()
    u=82/(n+8)
    rect(x,y,82,82,WHITE)
    path=" ".join(f"M{c+4} {r+4}h1v1h-1z" for r in range(n) for c in range(n) if code.isDark(r,c))
    element("path",d=path,transform=f"translate({x} {y}) scale({u})",fill=NAVY)

def mast(dark=False):
    c=WHITE if dark else NAVY
    txt(34,49,"AforoFit",24,c,True)
    txt(296,37,"Universidad San Sebastián",10,c,True)
    txt(296,52,"Taller de Ingeniería de Software",9,c)
    txt(558,37,"Proyecto Integrador 2026",10,c,True)
    txt(558,52,"Grupo 6  /  Sede Bellavista",9,c)
    line(34,67,773,c)

def a():
    mast()
    txt(31,162,"Cada entrada",56,NAVY,True)
    txt(31,224,"cuenta.",56,BLUE,True)
    lines(558,153,["Control de acceso","y aforo en tiempo real","para el gimnasio","USS Bellavista."],16,20,limit=249)
    line(34,263,773)
    txt(34,292,"Del papel al aforo en vivo",18,NAVY,True)
    lines(34,322,["El ingreso se anota en papel y luego se pasa","a Excel. La salida queda sin registrar.","¿Cuántos alumnos siguen entrenando?"],11.4,16,limit=377)
    txt(34,426,"17 / 20",43,BLUE,True)
    lines(34,450,["En la captura hay 17 personas dentro.","Cada marca representa un cupo operativo."],10,14,limit=377)
    for i in range(20):rect(34+i*18,494,15,45,BLUE if i<17 else "#c8ced9")
    photo("fidelidad/1280-aforo-casi-lleno.png",427,313,380)
    txt(427,575,"Pantalla pública · escenario de prueba con tres cupos libres.",9)
    txt(34,575,"Límite operativo informado por el encargado.",9)
    photo("historial/1280-profesor-historial.png",34,588,204,(289,636,1237,764),"detalle-historial")
    lines(254,598,["El historial conserva las visitas y distingue cómo se cerró cada una."],9)


def b():
    rect(0,0,841,606,NAVY); mast(True)
    txt(34,111,"AFORO DEL GIMNASIO USS BELLAVISTA",13,ICE,True)
    txt(24,326,"20",230,WHITE,True)
    txt(302,194,"cupos.",60,WHITE,True)
    txt(302,259,"Cada entrada",52,WHITE,True)
    txt(302,317,"cuenta.",52,ICE,True)
    txt(34,364,"Límite operativo informado por el encargado  /  Una marca por persona",12,WHITE)
    for i in range(20):
        x=34+i*38.6
        element("path",d=f"M{x} 447 l18 -59 h19 l-18 59z",fill=ICE)
    line(34,473,773,ICE)
    txt(34,515,"¿Y si llega alguien más?",21,WHITE,True)
    lines(34,548,["Con la sala llena, el kiosco asigna un turno.","Al liberarse un cupo, la pantalla llama al siguiente."],12,17,WHITE,limit=484)
    photo("fidelidad/1280-aforo-lleno-turno.png",558,487,249,(0,70,1280,605))
    txt(558,601,"Pantalla pública · turno llamado.",8,WHITE)

def c():
    mast()
    txt(34,131,"De la credencial al celular",45,NAVY,True)
    txt(34,169,"Control de acceso y aforo en tiempo real para el gimnasio USS Bellavista.",15)
    # Tríptico fotográfico: tres piezas auténticas, recortadas a su zona de interés.
    rect(0,193,841,331,NAVY)
    photo("lector/lector-usb-2026-11-24.jpg",34,218,249,(180,410,920,1130),"foto-lector-sustituible")
    photo("fidelidad/1280-ingreso-entrada.png",296,218,249,(620,60,1200,623),"resultado-kiosco")
    photo("fidelidad/360-alumno-rutina-mantencion.png",558,218,249,(0,0,720,700),"rutina-celular")
    for x,num,title in [(34,"01","Lectura USB"),(296,"02","Ingreso validado"),(558,"03","Rutina del día")]:
        txt(x,496,num,11,ICE,True); txt(x+27,496,title,15,WHITE,True,limit=222)
    txt(34,562,"Cada entrada cuenta.",23,BLUE,True)
    lines(427,551,["El registro activa la rutina y actualiza el aforo.","El encargado informa un límite de 20 personas."],12,16,limit=380)

def detail(version):
    txt(34,643,"Cómo se decide un acceso",22,NAVY,True)
    flow=[("Credencial","TNE / TUI o QR"),("Kiosco web","Recibe la lectura"),("Supabase","Valida y guarda"),("Decisión","Entrada, salida o turno"),("Pantalla pública","Actualiza el aforo")]
    for i,(title,cap) in enumerate(flow):
        x=34+i*156
        line(x,664,144,BLUE)
        txt(x,689,title,12,NAVY,True,144)
        txt(x,709,cap,9.8,NAVY,limit=145)
        if i<4: txt(x+134,659,"›",13,BLUE,True)
    line(34,730,773)
    txt(34,757,"El punto de partida",14,NAVY,True)
    lines(34,779,["El encargado estima 80 a 90 alumnos al día.","Se copia el ingreso del papel a Excel. Sin salidas,","el profesor debe estimar cuántos siguen dentro."],10.6,14,limit=380)
    txt(427,757,"Del levantamiento a la prueba",14,NAVY,True)
    lines(427,779,["Entrevista con el encargado, prototipo y revisión","con el usuario. Desarrollo por etapas y pruebas","locales. Next.js, TypeScript y Supabase Realtime."],10.6,14,limit=380)
    line(34,826,773)
    txt(34,855,"Qué permite el registro",14,NAVY,True)
    lines(34,877,["El alumno recibe una rutina por objetivo y nivel,","con alertas de mantención. Su evaluación orienta","la progresión. El profesor consulta el historial","y registra préstamos y devoluciones parciales.","Administración gestiona certificados y parámetros."],10.4,13.5,limit=383)
    txt(427,855,"Qué se comprobó",14,BLUE,True)
    lines(427,877,["429 comprobaciones locales aprobadas:","198 de Vitest y 231 de SQL. En video, en red","doméstica: entrada con lector ≤ 1,2 s y aforo","< 0,1 s tras el resultado del kiosco. En la prueba","manual, la rutina llegó al celular en cerca de 1 s."],10.4,13.5,limit=380)
    rect(0,956,841,100,BLUE)
    txt(34,987,"De un conteo a ojo a un registro de quién sigue dentro.",17,WHITE,True)
    lines(34,1015,["Prototipo académico para alumnos, con datos ficticios y sin integración institucional USS.","El QR de respaldo admite canje manual. La prueba física con cámara sigue pendiente."],10.8,16,WHITE)
    txt(34,1083,"Equipo del proyecto",12,NAVY,True)
    lines(34,1105,["Vicente Galleguillos · Jefe de proyecto","Benjamín Velásquez · Frontend y prototipo","Isidora Moscoso · Backend y base de datos","Pau Urzúa · Ingreso y hardware","Bastián González · Administración y QA"],9.4,12.6,limit=360)
    if version=="C-producto":
        # Detalle complementario de garantía, con leyenda fuera de la imagen.
        txt(558,1123,"Préstamo en curso",9,NAVY,True)
        photo("prestamos-qr/prestamo-parcial.png",558,1131,143,(35,534,315,607),"detalle-garantia")
    txt(427,1083,"Ver el aforo en vivo",14,BLUE,True)
    txt(427,1104,"aforofit.vercel.app/aforo",10.5)
    txt(427,1144,"Docente",9)
    txt(427,1160,"Rodrigo Correa Rojas",11,NAVY,True)
    qr(725,1078)

ET.register_namespace("xlink","http://www.w3.org/1999/xlink")
for name,draw in [("A-precision",a),("B-deporte",b),("C-producto",c)]:
    root=ET.Element("svg",xmlns="http://www.w3.org/2000/svg",width="841mm",height="1189mm",viewBox="0 0 841 1189")
    rect(0,0,841,1189,PAPER)
    draw(); detail(name)
    ET.ElementTree(root).write(DIR/(name+".svg"),encoding="utf-8",xml_declaration=True)
