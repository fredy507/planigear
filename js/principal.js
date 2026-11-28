// Código de index.html (antes en línea; separado para la política de contenido, CSP).
(function(){
  // --- Idioma (es/en), recordado en este navegador ---
  var idioma = 'es';
  try { idioma = localStorage.getItem('idioma') || (navigator.language||'es').slice(0,2); } catch(e){}
  if (idioma !== 'en') idioma = 'es';
  function aplicar(){
    document.documentElement.lang = idioma;
    document.querySelectorAll('[data-es]').forEach(function(n){ n.textContent = n.getAttribute('data-'+idioma); });
    document.querySelectorAll('[data-es-html]').forEach(function(n){ n.innerHTML = n.getAttribute('data-'+idioma+'-html'); });
    document.getElementById('idioma').textContent = idioma === 'es' ? 'English' : 'Español';
    pintarVersion();
  }
  document.getElementById('idioma').addEventListener('click', function(){
    idioma = idioma === 'es' ? 'en' : 'es';
    try { localStorage.setItem('idioma', idioma); } catch(e){}
    aplicar();
  });

  // --- Enlaces directos a la última versión publicada ---
  var version = null;
  function pintarVersion(){
    if (!version) return;
    var nota = document.getElementById('nota-version');
    nota.textContent = (idioma === 'es' ? 'Versión ' : 'Version ') + version + ' · ' + nota.getAttribute('data-'+idioma);
  }
  function mb(b){ return (b/1048576).toFixed(0) + ' MB'; }
  fetch('https://api.github.com/repos/fredy507/planigear/releases/latest')
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(rel){
      if (!rel || !rel.assets) return;
      version = (rel.tag_name || '').replace(/^v/, '');
      document.querySelectorAll('.descarga[data-sufijo]').forEach(function(a){
        var suf = a.getAttribute('data-sufijo');
        var asset = rel.assets.filter(function(x){ return x.name.slice(-suf.length) === suf; })[0];
        if (asset){
          a.href = asset.browser_download_url;
          a.querySelector('.archivo').textContent = asset.name + ' · ' + mb(asset.size);
        }
      });
      // Botón principal: directo al instalador del sistema del visitante.
      var ua = navigator.userAgent, suf = /Windows/.test(ua) ? 'windows-instalador.exe' : /Linux/.test(ua) && !/Android/.test(ua) ? 'linux-amd64.deb' : null;
      var destino = suf && document.querySelector('.descarga[data-sufijo="'+suf+'"]');
      if (destino && destino.href.indexOf('/download/') > 0){
        var b = document.getElementById('boton-principal');
        b.href = destino.href;
        // Medición: el botón cuenta como el archivo al que apunta ahora. Si count.js ya cargó,
        // hay que volver a enlazar (al cargar, el botón aún no tenía el atributo).
        b.setAttribute('data-goatcounter-click', destino.getAttribute('data-goatcounter-click'));
        if (window.goatcounter && window.goatcounter.bind_events) window.goatcounter.bind_events();
        b.setAttribute('data-es', suf.indexOf('windows') === 0 ? 'Descargar para Windows' : 'Descargar para Linux');
        b.setAttribute('data-en', suf.indexOf('windows') === 0 ? 'Download for Windows' : 'Download for Linux');
      }
      aplicar();
    })
    .catch(function(){});

  // --- Planigear móvil: el APK más nuevo entre todas las releases (no es la «latest») ---
  fetch('https://api.github.com/repos/fredy507/planigear/releases?per_page=30')
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(rels){
      if (!rels) return;
      var mejor = null;
      function num(v){ return v.split('.').map(Number); }
      function mayor(a, b){ a = num(a); b = num(b); for (var i = 0; i < Math.max(a.length, b.length); i++){ var d = (a[i]||0) - (b[i]||0); if (d) return d > 0; } return false; }
      rels.forEach(function(rel){
        if (rel.draft || rel.prerelease) return;
        (rel.assets || []).forEach(function(x){
          var m = /^planigear-movil-(\d+(?:\.\d+)*)-android\.apk$/.exec(x.name);
          if (m && (!mejor || mayor(m[1], mejor.v))) mejor = { v: m[1], a: x };
        });
      });
      if (!mejor) return;
      var t = document.getElementById('descarga-android');
      t.href = mejor.a.browser_download_url;
      t.querySelector('.archivo').textContent = mejor.a.name + ' · ' + mb(mejor.a.size);
      t.style.display = '';
      var b = document.getElementById('boton-android');
      b.href = mejor.a.browser_download_url;
      b.style.display = '';
      // En un celular Android, el botón principal baja directo el APK.
      if (/Android/.test(navigator.userAgent)){
        var p = document.getElementById('boton-principal');
        p.href = mejor.a.browser_download_url;
        p.setAttribute('data-goatcounter-click', 'descarga-android-principal');
        p.setAttribute('data-es', 'Descargar para Android');
        p.setAttribute('data-en', 'Download for Android');
        p.textContent = p.getAttribute('data-' + idioma);
        b.style.display = 'none';
      }
    })
    .catch(function(){});

  // --- Contacto: mensaje de mejora o error (sitio estático: se arma un mailto:) ---
  var CORREO = 'contact@planigear.com';
  var TXT = {
    es: {
      asunto: { error: 'Error en Planigear: ', mejora: 'Mejora para Planigear: ' },
      ayuda: { error: 'Diga qué hizo, qué pasó y qué esperaba. Si puede, adjunte una captura en el correo.',
               mejora: 'Cuente qué le gustaría que hiciera el programa y para qué trabajo le sirve.' },
      plantilla: { error: 'Qué estaba haciendo:\n\nQué pasó:\n\nQué esperaba:\n\nVersión de Planigear y sistema (Windows/Linux):\n',
                   mejora: 'Qué me gustaría que hiciera Planigear:\n\nPara qué me sirve en mi trabajo:\n' },
      sistema: 'Se agregará al final: ', faltaAsunto: 'Escriba un asunto.', faltaTexto: 'Escriba el mensaje.',
      abierto: 'Si no se abrió su correo, use «Copiar el mensaje» y péguelo en un correo a ' + CORREO + '.',
      copiado: 'Mensaje copiado. Péguelo en un correo a ' + CORREO + '.',
      noCopiado: 'No se pudo copiar. Seleccione el texto del mensaje y cópielo a mano.',
      pie: 'Enviado desde planigear.com'
    },
    en: {
      asunto: { error: 'Planigear bug: ', mejora: 'Planigear improvement: ' },
      ayuda: { error: 'Tell us what you did, what happened and what you expected. Attach a screenshot to the email if you can.',
               mejora: 'Tell us what you would like the program to do and what work it helps with.' },
      plantilla: { error: 'What I was doing:\n\nWhat happened:\n\nWhat I expected:\n\nPlanigear version and system (Windows/Linux):\n',
                   mejora: 'What I would like Planigear to do:\n\nHow it helps my work:\n' },
      sistema: 'Added at the end: ', faltaAsunto: 'Write a subject.', faltaTexto: 'Write the message.',
      abierto: 'If your email app did not open, use “Copy message” and paste it into an email to ' + CORREO + '.',
      copiado: 'Message copied. Paste it into an email to ' + CORREO + '.',
      noCopiado: 'Could not copy. Select the message text and copy it by hand.',
      pie: 'Sent from planigear.com'
    }
  };
  var dlg = document.getElementById('mensaje'), fAsunto = document.getElementById('msj-asunto'),
      fTexto = document.getElementById('msj-texto'), fEstado = document.getElementById('msj-estado');
  function tipoActual(){ var r = dlg.querySelector('input[name=tipo]:checked'); return r ? r.value : 'mejora'; }
  function sistema(){
    var ua = navigator.userAgent;
    var so = /Windows/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Mac/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : '?';
    return so + (version ? ' · web v' + version : '');
  }
  // Cambiar de tipo reemplaza el texto solo si todavía es una plantilla sin tocar.
  function prepararTipo(tipo, forzar){
    var t = TXT[idioma];
    var esPlantilla = !fTexto.value || [TXT.es, TXT.en].some(function(x){ return fTexto.value === x.plantilla.error || fTexto.value === x.plantilla.mejora; });
    var asuntoVacio = !fAsunto.value || [TXT.es, TXT.en].some(function(x){ return fAsunto.value === x.asunto.error || fAsunto.value === x.asunto.mejora; });
    if (forzar || esPlantilla) fTexto.value = t.plantilla[tipo];
    if (forzar || asuntoVacio) fAsunto.value = t.asunto[tipo];
    document.getElementById('msj-ayuda').textContent = t.ayuda[tipo];
    document.getElementById('msj-sistema').textContent = t.sistema + sistema();
  }
  function textoCompleto(){ return fTexto.value.trim() + '\n\n---\n' + TXT[idioma].pie + ' · ' + sistema(); }
  function abrirMensaje(tipo){
    dlg.querySelector('input[name=tipo][value=' + tipo + ']').checked = true;
    fEstado.textContent = '';
    prepararTipo(tipo, false);
    dlg.showModal();
    fAsunto.focus(); fAsunto.setSelectionRange(fAsunto.value.length, fAsunto.value.length);
  }
  document.querySelectorAll('[data-abrir-mensaje]').forEach(function(b){
    b.addEventListener('click', function(ev){ ev.preventDefault(); abrirMensaje(b.getAttribute('data-abrir-mensaje')); });
  });
  dlg.querySelectorAll('input[name=tipo]').forEach(function(r){ r.addEventListener('change', function(){ prepararTipo(tipoActual(), false); }); });
  document.getElementById('msj-cerrar').addEventListener('click', function(){ dlg.close(); });
  dlg.addEventListener('click', function(ev){ if (ev.target === dlg) dlg.close(); }); // clic fuera = cerrar
  function validar(){
    var t = TXT[idioma], tipo = tipoActual();
    if (!fAsunto.value.trim() || fAsunto.value === t.asunto[tipo]) { fEstado.textContent = t.faltaAsunto; fAsunto.focus(); return false; }
    if (!fTexto.value.trim() || fTexto.value === t.plantilla[tipo]) { fEstado.textContent = t.faltaTexto; fTexto.focus(); return false; }
    return true;
  }
  document.getElementById('form-mensaje').addEventListener('submit', function(ev){
    ev.preventDefault();
    if (!validar()) return;
    var url = 'mailto:' + CORREO + '?subject=' + encodeURIComponent(fAsunto.value.trim()) + '&body=' + encodeURIComponent(textoCompleto());
    if (window.goatcounter && window.goatcounter.count) { try { window.goatcounter.count({ path: 'mensaje-' + tipoActual(), event: true }); } catch(e){} }
    window.location.href = url;
    fEstado.textContent = TXT[idioma].abierto;
  });
  document.getElementById('msj-copiar').addEventListener('click', function(){
    var t = TXT[idioma], todo = CORREO + '\n' + fAsunto.value.trim() + '\n\n' + textoCompleto();
    var ok = function(){ fEstado.textContent = t.copiado; }, mal = function(){ fEstado.textContent = t.noCopiado; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(todo).then(ok, mal); else mal();
  });

  // --- Visor de capturas ---
  var visor = document.getElementById('visor');
  document.querySelectorAll('.galeria img').forEach(function(img){
    img.addEventListener('click', function(){ visor.querySelector('img').src = img.src; visor.showModal(); });
  });
  visor.addEventListener('click', function(){ visor.close(); });

  aplicar();
})();
