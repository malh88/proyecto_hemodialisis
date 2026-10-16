/* Maqueta · Módulo de Hemodiálisis · SIGESAPOL
   4. Registro de atención del día y ficha de sesión en 3 tiempos (0026_03 y 0026_04), con proceso de atención de enfermería NANDA · NOC · NIC. */
/* ===== 1. Atención del día ===== */
function vDia(){
  var cnt=[0,0,0,0,0];Object.keys(S).forEach(function(k){cnt[S[k].est]++});
  var filas="";
  TURNOS.forEach(function(t){
    var ps=Object.keys(S).map(function(k){return{s:S[k],p:P.filter(function(x){return x.id===+k})[0]}}).filter(function(o){return o.s.turno===t.id});
    if(!ps.length)return;
    filas+='<tr class="grupo"><td colspan="8">'+t.n.toUpperCase()+' · '+t.h+'</td></tr>';
    ps.forEach(function(o){var s=o.s;filas+='<tr class="clic'+(s.est===0?' nuevo':'')+'" data-pid="'+o.p.id+'"><td class="nw">'+o.p.hc+'<div class="prof">DNI '+o.p.dni+'</div></td><td>'+esc(o.p.nom)+'</td><td>'+prTag(s.pk)+'</td><td>'+esc(s.lugar)+'</td><td style="text-align:center">'+(s.unica?'CITA ÚNICA':s.nro)+'</td><td>'+st(s.est)+'</td><td class="prof">'+profs(s)+'</td><td class="nw"><button class="btn sm '+(s.est===4?"k":"g")+'">'+(s.est===4?"Ver ficha":"Atender")+'</button>'+(s.est===0?' <button class="btn sm o" data-rep="'+o.p.id+'">Reprogramar</button>':'')+'</td></tr>'})
  });
  return'<div class="bar">REGISTRO DE ATENCIÓN DEL DÍA · LUNES 12-10-2026<span class="tag">nuevo</span></div><div class="box">'+
   '<div class="kpis"><div class="kpi"><div class="v">'+cnt[0]+'</div><div class="t">Por iniciar</div></div><div class="kpi"><div class="v">'+cnt[1]+'</div><div class="t">En evaluación inicial</div></div><div class="kpi alerta"><div class="v">'+cnt[2]+'</div><div class="t">En enfermería</div></div><div class="kpi"><div class="v">'+cnt[3]+'</div><div class="t">Por evaluación final</div></div><div class="kpi ok"><div class="v">'+cnt[4]+'</div><div class="t">Cerradas</div></div></div>'+
   '<div class="tw"><table><tr><th>N° HC</th><th>Paciente</th><th>Procedencia</th><th>Lugar de atención</th><th>N° sesión del mes</th><th>Estado</th><th>Profesionales que atienden</th><th></th></tr>'+filas+'</table></div>'+
   '<div class="leg">Aparecen las citas del día: pacientes del programa regular y citas únicas de hospitalización y emergencia asignadas desde «Solicitudes de atención». La atención dura de 3 a 4 horas, por eso el médico y la enfermera de cada tiempo pueden ser distintos (cambio de turno). La sesión queda abierta 24 horas desde la evaluación inicial.</div></div>';
}
function profs(s){var e=[];s.enf.mon.forEach(function(r){if(r.u&&e.indexOf(r.u)<0)e.push(r.u)});if(s.enf.firm&&e.indexOf(s.enf.firm.u)<0)e.push(s.enf.firm.u);
  return'Ev. inicial: <b>'+(s.ini.firm?s.ini.firm.u:"—")+'</b><br>Enfermería: <b>'+(e.join(" / ")||"—")+'</b><br>Ev. final: <b>'+(s.fin.firm?s.fin.firm.u:"—")+'</b>'}
function bDia(){q("[data-rep]").forEach(function(b){b.onclick=function(ev){ev.stopPropagation();reprog(+b.getAttribute("data-rep"))}});q("tr[data-pid]").forEach(function(tr){tr.onclick=function(){V.ses=+tr.getAttribute("data-pid");var s=S[V.ses];V.t=s.est>=3?3:s.est>=2?2:1;if(s.est===0)s.est=1;V.vista="ses";pintar();window.scrollTo(0,0)}})}

