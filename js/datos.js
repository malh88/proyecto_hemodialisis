/* Maqueta · Módulo de Hemodiálisis · SIGESAPOL
   Datos de ejemplo (ficticios): pacientes, solicitudes, autorizaciones y sesiones del día. */
/* ===== Datos de ejemplo (ficticios) ===== */
var TURNOS=[{id:1,n:"Turno 1",h:"06:00 - 10:00"},{id:2,n:"Turno 2",h:"10:30 - 14:30"},{id:3,n:"Turno 3",h:"15:00 - 19:00"},{id:4,n:"Turno 4",h:"19:30 - 23:30"}];
var MAQ=["Máquina 01","Máquina 02","Máquina 03","Máquina 04","Máquina 05","Máquina 06","Máquina 07","Máquina 08 (aislamiento)","Puesto E (emergencia)"];
var P=[
 {id:1,nom:"GUTIERREZ ROJAS, LUIS ALBERTO",dni:"40718235",hc:"0238145",cip:"31187420",grado:"SOS PNP",par:"TITULAR",tit:"—",sexo:"M",edad:58,tel:"987412305",ubic:"AMBULATORIO · SJL",obs:"Refiere calambres frecuentes",estado:"ACTIVO",dias:"LMV",turno:1,maq:0,ser:"NEGATIVA",acceso:"FAV",hcOk:true},
 {id:2,nom:"MENDOZA PAREDES, ROSA ELENA",dni:"09852147",hc:"0127733",cip:"—",grado:"CMDTE. PNP",par:"CÓNYUGE",tit:"CASTRO VEGA, JULIO",sexo:"F",edad:64,tel:"956210774",ubic:"AMBULATORIO · JESÚS MARÍA",obs:"",estado:"ACTIVO",dias:"LMV",turno:1,maq:1,ser:"NEGATIVA",acceso:"CVC",hcOk:true},
 {id:3,nom:"QUISPE HUAMANI, TEODORO",dni:"25471893",hc:"0310592",cip:"30554127",grado:"SO1 PNP (R)",par:"TITULAR",tit:"—",sexo:"M",edad:71,tel:"944870112",ubic:"HOSPITALIZADO · MEDICINA 4.º PISO",hosp:{tipo:"HOSP",serv:"MEDICINA INTERNA · 4.º PISO",cama:"412-A",med:"Dr. H. RIOS PALACIOS"},obs:"Procede de hospitalización",estado:"ACTIVO",dias:"LMV",turno:2,maq:2,ser:"NEGATIVA",acceso:"CVCLP",hcOk:true},
 {id:4,nom:"TORRES LLANOS, CARMEN JULIA",dni:"41209968",hc:"0402219",cip:"—",grado:"SB PNP",par:"HIJA",tit:"TORRES DIAZ, MARCO",sexo:"F",edad:39,tel:"912663048",ubic:"AMBULATORIO · COMAS",obs:"Llamar al titular si no asiste",estado:"ACTIVO",dias:"MJS",turno:1,maq:0,ser:"NEGATIVA",acceso:"FAV",hcOk:true},
 {id:5,nom:"VARGAS CCAHUANA, ELIAS",dni:"10834576",hc:"0199870",cip:"28741006",grado:"CAP. PNP",par:"TITULAR",tit:"—",sexo:"M",edad:47,tel:"998304551",ubic:"AMBULATORIO · SURCO",obs:"AgHBs positivo",estado:"ACTIVO",dias:"LMV",turno:3,maq:7,ser:"POSITIVA",acceso:"FAV",hcOk:true},
 {id:6,nom:"SANCHEZ ÑAUPARI, GLORIA",dni:"07745120",hc:"0088412",cip:"—",grado:"STS PNP",par:"MADRE",tit:"SANCHEZ ROMERO, IVAN",sexo:"F",edad:76,tel:"965118290",ubic:"AMBULATORIO · BREÑA",obs:"2 inasistencias en octubre",estado:"ACTIVO",dias:"MJS",turno:2,maq:3,ser:"NEGATIVA",acceso:"FAV",hcOk:true},
 {id:7,nom:"ARIAS POMA, WILFREDO",dni:"43562190",hc:"0451036",cip:"32019884",grado:"S3 PNP",par:"TITULAR",tit:"—",sexo:"M",edad:33,tel:"923557016",ubic:"EMERGENCIA · OBSERVACIÓN DE ADULTOS",hosp:{tipo:"EMER",serv:"EMERGENCIA · OBSERVACIÓN DE ADULTOS",cama:"12",med:"Dr. R. CAMPOS DIAZ"},obs:"Solicitud desde Emergencia",estado:"ACTIVO",dias:"",turno:null,maq:null,ser:"PENDIENTE",acceso:"CVC",hcOk:false},
 {id:8,nom:"PALOMINO REYES, ANA LUCIA",dni:"08321457",hc:"0076508",cip:"—",grado:"CRNL. PNP",par:"CÓNYUGE",tit:"BENAVIDES SOTO, RAUL",sexo:"F",edad:69,tel:"981220637",ubic:"—",obs:"Trasplante renal 09/2026",estado:"ALTA POR TRASPLANTE",dias:"",turno:null,maq:null,ser:"NEGATIVA",acceso:"FAV",hcOk:true},
 {id:9,nom:"LOPEZ FARFAN, JORGE LUIS",dni:"42876510",hc:"0466120",cip:"33104577",grado:"SO2 PNP",par:"TITULAR",tit:"—",sexo:"M",edad:44,tel:"947220913",ubic:"HOSPITALIZADO · MEDICINA 3.er PISO · CAMA 305-B",hosp:{tipo:"HOSP",serv:"MEDICINA INTERNA · 3.er PISO",cama:"305-B",med:"Dr. H. RIOS PALACIOS"},obs:"Interconsulta de Medicina Interna",estado:"ACTIVO",dias:"",turno:null,maq:null,ser:"PENDIENTE",acceso:"CVC",hcOk:false},
 {id:10,nom:"CHAVEZ MORI, ROSARIO DEL PILAR",dni:"40125586",hc:"0472318",cip:"—",grado:"SOT1 PNP",par:"CÓNYUGE",tit:"PINEDO SALAS, HUGO",sexo:"F",edad:52,tel:"975330418",ubic:"AMBULATORIO · BREÑA",obs:"Referida de Policlínico PNP Breña",estado:"ACTIVO",dias:"",turno:null,maq:null,ser:"NEGATIVA",acceso:"FAV",hcOk:false}
];
var ESTADOS=["PENDIENTE","EVALUACIÓN INICIAL","EN ENFERMERÍA","EVALUACIÓN FINAL","CERRADA"];
var CIE=["N18.6 · ENFERMEDAD RENAL CRÓNICA, ESTADIO 5","N18.0 · ENFERMEDAD RENAL TERMINAL","Z99.2 · DEPENDENCIA DE DIÁLISIS RENAL","I10 · HIPERTENSIÓN ESENCIAL","E11.2 · DIABETES TIPO 2 CON COMPLICACIÓN RENAL","D63.8 · ANEMIA EN ENFERMEDAD CRÓNICA","J18.9 · NEUMONÍA, NO ESPECIFICADA"];
var PROD=["HEPARINA SÓDICA 5 000 UI/ML","ERITROPOYETINA 4 000 UI","HIERRO SACAROSA 100 MG","CLORURO DE SODIO 0.9 % 1 000 ML","COMPLEJO B AMPOLLA","PAQUETE GLOBULAR (TRANSFUSIÓN)"];
var HORAS=[];for(var h=1;h<=4.0001;h+=0.25)HORAS.push(h.toFixed(2));
var QB=[250,300,350,400,450,500];
var REPROG=[{pid:6,alc:"UNICA",fOrig:"09-10-2026",tOrig:2,lOrig:"Máquina 04",fNueva:"10-10-2026",tNuevo:3,mNueva:3,lNuevo:"Máquina 04",mot:"PACIENTE NO LLEGÓ A TIEMPO",obs:"Llegó 1 h 30 min tarde por tráfico.",u:"Lic. C. HUAMAN",h:"11:05"}]; /* historial de reprogramaciones */
var NOTAS={6:[{f:"09-10-2026",u:"Admisión HD",n:"No asistió. Se llamó al titular, refiere viaje familiar."}],4:[{f:"02-10-2026",u:"Admisión HD",n:"Se actualizó teléfono de contacto."}]};

