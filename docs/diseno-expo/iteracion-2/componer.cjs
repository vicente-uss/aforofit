// A0; unidades en milímetros. Ejecutar desde la carpeta de esta iteración.
const fs = require("node:fs");
const { execFileSync } = require("node:child_process");
const ot = require("opentype.js");
const { PNG } = require("pngjs");
const { deflateSync } = require("node:zlib");
const pk = {deflate: deflateSync};
process.chdir(__dirname);
const files={reg:"fuentes/Barlow-Regular.ttf",bold:"fuentes/BarlowCondensed-Bold.ttf",ink:"../../evidencia/fidelidad/1280-aforo-lleno-turno.png",mob:"../../evidencia/fidelidad/360-alumno-rutina-mantencion.png"};
const u=key=>Uint8Array.from(fs.readFileSync(files[key]));
const fonts={reg:ot.parse(u("reg").buffer),bold:ot.parse(u("bold").buffer)};
const original=fs.readFileSync("../B-deporte.svg","utf8");
const matrix=[...original.match(/<path d="(M\d+ \d+h1v1h-1z[^"]+)"/)[1].matchAll(/M(\d+) (\d+)h/g)].map(m=>[+m[1],+m[2]]);
function crop(e){const im=PNG.sync.read(Buffer.from(u(e.key)));const [left,top,w,h]=e.crop;const a=new Uint8Array(w*h*4);for(let row=0;row<h;row++){const start=((row+top)*im.width+left)*4;a.set(im.data.subarray(start,start+w*4),row*w*4);}return a}
const pack=({W,H,data})=>PNG.sync.write({width:W,height:H,data:Buffer.from(data)}).toString("base64");
function compose(variant) {
  const shapes=[], dark="#101c2c", blue="#184fd0", paper="#f6f5f0", light="#c9daff", white="#ffffff";
  const rect=(x,y,w,h,c)=>shapes.push({type:"rect",x,y,w,h,c});
  const txt=(x,y,s,size,font="reg",c=dark)=>shapes.push({type:"text",x,y,s,size,font,c});
  const lines=(x,y,strings,step,size,c=dark)=>strings.forEach((s,i)=>txt(x,y+i*step,s,size,"reg",c));
  const pic=(key,x,y,w,crop)=>shapes.push({type:"image",key,x,y,w,crop});
  const bars=(x,y,w,h,c)=>{for(let i=0;i<20;i++){const p=w/20;shapes.push({type:"poly",c,pts:[[x+i*p,y+h],[x+i*p+p*.26,y],[x+i*p+p*.89,y],[x+i*p+p*.63,y+h]]})}};
  function mast(c) {
    txt(32,36,"UNIVERSIDAD SAN SEBASTIÁN  /  BELLAVISTA",11,"bold",c);
    txt(423,36,"TALLER DE INGENIERÍA DE SOFTWARE  /  GRUPO 6",10,"bold",c);
    // El área sin tinta a la derecha se reserva para el recurso USS autorizado.
    shapes.push({type:"reserve",x:739,y:12,w:70,h:33});
  }
  const method=["Entrevista con el encargado y revisión del prototipo.","Tamaño estimado en puntos de función (FP) y líneas","de código (LOC). Esfuerzo estimado con COCOMO."];
  const stack=["Next.js y TypeScript en Vercel. Supabase valida","y guarda cada visita. Realtime actualiza el aforo."];
  const problem=["El ingreso se anota en papel y se copia a Excel.","Sin registro de salida, el encargado estima la ocupación.","La entrevista sitúa la asistencia en 80–90 alumnos al día."];
  function footer() {
    rect(0,1064,841,125,dark);
    txt(32,1088,"PROYECTO INTEGRADOR 2026",10,"bold",light);
    txt(32,1112,"Vicente Galleguillos · Jefe de proyecto",10,"reg",white);
    txt(32,1130,"Benjamín Velásquez · Frontend y prototipo",10,"reg",white);
    txt(32,1148,"Isidora Moscoso · Backend y base de datos",10,"reg",white);
    txt(427,1112,"Pau Urzúa · Ingreso y hardware",10,"reg",white);
    txt(427,1130,"Bastián González · Administración y QA",10,"reg",white);
    txt(427,1148,"Docente · Rodrigo Correa Rojas",10,"reg",white);
    txt(427,1088,"Historial, préstamos con devolución parcial y certificados.",9.5,"reg",light);
    txt(32,1173,"Prototipo académico para alumnos · Datos ficticios · Sin integración con sistemas institucionales USS.",9,"reg",light);
  }
  function qr(x,y) {shapes.push({type:"qr",x,y,w:85});}
  rect(0,0,841,1189,paper);
  if(variant==="B2") {
    rect(0,0,841,250,dark);mast(white);
    txt(29,125,"AforoFit",83,"bold",white);
    txt(32,162,"Control de acceso y aforo en tiempo real",22,"reg",white);
    txt(487,121,"Cada entrada cuenta.",31,"bold",light);
    bars(489,140,309,22,light);
    txt(490,185,"20 cupos operativos según el encargado.",12,"reg",white);
    txt(32,211,"OBJETIVO",11,"bold",light);
    txt(32,233,"Registrar entradas y salidas para saber cuántos alumnos siguen en el gimnasio.",15,"reg",white);
    txt(32,291,"Cuando se ocupa el último cupo",29,"bold");
    txt(32,318,"La pantalla pública muestra el turno llamado. El alumno vuelve a pasar su credencial al ingresar.",12);
    pic("ink",32,336,472,[0,105,1280,625]);
    pic("mob",527,336,282,[0,0,720,535]);
    txt(32,593,"01   /   Aforo y llamado de turno",14,"bold");
    txt(527,593,"02   /   Rutina y aviso de mantención",13.5,"bold");
    txt(32,616,"Escenarios de prueba del prototipo con datos ficticios.",10);
    rect(0,635,841,222,blue);
    txt(32,753,"429",116,"bold",white);
    txt(34,786,"COMPROBACIONES LOCALES APROBADAS",13,"bold",white);
    txt(34,818,"198 Vitest  +  231 SQL",17,"reg",white);
    txt(424,699,"≤ 1,2 s",45,"bold",white);
    txt(633,699,"< 0,1 s",45,"bold",white);
    lines(424,727,["Desde la luz del lector","hasta el registro visible","de entrada. Cota superior."],15,11.5,white);
    lines(633,727,["Del resultado del kiosco","al cambio de aforo en","la misma máquina."],15,11.5,white);
    lines(424,804,["Prueba puntual en red doméstica. Video analizado","a intervalos de 0,1 s con credenciales de prueba."],15,11,white);
    txt(32,893,"Del papel a la visita registrada",21,"bold");
    lines(32,918,problem,14,10.7);
    txt(32,979,"Kiosco con TNE/TUI o QR: registra la visita o asigna turno.",13,"bold");
    lines(32,1002,stack,14,10.7);
    txt(427,893,"Método",21,"bold");
    lines(427,918,method,14,10.1);
    txt(32,1043,"El QR de respaldo admite canje manual. Prueba física con cámara pendiente.",9.8);
    txt(427,991,"Ver el aforo en vivo",17,"bold",blue);
    txt(427,1014,"aforofit.vercel.app/aforo",12);
    qr(724,965);
  } else {
    mast(dark);
    txt(30,122,"AforoFit",84,"bold");
    txt(427,90,"Cada entrada cuenta.",31,"bold",blue);
    txt(427,119,"Control de acceso y aforo en tiempo real",19,"reg");
    bars(32,146,777,17,blue);
    txt(32,186,"20 marcas · 20 cupos operativos informados por el encargado del gimnasio.",12);
    rect(0,207,841,453,dark);
    txt(32,247,"Una credencial, dos pantallas",30,"bold",white);
    txt(32,273,"Escenarios de prueba · Capturas del prototipo con datos ficticios.",12,"reg",light);
    pic("ink",32,293,525,[0,0,1280,820]);
    pic("mob",577,293,232,[0,0,720,908]);
    txt(32,648,"01   /   Sala llena y turno llamado en la pantalla pública",12,"bold",white);
    txt(577,648,"02   /   Rutina del alumno",12,"bold",white);
    txt(32,701,"Objetivo",21,"bold",blue);
    lines(32,729,["Registrar cada entrada y salida para conocer la ocupación","y asignar un turno cuando se completa el cupo."],15,12);
    txt(32,787,"Del papel al registro digital",19,"bold");
    lines(32,811,problem,14,10.6);
    rect(476,660,365,244,blue);
    txt(499,766,"429",98,"bold",white);
    txt(503,798,"COMPROBACIONES LOCALES APROBADAS",13,"bold",white);
    txt(503,835,"198 Vitest  +  231 SQL",21,"reg",white);
    txt(503,872,"Integración verificada en el entorno local.",11,"reg",white);
    txt(32,876,"Kiosco con TNE/TUI o QR: registra la visita o asigna turno.",13,"bold");
    txt(32,923,"≤ 1,2 s",39,"bold",blue);txt(211,923,"< 0,1 s",39,"bold",blue);
    lines(32,947,["De la luz del lector a la","entrada visible. Cota superior."],13,10.3);
    lines(211,947,["Del kiosco al aforo en","la misma máquina."],13,10.3);
    lines(32,996,["Prueba puntual en red doméstica. Video analizado","a intervalos de 0,1 s con credenciales de prueba."],14,10.3);
    txt(32,1043,"QR de respaldo con canje manual. Prueba con cámara pendiente.",9.8);
    txt(426,930,"Método y tecnología",16,"bold");
    lines(426,950,["Entrevista, prototipo y revisión. Estimación","de tamaño con FP y LOC, de esfuerzo con","COCOMO. Next.js y TypeScript en Vercel.","Supabase guarda las visitas y Realtime","actualiza el aforo de la pantalla pública."],13,10.1);
    qr(724,924);
    txt(718,1029,"Ver aforo en vivo",11.5,"bold",blue);
    txt(706,1046,"aforofit.vercel.app/aforo",9);
  }
  footer();
  return shapes;
}
function content(variant){
 const out=[];
 for(const e of compose(variant)){
  if(e.type==="qr"){out.push({type:"rect",x:e.x,y:e.y,w:e.w,h:e.w,c:"#ffffff"});for(const [c,r] of matrix)out.push({type:"rect",x:e.x+c*e.w/37,y:e.y+r*e.w/37,w:e.w/37,h:e.w/37,c:"#101c2c"});}
  else out.push(e)
 }return out
}