/* ===== 2. Ficha de sesión ===== */
function cab(p,s){return'<div class="pac"><span>Paciente: <b>'+esc(p.nom)+'</b></span><span>DNI: <b>'+p.dni+'</b></span><span>N° HC: <b>'+p.hc+'</b></span><span>Grado / parentesco: <b>'+p.grado+' · '+p.par+'</b></span><span>Edad: <b>'+p.edad+' años</b></span>'+
  '<span>Procedencia: '+prTag(s.pk)+'</span><span>Lugar de atención: <b>'+esc(s.lugar)+'</b></span><span>Turno: <b>'+TURNOS[s.turno-1].n+' ('+TURNOS[s.turno-1].h+')</b></span>'+(s.unica?'<span>Tipo de cita: <b>CITA ÚNICA</b></span>':'<span>N° sesión del mes: <b>'+s.nro+'</b></span><span>Frecuencia: <b>3 veces/semana ('+p.dias+')</b></span>')+'<span>Serología: <b>'+p.ser+'</b></span></div>'}
function vSes(){var s=S[V.ses],p=P.filter(function(x){return x.id===V.ses})[0];return cab(p,s)+(V.t===1?t1(s,p):V.t===2?t2(s,p):t3(s,p))}
function firma(f,puede,txt,id,leg,no){
  if(f)return'<div class="nota ok">Firmado por <b>'+f.u+'</b> a las '+f.h+'.</div>';
  if(!puede)return'<div class="nota err">'+no+' Cambie el perfil en «Ver como».</div>';
  return'<div class="acciones"><button class="btn g" style="flex:1" id="'+id+'">'+txt+'</button><button class="btn r" style="flex:.4" id="btnVolver">Volver</button></div><div class="leg">'+leg+'</div>';
}
function t1(s){
  var lock=!!s.ini.firm||!esNef();
  var cie=s.ini.cie.map(function(c,i){return'<tr><td>'+esc(c)+'</td><td style="width:60px"><button class="btn sm r" data-dc="'+i+'">✖</button></td></tr>'}).join("");
  var med=s.ini.med.map(function(m,i){return'<tr><td>'+esc(m.p)+'</td><td>'+esc(m.d)+'</td><td>'+m.v+'</td><td style="width:60px"><button class="btn sm r" data-dm="'+i+'">✖</button></td></tr>'}).join("");
  return'<div class="bar">I.1 EVALUACIÓN INICIAL · FICHA 0026_03<span class="tag">tiempo 1 · nefrólogo</span></div><div class="box"><fieldset'+(lock?' disabled':'')+'>'+
  '<div class="row">'+campo("Hora de evaluación inicial",inp("hIni","06:05",' type="time"'),"f",true)+campo("Atención en condiciones COVID-19",radios("covid",["SÍ","NO"],"NO"))+campo("Médico",ro(s.ini.firm?s.ini.firm.u:usuario()),"f2")+'</div>'+
  '<div class="sub">1. PROBLEMAS CLÍNICOS (CIE-10)</div>'+
  '<div class="row">'+campo("Buscar diagnóstico CIE-10",sel("cieAdd",["Seleccione…"].concat(CIE)),"f3",true)+'<div class="fh"><label>&nbsp;</label><button class="btn k" style="width:100%" id="btnCie">Agregar</button></div></div>'+
  '<div class="tw"><table><tr><th>Diagnóstico</th><th></th></tr>'+(cie||'<tr><td colspan="2" class="vacio">Agregue al menos un diagnóstico.</td></tr>')+'</table></div>'+
  '<div class="row" style="margin-top:8px">'+campo("Signos y síntomas",'<textarea class="in">Refiere astenia leve. Niega disnea.</textarea>',"f3")+'</div>'+
  '<div class="sub">2. FUNCIONES VITALES</div>'+
  '<div class="row">'+campo("PA (mmHg)",inp("pa","140/85"),"f",true)+campo("FC (lpm)",inp("fc","76",' type="number"'),"f",true)+campo("FR (rpm)",inp("fr","18",' type="number"'),"f",true)+campo("SO2 (%)",inp("so2","97",' type="number"'),"f",true)+campo("Otras",inp("otv","",' placeholder="Temperatura, glucosa…"'),"f2")+'</div>'+
  '<div class="sub">3. PRESCRIPCIÓN PARA MÁQUINA DE HEMODIÁLISIS <span class="orig">precargada de la sesión del 09-10-2026</span></div>'+
  '<div class="row">'+campo("Horas de hemodiálisis",sel("hhd",HORAS,"3.50")+'<div class="ayuda">1.00 a 4.00 en pasos de 0.25</div>',"f",true)+campo("Dosis de heparina (UI)",inp("hep","5000"),"f")+campo("Peso seco (kg)",inp("ps","62.5"),"f",true)+campo("Peso inicial (kg)",inp("pi","65.1"),"f",true)+campo("Ultrafiltrado a programar (L)",inp("uf","2.6")+'<div class="ayuda" id="ufh">Peso inicial − peso seco: 2.6 kg</div>',"f",true)+'</div>'+
  '<div class="row">'+campo("QB (ml/min)",sel("qb",QB,350),"f",true)+campo("QD (ml/min)",inp("qd","500"),"f")+campo("Buffer",sel("buf",["BICARBONATO","ACETATO"]),"f")+campo("Bicarbonato (mEq/L)",inp("bic","32"),"f")+campo("Conductividad (mS/cm)",inp("cond","14.0"),"f")+'</div>'+
  '<div class="row">'+campo("Na inicial (mEq/L)",inp("nai","140"),"f")+campo("Na final (mEq/L)",inp("naf","138"),"f")+campo("Perfil de Na",sel("pna",["SIN PERFIL","PERFIL 1","PERFIL 2","PERFIL 3"]),"f")+campo("Perfil de UF",sel("puf",["SIN PERFIL","PERFIL 1","PERFIL 2","PERFIL 3"]),"f")+'<div class="f"></div></div>'+
  '<div class="sub">4. PRESCRIPCIÓN PARA DIALIZADOR</div>'+
  '<div class="row">'+campo("Área de dializador (m²)",sel("area",["1.3","1.5","1.8","2.1"],"1.8"),"f")+campo("Membrana de dializador",sel("memb",["POLISULFONA ALTO FLUJO","POLISULFONA BAJO FLUJO","TRIACETATO DE CELULOSA"]),"f2")+'<div class="f2"></div></div>'+
  '<div class="sub">5. MEDICAMENTOS, TRANSFUSIÓN E INDICACIONES</div>'+
  '<div class="row">'+campo("Producto",sel("mP",PROD),"f3")+campo("Dosis",inp("mD",""),"f")+campo("Vía",sel("mV",["EV","SC","VO","IM"]),"fh")+'<div class="fh"><label>&nbsp;</label><button class="btn k" style="width:100%" id="btnMed">Agregar</button></div></div>'+
  '<div class="tw"><table><tr><th>Producto</th><th>Dosis</th><th>Vía</th><th></th></tr>'+(med||'<tr><td colspan="4" class="vacio">Sin medicamentos indicados.</td></tr>')+'</table></div>'+
  '<div class="row" style="margin-top:8px">'+campo("Otras indicaciones",'<textarea class="in">Control de potasio en la próxima sesión.</textarea>',"f3")+'</div>'+
  '<div class="row">'+campo("Receta",ro(s.ini.receta?s.ini.receta.r:"Se genera al firmar"),"f")+campo("FUR (insumos: filtro, líneas)",ro(s.ini.receta?s.ini.receta.f:"Se genera al firmar"),"f")+campo("CPMS de diálisis",sel("cpms",["90937 · HEMODIÁLISIS CON EVALUACIONES REPETIDAS","90935 · HEMODIÁLISIS CON UNA EVALUACIÓN MÉDICA"]),"f2",true)+'</div>'+
  '</fieldset><div class="nota">Valores de área, membrana, buffer y perfiles son de ejemplo: se confirman con Nefrología y se cargan como catálogo.</div>'+
  firma(s.ini.firm,esNef(),"Firmar evaluación inicial","sign1","Al firmar se generan la receta y el FUR, se bloquea este tiempo y se habilita la evaluación de enfermería.","Solo un nefrólogo registra y firma este tiempo.")+'</div>';
}
function t2(s,p){
  var lock=!!s.enf.firm||!esEnf(),fav=p.acceso==="FAV";
  var mon=s.enf.mon.map(function(r){return r.t==="c"?'<tr><td>'+r.h+'</td><td>'+r.pa+'</td><td>'+r.fc+'</td><td>'+r.qb+'</td><td>'+r.na+'</td><td>'+r.ra+'</td><td>'+r.rv+'</td><td>'+r.ptm+'</td><td>'+(esc(r.o)||"—")+'</td><td class="prof">'+(r.u||"")+'</td></tr>':'<tr class="ev"><td>'+r.h+'</td><td colspan="7"><span class="st sx">EVENTO</span> <b>'+esc(r.ev)+'</b> · '+esc(r.ac)+'</td><td>'+esc(r.o)+'</td><td class="prof">'+(r.u||"")+'</td></tr>'}).join("");
  var last=s.enf.mon.filter(function(r){return r.t==="c"}).pop(),base=(last?last.h:"06:10").split(":"),tot=(+base[0])*60+(+base[1])+(last?s.enf.frec:0),sug=("0"+Math.floor(tot/60)%24).slice(-2)+":"+("0"+tot%60).slice(-2);
  var apl=s.ini.med.map(function(m,i){return'<tr><td>'+esc(m.p)+'</td><td>'+esc(m.d)+'</td><td>'+m.v+'</td><td>'+(s.enf.apl[i]||"—")+'</td><td>'+(s.enf.apl[i]?'<span class="st s4">APLICADO</span>':'<button class="btn sm g" data-ap="'+i+'">Marcar aplicado</button>')+'</td></tr>'}).join("");
  return'<div class="bar">EVOLUCIÓN DE ENFERMERÍA · FICHA 0026_04<span class="tag">tiempo 2 · enfermería</span></div><div class="box"><fieldset'+(lock?' disabled':'')+'>'+
  '<div class="row">'+campo("PA inicial",inp("pai","138/84"),"f",true)+campo("PA final",inp("paf",""),"f")+campo("Peso inicial (kg)",inp("pei","65.1"),"f",true)+campo("Peso final (kg)",inp("pef",""),"f")+campo("Lugar de atención",ro(s.lugar),"f2")+'</div>'+
  '<div class="row">'+campo("S (subjetivo)",'<textarea class="in">Paciente refiere sentirse bien, niega dolor.</textarea>',"f3")+'</div>'+
  '<div class="sub">O (OBJETIVO)</div>'+
  '<div class="row">'+campo("Sexo",ro(p.sexo==="M"?"HOMBRE":"MUJER"),"f")+campo("Grupo etario",ro(p.edad>=60?"ADULTO MAYOR":p.edad>=30?"ADULTO MADURO":"ADULTO JOVEN"),"f")+campo("Estado de conciencia",radios("conc",["LÚCIDO","ORIENTADO","DESORIENTADO","CONFUSO"],"LÚCIDO"),"f2")+'</div>'+
  '<div class="row">'+campo("Ventilación",radios("vent",["ESPONTÁNEA","DISNEA","OTRO"],"ESPONTÁNEA"),"f2")+campo("Edema",radios("ede",["SÍ","NO"],"NO"),"f")+campo("Sangrado",radios("san",["SÍ","NO"],"NO"),"f")+campo("Movilización",radios("mov",["DEAMBULA","SILLA DE RUEDAS","CAMILLA"],"DEAMBULA"),"f2")+'</div>'+
  '<div class="row">'+campo("Otras observaciones",inp("oob",""),"f3")+'</div>'+
  '<div class="sub">ACCESO VASCULAR <span class="orig">precargado del acceso actual</span></div>'+
  '<div class="row">'+campo("Tipo de acceso",radios("tacc",["FAV","CVC","CVCLP"],p.acceso),"f2",true)+'</div>'+
  '<div id="accFav"'+(fav?'':' hidden')+'><div class="row">'+campo("Thrill",radios("thr",["BUENO","FUERTE","DÉBIL"],"BUENO"),"f")+campo("Soplo",radios("sop",["AUDIBLE","AUSENTE","PIANTE","CONTINUO","DISCONTINUO"],"AUDIBLE"),"f2")+campo("Pulso",radios("pul",["PRESENTE","AUSENTE","HIPERPULSÁTIL","DISMINUIDO"],"PRESENTE"),"f2")+'</div>'+
  '<div class="row">'+campo("Piel",radios("piel",["LIMPIA","SUCIA","HEMATOMAS"],["LIMPIA"],"checkbox"),"f2")+campo("Distancia de venopunción (cm)",inp("dven","4"),"f")+'<div class="f"></div></div></div>'+
  '<div id="accCvc"'+(fav?' hidden':'')+'><div class="row">'+campo("Ubicación",sel("ubc",["YUGULAR INTERNA DERECHA","YUGULAR INTERNA IZQUIERDA","SUBCLAVIA DERECHA","FEMORAL DERECHA"]),"f2")+campo("Lumen arterial",radios("la",["PERMEABLE","RESISTENCIA","OBSTRUIDO"],"PERMEABLE"),"f2")+campo("Lumen venoso",radios("lv",["PERMEABLE","RESISTENCIA","OBSTRUIDO"],"PERMEABLE"),"f2")+'</div>'+
  '<div class="row">'+campo("Orificio",radios("ori",["LIMPIO","CON SECRECIÓN"],"LIMPIO"),"f")+campo("Apósitos",radios("apo",["FIJO","DESPEGADO"],"FIJO"),"f")+'<div class="f2"></div></div></div>'+
  '<div class="row">'+campo("OBS.",inp("obsA",""),"f3")+'</div>'+
  '<div class="sub">PROCESO DE ATENCIÓN DE ENFERMERÍA (NANDA · NOC · NIC)</div>'+pae(s)+
  '<div class="sub">EVOLUCIÓN DEL TRATAMIENTO</div>'+
  '<div class="row">'+campo("Frecuencia de control",'<select class="in" id="frec">'+[20,30,60].map(function(m){return'<option value="'+m+'"'+(s.enf.frec===m?' selected':'')+'>CADA '+m+' MINUTOS</option>'}).join("")+'</select>',"f",true)+campo("Siguiente control sugerido",ro(sug),"f")+'<div class="f2"></div></div>'+
  '<div class="tw"><table><tr><th>Hora</th><th>PA</th><th>FC</th><th>QB</th><th>Na</th><th>RA</th><th>RV</th><th>PTM</th><th>Observaciones</th><th>Registró</th></tr>'+(mon||'<tr><td colspan="10" class="vacio">Sin controles registrados.</td></tr>')+
  '<tr class="nuevo"><td><input class="in" type="time" id="cH" value="'+sug+'"></td><td><input class="in" id="cPa" placeholder="120/80"></td><td><input class="in" id="cFc" type="number"></td><td><select class="in" id="cQb">'+opts(QB,350)+'</select></td><td><input class="in" id="cNa" value="140"></td><td><input class="in" id="cRa"></td><td><input class="in" id="cRv"></td><td><input class="in" id="cPtm"></td><td><input class="in" id="cO"></td><td class="prof">'+esc(usuario())+'</td></tr></table></div>'+
  '<div class="acciones"><button class="btn g" id="btnCtl">+ Registrar control</button></div>'+
  '<div class="row" style="margin-top:10px">'+campo("Evento",sel("eT",["HIPOTENSIÓN","HIPOTENSIÓN SEVERA","HIPOGLICEMIA","CALAMBRES","COAGULACIÓN DEL CIRCUITO","OTRO"]),"f")+campo("Acción tomada",inp("eA","",' placeholder="Ej.: se avisa al médico, se administra ClNa 0.9 %"'),"f3",true)+'<div class="fh"><label>&nbsp;</label><button class="btn o" style="width:100%" id="btnEv">Registrar evento</button></div></div>'+
  '<div class="sub">MEDICAMENTOS APLICADOS <span class="orig">de la receta de la sesión</span></div>'+
  '<div class="tw"><table><tr><th>Producto</th><th>Dosis</th><th>Vía</th><th>Hora de aplicación</th><th></th></tr>'+(apl||'<tr><td colspan="5" class="vacio">La receta no tiene productos.</td></tr>')+'</table></div>'+
  '<div class="sub">CIERRE DE ENFERMERÍA</div>'+
  '<div class="row">'+campo("Curación de CVC",radios("cur",["SÍ","NO"],fav?"NO":"SÍ"),"f")+campo("Observaciones de curación",inp("ocur",""),"f2")+campo("UF efectiva (L)",inp("ufe","",' placeholder="Programada: 2.6"')+'<div class="ayuda" id="ufw"></div>',"f",true)+'</div>'+
  '<div class="row">'+campo("Solución de sellado de CVC",sel("sell",["HEPARINA 5 000 UI","CITRATO 4 %","OTRA"]),"f")+campo("Aspecto del dializador",sel("asp",["LIMPIO","COAGULACIÓN LEVE","COAGULACIÓN MODERADA","COAGULACIÓN SEVERA"]),"f")+campo("E. Observación final",inp("obf",""),"f2")+'</div>'+
  '</fieldset>'+firma(s.enf.firm,esEnf(),"Firmar cierre de enfermería","sign2","Puede continuarla otra enfermera si hay cambio de turno. Al firmar se habilita la evaluación final.","Solo enfermería de hemodiálisis registra y firma este tiempo.")+'</div>';
}
function t3(s){
  var lock=!!s.fin.firm||!esNef(),ev=s.enf.mon.filter(function(r){return r.t==="e"}),ctl=s.enf.mon.length-ev.length;
  return'<div class="bar">I.2 EVALUACIÓN FINAL · FICHA 0026_03<span class="tag">tiempo 3 · nefrólogo</span></div><div class="box"><fieldset'+(lock?' disabled':'')+'>'+
  (ev.length?'<div class="nota err"><b>'+ev.length+' evento(s) durante la sesión:</b> '+ev.map(function(e){return esc(e.h+" "+e.ev+" ("+e.ac+")")}).join("; ")+'</div>':'')+
  '<div class="kpis"><div class="kpi"><div class="v">2.6</div><div class="t">UF programada (L)</div></div><div class="kpi"><div class="v">'+ctl+'</div><div class="t">Controles registrados</div></div><div class="kpi'+(ev.length?' alerta':'')+'"><div class="v">'+ev.length+'</div><div class="t">Eventos</div></div><div class="kpi ok"><div class="v">'+Object.keys(s.enf.apl).length+'</div><div class="t">Medicamentos aplicados</div></div></div>'+
  '<div class="row">'+campo("Hora de evaluación final",inp("hFin","10:02",' type="time"'),"f",true)+campo("Médico",ro(s.fin.firm?s.fin.firm.u:usuario()),"f2")+campo("CPMS de evaluación",sel("cpms2",["992XX · EVALUACIÓN MÉDICA ESPECIALIZADA (POR CONFIRMAR)"]),"f2",true)+'</div>'+
  '<div class="row">'+campo("Condición clínica del paciente al finalizar hemodiálisis y otros",'<textarea class="in">Paciente estable, sin molestias. Se retira deambulando.</textarea>',"f3",true)+'</div>'+
  '</fieldset>'+firma(s.fin.firm,esNef(),"Firmar y cerrar sesión","sign3","Puede firmarla un nefrólogo distinto al de la evaluación inicial. Al cerrar, la prestación pasa a producción con CIE-10 y CPMS.","Solo un nefrólogo cierra la sesión.")+'</div>';
}

