/* Maqueta · Módulo de Hemodiálisis · SIGESAPOL
   3. Programación de turnos y citas (calendario por máquina y turno). */
/* ===== 4. Programación y citas ===== */
var DIAS=[["L","Lunes"],["M","Martes"],["X","Miércoles"],["J","Jueves"],["V","Viernes"],["S","Sábado"]];
function seq(d){return"LXV".indexOf(d)>=0?"LMV":"MJS"}
function vCal(){
  var sq=seq(V.dia),ocup=0;[1,2,3,4].forEach(function(t){[0,1,2,3,4,5,6,7].forEach(function(mi){if(ocupado(fechaDia(V.dia),t,mi,-1))ocup++})});
  function celda(mi,t){var fd=fechaDia(V.dia),short=function(p){return esc(p.nom.split(",")[0])};
    var rn=REPROG.filter(function(r){return r.alc==="UNICA"&&r.fNueva===fd&&r.tNuevo===t&&r.mNueva===mi})[0];
    if(rn){var pr=P.filter(function(x){return x.id===rn.pid})[0];return'<button class="slot oc rep" data-p="'+pr.id+'"><b>'+short(pr)+'</b>REPROGRAMADA · venía del '+rn.fOrig.slice(0,5)+'</button>'}
    var su=SOL.filter(function(x){return x.unica&&x.cd&&x.cd.f===fd&&x.cd.t===t&&x.cd.mi===mi})[0];
    if(su){var ps=P.filter(function(x){return x.id===su.pid})[0];return'<button class="slot oc'+(mi===8?' iso':'')+'" data-p="'+ps.id+'"><b>'+short(ps)+'</b>'+prTag(su.proc)+' '+su.cd.h+'</button>'}
    var u=V.dia==="L"&&Object.keys(S).map(function(k){return S[k]}).filter(function(z){return z.unica&&z.turno===t&&z.lugar===MAQ[mi]})[0];
    if(u){var pu=P.filter(function(x){return x.id===u.pid})[0];return'<button class="slot oc" data-p="'+pu.id+'"><b>'+esc(pu.nom.split(",")[0])+'</b>'+prTag(u.pk)+' cita única</button>'}
    var p=P.filter(function(x){return x.estado==="ACTIVO"&&x.dias===sq&&x.turno===t&&x.maq===mi})[0];
    var mv=p&&REPROG.filter(function(r){return r.alc==="UNICA"&&r.pid===p.id&&r.fOrig===fd})[0];
    if(mv)return'<button class="slot movida" data-p="'+p.id+'"><b>'+short(p)+'</b>Reprogramada → '+mv.fNueva.slice(0,5)+' · '+TURNOS[mv.tNuevo-1].n+'</button>';
    if(mi===8)return'<button class="slot" data-me="1" data-t="'+t+'">+ Asignar cita (hosp. / emerg.)</button>';
    return p?'<button class="slot oc'+(p.ser==="POSITIVA"?' iso':'')+'" data-p="'+p.id+'"><b>'+esc(p.nom.split(",")[0])+'</b>'+(p.ser==="POSITIVA"?'SEROLOGÍA (+)':p.acceso+' · HC '+p.hc)+'</button>':'<button class="slot" data-m="'+mi+'" data-t="'+t+'">+ Asignar</button>'}
  return'<div class="bar">PROGRAMACIÓN DE TURNOS Y CITAS<span class="tag">departamento de Nefrología</span></div><div class="box">'+
  '<div class="tabs">'+DIAS.map(function(d){return'<div data-dia="'+d[0]+'" class="'+(d[0]===V.dia?"on":"")+'">'+d[1]+' '+fechaDia(d[0]).slice(0,5)+'</div>'}).join("")+'</div>'+
  '<div class="kpis"><div class="kpi"><div class="v">'+(sq==="LMV"?"L-M-V":"Ma-J-S")+'</div><div class="t">Secuencia del día</div></div><div class="kpi"><div class="v">'+ocup+' / 32</div><div class="t">Cupos ocupados (8 máquinas × 4 turnos)</div></div><div class="kpi ok"><div class="v">'+(32-ocup)+'</div><div class="t">Cupos libres</div></div><div class="kpi alerta"><div class="v">'+P.filter(function(x){return x.estado==="ACTIVO"&&!x.dias}).length+'</div><div class="t">Pacientes sin programar</div></div></div>'+
  '<div class="tw"><table class="cal"><tr><th>Máquina / puesto</th>'+TURNOS.map(function(t){return'<th>'+t.n+'<br><span style="font-weight:400">'+t.h+'</span></th>'}).join("")+'</tr>'+
  MAQ.map(function(m,mi){return'<tr><td><b>'+m+'</b></td>'+TURNOS.map(function(t){return'<td>'+celda(mi,t.id)+'</td>'}).join("")+'</tr>'}).join("")+'</table></div>'+
  '<div class="sub">CITAS REPROGRAMADAS</div><div class="tw"><table><tr><th>Paciente</th><th>Cita original</th><th>Nueva cita</th><th>Alcance</th><th>Motivo</th><th>Registró</th></tr>'+
  (REPROG.slice().reverse().map(function(r){var p=P.filter(function(x){return x.id===r.pid})[0];return'<tr><td>'+esc(p.nom)+'</td><td>'+r.fOrig+' · '+TURNOS[r.tOrig-1].n+' · '+esc(r.lOrig)+'</td><td><b>'+(r.alc==="REGULAR"?r.lNuevo:r.fNueva+' · '+TURNOS[r.tNuevo-1].n+' · '+esc(r.lNuevo))+'</b></td><td>'+(r.alc==="UNICA"?"SOLO ESA CITA":"PROGRAMACIÓN REGULAR")+'</td><td>'+esc(r.mot)+(r.obs?'<div class="prof">'+esc(r.obs)+'</div>':'')+'</td><td class="prof">'+esc(r.u)+' · '+r.h+'</td></tr>'}).join("")||'<tr><td colspan="6" class="vacio">Sin reprogramaciones.</td></tr>')+'</table></div>'+
  '<div class="sub">CITAS ÚNICAS DE HOSPITALIZACIÓN Y EMERGENCIA</div><div class="tw"><table><tr><th>Solicitud</th><th>Procedencia</th><th>Paciente</th><th>Fecha · turno · lugar de atención</th></tr>'+
  (SOL.filter(function(x){return x.unica}).map(function(x){var p=P.filter(function(y){return y.id===x.pid})[0];return'<tr><td>'+x.id+'</td><td>'+prTag(x.proc)+'</td><td>'+esc(p.nom)+'</td><td>'+esc(x.cita)+'</td></tr>'}).join("")||'<tr><td colspan="4" class="vacio">Sin citas únicas. Se asignan desde «Solicitudes de atención».</td></tr>')+'</table></div>'+
  '<div class="acciones"><button class="btn g" id="btnGen">Generar citas de noviembre 2026</button><button class="btn k" id="btnImp">Ver rol del mes</button></div>'+
  '<div class="leg">Las citas las asigna el personal del departamento de Nefrología (admisión, médico o enfermería); el paciente no pasa por la admisión central. Los ambulatorios tienen citas recurrentes; hospitalización y emergencia, citas únicas desde «Solicitudes de atención». Horarios de turno de ejemplo. Máquina 08 reservada para pacientes con serología positiva. Puesto E reservado para hospitalización y emergencia: use «+ Asignar cita» para registrar la cita.</div></div>';
}
function bCal(){
  q("[data-dia]").forEach(function(d){d.onclick=function(){V.dia=d.getAttribute("data-dia");pintar()}});
  on("btnGen","click",function(){aviso("Se generaron "+P.filter(function(x){return x.estado==="ACTIVO"&&x.dias}).length*13+" citas para noviembre (simulado).")});
  on("btnImp","click",function(){aviso("En el sistema real se muestra el rol mensual por máquina y turno.")});
  q(".slot[data-p]").forEach(function(b){b.onclick=function(){ficha(+b.getAttribute("data-p"))}});
  q(".slot[data-m]").forEach(function(b){b.onclick=function(){asignar(+b.getAttribute("data-m"),+b.getAttribute("data-t"))}});
  q(".slot[data-me]").forEach(function(b){b.onclick=function(){asignarE(+b.getAttribute("data-t"))}});
}
function asignarE(t){
  var fd=fechaDia(V.dia),pend=SOL.filter(function(x){return(x.proc==="HOSP"||x.proc==="EMER")&&x.estado!=="PROGRAMADA"});
  abrir('<div class="bar">ASIGNAR CITA · PUESTO E (EMERGENCIA) · '+TURNOS[t-1].n.toUpperCase()+' · '+fd+'</div><div class="box">'+
   (pend.length?'<div class="row">'+campo("Solicitud de hospitalización / emergencia",'<select class="in" id="aeS">'+pend.map(function(x){var p=P.filter(function(y){return y.id===x.pid})[0];return'<option value="'+x.id+'">'+x.id+' · '+PROC[x.proc]+' · '+esc(p.nom)+(p.hcOk?'':' (sin HC inicial)')+'</option>'}).join("")+'</select>',"f3",true)+'</div>'+
    '<div class="ayuda">El Puesto E está reservado para pacientes de hospitalización y emergencia. En el siguiente paso se confirma fecha, hora y lugar de atención.</div>'
    :'<div class="nota">No hay solicitudes de hospitalización o emergencia pendientes. Registre al paciente con «Registrar paciente».</div>')+
   '<div class="acciones">'+(pend.length?'<button class="btn g" style="flex:1" id="aeOk">Continuar</button>':'')+'<button class="btn r" style="flex:.4" id="aeNo">Cancelar</button></div></div>');
  on("aeNo","click",cerrar);
  on("aeOk","click",function(){var so=SOL.filter(function(x){return x.id===$("aeS").value})[0],p=P.filter(function(y){return y.id===so.pid})[0];cerrar();
    if(!p.hcOk){hcModal(so.id);aviso("Primero se llena la HC inicial; luego se asigna la cita.");return}
    programar(so.id,{f:f2iso(fd),t:t,mi:8})});
}
function abrir(html){$("modal").innerHTML=html;$("velo").classList.add("ver")}
function cerrar(){$("velo").classList.remove("ver","alto");$("modal").classList.remove("xl")}
$("velo").onclick=function(e){if(e.target===this)cerrar()};
function asignar(mi,t){
  var libres=P.filter(function(x){return x.estado==="ACTIVO"&&!x.dias&&x.hcOk&&!SOL.some(function(z){return z.pid===x.id&&(z.proc==="HOSP"||z.proc==="EMER")})}),puede=true;
  abrir('<div class="bar">ASIGNAR CUPO · '+MAQ[mi].toUpperCase()+' · '+TURNOS[t-1].n.toUpperCase()+'</div><div class="box">'+
   (puede?'':'<div class="nota err">Solo el personal del departamento (admisión o médico) asigna cupos. Cambie el perfil en «Ver como».</div>')+
   '<div class="row">'+campo("Paciente sin programación",'<select class="in" id="asP">'+libres.map(function(p){return'<option value="'+p.id+'">'+esc(p.nom)+' · DNI '+p.dni+'</option>'}).join("")+'</select>',"f3",true)+'</div>'+
   '<div class="row">'+campo("Secuencia",ro(seq(V.dia)==="LMV"?"LUNES - MIÉRCOLES - VIERNES":"MARTES - JUEVES - SÁBADO"),"f2")+campo("Horario",ro(TURNOS[t-1].h),"f")+campo("Vigencia desde",inp("asV","2026-10-14",' type="date"'),"f",true)+'</div>'+
   '<div id="asMsg"></div><div class="acciones"><button class="btn g" style="flex:1" id="asOk"'+(puede?'':' disabled')+'>Asignar y generar citas</button><button class="btn r" style="flex:.4" id="asNo">Cancelar</button></div></div>');
  on("asNo","click",cerrar);
  on("asOk","click",function(){var p=P.filter(function(x){return x.id===+$("asP").value})[0];
    if(!p){$("asMsg").innerHTML='<div class="nota err">No hay pacientes pendientes de programación.</div>';return}
    if(!p.hcOk){$("asMsg").innerHTML='<div class="nota err">El paciente no tiene HC inicial firmada. Regístrela antes de programarlo.</div>';return}
    if(p.ser==="POSITIVA"&&mi!==7){$("asMsg").innerHTML='<div class="nota err">Serología positiva: solo puede asignarse a la Máquina 08 (aislamiento).</div>';return}
    p.dias=seq(V.dia);p.turno=t;p.maq=mi;cerrar();pintar();aviso("Cupo asignado y citas generadas.")});
}


