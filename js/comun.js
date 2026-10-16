/* Maqueta · Módulo de Hemodiálisis · SIGESAPOL
   Estado de la maqueta, utilidades, menú lateral, flujo de los 3 tiempos y pintado de vistas. */
/* ===== Estado de la maqueta ===== */
var V={vista:"sol",ses:null,t:1,hc:7,dia:"L",fEst:"ACTIVO",fQ:""};

/* ===== Utilidades ===== */
function $(id){return document.getElementById(id)}
function q(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function rol(){return $("selRol").value}
function esNef(){return rol()==="nef"||rol()==="nef2"}
function esEnf(){return rol()==="enf"||rol()==="enf2"}
function usuario(){return{adm:"[admisión HD]",nef:"Dra. M. SALAZAR",nef2:"Dr. J. PAREDES",enf:"Lic. C. HUAMAN",enf2:"Lic. P. ROJAS",jef:"Dr. A. RIVAS"}[rol()]}
function ahora(){var d=new Date();return("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2)}
function opts(a,v){return a.map(function(o){return'<option'+(String(o)===String(v)?' selected':'')+'>'+esc(o)+'</option>'}).join("")}
function campo(lab,html,cls,req){return'<div class="'+(cls||"f")+'"><label>'+lab+(req?' <i>*</i>':'')+'</label>'+html+'</div>'}
function ro(v){return'<input class="in" readonly value="'+esc(v)+'">'}
function inp(id,v,extra){return'<input class="in" id="'+id+'" value="'+esc(v==null?"":v)+'"'+(extra||"")+'>'}
function sel(id,a,v){return'<select class="in" id="'+id+'">'+opts(a,v)+'</select>'}
function radios(name,a,v,type){return'<div class="ops">'+a.map(function(o,i){var c=Array.isArray(v)?v.indexOf(o)>=0:v===o;return'<label class="ck"><input type="'+(type||"radio")+'" name="'+name+'" id="'+name+i+'"'+(c?' checked':'')+'>'+esc(o)+'</label>'}).join("")+'</div>'}
function st(e){return'<span class="st s'+e+'">'+ESTADOS[e]+'</span>'}
function aviso(t,err){var a=$("aviso");a.textContent=t;a.className="aviso ver"+(err?" err":"");clearTimeout(aviso.t);aviso.t=setTimeout(function(){a.className="aviso"+(err?" err":"")},3800)}
function on(id,ev,f){var e=$(id);if(e)e["on"+ev]=f}

/* ===== Menú lateral ===== */
function menu(){
  var perfiles={adm:["[admisión HD]","perfil «Admisión de Hemodiálisis»"],nef:["Dra. M. SALAZAR","CMP 045812 · perfil «Nefrólogo»"],nef2:["Dr. J. PAREDES","CMP 051277 · perfil «Nefrólogo»"],enf:["Lic. C. HUAMAN","CEP 087412 · perfil «Enfermería HD»"],enf2:["Lic. P. ROJAS","CEP 090233 · perfil «Enfermería HD»"],jef:["Dr. A. RIVAS","perfil «Jefatura de Nefrología»"]};
  var pf=perfiles[rol()],act=P.filter(function(p){return p.estado==="ACTIVO"}).length,sinhc=P.filter(function(p){return !p.hcOk}).length;
  var pend=Object.keys(S).filter(function(k){return S[k].est<4}).length;
  var h='<div class="usr"><b>'+pf[0]+'</b>Servicio de Hemodiálisis · '+pf[1]+'</div>';
  h+=item("sol","1. Solicitudes de atención",true,SOL.filter(function(x){return x.estado!=="PROGRAMADA"}).length);
  h+=item("hc","2. Historia clínica inicial",true,sinhc);
  h+=item("cal","3. Programación y citas",true);
  h+=item("dia","4. Registro de atención del día",true,pend);
  h+=item("seg","5. Seguimiento de pacientes",true,act);
  h+=item("rep","6. Reportes",true);
  $("side").innerHTML=h;
  q(".side a[data-v]").forEach(function(a){a.onclick=function(){V.vista=a.getAttribute("data-v");V.ses=null;pintar()}});
}
function item(v,t,nuevo,c){var act=V.vista===v||(V.vista==="ses"&&v==="dia");return'<a data-v="'+v+'" class="'+(act?"on":"")+'">▦ '+t+(nuevo?' <span class="n">nuevo</span>':'')+(c?'<span class="c">'+c+'</span>':'')+'</a>'}

/* ===== Flujo de los 3 tiempos ===== */
function flujo(){
  var f=$("flujo");
  if(V.vista!=="ses"){f.style.display="none";return}
  f.style.display="";
  var s=S[V.ses];
  var pasos=[["1. Evaluación inicial","Nefrólogo · "+(s.ini.firm?"firmado "+s.ini.firm.h+" · "+s.ini.firm.u:"pendiente"),s.ini.firm,false],
             ["2. Evaluación de enfermería","Enfermería HD · "+(s.enf.firm?"firmado "+s.enf.firm.h+" · "+s.enf.firm.u:s.ini.firm?"pendiente":"bloqueado"),s.enf.firm,!s.ini.firm],
             ["3. Evaluación final","Nefrólogo · "+(s.fin.firm?"firmado "+s.fin.firm.h+" · "+s.fin.firm.u:s.enf.firm?"pendiente":"bloqueado"),s.fin.firm,!s.enf.firm]];
  f.innerHTML=pasos.map(function(p,i){return'<div data-t="'+(i+1)+'" class="'+(V.t===i+1?"on":p[2]?"dep":"")+(p[3]?" lock":"")+'">'+p[0]+'<small>'+p[1]+'</small></div>'}).join("");
  q("#flujo div").forEach(function(d){d.onclick=function(){if(d.classList.contains("lock")){aviso("Este tiempo se habilita cuando se firma el anterior.",true);return}V.t=+d.getAttribute("data-t");pintar()}});
}

function pintar(){var nn=SOL.filter(function(x){return x.estado==="NUEVA"}).length;$("notif").innerHTML="Notificaciones"+(nn?" <b>"+nn+"</b>":"");menu();flujo();$("vista").innerHTML=({sol:vSol,dia:vDia,ses:vSes,hc:vHC,cal:vCal,seg:vSeg,rep:vRep})[V.vista]();({sol:bSol,dia:bDia,ses:bSes,hc:bHC,cal:bCal,seg:bSeg,rep:bRep,cfg:function(){}})[V.vista]()}
