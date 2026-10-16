/* Maqueta · Módulo de Hemodiálisis · SIGESAPOL
   1. Solicitudes de atención: registro por tipo de ingreso, autorizaciones y asignación de cita. */
/* ===== 0. Solicitudes de atención (ambulatorio, referido, hospitalización, emergencia) ===== */
var fProc="TODAS",fDni="";
/* Autorizaciones de derivación registradas por el médico tratante (hospitalización / emergencia) */
var AUT=[
 {dni:"46213578",tipo:"HOSP",nro:"AUT-HOSP-2026-0412",fecha:"12-10-2026 08:30",med:"Dra. L. VEGA TORRES",cmp:"052114",serv:"CIRUGÍA GENERAL",cama:"214-A",ubic:"CIRUGÍA 2.º PISO · CAMA 214-A",dx:"N17.9 · INSUFICIENCIA RENAL AGUDA",mot:"Oliguria post operatoria, creatinina en ascenso. Se deriva a Nefrología para evaluación y hemodiálisis.",pac:{nom:"HUAMAN QUISPE, MARIO CESAR",hc:"0480144",cip:"34210056",grado:"S1 PNP",par:"TITULAR",tit:"—",sexo:"M",edad:31,tel:"961002338"}},
 {dni:"47120934",tipo:"EMER",nro:"AUT-EMER-2026-1187",fecha:"12-10-2026 09:05",med:"Dr. R. CAMPOS DIAZ",cmp:"048803",serv:"EMERGENCIA · TRAUMA SHOCK",cama:"3",ubic:"EMERGENCIA · TRAUMA SHOCK · CAMA 3",dx:"E87.5 · HIPERKALEMIA",mot:"Potasio 7.1 mEq/L con cambios en el EKG. Requiere hemodiálisis de urgencia.",pac:{nom:"ROJAS ALIAGA, KAREN PAOLA",hc:"0481207",cip:"—",grado:"SB PNP",par:"HIJA",tit:"ROJAS MEZA, LUIS",sexo:"F",edad:27,tel:"988443120"}}
];
function verAut(a,pnom){
  abrir('<div class="bar">AUTORIZACIÓN DE DERIVACIÓN A NEFROLOGÍA · '+a.nro+'<span class="tag">'+PROC[a.tipo]+'</span></div><div class="box">'+
   '<div class="row">'+campo("N° de autorización",ro(a.nro),"f")+campo("Fecha y hora de registro",ro(a.fecha),"f")+campo("Servicio que deriva",ro(a.serv),"f")+'</div>'+
   '<div class="row">'+campo("Paciente",ro(pnom),"f3")+campo("Ubicación del paciente",ro(a.ubic),"f2")+'</div>'+
   '<div class="row">'+campo("Médico tratante que autoriza",ro(a.med),"f2")+campo("CMP",ro(a.cmp),"f")+'</div>'+
   '<div class="row">'+campo("Diagnóstico (CIE-10)",ro(a.dx),"f3")+'</div>'+
   '<div class="row">'+campo("Motivo de la derivación",'<textarea class="in" readonly>'+esc(a.mot)+'</textarea>',"f3")+'</div>'+
   '<div class="nota ok">Firmado electrónicamente por <b>'+esc(a.med)+'</b> el '+a.fecha+'. Documento registrado en SIGESAPOL por el servicio de origen; Nefrología solo lo consulta.</div>'+
   '<div class="acciones"><button class="btn k" style="flex:.4" id="autCerrar">Cerrar</button></div></div>');
  on("autCerrar","click",cerrar);
}
function vSol(){
  var lista=SOL.filter(function(x){var p=P.filter(function(y){return y.id===x.pid})[0];return(fProc==="TODAS"||x.proc===fProc)&&(!fDni||p.dni.indexOf(fDni)>=0||p.hc.indexOf(fDni)>=0||p.nom.toLowerCase().indexOf(fDni.toLowerCase())>=0)});
  var k=function(e){return SOL.filter(function(x){return x.estado===e}).length};
  var est={"NUEVA":"s2","HC LISTA":"s1","PROGRAMADA":"s4"};
  var sinHc=SOL.filter(function(x){return x.estado!=="PROGRAMADA"&&!P.filter(function(p){return p.id===x.pid})[0].hcOk}).length;
  return'<div class="bar">SOLICITUDES DE ATENCIÓN DE HEMODIÁLISIS<span class="tag">nuevo</span></div><div class="box">'+
  '<div class="kpis"><div class="kpi alerta"><div class="v">'+k("NUEVA")+'</div><div class="t">Nuevas (sin atender)</div></div><div class="kpi"><div class="v">'+sinHc+'</div><div class="t">Requieren HC inicial</div></div><div class="kpi"><div class="v">'+k("HC LISTA")+'</div><div class="t">Con HC, por asignar cita</div></div><div class="kpi ok"><div class="v">'+k("PROGRAMADA")+'</div><div class="t">Con cita asignada</div></div></div>'+
  '<div class="row">'+campo("Buscar por DNI, N° de HC o apellidos",inp("solQ",fDni,' placeholder="Escriba el DNI y presione Buscar"'),"f3")+'<div class="fh"><label>&nbsp;</label><button class="btn k" style="width:100%" id="solBus">Buscar</button></div><div class="fh"><label>&nbsp;</label><button class="btn r" style="width:100%" id="solLim">Limpiar</button></div><div class="f2" style="text-align:right"><label>&nbsp;</label><button class="btn g" id="btnReg">+ Registrar paciente</button></div></div>'+
  '<div class="tabs">'+["TODAS","AMB","REF","HOSP","EMER"].map(function(t){var n=SOL.filter(function(x){return t==="TODAS"||x.proc===t}).length;return'<div data-fp="'+t+'" class="'+(fProc===t?"on":"")+'">'+(t==="TODAS"?"Todas":t==="AMB"?"Ambulatorio":t==="REF"?"Referido":t==="HOSP"?"Hospitalización":"Emergencia")+' ('+n+')</div>'}).join("")+'</div>'+
  '<div class="tw"><table><tr><th>N° solicitud</th><th>Fecha y hora</th><th>Tipo de ingreso</th><th>Paciente</th><th>Origen / autorización</th><th>Ubicación actual</th><th>Diagnóstico</th><th>HC inicial</th><th>Estado</th><th></th></tr>'+
  (lista.map(function(x){var p=P.filter(function(y){return y.id===x.pid})[0];
    var acc=x.estado==="PROGRAMADA"?'<button class="btn sm k" data-ver="'+x.id+'">Ver</button> <button class="btn sm o" data-edc="'+x.pid+'">Editar cita</button>':!p.hcOk?'<button class="btn sm o" data-hcs="'+x.id+'">Llenar HC inicial</button>':'<button class="btn sm g" data-prog="'+x.id+'">Asignar cita</button>';
    var org=x.aut?esc(x.aut.med)+' · '+esc(x.aut.serv)+'<br><a href="#" data-aut="'+x.id+'" style="color:#337AB7">Ver autorización '+x.aut.nro+'</a>':esc(x.sol);
    return'<tr'+(x.estado==="NUEVA"?' class="nuevo"':'')+'><td class="nw">'+x.id+'</td><td class="nw">'+x.fecha+'</td><td>'+prTag(x.proc)+'</td><td><b>'+esc(p.nom)+'</b><div class="prof">DNI '+p.dni+' · HC '+p.hc+'</div></td><td>'+org+'</td><td>'+esc(x.ubic)+'</td><td>'+esc(x.dx)+'</td><td>'+(p.hcOk?'<span class="st s4">SÍ</span>':'<span class="st sx">NO</span>')+'</td><td><span class="st '+est[x.estado]+'">'+x.estado+'</span>'+(x.cita?'<div class="prof">'+esc(x.cita)+'</div>':'')+'</td><td>'+acc+'</td></tr>'}).join("")||'<tr><td colspan="10" class="vacio">'+(fDni?'No hay solicitudes para «'+esc(fDni)+'». Puede registrar al paciente con «+ Registrar paciente».':'No hay solicitudes.')+'</td></tr>')+'</table></div>'+
  '<div class="nota"><b>Tipos de ingreso (para la estadística del departamento).</b> <b>Ambulatorio</b>: el paciente acude directamente a Nefrología. <b>Referido</b>: llega con hoja de referencia de otro establecimiento. <b>Hospitalización</b> y <b>emergencia</b>: el médico tratante registra la autorización de derivación con su diagnóstico; la solicitud llega como notificación y la autorización se puede consultar. Si es la primera vez, el nefrólogo llena la HC inicial; luego se asigna la cita.</div></div>';
}
function bSol(){
  q("[data-fp]").forEach(function(d){d.onclick=function(){fProc=d.getAttribute("data-fp");pintar()}});
  on("btnReg","click",function(){regPac($("solQ").value.trim())});
  on("solBus","click",function(){fDni=$("solQ").value.trim();pintar()});
  on("solQ","keydown",function(e){if(e.key==="Enter"){fDni=$("solQ").value.trim();pintar()}});
  on("solLim","click",function(){fDni="";fProc="TODAS";pintar()});
  q("[data-aut]").forEach(function(a){a.onclick=function(e){e.preventDefault();var so=SOL.filter(function(x){return x.id===a.getAttribute("data-aut")})[0];verAut(so.aut,P.filter(function(p){return p.id===so.pid})[0].nom)}});
  q("[data-hcs]").forEach(function(b){b.onclick=function(){hcModal(b.getAttribute("data-hcs"))}});
  q("[data-prog]").forEach(function(b){b.onclick=function(){programar(b.getAttribute("data-prog"))}});
  q("[data-edc]").forEach(function(b){b.onclick=function(){reprog(+b.getAttribute("data-edc"))}});
  q("[data-ver]").forEach(function(b){b.onclick=function(){var so=SOL.filter(function(x){return x.id===b.getAttribute("data-ver")})[0];ficha(so.pid)}});
}
function regPac(dniIni){
  var pac=null,aut=null;
  abrir('<div class="bar">REGISTRAR PACIENTE PARA HEMODIÁLISIS</div><div class="box">'+
   '<div class="row">'+campo("Tipo de ingreso",radios("rgTipo",["AMBULATORIO","REFERIDO","HOSPITALIZACIÓN","EMERGENCIA"],"AMBULATORIO"),"f3",true)+'</div>'+
   '<div class="row">'+campo("DNI del paciente",inp("rgDni",/^\d+$/.test(dniIni||"")?dniIni:"",' placeholder="Escriba el DNI y presione Buscar"'),"f2",true)+'<div class="fh"><label>&nbsp;</label><button class="btn k" style="width:100%" id="rgBus">Buscar</button></div></div>'+
   '<div id="rgPac"></div>'+
   '<div id="rgRef" hidden><div class="sub">DATOS DE LA REFERENCIA</div><div class="row">'+campo("N° de hoja de referencia",inp("rgNref","2026-"),"f",true)+campo("Establecimiento de origen",sel("rgEst",["POLICLÍNICO PNP BREÑA","POLICLÍNICO PNP CHORRILLOS","HOSPITAL PNP AUGUSTO B. LEGUÍA","OTRO"]),"f2",true)+'</div></div>'+
   '<div id="rgAut" hidden></div>'+
   '<div id="rgDxBox"><div class="row">'+campo("Diagnóstico (CIE-10)",sel("rgDx",CIE),"f3",true)+'</div></div>'+
   '<div class="row">'+campo("Observación",inp("rgObs",""),"f3")+'</div>'+
   '<div class="ayuda" id="rgHint"></div>'+
   '<div id="rgMsg"></div><div class="acciones"><button class="btn g" style="flex:1" id="rgOk">Registrar solicitud</button><button class="btn r" style="flex:.4" id="rgNo">Cancelar</button></div></div>');
  function tipo(){return["AMB","REF","HOSP","EMER"][[0,1,2,3].filter(function(i){return $("rgTipo"+i).checked})[0]]}
  function vista(){var t=tipo(),conAut=t==="HOSP"||t==="EMER";
    $("rgRef").hidden=t!=="REF";$("rgAut").hidden=!conAut;$("rgDxBox").hidden=conAut;
    $("rgHint").textContent=conAut?"Para probar: DNI 46213578 tiene autorización de hospitalización y DNI 47120934 de emergencia. Otro DNI no tiene autorización registrada.":"Para probar: el DNI 08321457 ya tiene HC inicial; cualquier otro DNI de 8 dígitos simula un asegurado sin HC de Hemodiálisis.";
    $("rgMsg").innerHTML="";if($("rgPac").innerHTML)buscar()}
  function buscar(){var d=$("rgDni").value.trim(),t=tipo();aut=null;pac=null;$("rgAut").innerHTML="";$("rgMsg").innerHTML="";
    if(!/^\d{8}$/.test(d)){$("rgPac").innerHTML='<div class="nota err">El DNI debe tener 8 dígitos.</div>';return}
    pac=P.filter(function(x){return x.dni===d})[0];
    if(t==="HOSP"||t==="EMER"){
      aut=AUT.filter(function(a){return a.dni===d&&a.tipo===t&&!a.usada})[0];
      if(!aut){$("rgAut").innerHTML='<div class="nota err">No existe una autorización de derivación de '+PROC[t].toLowerCase()+' registrada para este DNI. El médico tratante debe registrarla en SIGESAPOL antes de que Nefrología reciba al paciente.</div>';}
      else{if(!pac)pac=Object.assign({id:P.length+1,dni:d,ubic:aut.ubic,obs:"Derivado por "+aut.serv,estado:"ACTIVO",dias:"",turno:null,maq:null,ser:"PENDIENTE",acceso:"CVC",hcOk:false,nuevo:true},aut.pac);
        $("rgAut").innerHTML='<div class="sub">AUTORIZACIÓN REGISTRADA POR EL MÉDICO TRATANTE</div><div class="row">'+campo("N° de autorización",ro(aut.nro),"f")+campo("Fecha",ro(aut.fecha),"f")+campo("Médico tratante",ro(aut.med+" · CMP "+aut.cmp),"f2")+'</div><div class="row">'+campo("Servicio",ro(aut.serv),"f2")+campo("Ubicación del paciente",ro(aut.ubic),"f2")+campo("Diagnóstico",ro(aut.dx),"f2")+'</div><div class="row">'+campo("Motivo de la derivación",'<textarea class="in" readonly>'+esc(aut.mot)+'</textarea>',"f3")+'</div>'}}
    if(!pac)pac={id:P.length+1,nom:"PACIENTE DE PRUEBA, ASEGURADO",dni:d,hc:"04"+d.slice(3),cip:"—",grado:"SO3 PNP",par:"TITULAR",tit:"—",sexo:"M",edad:50,tel:"900000000",ubic:"AMBULATORIO",obs:"",estado:"ACTIVO",dias:"",turno:null,maq:null,ser:"PENDIENTE",acceso:"FAV",hcOk:false,nuevo:true};
    var titular=pac.par==="TITULAR",conHosp=t==="HOSP"||t==="EMER";
    var h=aut?{serv:aut.serv,cama:aut.cama,med:aut.med}:(pac.hosp&&pac.hosp.tipo===t?pac.hosp:null);
    if(aut&&!pac.hosp)pac.hosp={tipo:t,serv:aut.serv,cama:aut.cama,med:aut.med};
    $("rgPac").innerHTML='<div class="sub">DATOS DEL PACIENTE <span class="orig">desde Asegurados</span></div>'+
     '<div class="row">'+campo("Apellidos y nombres",ro(pac.nom),"f3")+campo("N° DNI",ro(pac.dni),"f")+campo("N° HC",ro(pac.hc),"f")+'</div>'+
     '<div class="row">'+campo("Grado",ro(pac.grado),"f")+campo("Condición",ro(titular?"TITULAR":"FAMILIAR"),"f")+campo("Parentesco",ro(pac.par),"f")+campo("Titular",ro(titular?"—":pac.tit),"f2")+'</div>'+
     (conHosp?'<div class="sub">'+(t==="HOSP"?"HOSPITALIZACIÓN ACTUAL":"ATENCIÓN EN EMERGENCIA ACTUAL")+' <span class="orig">desde '+(t==="HOSP"?"Hospitalización":"Emergencia")+'</span></div>'+
       (h?'<div class="row">'+campo("Servicio a cargo",ro(h.serv),"f2")+campo("N° de cama",ro(h.cama),"f")+campo("Médico tratante",ro(h.med||"—"),"f2")+'</div>'
         :'<div class="nota err">El paciente no registra '+(t==="HOSP"?"una hospitalización activa":"una atención activa en Emergencia")+' en SIGESAPOL.</div>'):'')+
     '<div class="ayuda">HC inicial de Hemodiálisis: <b>'+(pac.hcOk?"SÍ":"NO, se llenará antes de la cita")+'</b></div>'}
  q('input[name="rgTipo"]').forEach(function(r){r.onchange=vista});vista();
  on("rgBus","click",buscar);on("rgDni","keydown",function(e){if(e.key==="Enter")buscar()});
  if($("rgDni").value)buscar();
  on("rgNo","click",cerrar);
  on("rgOk","click",function(){var t=tipo();
    if(!pac){$("rgMsg").innerHTML='<div class="nota err">Busque primero al paciente por DNI.</div>';return}
    if((t==="HOSP"||t==="EMER")&&!aut){$("rgMsg").innerHTML='<div class="nota err">Sin autorización del médico tratante no se puede registrar un ingreso de '+PROC[t].toLowerCase()+'.</div>';return}
    if(t==="REF"&&$("rgNref").value.trim().length<6){$("rgMsg").innerHTML='<div class="nota err">Ingrese el N° de hoja de referencia.</div>';return}
    if(pac.nuevo){delete pac.nuevo;P.push(pac)}
    pac.estado="ACTIVO";
    var id="SOL-0"+(155+SOL.length),so={id:id,pid:pac.id,proc:t,fecha:"12-10-2026 "+ahora(),estado:pac.hcOk?"HC LISTA":"NUEVA",mot:$("rgObs").value};
    if(t==="AMB"){so.sol="SE PRESENTÓ EN NEFROLOGÍA";so.ubic="AMBULATORIO";so.dx=$("rgDx").value;pac.ubic="AMBULATORIO"}
    if(t==="REF"){so.sol="REFERENCIA N° "+$("rgNref").value+" · "+$("rgEst").value;so.ubic="AMBULATORIO";so.dx=$("rgDx").value;pac.ubic="AMBULATORIO"}
    if(aut){aut.usada=true;so.aut=aut;so.sol=aut.med+" · "+aut.serv;so.ubic=aut.ubic;so.dx=aut.dx;pac.ubic=aut.ubic}
    SOL.unshift(so);cerrar();fProc="TODAS";fDni="";pintar();if(pac.hcOk){programar(id);aviso("Solicitud "+id+" registrada. El paciente ya tiene HC inicial: asigne la cita.")}else{hcModal(id);aviso("Solicitud "+id+" registrada. Complete la HC inicial del paciente.")}});
}
function libresMaq(t){return MAQ.slice(0,8).map(function(m,i){return i}).filter(function(i){return!P.some(function(x){return x.estado==="ACTIVO"&&x.dias==="LMV"&&x.turno===t&&x.maq===i})&&!Object.keys(S).some(function(k){return S[k].unica&&S[k].turno===t&&S[k].lugar===MAQ[i]})})}
function programar(sid,pre){
  var so=SOL.filter(function(x){return x.id===sid})[0],p=P.filter(function(x){return x.id===so.pid})[0],amb=so.proc==="AMB"||so.proc==="REF";
  var tur='<select class="in" id="pgTur">'+TURNOS.map(function(t){return'<option value="'+t.id+'">'+t.n+' · '+t.h+'</option>'}).join("")+'</select>';
  abrir('<div class="bar">ASIGNAR CITA · '+so.id+'<span class="tag">'+PROC[so.proc]+'</span></div><div class="box">'+
   '<div class="pac"><span>Paciente: <b>'+esc(p.nom)+'</b></span><span>N° HC: <b>'+p.hc+'</b></span><span>Diagnóstico: <b>'+esc(so.dx)+'</b></span><span>Solicitado por: <b>'+esc(so.sol)+'</b></span><span>Ubicación actual: <b>'+esc(so.ubic)+'</b></span><span>Serología: <b>'+p.ser+'</b></span></div>'+
   (amb?
    '<div class="sub">PROGRAMA REGULAR · CITAS RECURRENTES</div><div class="row">'+campo("Secuencia",sel("pgSeq",["LMV","MJS"]),"f",true)+campo("Turno",tur,"f2",true)+campo("Hora de inicio",inp("pgHora","06:00",' type="time"'),"f",true)+campo("Máquina",'<select class="in" id="pgMaq"></select>',"f2",true)+campo("Vigencia desde",inp("pgDes","2026-10-14",' type="date" min="2026-10-12"'),"f",true)+'</div><div class="ayuda">Se generan las citas del mes (unas 13) según la secuencia elegida.</div>'
   :
    '<div class="sub">CITA ÚNICA · '+PROC[so.proc]+'</div><div class="row">'+campo("Fecha de atención",inp("pgFec","2026-10-12",' type="date" min="2026-10-12"'),"f",true)+campo("Turno",tur,"f2",true)+campo("Hora de inicio",inp("pgHora","06:00",' type="time"'),"f",true)+'</div>'+
    '<div class="row">'+campo("Lugar de atención",radios("pgLug",["SALA DE HEMODIÁLISIS (se traslada al paciente)","EN EL LUGAR DONDE SE ENCUENTRA EL PACIENTE"],so.proc==="EMER"?"EN EL LUGAR DONDE SE ENCUENTRA EL PACIENTE":"SALA DE HEMODIÁLISIS (se traslada al paciente)"),"f3",true)+'</div>'+
    '<div class="row" id="pgSala">'+campo("Máquina",'<select class="in" id="pgMaq"></select>',"f2",true)+'<div class="f2"></div></div>'+
    '<div class="row" id="pgLugar">'+(so.proc==="EMER"?campo("Unidad de Emergencia",sel("pgUni",UNID_EMER,so.ubic.split(" · ")[1]||"OBSERVACIÓN DE ADULTOS"),"f2",true)+campo("Cama / ambiente",inp("pgCama",so.ubic.split(" · ")[2]||""),"f",true):campo("Servicio y cama",inp("pgCama",so.ubic),"f3",true))+campo("Equipo",ro("MÁQUINA PORTÁTIL"),"f")+'</div>')+
   '<div id="pgMsg"></div><div class="acciones"><button class="btn g" style="flex:1" id="pgOk">Asignar cita</button><button class="btn r" style="flex:.4" id="pgNo">Cancelar</button></div>'+
   '<div class="leg">Asigna la cita el personal del departamento (médico, enfermería o admisión). La cita aparece en «Registro de atención del día» en la fecha y turno elegidos; para verla hoy en la maqueta deje la fecha 12-10-2026. Luego se puede editar con «Editar cita».</div></div>');
  function fechaRef(){if(amb)return $("pgSeq").value==="LMV"?FECHAS.X:FECHAS.M;var v=$("pgFec").value;return v?iso2f(v):HOY_F}
  function llenarMaq(){var t=+$("pgTur").value,fe=fechaRef();$("pgMsg").innerHTML="";
    if(letraDe(fe)==="D"){$("pgMsg").innerHTML='<div class="nota err">No hay atención de hemodiálisis los domingos.</div>';$("pgMaq").innerHTML='<option value="">—</option>';return}
    var l=(amb?[0,1,2,3,4,5,6,7]:[8,0,1,2,3,4,5,6,7]).filter(function(i){return!ocupado(fe,t,i,p.id)});if(p.ser==="POSITIVA")l=l.filter(function(i){return i===7||i===8});
    $("pgMaq").innerHTML=l.map(function(i){return'<option value="'+i+'">'+MAQ[i]+'</option>'}).join("")||'<option value="">SIN CUPO EN ESTE TURNO</option>'}
  function horaTurno(){$("pgHora").value=TURNOS[+$("pgTur").value-1].h.slice(0,5);llenarMaq()}
  function lug(){if(amb)return;var enSala=$("pgLug0").checked;$("pgSala").style.display=enSala?"":"none";$("pgLugar").style.display=enSala?"none":""}
  if(pre&&!amb){$("pgFec").value=pre.f;$("pgTur").value=String(pre.t);$("pgHora").value=TURNOS[pre.t-1].h.slice(0,5);$("pgLug0").checked=true}
  llenarMaq();if(pre&&pre.mi!=null&&!amb)$("pgMaq").value=String(pre.mi);lug();on("pgTur","change",horaTurno);on("pgFec","change",llenarMaq);on("pgSeq","change",llenarMaq);q('input[name="pgLug"]').forEach(function(r){r.onchange=lug});
  on("pgNo","click",cerrar);
  on("pgOk","click",function(){
    if(!p.hcOk){$("pgMsg").innerHTML='<div class="nota err">Falta la HC inicial del paciente.</div>';return}
    var t=+$("pgTur").value,hora=$("pgHora").value,enSala=amb||$("pgLug0").checked,mi=enSala?$("pgMaq").value:"";
    if(!hora){$("pgMsg").innerHTML='<div class="nota err">Ingrese la hora de inicio.</div>';return}
    if(!amb&&!$("pgFec").value){$("pgMsg").innerHTML='<div class="nota err">Ingrese la fecha de atención.</div>';return}
    if(!amb&&letraDe(iso2f($("pgFec").value))==="D"){$("pgMsg").innerHTML='<div class="nota err">No hay atención de hemodiálisis los domingos.</div>';return}
    if(enSala&&mi===""){$("pgMsg").innerHTML='<div class="nota err">No hay máquinas libres en ese turno. Elija otro turno'+(amb?'':' o atienda en el lugar')+'.</div>';return}
    if(amb){p.dias=$("pgSeq").value;p.turno=t;p.maq=+mi;p.hora=hora;so.cita=(p.dias==="LMV"?"L-M-V":"Ma-J-S")+" · "+hora+" ("+TURNOS[t-1].n+") · "+MAQ[+mi]+" · desde "+iso2f($("pgDes").value)}
    else{var lugar=enSala?MAQ[+mi]:(so.proc==="EMER"?"EMERGENCIA · "+$("pgUni").value+" · "+$("pgCama").value:$("pgCama").value)+" (máquina portátil)",fe=iso2f($("pgFec").value);
      so.cd={f:fe,t:t,h:hora,l:lugar,mi:enSala?+mi:null};so.unica=true;so.cita=fe+" · "+hora+" ("+TURNOS[t-1].n+") · "+lugar;
      if(fe===HOY_F)S[p.id]=nuevaSes(p,so.proc,t,lugar)}
    so.estado="PROGRAMADA";cerrar();pintar();aviso("Cita asignada: "+so.cita)});
}
function nuevaSes(p,pk,t,lugar){return{pid:p.id,nro:1,est:0,pk:pk,turno:t,lugar:lugar,unica:true,ini:{firm:null,cie:[],med:[],receta:null},enf:{firm:null,frec:30,mon:[],apl:{},dx:[],noc:[],nic:[],detInt:"",detEva:""},fin:{firm:null}}}