var SOL=[
 {id:"SOL-0158",pid:7,proc:"EMER",fecha:"12-10-2026 05:40",sol:"Dr. R. CAMPOS · EMERGENCIA",ubic:"EMERGENCIA · OBSERVACIÓN DE ADULTOS · CAMA 12",dx:"N17.9 · INSUFICIENCIA RENAL AGUDA",mot:"Hiperkalemia y sobrecarga de volumen.",estado:"NUEVA",aut:{nro:"AUT-EMER-2026-1180",fecha:"12-10-2026 05:35",med:"Dr. R. CAMPOS DIAZ",cmp:"048803",serv:"EMERGENCIA",ubic:"EMERGENCIA · OBSERVACIÓN DE ADULTOS · CAMA 12",dx:"N17.9 · INSUFICIENCIA RENAL AGUDA",mot:"Hiperkalemia y sobrecarga de volumen refractaria a diuréticos. Se deriva a Nefrología para hemodiálisis de urgencia.",tipo:"EMER"}},
 {id:"SOL-0157",pid:9,proc:"HOSP",fecha:"11-10-2026 18:20",sol:"Dr. H. RIOS · MEDICINA INTERNA",ubic:"MEDICINA 3.er PISO · CAMA 305-B",dx:"N18.5 · ENFERMEDAD RENAL CRÓNICA, ESTADIO 5",mot:"Uremia, inicio de terapia de reemplazo renal.",estado:"NUEVA",aut:{nro:"AUT-HOSP-2026-0409",fecha:"11-10-2026 18:15",med:"Dr. H. RIOS PALACIOS",cmp:"039920",serv:"MEDICINA INTERNA",ubic:"MEDICINA 3.er PISO · CAMA 305-B",dx:"N18.5 · ENFERMEDAD RENAL CRÓNICA, ESTADIO 5",mot:"Síndrome urémico, urea 245 mg/dL. Se solicita evaluación de Nefrología e inicio de terapia de reemplazo renal.",tipo:"HOSP"}},
 {id:"SOL-0156",pid:10,proc:"REF",fecha:"11-10-2026 09:15",sol:"REFERENCIA N° 2026-08812 · POLICLÍNICO PNP BREÑA",ubic:"AMBULATORIO",dx:"N18.5 · ENFERMEDAD RENAL CRÓNICA, ESTADIO 5",mot:"Se presenta en Nefrología con referencia.",estado:"NUEVA"},
 {id:"SOL-0149",pid:3,proc:"HOSP",fecha:"02-10-2026 10:05",sol:"Dr. H. RIOS · MEDICINA INTERNA",ubic:"MEDICINA 4.º PISO · CAMA 412-A",dx:"N18.0 · ENFERMEDAD RENAL TERMINAL",mot:"Paciente del programa hospitalizado.",estado:"PROGRAMADA",aut:{nro:"AUT-HOSP-2026-0371",fecha:"02-10-2026 10:00",med:"Dr. H. RIOS PALACIOS",cmp:"039920",serv:"MEDICINA INTERNA",ubic:"MEDICINA 4.º PISO · CAMA 412-A",dx:"N18.0 · ENFERMEDAD RENAL TERMINAL",mot:"Paciente del programa de hemodiálisis hospitalizado por neumonía. Continuar hemodiálisis.",tipo:"HOSP"},cita:"L-M-V · Turno 2 · Máquina 03"}
];
var PROC={AMB:"AMBULATORIO",REF:"REFERIDO",HOSP:"HOSPITALIZACIÓN",EMER:"EMERGENCIA"};
var UNID_EMER=["OBSERVACIÓN DE ADULTOS","TRAUMA SHOCK","UCI DE EMERGENCIA","TÓPICO DE MEDICINA"];
function prTag(k){return'<span class="pr pr-'+k+'">'+PROC[k]+'</span>'}

