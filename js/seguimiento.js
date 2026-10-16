/* Maqueta · Módulo de Hemodiálisis · SIGESAPOL
   5. Seguimiento de pacientes del programa. */
/* ===== 5. Seguimiento ===== */
function vSeg(){
  var lista=P.filter(function(p){return(V.fEst==="TODOS"||p.estado===V.fEst)&&(!V.fQ||(p.nom+p.dni+p.hc+p.cip).toLowerCase().indexOf(V.fQ.toLowerCase())>=0)});
  return'<div class="bar">SEGUIMIENTO DE PACIENTES DEL PROGRAMA<span class="tag">nuevo</span></div><div class="box">'+
  '<div class="row">'+campo("Buscar por nombre, DNI, N° HC o CIP",inp("sQ",V.fQ),"f3")+campo("Estado",sel("sE",["ACTIVO","SUSPENDIDO","ALTA POR TRASPLANTE","TRASLADADO","FALLECIDO","TODOS"],V.fEst),"f")+'<div class="fh"><label>&nbsp;</label><button class="btn k" style="width:100%" id="sBus">Buscar</button></div></div>'+
  '<div class="tw"><table><tr><th>DNI</th><th>HC</th><th>CIP</th><th>Grado</th><th>Parentesco</th><th>Titular</th><th>Sexo</th><th>Edad</th><th>Teléfono</th><th>Ubicación</th><th>Observaciones</th><th>Estado</th></tr>'+
  (lista.map(function(p){return'<tr class="clic'+(!p.hcOk?' nuevo':'')+'" data-p="'+p.id+'"><td class="nw">'+p.dni+'</td><td class="nw">'+p.hc+'</td><td class="nw">'+p.cip+'</td><td>'+p.grado+'</td><td>'+p.par+'</td><td>'+esc(p.tit)+'</td><td>'+p.sexo+'</td><td>'+p.edad+'</td><td class="nw">'+p.tel+'</td><td>'+esc(p.ubic)+'</td><td>'+(esc(p.obs)||"—")+'</td><td><span class="st '+(p.estado==="ACTIVO"?"s4":"s0")+'">'+p.estado+'</span>'+(!p.hcOk?' <span class="st s2">SIN HC INICIAL</span>':'')+'</td></tr>'}).join("")||'<tr><td colspan="12" class="vacio">No se encontraron pacientes.</td></tr>')+'</table></div>'+
  '<div class="leg">Haga clic en un paciente para ver su programación, últimas sesiones y notas de seguimiento.</div></div>';
}
function bSeg(){
  on("sBus","click",function(){V.fQ=$("sQ").value;V.fEst=$("sE").value;pintar()});
  on("sE","change",function(){V.fEst=$("sE").value;pintar()});
  on("sQ","keydown",function(e){if(e.key==="Enter"){V.fQ=$("sQ").value;pintar()}});
  q("tr[data-p]").forEach(function(tr){tr.onclick=function(){ficha(+tr.getAttribute("data-p"))}});
}
function ficha(pid){
  var p=P.filter(function(x){return x.id===pid})[0],n=NOTAS[pid]||[],soP=SOL.filter(function(x){return x.pid===pid&&x.estado!=="PROGRAMADA"})[0];
  var ca=citaActual(p);
  abrir('<div class="bar">'+esc(p.nom)+'<span class="tag" style="background:#fff;color:#333">'+p.estado+'</span></div><div class="box">'+
   '<div class="row">'+(p.dias?campo("Secuencia",ro(p.dias),"f")+campo("Turno",ro(TURNOS[p.turno-1].n),"f")+campo("Máquina",ro(MAQ[p.maq]),"f2"):campo("Próxima cita",ro(ca?ca.f+" · "+TURNOS[ca.t-1].n:"SIN CITA"),"f2")+campo("Lugar",ro(ca?ca.l:"—"),"f2"))+campo("Acceso",ro(p.acceso),"fh")+campo("Serología",ro(p.ser),"f")+'</div>'+
   '<div class="sub">ÚLTIMAS SESIONES</div><div class="tw"><table><tr><th>Fecha</th><th>UF efectiva</th><th>Eventos</th><th>Estado</th></tr><tr><td>09-10-2026</td><td>2.4 L</td><td>—</td><td>'+st(4)+'</td></tr><tr><td>07-10-2026</td><td>2.8 L</td><td>HIPOTENSIÓN</td><td>'+st(4)+'</td></tr><tr><td>05-10-2026</td><td>2.5 L</td><td>—</td><td>'+st(4)+'</td></tr></table></div>'+
   '<div class="sub">NOTAS DE SEGUIMIENTO</div>'+(n.length?n.map(function(x){return'<div class="leg"><b>'+x.f+'</b> · '+x.u+'<br>'+esc(x.n)+'</div>'}).join(""):'<div class="leg">Sin notas.</div>')+
   '<div class="row" style="margin-top:8px">'+campo("Nueva nota",'<textarea class="in" id="nNota" placeholder="Llamada, inasistencia, cambio de datos…"></textarea>',"f3")+'</div>'+
   '<div class="row">'+campo("Cambiar estado del paciente",sel("nEst",["ACTIVO","SUSPENDIDO","ALTA POR TRASPLANTE","TRASLADADO","FALLECIDO"],p.estado),"f")+'<div class="f2"></div></div>'+
   '<div class="acciones"><button class="btn g" style="flex:1" id="nOk">Guardar</button>'+(soP?(p.hcOk?'<button class="btn b" style="flex:.6" id="nAsig">Asignar cita</button>':'<button class="btn o" style="flex:.6" id="nHc">Llenar HC inicial</button>'):'')+(citaActual(p)?'<button class="btn o" style="flex:.6" id="nRep">Editar / reprogramar cita</button>':'')+'<button class="btn r" style="flex:.4" id="nNo">Cerrar</button></div></div>');
  on("nRep","click",function(){cerrar();reprog(pid)});on("nAsig","click",function(){cerrar();programar(soP.id)});on("nHc","click",function(){cerrar();hcModal(soP.id)});
  on("nNo","click",cerrar);
  on("nOk","click",function(){var t=$("nNota").value.trim(),e=$("nEst").value,cambio=e!==p.estado;if(!t&&!cambio){aviso("Escriba una nota o cambie el estado.",true);return}
    if(t)(NOTAS[pid]=NOTAS[pid]||[]).unshift({f:"14-10-2026",u:usuario(),n:t});p.estado=e;cerrar();pintar();aviso("Seguimiento actualizado.")});
}
