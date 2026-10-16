/* Maqueta · Módulo de Hemodiálisis · SIGESAPOL
   2. Historia clínica inicial (fichas 0026_01 y 0026_02) y su ventana emergente. */
/* ===== 3. HC inicial ===== */
function hcCampos(p){
  var lab=[["Hemoglobina","g/dL"],["Hematocrito","%"],["Glucosa","mg/dL"],["Depuración de creatinina","ml/min"],["Urea","mg/dL"],["Creatinina","mg/dL"],["Proteínas totales","g/dL"],["Albúmina","g/dL"],["Calcio","mg/dL"],["Fósforo","mg/dL"],["TGO","U/L"],["TGP","U/L"],["Hierro sérico","µg/dL"],["Saturación de transferrina","%"],["Parathormona (PTH)","pg/mL"]];
  var ser=["Serológicas para lúes","AgHBs","AcHBs","AcHBc","AcHVC","HIV","HTLV-1"];
  return ''+
  '<fieldset'+(esNef()?'':' disabled')+'>'+
  '<div class="sub">1.1 DATOS DEL PACIENTE <span class="orig">desde Asegurados</span></div>'+
  '<div class="row">'+campo("Apellidos y nombres",ro(p.nom),"f3")+campo("Edad",ro(p.edad),"fh")+campo("Fecha de atención",ro("14-10-2026"),"f")+'</div>'+
  '<div class="row">'+campo("N° DNI",ro(p.dni),"f")+campo("N° CIP",ro(p.cip),"f")+campo("N° HC",ro(p.hc),"f")+campo("Teléfono",inp("tel",p.tel),"f")+'</div>'+
  '<div class="row">'+campo("Dirección",inp("dir","AV. LOS PRÓCERES 1240"),"f3")+campo("Departamento",ro("LIMA"),"f")+campo("Provincia",ro("LIMA"),"f")+campo("Distrito",ro("SAN JUAN DE LURIGANCHO"),"f")+'</div>'+
  '<div class="sub">1.2 CONTACTO DE EMERGENCIA</div>'+
  '<div class="row">'+campo("Apellidos y nombres",inp("ceN","ARIAS LOPEZ, MARINA"),"f3",true)+campo("Relación con el paciente",sel("ceR",["CÓNYUGE","HIJO(A)","PADRE / MADRE","OTRO"]),"f",true)+campo("Teléfono",inp("ceT","999101202"),"f",true)+'</div>'+
  '<div class="sub">2.1 ANTECEDENTES PATOLÓGICOS</div>'+
  '<div class="row">'+campo("Enfermedad o condición clínica que produjo la enfermedad renal (CIE-10)",sel("cErc",["E11.2 · NEFROPATÍA DIABÉTICA","I12.0 · NEFROPATÍA HIPERTENSIVA","N03 · GLOMERULONEFRITIS CRÓNICA","OTRA"]),"f3",true)+campo("Fecha de primera hemodiálisis",inp("f1hd","2026-09-28",' type="date"'),"f",true)+'</div>'+
  '<div class="row">'+campo("Comorbilidades",inp("com","HTA, DM2"),"f2")+campo("N° de transfusiones",inp("ntr","0"),"fh")+campo("Diuresis residual 24 h (ml)",inp("diu","400"),"f")+campo("Alergia a medicamentos",inp("ale","NIEGA"),"f")+'</div>'+
  '<div class="row">'+campo("Medicación que recibe",inp("medr","LOSARTÁN 50 MG C/12 H"),"f2")+campo("Tiempo de diálisis",inp("tdia","2 SEMANAS"),"f")+campo("Transfusiones previas",radios("trp",["SÍ","NO"],"NO"),"f")+'</div>'+
  '<div class="row">'+campo("Diálisis peritoneal · desde",inp("dpd","",' type="date"'),"f")+campo("hasta",inp("dph","",' type="date"'),"f")+campo("Trasplante renal · desde",inp("trd","",' type="date"'),"f")+campo("hasta",inp("trh","",' type="date"'),"f")+'</div>'+
  '<div class="sub">2.2 OTROS ANTECEDENTES DE IMPORTANCIA</div>'+
  '<div class="row">'+campo("Médicos",inp("anm",""),"f2")+campo("Quirúrgicos",inp("anq","COLOCACIÓN DE CVC 09-2026"),"f2")+'</div>'+
  '<div class="tw"><table><tr><th>Inmunización</th><th>Dosis</th><th>Fecha</th></tr>'+[["Hepatitis B","1.ª dosis","2026-10-01"],["Hepatitis B","2.ª dosis",""],["Hepatitis B","3.ª dosis",""],["Hepatitis B","Refuerzo",""],["COVID-19","N° de dosis","2024-05-10","3 DOSIS"],["Influenza","Última dosis",""],["Neumococo","Última dosis",""]].map(function(r){return'<tr><td style="width:160px">'+r[0]+'</td><td><input class="in" value="'+esc(r[3]||(r[2]?r[1]:""))+'" placeholder="'+esc(r[1])+'"></td><td style="width:170px"><input class="in" type="date" value="'+r[2]+'"></td></tr>'}).join("")+'</table></div>'+
  '<div class="sub">ACCESO VASCULAR</div><div class="row">'+campo("Accesos vasculares previos",inp("avp",""),"f2")+campo("Fecha de creación del primer acceso",inp("fpa","2026-09-27",' type="date"'),"f")+campo("Causa de cambio o pérdida",inp("ccp",""),"f")+campo("Fecha del acceso actual",inp("faa","2026-09-27",' type="date"'),"f")+'</div>'+
  '<div class="sub">2.3 ENFERMEDAD ACTUAL Y 2.4 EXAMEN CLÍNICO</div>'+
  '<div class="row">'+campo("Síntomas",'<textarea class="in">Edema de miembros inferiores, náuseas.</textarea>',"f3")+'</div>'+
  '<div class="row">'+campo("Peso (kg)",inp("hpe","71.2"),"f",true)+campo("Talla (cm)",inp("hta","168"),"f",true)+campo("PA (mmHg)",inp("hpa","150/90"),"f",true)+campo("FC",inp("hfc","88"),"f")+campo("FR",inp("hfr","20"),"f")+campo("SO2 (%)",inp("hso","96"),"f")+'</div>'+
  '<div class="row">'+campo("Piel",inp("hpi",""),"f")+campo("Acceso vascular · ubicación",sel("hub",["YUGULAR INTERNA","SUBCLAVIA","FEMORAL","RADIAL","HUMERAL","OTROS"]),"f")+campo("Tipo",sel("hti",["CATÉTER TEMPORAL","CATÉTER PERMANENTE","FÍSTULA ARTERIOVENOSA","INJERTO"]),"f")+campo("Thrill de FAV",radios("hth",["BUENO","REGULAR"],""),"f")+'</div>'+
  '<div class="row">'+campo("Cardiovascular: corazón",inp("hco",""),"f")+campo("Pulsos periféricos",inp("hpu",""),"f")+campo("Aparato respiratorio",inp("hre",""),"f")+campo("Abdomen",inp("hab",""),"f")+'</div>'+
  '<div class="row">'+campo("Neurológico",inp("hne",""),"f")+campo("Osteomuscular",inp("hos",""),"f")+campo("Estado nutricional",inp("hen",""),"f")+campo("Índice de Karnofsky",sel("hka",[100,90,80,70,60,50,40,30,20,10],70),"f")+'</div>'+
  '<div class="sub">2.5 EXÁMENES DE LABORATORIO <span class="orig">se precargan del laboratorio si existen</span></div>'+
  '<div class="tw"><table><tr><th>Examen</th><th>Resultado</th><th>Unidad</th><th>Fecha</th></tr>'+
  '<tr><td>Grupo sanguíneo y factor Rh</td><td colspan="2">'+ro("O RH(+) · desde Asegurados")+'</td><td></td></tr>'+
  lab.map(function(l){return'<tr><td>'+l[0]+'</td><td style="width:140px"><input class="in"></td><td>'+l[1]+'</td><td style="width:170px"><input class="in" type="date"></td></tr>'}).join("")+
  ser.map(function(n){return'<tr><td>'+n+'</td><td><select class="in">'+opts(["—","NEGATIVO","POSITIVO"])+'</select></td><td></td><td><input class="in" type="date"></td></tr>'}).join("")+
  '<tr><td>Prueba COVID-19</td><td><input class="in"></td><td></td><td><input class="in" type="date"></td></tr><tr><td>Ecografía renal</td><td><select class="in">'+opts(["NO","SÍ"])+'</select></td><td><input class="in" placeholder="Descripción"></td><td><input class="in" type="date"></td></tr><tr><td>RX de tórax</td><td><select class="in">'+opts(["NO","SÍ"])+'</select></td><td><input class="in" placeholder="Descripción"></td><td><input class="in" type="date"></td></tr></table></div>'+
  '<div class="nota">Si alguna serología (AgHBs, AcHVC, HIV) es positiva, el paciente solo podrá programarse en la máquina de aislamiento.</div>'+
  '<div class="sub">III. DATOS DEL MÉDICO</div>'+
  '<div class="row">'+campo("Apellidos y nombres",ro(esNef()?usuario():"—"),"f2")+campo("N° CMP",ro(esNef()?"045812":"—"),"f")+campo("Especialidad",ro("NEFROLOGÍA"),"f")+campo("N° RNE",ro(esNef()?"028731":"—"),"f")+'</div>'+
  '</fieldset>';
}
function vHC(){
  var p=P.filter(function(x){return x.id===V.hc})[0],pend=P.filter(function(x){return!x.hcOk});
  return'<div class="bar">HISTORIA CLÍNICA INICIAL DEL PROGRAMA DE HEMODIÁLISIS · FICHAS 0026_01 Y 0026_02<span class="tag">nuevo</span></div><div class="box">'+
  '<div class="row">'+campo("Buscar paciente por DNI, CIP o N° de HC",inp("hcQ",p.dni),"f3")+'<div class="fh"><label>&nbsp;</label><button class="btn k" style="width:100%" id="btnHcBus">Buscar</button></div></div>'+
  (pend.length?'<div class="nota">Pacientes sin HC inicial: '+pend.map(function(x){return'<a href="#" data-hc="'+x.id+'" style="color:#337AB7">'+esc(x.nom)+'</a>'}).join(", ")+'. Sin HC inicial firmada no se puede programar al paciente.</div>':'')+
  (function(){var so=SOL.filter(function(x){return x.pid===p.id})[0];return so?'<div class="nota">Paciente de la solicitud <b>'+so.id+'</b> · '+prTag(so.proc)+' · '+esc(so.ubic)+' · '+esc(so.dx)+'. Al firmar la HC se pasa a asignar la cita.</div>':''})()+
  hcCampos(p)+
  (esNef()?'<div class="acciones"><button class="btn g" style="flex:1" id="btnHcFirma">Firmar historia clínica inicial</button><button class="btn r" style="flex:.4" id="btnHcCan">Cancelar</button></div>':'<div class="nota err">Solo un nefrólogo registra la HC inicial. Cambie el perfil en «Ver como».</div>')+
  '<div class="leg"><i style="color:#C9302C;font-style:normal">*</i> obligatorio. Los datos del paciente vienen de Asegurados y no se editan aquí, salvo teléfono y dirección.</div></div>';
}
function bHC(){
  q("[data-hc]").forEach(function(a){a.onclick=function(e){e.preventDefault();V.hc=+a.getAttribute("data-hc");pintar()}});
  on("btnHcBus","click",function(){var v=$("hcQ").value.trim(),p=P.filter(function(x){return x.dni===v||x.hc===v||x.cip===v})[0];if(p){V.hc=p.id;pintar()}else aviso("No se encontró un asegurado con ese DNI, CIP o N° de HC.",true)});
  on("btnHcFirma","click",function(){var p=P.filter(function(x){return x.id===V.hc})[0];p.hcOk=true;var so=SOL.filter(function(x){return x.pid===p.id&&x.estado!=="PROGRAMADA"})[0];if(so){so.estado="HC LISTA";V.vista="sol";pintar();programar(so.id);aviso("HC inicial firmada. Ahora asigne la cita.")}else{pintar();aviso("HC inicial firmada. El paciente ya puede programarse.")}});
  on("btnHcCan","click",function(){V.vista="dia";pintar()});
}


