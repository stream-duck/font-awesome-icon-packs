(async () => {
    const data = await fetch('data/packs.json').then(r => r.json());
    const templateText = await fetch('templates/card.mustache').then(r => r.text());
    const gallery = document.getElementById('gallery');
    const filtersDiv = document.getElementById('filters');

    let selected_version;

    const versionFilter = document.createElement('select');
    versionFilter.innerHTML = Object.keys(data).map(v => `<option value="${v}">${v}</option>`).join('');
    versionFilter.className = "bg-gray-800 border border-gray-700 rounded p-2 text-white";
    filtersDiv.appendChild(versionFilter);

    const fontFilter = document.createElement('select');
    fontFilter.innerHTML = `<option value="">All Fonts</option>`
    fontFilter.className = "bg-gray-800 border border-gray-700 rounded p-2 text-white";
    filtersDiv.appendChild(fontFilter);

    const colorFilter = document.createElement('select');
    colorFilter.innerHTML = `<option value="">All Colors</option>`
    colorFilter.className = "bg-gray-800 border border-gray-700 rounded p-2 text-white";
    filtersDiv.appendChild(colorFilter);

    const backgroundFilter = document.createElement('select');
    backgroundFilter.innerHTML = `<option value="">All Backgrounds</option><option value="1">With Background</option><option value="0">Without Background</option>`
    backgroundFilter.className = "bg-gray-800 border border-gray-700 rounded p-2 text-white";
    filtersDiv.appendChild(backgroundFilter);

    const render = () => {
        const version = data[versionFilter.value];

        if (versionFilter.value !== selected_version) {
            const fonts = Object.fromEntries(version.map(font => [font.font_id, font.font_name]));
            const colors = Object.fromEntries(version.map(font => [font.color_id, font.color_name]));

            fontFilter.innerHTML = `<option value="">All Fonts</option>` +
                Object.keys(fonts).map(font_id => `<option value="${font_id}">${fonts[font_id]}</option>`).join('');

            colorFilter.innerHTML = `<option value="">All Colors</option>` +
                Object.keys(colors).map(color_id => `<option value="${color_id}">${colors[color_id]}</option>`).join('');

            selected_version = versionFilter.value;
        }

        const filtered = version.filter(font =>
            (!fontFilter.value || font.font_id === fontFilter.value) &&
            (!colorFilter.value || font.color_id === colorFilter.value) &&
            (!backgroundFilter.value || font.background === (backgroundFilter.value === "1")) &&
            true
        );
        gallery.innerHTML = filtered.map(font =>
            Mustache.render(templateText, {"version": versionFilter.value, "font": font})
        ).join('');
    };

    versionFilter.addEventListener('change', render);
    fontFilter.addEventListener('change', render);
    colorFilter.addEventListener('change', render);
    backgroundFilter.addEventListener('change', render);

    render();
})();