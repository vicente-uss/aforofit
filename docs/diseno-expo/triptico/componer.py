"""Trípticos envolventes. Coordenadas en mm desde la esquina del corte."""
from pathlib import Path
from io import BytesIO
import base64
from copy import deepcopy
import subprocess
import tempfile
import xml.etree.ElementTree as E
import fitz
from PIL import Image,ImageFont,ImageDraw
from reportlab.graphics.barcode.qrencoder import QRCode,QRErrorCorrectLevel

D=Path(__file__).resolve().parent
F=D.parent/"iteracion-2/fuentes"
ORIG=D.parent/"iteracion-3/originales"
NAVY,BLUE,PAPER,WHITE="#101C2C","#184FD0","#F6F5F0","#FFFFFF"
NS="http://www.w3.org/2000/svg"
LINK="{http://www.w3.org/1999/xlink}href"
E.register_namespace("","http://www.w3.org/2000/svg")
E.register_namespace("xlink","http://www.w3.org/1999/xlink")
brand=E.parse(D.parent/"cierre-B4-1/B4.1.svg").find(".//*[@id='isotipo']")
def node(tag,**attrs):
    return E.SubElement(page,tag,{k:str(v) for k,v in attrs.items()})
def rect(x,y,w,h,c):
    node("rect",x=x,y=y,width=w,height=h,fill=c)
def t(x,y,s,size=4,c=NAVY,b=False):
    font=ImageFont.truetype(str(F/("BarlowCondensed-Bold.ttf" if b else "Barlow-Regular.ttf")),round(size*100))
    width=font.getlength(s)/100
    bounds=[97,197,297] if side=="exterior" else [100,200,297]
    end=next(v for v in bounds if v>x)
    assert x+width<=end-4,(s,x,width,end)
    node("text",x=x,y=y,fill=c,**{"font-size":size,"font-family":"Barlow Condensed" if b else "Barlow","font-weight":700 if b else 400}).text=s
def block(x,y,rows,size=3.9,step=5.4,c=NAVY):
    for j,s in enumerate(rows): t(x,y+j*step,s,size,c)
def logo(x,y,factor):
    g=deepcopy(brand);g.set("transform",f"translate({x} {y}) scale({factor})");page.append(g)
def marks(x,y,w,h,c):
    for i in range(20):
        sx=x+w*i/20
        node("path",d=f"M{sx} {y+h} l{w*.012} {-h} h{w*.027} l{-w*.012} {h}z",fill=c)
def image(path,x,y,w,box):
    im=Image.open(path).crop(box)
    buf=BytesIO();im.save(buf,"PNG")
    node("image",x=x,y=y,width=w,height=w*im.height/im.width,**{LINK:"data:image/png;base64,"+base64.b64encode(buf.getvalue()).decode()})
def uss(x,y,w):
    node("image",x=x,y=y,width=w,height=w*344.2/1023.3,**{LINK:"data:image/svg+xml;base64,"+base64.b64encode((D/"recursos/uss-logo-white.svg").read_bytes()).decode()})
def qr(x,y,w):
    q=QRCode(None,QRErrorCorrectLevel.M);q.addData("https://aforofit.vercel.app/aforo");q.make()
    n=q.getModuleCount();rect(x,y,w,w,WHITE)
    d=" ".join(f"M{j+4} {i+4}h1v1h-1z" for i in range(n) for j in range(n) if q.isDark(i,j))
    node("path",transform=f"translate({x} {y}) scale({w/(n+8)})",d=d,fill=NAVY)

