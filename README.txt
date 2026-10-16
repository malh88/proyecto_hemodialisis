MAQUETA · MÓDULO DE HEMODIÁLISIS · SIGESAPOL
Hospital Nacional PNP Luis N. Sáenz · Departamento de Nefrología

Cómo abrirla: descomprima la carpeta y abra index.html en el navegador (Chrome o Edge).
No necesita servidor ni instalación. Los datos son ficticios y no se guardan al recargar.

Estructura
  index.html                  estructura de la página
  css/estilos.css             estilos (verde institucional de SIGESAPOL)
  js/datos.js                 datos de ejemplo
  js/catalogos-enfermeria.js  catálogos NANDA, NOC y NIC (reemplazar por la exportación de SIGESAPOL)
  js/comun.js                 utilidades, menú lateral y pintado de vistas
  js/solicitudes.js           1. Solicitudes de atención (registro, autorizaciones, cita)
  js/hc-inicial.js            2. Historia clínica inicial y su ventana emergente
  js/programacion.js          3. Programación y citas
  js/atencion.js              4. Registro de atención del día, ficha en 3 tiempos y NANDA/NOC/NIC
  js/seguimiento.js           5. Seguimiento de pacientes
  js/reportes.js              6. Reportes
  js/main.js                  arranque

Cargar los catálogos completos
  En js/catalogos-enfermeria.js cada catálogo es una lista ["código","DESCRIPCIÓN"].
  Pegue ahí la exportación completa de NANDA, NOC y NIC que usa SIGESAPOL; no hay que tocar nada más.

Prueba sugerida
  1. «Ver como: Nefrólogo» › «+ Registrar paciente», tipo AMBULATORIO, DNI 45678912: se abre la HC inicial.
  2. HOSPITALIZACIÓN DNI 46213578 o EMERGENCIA DNI 47120934 muestran la autorización del médico tratante.
  3. En «4. Registro de atención del día» atienda los 3 tiempos cambiando de perfil. En enfermería use
     «Agregar diagnóstico / NOC / NIC» y escriba en el buscador (por ejemplo «ce» o «hemo»).