var S={}; // sesiones de hoy (lunes, secuencia L-M-V)
P.filter(function(p){return p.dias==="LMV"&&p.estado==="ACTIVO"}).forEach(function(p,i){
  var est=[4,2,1,0][i]||0;
  var s=S[p.id]={pid:p.id,nro:[6,5,7,6][i]||6,est:est,pk:p.ubic.indexOf("HOSP")===0?"HOSP":"AMB",turno:p.turno,lugar:MAQ[p.maq],unica:false,
    ini:{firm:null,cie:[CIE[0],CIE[2],CIE[3]],med:[{p:PROD[0],d:"5 000 UI",v:"EV"},{p:PROD[1],d:"4 000 UI",v:"SC"}],receta:null},
    enf:{firm:null,frec:p.id===3?30:60,mon:[],apl:{},dx:["00026","00004"],noc:[{c:"0601",v:"3"},{c:"0802",v:"4"}],nic:["2100","4130"],detInt:"",detEva:""},fin:{firm:null}};
  if(est>=2){s.ini.firm={u:"Dra. M. SALAZAR",h:"06:12"};s.ini.receta={r:"R-0045871",f:"FUR-0012334"};}
  if(est>=2){s.enf.mon=[{t:"c",h:"06:40",pa:"130/80",fc:78,qb:350,na:140,ra:-120,rv:140,ptm:60,o:"",u:"Lic. C. HUAMAN"},{t:"c",h:"07:40",pa:"118/72",fc:82,qb:350,na:140,ra:-130,rv:150,ptm:70,o:"",u:"Lic. C. HUAMAN"},{t:"e",h:"08:05",ev:"HIPOTENSIÓN",ac:"Se reduce UF y se administra ClNa 0.9 % 200 ml",o:"Se avisa al médico de turno",u:"Lic. C. HUAMAN"}];s.enf.apl={0:"06:35",1:"06:40"};}
  if(est>=3)s.enf.firm={u:"Lic. P. ROJAS",h:"09:58"};
  if(est>=4)s.fin.firm={u:"Dr. J. PAREDES",h:"10:05"};
});