def exterior(v):
    rect(-3,-3,303,216,PAPER)
    rect(197,-3,103,216,NAVY if v==1 else BLUE)
    # Solapa: el problema de la sala antes de desplegar el interior.
    t(8,15,"Gimnasio USS Bellavista",3.8)
    if v==1:
        t(7,49,"¿Cuántos",13,b=True);t(7,64,"siguen dentro?",13,b=True)
        t(8,82,"El registro actual",5.6,BLUE,True)
    else:
        t(7,48,"¿Hay cupo",13,b=True);t(7,64,"para entrar?",13,b=True)
        t(8,82,"Antes de pasar la credencial",5.6,BLUE,True)
    block(8,94,["El ingreso se anota en papel y luego","se copia a Excel. Como las salidas","quedan sin registrar, el profesor","estima cuántos alumnos siguen dentro."])
    t(7,141,"80–90",15,BLUE,True)
    block(8,150,["alumnos por día, según el encargado.","El límite operativo es de 20 personas."],3.75)
    t(8,175,"Objetivo",5.5,b=True)
    block(8,185,["Registrar entradas y salidas para","conocer la ocupación y ordenar la espera."])
    # Contraportada: resultados y acceso público.
    t(105,16,"Resultados del prototipo",5.8,b=True)
    t(104,44,"429",20,BLUE,True)
    block(105,53,["comprobaciones automatizadas locales","aprobadas. 198 Vitest y 231 SQL."])
    t(105,72,"Entrada en ≤ 1,2 s",5.6,b=True)
    block(105,79,["Desde la luz del lector hasta la entrada","visible. Es una cota superior."],3.65)
    t(105,96,"Aforo en menos de 0,1 s",5.6,b=True)
    block(105,103,["Tras el resultado del kiosco, en la misma","máquina. Prueba en red doméstica; video","analizado a intervalos de 0,1 s."],3.65,4.8)
    qr(162,119,28)
    t(105,130,"Ver el aforo público",5.2,BLUE,True)
    t(105,137,"aforofit.vercel.app/aforo",3.6)
    t(105,157,"Taller de Ingeniería de Software",5,b=True)
    block(105,164,["Proyecto Integrador 2026 · Grupo 6","Vicente Galleguillos · Benjamín Velásquez","Isidora Moscoso · Pau Urzúa","Bastián González","Docente · Rodrigo Correa Rojas"],3.65,5.1)
    # Portada: dos jerarquías con la misma identidad.
    if v==1:
        logo(206,17,.32);t(223,28,"AforoFit",10,WHITE,True)
        t(205,88,"Cada entrada",13.5,WHITE,True);t(205,104,"cuenta.",13.5,WHITE,True)
        marks(206,116,80,8,WHITE)
    else:
        logo(206,17,.31);t(205,72,"AforoFit",23,WHITE,True)
        marks(206,86,80,11,WHITE)
        t(205,119,"Cada entrada cuenta.",8.5,WHITE,True)
    if v==1: t(206,130,"Una marca por cupo operativo.",3.35,WHITE)
    else: t(206,104,"Una marca por cupo operativo.",3.35,WHITE)
    block(206,143,["Control de acceso y aforo","en tiempo real."],5,7,WHITE)
    uss(206,177,40)
    t(206,199,"Sede Bellavista",3.6,WHITE)

