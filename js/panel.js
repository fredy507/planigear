// Código de panel.html (antes en línea; separado para la política de contenido, CSP).
(function(){
  'use strict';
  const GC = 'planigear';
  const REPO = 'fredy507/planigear';

  const EVENTOS = [
    ['descarga-windows-instalador', 'Windows, instalador'],
    ['descarga-windows-portable', 'Windows, portable'],
    ['descarga-linux-deb', 'Linux, .deb'],
    ['descarga-linux-appimage', 'Linux, AppImage'],
    ['donar-kofi', 'Donar en Ko-fi']
  ];
  const PLATAFORMAS = [
    ['Windows, instalador', /instalador.*\.exe/i],
    ['Windows, portable', /portable.*\.zip/i],
    ['Linux, .deb', /\.deb/i],
    ['Linux, AppImage', /\.appimage/i]
  ];

  const $ = id => document.getElementById(id);
  const fmt = n => n === null ? '—' : n.toLocaleString('es-PA');
  function crear(tipo, clase, texto){
    const n = document.createElement(tipo);
    if (clase) n.className = clase;
    if (texto !== undefined) n.textContent = texto;
    return n;
  }
  function aviso(id, texto){ $(id).textContent = texto; $(id).hidden = !texto; }

  // filas: [nombre, número o null si no se pudo leer]
  function pintarBarras(id, filas){
    const max = Math.max(1, ...filas.map(f => f[1] || 0));
    $(id).replaceChildren(...filas.map(([nombre, n]) => {
      const fila = crear('div', 'fila'), linea = crear('div', 'linea');
      linea.append(crear('span', '', nombre), crear('span', 'num', fmt(n)));
      const pista = crear('div', 'pista'), barra = crear('div');
      barra.style.width = ((n || 0) / max * 100) + '%';
      pista.append(barra);
      pista.title = nombre + ': ' + fmt(n);
      fila.append(linea, pista);
      return fila;
    }));
  }

  // --- GoatCounter ---
  function inicio(dias){
    if (!dias) return '';
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - (dias - 1));   // hoy incluido; GoatCounter usa UTC
    return '?start=' + d.toISOString().slice(0, 10);
  }
  function numero(texto){
    const digitos = String(texto === undefined ? '' : texto).replace(/\D/g, '');
    if (!digitos) throw new Error('respuesta inesperada');
    return Number(digitos);
  }
  async function contador(ruta, dias){
    const r = await fetch('https://' + GC + '.goatcounter.com/counter/' + encodeURIComponent(ruta) + '.json' + inicio(dias), {cache: 'no-store'});
    if (r.status === 404 && ruta !== 'TOTAL') return {visitas: 0, unicos: 0};
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = await r.json();
    return {visitas: numero(j.count), unicos: numero(j.count_unique)};
  }

  let turno = 0;   // descarta respuestas de una consulta anterior si se cambió el periodo
  async function cargarVisitas(mio){
    const dias = Number($('periodo').value);
    const res = await Promise.allSettled(['TOTAL', ...EVENTOS.map(e => e[0])].map(r => contador(r, dias)));
    if (mio !== turno) return;
    const dato = (i, campo) => res[i].status === 'fulfilled' ? res[i].value[campo] : null;
    $('k-visitas').textContent = fmt(dato(0, 'visitas'));
    $('k-unicos').textContent = fmt(dato(0, 'unicos'));
    const clics = EVENTOS.map((e, i) => [e[1], dato(i + 1, 'visitas')]);
    $('k-donar').textContent = fmt(clics[EVENTOS.findIndex(e => e[0] === 'donar-kofi')][1]);
    pintarBarras('clics', clics);
    aviso('aviso-gc', res.some(r => r.status === 'rejected')
      ? 'No se pudieron leer todas las visitas. Revise que la cuenta «' + GC + '» exista en GoatCounter y que en Settings esté activado "Allow adding visitor counts on your website".'
      : '');
  }

  // --- GitHub ---
  async function cargarDescargas(mio){
    try {
      const r = await fetch('https://api.github.com/repos/' + REPO + '/releases?per_page=100');
      if (r.status === 403 || r.status === 429) throw new Error('limite');
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const versiones = await r.json();
      if (mio !== turno) return;
      const sumas = PLATAFORMAS.map(() => 0);
      let total = 0, otros = 0;
      const filas = versiones.map(v => {
        let suma = 0;
        (v.assets || []).forEach(a => {
          suma += a.download_count;
          const i = PLATAFORMAS.findIndex(p => p[1].test(a.name));
          if (i >= 0) sumas[i] += a.download_count; else otros += a.download_count;
        });
        total += suma;
        const tr = crear('tr');
        const fecha = v.published_at ? new Date(v.published_at).toLocaleDateString('es-PA', {year: 'numeric', month: 'short', day: 'numeric'}) : '—';
        tr.append(crear('td', '', v.tag_name + (v.prerelease ? ' (prueba)' : '')), crear('td', '', fecha), crear('td', '', fmt(suma)));
        return tr;
      });
      $('k-descargas').textContent = fmt(total);
      const barras = PLATAFORMAS.map((p, i) => [p[0], sumas[i]]);
      if (otros) barras.push(['Otros archivos', otros]);
      pintarBarras('barras', barras);
      $('versiones').replaceChildren(...filas);
      aviso('aviso-gh', '');
    } catch (e) {
      if (mio !== turno) return;
      if ($('k-descargas').textContent === '…') $('k-descargas').textContent = '—';
      aviso('aviso-gh', e.message === 'limite'
        ? 'GitHub alcanzó el límite de consultas. Espere unos minutos y pulse «Actualizar».'
        : 'No se pudieron leer las descargas de GitHub. Revise la conexión y pulse «Actualizar».');
    }
  }

  async function cargar(){
    const mio = ++turno;
    $('actualizar').disabled = true;
    $('hora').textContent = 'Actualizando…';
    ['k-visitas', 'k-unicos', 'k-donar'].forEach(id => { $(id).textContent = '…'; });
    await Promise.all([cargarVisitas(mio), cargarDescargas(mio)]);
    if (mio !== turno) return;
    $('actualizar').disabled = false;
    $('hora').textContent = 'Última actualización: ' + new Date().toLocaleString('es-PA');
  }
  $('actualizar').addEventListener('click', cargar);
  $('periodo').addEventListener('change', cargar);
  cargar();
})();