/* ===== Proceso de atención de enfermería: NANDA (diagnóstico), NOC (planeación), NIC (ejecución) ===== */
function nomCat(lista,c){var x=lista.filter(function(y){return y[0]===c})[0];return x?x[0]+" - "+x[1]:c}
function pae(s){
  var e=s.enf;e.pend=e.pend||{};
  var items=function(tipo,arr,lista){return arr.map(function(c,i){return'<div class="it"><div class="tx">'+esc(nomCat(lista,c))+'</div><button class="btn r" data-paedel="'+tipo+'" data-i="'+i+'" title="Quitar">✖</button></div>'}).join("")};
  var nocs=e.noc.map(function(n,i){return'<div class="it"><div class="tx">'+esc(nomCat(NOC,n.c))+'</div><select data-nocv="'+i+'" title="Puntuación (1 a 5)">'+ESCALA.map(function(v){return'<option'+(v===n.v?' selected':'')+'>'+v+'</option>'}).join("")+'</select><button class="btn r" data-paedel="noc" data-i="'+i+'" title="Quitar">✖</button></div>'}).join("");
  var ac=function(tipo){if(!e.pend[tipo])return"";return'<div class="it"><div class="acw"><input class="in" id="ac-'+tipo+'" autocomplete="off" placeholder="Escriba el código o parte de la descripción"><div class="acl" id="acl-'+tipo+'" hidden></div></div>'+(tipo==="noc"?'<select id="acv-noc" title="Puntuación (1 a 5)">'+ESCALA.map(function(v){return'<option>'+v+'</option>'}).join("")+'</select>':'')+'<button class="btn r" data-accan="'+tipo+'" title="Cancelar">✖</button></div>'};
  return'<div class="pae">'+
   '<div><h4>Diagnóstico de enfermería</h4><button class="btn g sm" data-paeadd="dx">✚ Agregar diagnóstico</button>'+ac("dx")+items("dx",e.dx,NANDA)+'</div>'+
   '<div><h4>Planeación</h4><button class="btn g sm" data-paeadd="noc">✚ Agregar NOC</button>'+ac("noc")+nocs+'</div>'+
   '<div><h4>Ejecución</h4><button class="btn g sm" data-paeadd="nic">✚ Agregar NIC</button>'+ac("nic")+items("nic",e.nic,NIC)+'<label style="margin-top:8px">Detalle de intervenciones</label><textarea class="in" id="paeInt">'+esc(e.detInt)+'</textarea></div>'+
   '<div><h4>Evaluación</h4><button class="btn g sm" id="paeEval">✚ Generar evaluación</button><label style="margin-top:8px">Detalle de evaluaciones</label><textarea class="in" id="paeEva">'+esc(e.detEva)+'</textarea></div>'+
  '</div><div class="ayuda">Escriba en el buscador y elija de la lista. Puntuación NOC: 1 = gravemente comprometido · 5 = no comprometido.</div>';
}
function bPae(s){
  var e=s.enf;
  q("[data-paeadd]").forEach(function(b){b.onclick=function(){var t=b.getAttribute("data-paeadd");e.pend[t]=true;pintar();var i=$("ac-"+t);if(i){i.focus();lista(t)}}});
  q("[data-accan]").forEach(function(b){b.onclick=function(){e.pend[b.getAttribute("data-accan")]=false;pintar()}});
  q("[data-paedel]").forEach(function(b){b.onclick=function(){e[b.getAttribute("data-paedel")].splice(+b.getAttribute("data-i"),1);pintar()}});
  q("[data-nocv]").forEach(function(sl){sl.onchange=function(){e.noc[+sl.getAttribute("data-nocv")].v=sl.value}});
  function cat(t){return t==="dx"?NANDA:t==="noc"?NOC:NIC}
  function usados(t){return t==="noc"?e.noc.map(function(n){return n.c}):e[t]}
  function elegir(t,c){if(t==="noc")e.noc.push({c:c,v:$("acv-noc").value});else e[t].push(c);e.pend[t]=false;pintar();aviso(nomCat(cat(t),c)+" agregado.")}
  function lista(t){var inp=$("ac-"+t),box=$("acl-"+t),f=inp.value.trim().toLowerCase(),u=usados(t);
    var r=cat(t).filter(function(x){return u.indexOf(x[0])<0&&(x[0]+" - "+x[1]).toLowerCase().indexOf(f)>=0}).slice(0,10);
    box.innerHTML=r.map(function(x,i){return'<div data-acc="'+x[0]+'"'+(i===0?' class="sel"':'')+'>'+esc(x[0]+" - "+x[1])+'</div>'}).join("")||'<div class="vac">Sin coincidencias</div>';
    box.hidden=false;
    q("[data-acc]",box).forEach(function(d){d.onmousedown=function(ev){ev.preventDefault();elegir(t,d.getAttribute("data-acc"))}})}
  ["dx","noc","nic"].forEach(function(t){var inp=$("ac-"+t);if(!inp)return;
    inp.oninput=function(){lista(t)};inp.onfocus=function(){lista(t)};
    inp.onblur=function(){setTimeout(function(){var b=$("acl-"+t);if(b)b.hidden=true},150)};
    inp.onkeydown=function(ev){var b=$("acl-"+t),it=q("[data-acc]",b),k=it.map(function(x){return x.classList.contains("sel")}).indexOf(true);
      if(ev.key==="ArrowDown"||ev.key==="ArrowUp"){ev.preventDefault();if(!it.length)return;if(k>=0)it[k].classList.remove("sel");k=ev.key==="ArrowDown"?Math.min(k+1,it.length-1):Math.max(k-1,0);it[k].classList.add("sel");it[k].scrollIntoView({block:"nearest"})}
      if(ev.key==="Enter"&&k>=0){ev.preventDefault();elegir(t,it[k].getAttribute("data-acc"))}
      if(ev.key==="Escape"){e.pend[t]=false;pintar()}}});
  on("paeInt","input",function(){e.detInt=$("paeInt").value});
  on("paeEva","input",function(){e.detEva=$("paeEva").value});
  on("paeEval","click",function(){
    if(!e.noc.length){aviso("Agregue al menos un resultado NOC para generar la evaluación.",true);return}
    var t=e.noc.map(function(n){return nomCat(NOC,n.c)+": puntuación "+n.v+" de 5 ("+(n.v>=4?"logrado":n.v>=3?"parcialmente logrado":"no logrado")+")"}).join("\n");
    var ev=e.mon.filter(function(r){return r.t==="e"}).length;
    e.detEva=t+(ev?"\nEventos durante la sesión: "+ev+".":"\nSin eventos durante la sesión.");$("paeEva").value=e.detEva;aviso("Evaluación generada a partir de los NOC. Puede editarla.")});
}
function bSes(){
  var s=S[V.ses];
  on("btnVolver","click",function(){V.vista="dia";pintar()});
  if(V.t===1){
    on("btnCie","click",function(){var v=$("cieAdd").value;if($("cieAdd").selectedIndex>0&&s.ini.cie.indexOf(v)<0){s.ini.cie.push(v);pintar()}});
    q("[data-dc]").forEach(function(b){b.onclick=function(){s.ini.cie.splice(+b.getAttribute("data-dc"),1);pintar()}});
    on("btnMed","click",function(){s.ini.med.push({p:$("mP").value,d:$("mD").value||"—",v:$("mV").value});pintar()});
    q("[data-dm]").forEach(function(b){b.onclick=function(){s.ini.med.splice(+b.getAttribute("data-dm"),1);pintar()}});
    ["pi","ps","uf"].forEach(function(id){on(id,"input",function(){var d=(+$("pi").value-+$("ps").value).toFixed(1),w=+$("uf").value>+$("ps").value*0.05;$("ufh").innerHTML="Peso inicial − peso seco: "+d+" kg"+(w?' · <b style="color:#A94442">UF mayor al 5 % del peso seco</b>':"")})});
    on("sign1","click",function(){var pa=$("pa").value.split("/");
      if(!s.ini.cie.length){aviso("Registre al menos un problema clínico CIE-10.",true);return}
      if(pa.length!==2||+pa[0]<=+pa[1]){aviso("Revise la PA: la sistólica debe ser mayor que la diastólica.",true);$("pa").classList.add("err");return}
      s.ini.receta={r:"R-00"+(45900+V.ses),f:"FUR-00"+(12400+V.ses)};s.ini.firm={u:usuario(),h:ahora()};s.est=Math.max(s.est,2);V.t=2;pintar();aviso("Evaluación inicial firmada. Receta y FUR enviados a farmacia.")});
  }
  if(V.t===2){
    bPae(s);
    q('input[name="tacc"]').forEach(function(r){r.onchange=function(){var f=$("tacc0").checked;$("accFav").hidden=!f;$("accCvc").hidden=f}});
    on("frec","change",function(){s.enf.frec=+$("frec").value;pintar()});
    on("btnCtl","click",function(){var pa=$("cPa").value;if(!/^\d{2,3}\/\d{2,3}$/.test(pa)){aviso("Ingrese la PA como sistólica/diastólica, por ejemplo 120/80.",true);$("cPa").classList.add("err");return}
      s.enf.mon.push({t:"c",h:$("cH").value,pa:pa,fc:$("cFc").value||"—",qb:$("cQb").value,na:$("cNa").value,ra:$("cRa").value||"—",rv:$("cRv").value||"—",ptm:$("cPtm").value||"—",o:$("cO").value,u:usuario()});pintar();aviso("Control registrado.")});
    on("btnEv","click",function(){if(!$("eA").value){aviso("Describa la acción tomada ante el evento.",true);return}s.enf.mon.push({t:"e",h:ahora(),ev:$("eT").value,ac:$("eA").value,o:"",u:usuario()});pintar();aviso("Evento registrado.")});
    q("[data-ap]").forEach(function(b){b.onclick=function(){s.enf.apl[b.getAttribute("data-ap")]=ahora();pintar()}});
    on("ufe","input",function(){var v=+$("ufe").value,d=Math.abs(v-2.6)/2.6;$("ufw").innerHTML=$("ufe").value&&d>0.2?'<b style="color:#A94442">Difiere más de 20 % de la UF programada</b>':""});
    on("sign2","click",function(){if(!s.enf.mon.some(function(r){return r.t==="c"})){aviso("Registre al menos un control del tratamiento antes de firmar.",true);return}
      s.enf.firm={u:usuario(),h:ahora()};s.est=Math.max(s.est,3);V.t=3;pintar();aviso("Cierre de enfermería firmado. Falta la evaluación final.")});
  }
  if(V.t===3)on("sign3","click",function(){s.fin.firm={u:usuario(),h:ahora()};s.est=4;pintar();aviso("Sesión cerrada. La prestación pasó a producción con CIE-10 y CPMS.")});
}