/* ===== Reprogramación de citas (paciente que no llega a tiempo, inasistencia, etc.) ===== */
var FECHAS={L:"12-10-2026",M:"13-10-2026",X:"14-10-2026",J:"15-10-2026",V:"16-10-2026",S:"17-10-2026"},HOY_F="12-10-2026";
function fechaDia(d){return FECHAS[d]}
function iso2f(v){return v.split("-").reverse().join("-")}
function f2iso(v){return v.split("-").reverse().join("-")}
function letraDe(fecha){var a=fecha.split("-");return["D","L","M","X","J","V","S"][new Date(+a[2],+a[1]-1,+a[0]).getDay()]}
function ocupado(fecha,t,mi,excl){var sq=seq(letraDe(fecha));
  var reg=P.some(function(x){return x.id!==excl&&x.estado==="ACTIVO"&&x.dias===sq&&x.turno===t&&x.maq===mi&&!REPROG.some(function(r){return r.alc==="UNICA"&&r.pid===x.id&&r.fOrig===fecha})});
  var rep=REPROG.some(function(r){return r.pid!==excl&&r.alc==="UNICA"&&r.fNueva===fecha&&r.tNuevo===t&&r.mNueva===mi});
  var uni=fecha===HOY_F&&Object.keys(S).some(function(k){return +k!==excl&&S[k].unica&&S[k].turno===t&&S[k].lugar===MAQ[mi]});
  var uni2=SOL.some(function(x){return x.pid!==excl&&x.unica&&x.cd&&x.cd.f===fecha&&x.cd.t===t&&x.cd.mi===mi});
  return reg||rep||uni||uni2}
