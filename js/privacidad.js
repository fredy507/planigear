// Código de privacidad.html (antes en línea; separado para la política de contenido, CSP).
(function(){
  var idioma = 'es';
  try { idioma = localStorage.getItem('idioma') || (navigator.language||'es').slice(0,2); } catch(e){}
  if (idioma !== 'en') idioma = 'es';
  function aplicar(){ document.documentElement.lang = idioma; document.getElementById('idioma').textContent = idioma === 'es' ? 'English' : 'Español'; }
  document.getElementById('idioma').addEventListener('click', function(){ idioma = idioma === 'es' ? 'en' : 'es'; try { localStorage.setItem('idioma', idioma); } catch(e){} aplicar(); });
  aplicar();
})();
