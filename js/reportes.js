/* Maqueta · Módulo de Hemodiálisis · SIGESAPOL
   6. Reportes y exportación. */
/* ===== 6. Reportes ===== */
function vRep(){
  var rows=[["12-10-2026","GUTIERREZ ROJAS, L.","N18.6; Z99.2; I10","90937","3.50","2.6","2.4","HEPARINA; ERITROPOYETINA","CERRADA"],["12-10-2026","MENDOZA PAREDES, R.","N18.6; Z99.2","90937","3.50","2.0","2.1","HEPARINA","EN ENFERMERÍA"],["09-10-2026","QUISPE HUAMANI, T.","N18.0; E11.2","90937","3.00","1.8","1.7","HEPARINA; HIERRO","CERRADA"],["09-10-2026","VARGAS CCAHUANA, E.","N18.6; Z99.2","90935","4.00","3.0","2.9","HEPARINA","CERRADA"]];
  return'<div class="bar">REPORTES · ATENCIONES DE HEMODIÁLISIS<span class="tag">nuevo</span></div><div class="box">'+
  '<div class="row">'+campo("Desde",inp("rD","2026-10-01",' type="date"'),"f",true)+campo("Hasta",inp("rH","2026-10-14",' type="date"'),"f",true)+campo("Turno",sel("rT",["TODOS"].concat(TURNOS.map(function(t){return t.n.toUpperCase()}))),"f")+campo("Nefrólogo",sel("rN",["TODOS","Dra. M. SALAZAR","Dr. J. PAREDES"]),"f")+'<div class="fh"><label>&nbsp;</label><button class="btn b" style="width:100%" id="rGen">Generar</button></div><div class="fh"><label>&nbsp;</label><button class="btn g" style="width:100%" id="rXls">Excel</button></div></div>'+
  '<div class="kpis"><div class="kpi"><div class="v">142</div><div class="t">Sesiones en el rango</div></div><div class="kpi"><div class="v">12</div><div class="t">Pacientes atendidos</div></div><div class="kpi alerta"><div class="v">3</div><div class="t">Sesiones con firma pendiente</div></div><div class="kpi"><div class="v">9</div><div class="t">Sesiones con eventos</div></div></div>'+
  '<div class="tw"><table><tr><th>Fecha</th><th>Paciente</th><th>CIE-10</th><th>CPMS</th><th>Horas HD</th><th>UF prog. (L)</th><th>UF efect. (L)</th><th>Medicamentos</th><th>Estado</th></tr>'+rows.map(function(r){return'<tr>'+r.map(function(c){return'<td>'+esc(c)+'</td>'}).join("")+'</tr>'}).join("")+'</table></div>'+
  '<div class="leg">Vista previa con cifras ilustrativas. La exportación trae una fila por sesión con paciente, diagnósticos, CPMS, prescripción, UF y medicamentos.</div></div>';
}
function bRep(){on("rGen","click",function(){aviso("Reporte generado para el rango seleccionado (simulado).")});on("rXls","click",function(){aviso("En el sistema real aquí se descarga el archivo .xlsx.")})}