function citaActual(p){
  if(S[p.id])return{f:HOY_F,t:S[p.id].turno,l:S[p.id].lugar,hoy:true,est:S[p.id].est,so:SOL.filter(function(x){return x.pid===p.id&&x.unica})[0]};
  var su=SOL.filter(function(x){return x.pid===p.id&&x.unica&&x.cd})[0];
  if(su)return{f:su.cd.f,t:su.cd.t,l:su.cd.l,hoy:false,est:0,so:su};
  if(!p.dias)return null;
  var d=(V.vista==="cal"&&seq(V.dia)===p.dias)?V.dia:(p.dias==="LMV"?"X":"M");
  return{f:fechaDia(d),t:p.turno,l:MAQ[p.maq],hoy:false,est:0};
}
function reprog(pid){
  var p=P.filter(function(x){return x.id===pid})[0],c=citaActual(p);
  if(!c){aviso("El paciente no tiene cita programada.",true);return}
  var bloq=c.hoy&&c.est>0;
  var tur=function(id){return'<select class="in" id="'+id+'">'+TURNOS.map(function(t){return'<option value="'+t.id+'">'+t.n+' · '+t.h+'</option>'}).join("")+'</select>'};
  abrir('<div class="bar">REPROGRAMAR CITA · '+esc(p.nom)+'</div><div class="box">'+
   (bloq?'<div class="nota err">La atención de hoy ya inició ('+ESTADOS[c.est]+'). No se puede reprogramar una sesión en curso.</div>':'')+
   '<div class="sub">CITA ACTUAL</div><div class="row">'+campo("Fecha",ro(c.f),"f")+campo("Turno",ro(TURNOS[c.t-1].n+" · "+TURNOS[c.t-1].h),"f2")+campo("Lugar",ro(c.l),"f2")+'</div>'+
   '<div class="row">'+campo("¿Qué desea reprogramar?",radios("rpAlc",p.dias?["SOLO ESTA CITA","PROGRAMACIÓN REGULAR (todas las citas siguientes)"]:["SOLO ESTA CITA"],"SOLO ESTA CITA"),"f3",true)+'</div>'+
   '<div id="rpUni"><div class="sub">NUEVA CITA</div><div class="row">'+campo("Nueva fecha",inp("rpFec",f2iso(c.f),' type="date" min="2026-10-12"'),"f",true)+campo("Turno",tur("rpTur"),"f2",true)+campo("Hora de inicio",inp("rpHora",(c.so&&c.so.cd&&c.so.cd.h)||TURNOS[c.t-1].h.slice(0,5),' type="time"'),"f",true)+campo((c.l.indexOf("portátil")>=0?"Lugar / máquina":"Máquina"),'<select class="in" id="rpMaq"></select>',"f2",true)+'</div></div>'+
   '<div id="rpReg" hidden><div class="sub">NUEVA PROGRAMACIÓN REGULAR</div><div class="row">'+campo("Secuencia",sel("rpSeq",["LMV","MJS"],p.dias),"f",true)+campo("Turno",tur("rpTur2"),"f2",true)+campo("Máquina",'<select class="in" id="rpMaq2"></select>',"f2",true)+campo("Vigencia desde",inp("rpDes","2026-10-13",' type="date"'),"f",true)+'</div></div>'+
   '<div class="row">'+campo("Motivo",sel("rpMot",["PACIENTE NO LLEGÓ A TIEMPO","INASISTENCIA DEL PACIENTE","SOLICITUD DEL PACIENTE","INDICACIÓN MÉDICA","FALLA O MANTENIMIENTO DE MÁQUINA","OTRO"]),"f2",true)+campo("Observación",inp("rpObs","",' placeholder="Ej.: llegó 1 h tarde; se coordina por teléfono"'),"f3")+'</div>'+
   '<div id="rpMsg"></div><div class="acciones"><button class="btn o" style="flex:1" id="rpOk"'+(bloq?' disabled':'')+'>Reprogramar cita</button><button class="btn r" style="flex:.4" id="rpNo">Cancelar</button></div>'+
   '<div class="leg">Pueden reprogramar el personal médico, de enfermería y de admisión del servicio. Queda registrado quién lo hizo, el motivo y una nota en el seguimiento del paciente.</div></div>');
  function maqLibres(fecha,t){var l=(c.so?[8,0,1,2,3,4,5,6,7]:[0,1,2,3,4,5,6,7]).filter(function(i){return!ocupado(fecha,t,i,pid)});if(p.ser==="POSITIVA")l=l.filter(function(i){return i===7||i===8});return l}
  var port=c.l.indexOf("portátil")>=0;
  function opM(id,l,actual){$(id).innerHTML=(port&&id==="rpMaq"?'<option value="P" selected>EN EL LUGAR · '+esc(c.l)+'</option>':'')+l.map(function(i){return'<option value="'+i+'"'+(!port&&MAQ[i]===actual?' selected':'')+'>'+MAQ[i]+'</option>'}).join("")||'<option value="">SIN CUPO EN ESE TURNO</option>'}
  function upd(){var v=$("rpFec").value;$("rpMsg").innerHTML="";if(!v)return;var fe=iso2f(v);
    if(letraDe(fe)==="D"){$("rpMsg").innerHTML='<div class="nota err">No hay atención de hemodiálisis los domingos.</div>';opM("rpMaq",[],"");return}
    opM("rpMaq",maqLibres(fe,+$("rpTur").value),c.l)}
  function upd2(){var sqv=$("rpSeq").value,t=+$("rpTur2").value,fe=sqv==="LMV"?FECHAS.X:FECHAS.M;opM("rpMaq2",maqLibres(fe,t),c.l)}
  $("rpTur").value=String(c.t);$("rpTur2").value=String(c.t);
  on("rpTur","change",function(){$("rpHora").value=TURNOS[+$("rpTur").value-1].h.slice(0,5);upd()});
  upd();upd2();on("rpFec","change",upd);on("rpSeq","change",upd2);on("rpTur2","change",upd2);
  q('input[name="rpAlc"]').forEach(function(r){r.onchange=function(){var reg=$("rpAlc1")&&$("rpAlc1").checked;$("rpUni").hidden=reg;$("rpReg").hidden=!reg}});
  on("rpNo","click",cerrar);
  on("rpOk","click",function(){
    var reg=$("rpAlc1")&&$("rpAlc1").checked,mot=$("rpMot").value,obs=$("rpObs").value.trim();
    if(mot==="OTRO"&&!obs){$("rpMsg").innerHTML='<div class="nota err">Si el motivo es «OTRO», describa el motivo en Observación.</div>';return}
    var reg0={pid:pid,fOrig:c.f,tOrig:c.t,lOrig:c.l,mot:mot,obs:obs,u:usuario(),h:ahora()},txt;
    if(!reg){
      var v=$("rpFec").value,mi=$("rpMaq").value,t=+$("rpTur").value;
      if(!v||mi===""){$("rpMsg").innerHTML='<div class="nota err">Elija una fecha válida y una máquina con cupo.</div>';return}
      var fe=iso2f(v);
      if(letraDe(fe)==="D"){$("rpMsg").innerHTML='<div class="nota err">No hay atención los domingos.</div>';return}
      var hora=$("rpHora").value,lug=mi==="P"?c.l:MAQ[+mi];
      if(!hora){$("rpMsg").innerHTML='<div class="nota err">Ingrese la hora de inicio.</div>';return}
      if(fe===c.f&&t===c.t&&lug===c.l&&(!c.so||!c.so.cd||c.so.cd.h===hora)){$("rpMsg").innerHTML='<div class="nota err">La nueva cita es igual a la actual.</div>';return}
      reg0.alc="UNICA";reg0.fNueva=fe;reg0.tNuevo=t;reg0.mNueva=mi==="P"?null:+mi;reg0.lNuevo=lug;reg0.hNueva=hora;
      if(c.so){c.so.cd={f:fe,t:t,h:hora,l:lug,mi:reg0.mNueva};c.so.cita=fe+" · "+hora+" ("+TURNOS[t-1].n+") · "+lug;
        if(c.hoy&&fe!==HOY_F)delete S[pid];else if(fe===HOY_F){if(!S[pid])S[pid]=nuevaSes(p,c.so.proc,t,lug);S[pid].turno=t;S[pid].lugar=lug}}
      else if(c.hoy){if(fe===HOY_F){S[pid].turno=t;S[pid].lugar=lug}else delete S[pid]}
      txt="Cita del "+c.f+" ("+TURNOS[c.t-1].n+") reprogramada al "+fe+" a las "+hora+" ("+TURNOS[t-1].n+", "+lug+")";
    }else{
      var mi2=$("rpMaq2").value,t2=+$("rpTur2").value,sqv=$("rpSeq").value;
      if(mi2===""){$("rpMsg").innerHTML='<div class="nota err">No hay máquina libre en ese turno y secuencia.</div>';return}
      p.dias=sqv;p.turno=t2;p.maq=+mi2;
      reg0.alc="REGULAR";reg0.lNuevo=(sqv==="LMV"?"L-M-V":"Ma-J-S")+" · "+TURNOS[t2-1].n+" · "+MAQ[+mi2]+" desde "+iso2f($("rpDes").value);
      if(c.hoy&&S[pid].est===0){if(sqv==="LMV"){S[pid].turno=t2;S[pid].lugar=MAQ[+mi2]}else delete S[pid]}
      txt="Programación regular cambiada a "+reg0.lNuevo;
    }
    REPROG.push(reg0);
    (NOTAS[pid]=NOTAS[pid]||[]).unshift({f:HOY_F,u:usuario(),n:txt+". Motivo: "+mot+(obs?" ("+obs+")":"")+"."});
    cerrar();pintar();aviso(txt+".");
  });
}
