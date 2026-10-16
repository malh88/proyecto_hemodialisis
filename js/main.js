/* Maqueta · Módulo de Hemodiálisis · SIGESAPOL
   Arranque de la maqueta: eventos globales y primer pintado. */
$("notif").onclick=function(){V.vista="sol";fProc="TODAS";pintar()};
$("selRol").onchange=function(){pintar();aviso("Viendo como: "+$("selRol").selectedOptions[0].text)};
document.addEventListener("click",function(e){if(e.target.hasAttribute&&e.target.hasAttribute("data-cfg"))aviso("Edición de catálogo (simulada).")});
pintar();