const bin=a=>{let s="";for(let n=0;n<a.length;n+=16000)s+=String.fromCharCode(...a.subarray(n,n+16000));return s};
const bytes=s=>Uint8Array.from(s,c=>c.charCodeAt(0));
const fmt=n=>Number(n.toFixed(5));
const esc=s=>s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
function svgFile(variant){
 let defs='<style>'+['reg','bold'].map(k=>'@font-face{font-family:'+ (k==='reg'?'Barlow':'Barlow Condensed')+';font-weight:'+(k==='reg'?400:700)+';src:url(data:font/ttf;base64,'+Buffer.from(u(k)).toString("base64")+') format("truetype")}').join('')+'</style>';
 let ss=compose(variant).map(e=>{
 if(e.type==="text")return '<text x="'+e.x+'" y="'+e.y+'" font-family="'+(e.font==="bold"?'Barlow Condensed':'Barlow')+'" font-weight="'+(e.font==="bold"?700:400)+'" font-size="'+e.size+'" fill="'+e.c+'">'+esc(e.s)+'</text>';
 if(e.type==="rect")return '<rect x="'+e.x+'" y="'+e.y+'" width="'+e.w+'" height="'+e.h+'" fill="'+e.c+'"/>';
 if(e.type==="poly")return '<polygon points="'+e.pts.map(p=>p.join(',')).join(' ')+'" fill="'+e.c+'"/>';
 if(e.type==="reserve")return '<rect id="reserva-logo-USS-autorizado" x="'+e.x+'" y="'+e.y+'" width="'+e.w+'" height="'+e.h+'" fill="none"/>';
 if(e.type==="image"){let [, ,w,h]=e.crop;let dat=pack({data:crop(e),W:w,H:h});return '<image id="captura-'+e.key+'" x="'+e.x+'" y="'+e.y+'" width="'+e.w+'" height="'+(e.w*h/w)+'" xlink:href="data:image/png;base64,'+dat+'"/>'}
 if(e.type==="qr")return '<g id="QR-aforo" transform="translate('+e.x+' '+e.y+') scale('+e.w/37+')"><rect width="37" height="37" fill="#fff"/><path fill="#101c2c" d="'+matrix.map(([x,y])=>'M'+x+' '+y+'h1v1h-1z').join(' ')+'"/></g>';
 }).join('\n');
 return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="841mm" height="1189mm" viewBox="0 0 841 1189" style="font-kerning:none"><title>AforoFit '+variant+'</title><defs>'+defs+'</defs>\n'+ss+'</svg>';
}
function pdfFile(shapes){
 let objs=[null,null,null,null], put=s=>(objs.push(s),objs.length-1);
 const stream=(a,dict="")=>{let b=pk.deflate(a);return put('<< '+dict+' /Filter /FlateDecode /Length '+b.length+' >>\nstream\n'+bin(b)+'\nendstream')};
 const ref=n=>n+' 0 R';const hx=n=>n.toString(16).padStart(4,"0");let fr=[],ir=[],ops=['q 2.8346456693 0 0 -2.8346456693 0 3370.39370079 cm'];
 for(let k of ["reg","bold"]){let f=fonts[k],name=k==="reg"?"Barlow-Regular":"BarlowCondensed-Bold", ids=new Map();
 for(let e of shapes.filter(s=>s.type==="text"&&s.font===k))for(let ch of e.s){let id=f.charToGlyphIndex(ch);if(!id)throw Error('Missing character '+ch);ids.set(id,ch.codePointAt(0));}
 let ttf=u(k),fref=stream(ttf,"/Length1 "+ttf.length),df=put('<< /Type /FontDescriptor /FontName /'+name+' /Flags 32 /FontBBox [-600 -320 1500 1100] /ItalicAngle 0 /Ascent 1000 /Descent -250 /CapHeight 700 /StemV 90 /FontFile2 '+ref(fref)+' >>');
 let widths=[...ids].map(([id])=>id+' ['+fmt(f.glyphs.get(id).advanceWidth*1000/f.unitsPerEm)+']').join(' ');
 let cid=put('<< /Type /Font /Subtype /CIDFontType2 /BaseFont /'+name+' /CIDSystemInfo << /Registry (Adobe) /Ordering (Identity) /Supplement 0 >> /FontDescriptor '+ref(df)+' /CIDToGIDMap /Identity /W ['+widths+'] >>');
 let cmap='/CIDInit /ProcSet findresource begin 12 dict begin begincmap /CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def /CMapName /Adobe-Identity-UCS def /CMapType 2 def 1 begincodespacerange <0000> <ffff> endcodespacerange '+ids.size+' beginbfchar\n'+[...ids].map(([id,cp])=>'<'+hx(id)+'> <'+hx(cp)+'>').join('\n')+'\nendbfchar endcmap CMapName currentdict /CMap defineresource pop end end';
 let cm=stream(bytes(cmap)); fr.push('/'+k+' '+ref(put('<< /Type /Font /Subtype /Type0 /BaseFont /'+name+' /Encoding /Identity-H /DescendantFonts ['+ref(cid)+'] /ToUnicode '+ref(cm)+' >>')));}
 let prev;for(let e of shapes){if(e.c&&e.c!==prev){prev=e.c;ops.push(e.c.slice(1).match(/../g).map(v=>fmt(parseInt(v,16)/255)).join(' ')+' rg')}
 if(e.type==="text"){const val=[...e.s].map(c=>hx(fonts[e.font].charToGlyphIndex(c))).join('');ops.push('BT /'+e.font+' '+e.size+' Tf 1 0 0 -1 '+e.x+' '+e.y+' Tm <'+val+'> Tj ET')}
 if(e.type==="rect")ops.push([e.x,e.y,e.w,e.h].map(fmt).join(' ')+' re f');
 if(e.type==="poly")ops.push(e.pts.map(([x,y],i)=>fmt(x)+' '+fmt(y)+(i?' l':' m')).join(' ')+' h f');
 if(e.type==="image"){let [, ,w,h]=e.crop,a=crop(e),rgb=new Uint8Array(w*h*3);for(let i=0;i<w*h;i++){for(let j=0;j<3;j++)rgb[i*3+j]=a[i*4+j]}
 let v=stream(rgb,'/Type /XObject /Subtype /Image /Width '+w+' /Height '+h+' /ColorSpace /DeviceRGB /BitsPerComponent 8');ir.push('/'+e.key+' '+ref(v));let hh=e.w*h/w;ops.push('q '+e.w+' 0 0 '+fmt(-hh)+' '+e.x+' '+fmt(e.y+hh)+' cm /'+e.key+' Do Q');}}
 ops.push('Q');const cr=stream(bytes(ops.join('\n')));objs[1]='<< /Type /Catalog /Pages 2 0 R >>';objs[2]='<< /Type /Pages /Count 1 /Kids [3 0 R] >>';objs[3]='<< /Type /Page /Parent 2 0 R /MediaBox [0 0 2383.93700787 3370.39370079] /Resources << /Font << '+fr.join(' ')+' >> /XObject << '+ir.join(' ')+' >> >> /Contents '+ref(cr)+' >>';
 let pdf='%PDF-1.7\n%\xe0\xe1\xe2\xe3\n', off=[0];for(let i=1;i<objs.length;i++){off.push(pdf.length);pdf+=i+' 0 obj\n'+objs[i]+'\nendobj\n'}const end=pdf.length;pdf+='xref\n0 '+objs.length+'\n0000000000 65535 f \n'+off.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')+'trailer\n<< /Size '+objs.length+' /Root 1 0 R >>\nstartxref\n'+end+'\n%%EOF\n';return bytes(pdf)
}

for(const variant of ["B2","B3"]){
  fs.writeFileSync(variant+".svg",svgFile(variant));
  fs.writeFileSync(variant+".pdf",pdfFile(content(variant)));
  execFileSync("pdftoppm",["-png","-singlefile","-scale-to","1902",variant+".pdf",variant]);
}
const [left,right]=["B2","B3"].map(k=>PNG.sync.read(fs.readFileSync(k+".png")));
const comparison=new PNG({width:left.width+right.width+24,height:Math.max(left.height,right.height),fill:true}); comparison.data.fill(255);
PNG.bitblt(left,comparison,0,0,left.width,left.height,0,0);
PNG.bitblt(right,comparison,0,0,right.width,right.height,left.width+24,0);
fs.writeFileSync("Comparacion.png",PNG.sync.write(comparison));