def interior(v):
    rect(-3,-3,303,216,PAPER)
    if v==1:
        rect(-3,-3,303,48,NAVY)
        for x,name,k in [(8,"Acceso inteligente","El punto de entrada"),(108,"Gestión en vivo","La sala"),(208,"Rutina del alumno","El entrenamiento")]:
            t(x,13,k,3.9,WHITE);t(x,34,name,8.4,WHITE,True)
    else:
        rect(-3,-3,303,48,BLUE)
        for x,name,k in [(8,"Al llegar","Tu credencial"),(108,"Si hay espera","Tu turno"),(208,"Al entrenar","Tu sesión")]:
            t(x,13,k,3.9,WHITE);t(x,34,name,9.5,WHITE,True)
    block(8,56,["Pasa tu TNE o TUI por el lector.","El kiosco valida el certificado, el horario","y los cupos antes de registrar la visita."] if v==2 else ["El kiosco recibe la TNE o TUI y valida","el certificado, el horario y el cupo.","Al salir, una nueva lectura cierra la visita."])
    image(ORIG/"entrada-escritorio.png",8,75,83,(1880,490,3040,800))
    t(8,104,"Confirmación de entrada en el kiosco.",3.45)
    t(8,119,"QR de respaldo",5.4,BLUE,True)
    block(8,127,["El alumno también puede ingresar con","un código de un solo uso. Se probó el","canje manual. La validación física por","cámara sigue pendiente."],3.8,5.2)
    block(108,56,["Con la sala llena se asigna un turno.","Al liberarse un cupo, la pantalla llama","al siguiente alumno de la lista."])
    image(ORIG/"turno-llamado-escritorio.png",108,75,84,(0,260,3840,1820))
    t(108,116,"19 dentro · 1 cupo libre · turno 03 llamado",3.4)
    block(108,127,["El profesor revisa el historial y el estado","de las máquinas, registra préstamos de","implementos y devoluciones parciales.","Administración gestiona certificados."],3.8,5.2)
    if v==1:
        image(ORIG/"rutina-fotos-movil.png",208,52,79,(0,803,1170,1570))
        t(208,111,"Aviso de mantención y carga del ejercicio.",3.35)
        block(208,122,["La rutina se adapta al objetivo y nivel.","Cada ejercicio muestra su fotografía,","series, repeticiones y carga. Al salir, el","alumno indica cómo le fue; en la rutina","por plantilla se ajusta la carga siguiente."],3.7,5.1)
    else:
        block(208,56,["Tu rutina por objetivo y nivel incluye fotos,","cargas y avisos de máquinas en mantención.","Al salir, evalúas la dificultad de la sesión."],3.7,5.2)
        image(ORIG/"rutina-fotos-movil.png",208,75,80,(0,1030,1170,1565))
        t(208,119,"Prensa de piernas · sesión de ejemplo",3.45)
        image(D/"recursos/progresion-movil.png",208,123,80,(20,818,1150,976))
        t(208,142,"Otra prueba: tras «Fácil», de 40 a 42,5 kg.",3.45)
    for x,s in [(8,"Arquitectura"),(108,"Método"),(208,"Conclusión")]:t(x,159,s,5.7,BLUE,True)
    block(8,166,["Next.js y TypeScript en Vercel. Supabase","valida y guarda las visitas; Realtime","actualiza la pantalla pública."],3.6,5)
    block(108,166,["Entrevista y revisión con el encargado.","Tamaño por puntos de función (FP) y líneas","de código (LOC); esfuerzo con COCOMO."],3.6,5)
    block(208,166,["Registrar entradas y salidas permite medir","la ocupación. En la prueba con lector, el","aforo pasó de 0 a 1 y volvió a 0 al salir."],3.6,5)
    rect(-3,186,303,27,NAVY)
    block(8,195,["Vistas independientes del prototipo local,","con datos ficticios y respuestas controladas."],3.45,4.8,WHITE)
    block(108,195,["Prototipo académico para alumnos,","sin integración con sistemas de la USS."],3.45,4.8,WHITE)
    t(208,198,"AforoFit   /   USS Bellavista",4.5,WHITE,True)

def folded(folder):
    # Vista frontal y primera apertura: interior izquierdo seguido de la solapa exterior.
    images=[Image.open(folder/(s+".png")).convert("RGB") for s in ["exterior","interior"]]
    def panel(index,left,right):
        im=images[index]
        return im.crop((round((left+3)*im.width/303),round(3*im.height/216),round((right+3)*im.width/303),round(213*im.height/216)))
    sheet=Image.new("RGB",(1210,830),"#e3e3dc");draw=ImageDraw.Draw(sheet)
    font=ImageFont.truetype(str(F/"Barlow-Regular.ttf"),23)
    for x,desc in [(25,"Cerrado · portada"),(426,"Primera apertura · acceso y solapa")]:draw.text((x,15),desc,font=font,fill=NAVY)
    for x,p,w in [(25,panel(0,197,297),359),(426,panel(1,0,100),359),(785,panel(0,0,97),348)]:
        sheet.paste(p.resize((w,754),Image.Resampling.LANCZOS),(x,54))
    sheet.save(folder/"plegado.png")

for v in [1,2]:
    folder=D/f"T{v}";folder.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        result=fitz.open()
        for side,fn in [("exterior",exterior),("interior",interior)]:
            page=E.Element("{"+NS+"}svg",width="303mm",height="216mm",viewBox="-3 -3 303 216")
            fn(v)
            svg=folder/(side+".svg")
            E.ElementTree(page).write(svg,encoding="utf-8",xml_declaration=True)
            pdf=Path(tmp)/(side+".pdf")
            subprocess.run(["inkscape",str(svg),"-o",str(pdf)],check=True)
            with fitz.open(pdf) as src:result.insert_pdf(src)
            pg=result[-1];m=3*72/25.4
            pg.set_trimbox(fitz.Rect(m,m,pg.rect.width-m,pg.rect.height-m))
            pg.set_bleedbox(pg.mediabox)
            pg.get_pixmap(matrix=fitz.Matrix(1.65,1.65),alpha=False).save(folder/(side+".png"))
        result.save(folder/f"T{v}.pdf",garbage=4,deflate=True)
        result.close()
    folded(folder)
