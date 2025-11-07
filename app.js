(async () => {
  const data = await fetch('data/packs.json').then(r => r.json());
  const templateText = await fetch('templates/card.mustache').then(r => r.text());
  const gallery = document.getElementById('gallery');
  const filtersDiv = document.getElementById('filters');

  const unique = (key) => [...new Set(data.map(item => item[key]))];

  const versionFilter = document.createElement('select');
  versionFilter.innerHTML = `<option value="">All Versions</option>` +
    unique('version').map(v => `<option value="${v}">${v}</option>`).join('');
  versionFilter.className = "bg-gray-800 border border-gray-700 rounded p-2 text-white";
  filtersDiv.appendChild(versionFilter);

  const variantFilter = document.createElement('select');
  variantFilter.innerHTML = `<option value="">All Variants</option>` +
    unique('variant').map(v => `<option value="${v}">${v}</option>`).join('');
  variantFilter.className = "bg-gray-800 border border-gray-700 rounded p-2 text-white";
  filtersDiv.appendChild(variantFilter);

  const bgFilter = document.createElement('select');
  bgFilter.innerHTML = `<option value="">Any Background</option>` +
    unique('has_background').map(v => `<option value="${v}">${v}</option>`).join('');
  bgFilter.className = "bg-gray-800 border border-gray-700 rounded p-2 text-white";
  filtersDiv.appendChild(bgFilter);

  const render = () => {
    const filtered = data.filter(item =>
      (!versionFilter.value || item.version === versionFilter.value) &&
      (!variantFilter.value || item.variant === variantFilter.value) &&
      (!bgFilter.value || String(item.has_background) === bgFilter.value)
    );
    gallery.innerHTML = filtered.map(item =>
      Mustache.render(templateText, item)
    ).join('');
  };

  versionFilter.addEventListener('change', render);
  variantFilter.addEventListener('change', render);
  bgFilter.addEventListener('change', render);

  render();
})();