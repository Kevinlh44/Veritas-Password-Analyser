const fs = require('fs');
let html = fs.readFileSync('raw_ui.html', 'utf8');

// Basic conversions
html = html.replace(/class=/g, 'className=');
html = html.replace(/onclick=/g, 'onClick=');
html = html.replace(/oninput=/g, 'onChange=');
html = html.replace(/stroke-width=/g, 'strokeWidth=');
html = html.replace(/stroke-linecap=/g, 'strokeLinecap=');
html = html.replace(/stroke-linejoin=/g, 'strokeLinejoin=');
html = html.replace(/<!--(.*?)-->/gs, '{/* $1 */}');
html = html.replace(/<input([^>]*?[^\/])>/g, '<input$1 />');

// Style conversions
html = html.replace(/style="([^"]+)"/g, (match, p1) => {
  const parts = p1.split(';').filter(p => p.trim() !== '');
  const obj = {};
  parts.forEach(p => {
    let [key, val] = p.split(':');
    if (!key || !val) return;
    key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
    obj[key] = val.trim();
  });
  return `style={${JSON.stringify(obj)}}`;
});

fs.writeFileSync('raw_ui.jsx', html);
console.log('Conversion done.');