/* Ventana emergente de la HC inicial: se abre al registrar un paciente sin HC */
function hcModal(sid){
  var so=SOL.filter(function(x){return x.id===sid})[0],p=P.filter(function(x){return x.id===so.pid})[0];
  abrir('<div class="bar">HISTORIA CLÍNICA INICIAL DEL PROGRAMA DE HEMODIÁLISIS · FICHAS 0026_01 Y 0026_02<span class="tag">primera atención</span></div><div class="box">'+
   '<div class="nota">El paciente <b>'+esc(p.nom)+'</b> no tiene HC inicial del programa de Hemodiálisis. Complétela y fírmela para asignarle la cita. Solicitud <b>'+so.id+'</b> · '+prTag(so.proc)+' · '+esc(so.dx)+'.</div>'+
   (esNef()?'':'<div class="nota err">La HC inicial la firma un nefrólogo. Puede dejarla pendiente con «Llenar después» o cambiar el perfil en «Ver como».</div>')+
   hcCampos(p)+
   '<div class="acciones"><button class="btn g" style="flex:1" id="hmFirma"'+(esNef()?'':' disabled')+'>Firmar HC inicial y asignar cita</button><button class="btn k" style="flex:.5" id="hmLuego">Llenar después</button></div>'+
   '<div class="leg"><i style="color:#C9302C;font-style:normal">*</i> obligatorio. Con «Llenar después» la solicitud queda en la bandeja con el botón «Llenar HC inicial».</div></div>');
  $("modal").classList.add("xl");$("velo").classList.add("alto");$("modal").scrollTop=0;
  on("hmLuego","click",function(){cerrar();aviso("HC inicial pendiente para "+p.nom.split(",")[0]+".")});
  on("hmFirma","click",function(){var req=["ceN","ceT","hpe","hta","hpa"].filter(function(id){var e=$(id);e.classList.remove("err");return!e.value.trim()});
    if(req.length){req.forEach(function(id){$(id).classList.add("err")});aviso("Complete los campos obligatorios marcados en rojo.",true);return}
    p.hcOk=true;so.estado="HC LISTA";cerrar();pintar();programar(so.id);aviso("HC inicial firmada. Ahora asigne la cita.")});
}
