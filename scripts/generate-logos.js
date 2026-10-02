const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");

// 1. Stacked 3-Line White Wordmark (Dark Mode / Dark Surfaces)
const typographyWhiteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240" fill="none">
  <text x="0" y="65" font-family="'Helvetica Now', 'Helvetica Neue', Helvetica, Arial, sans-serif" font-weight="900" font-size="64" fill="#FFFFFF" letter-spacing="-0.03em">THE</text>
  <text x="0" y="145" font-family="'Helvetica Now', 'Helvetica Neue', Helvetica, Arial, sans-serif" font-weight="900" font-size="64" fill="#FFFFFF" letter-spacing="-0.03em">GRAVITY</text>
  <text x="0" y="225" font-family="'Helvetica Now', 'Helvetica Neue', Helvetica, Arial, sans-serif" font-weight="900" font-size="64" fill="#FFFFFF" letter-spacing="-0.03em">STUDIOS<tspan fill="#F924EF">.</tspan></text>
</svg>`;

// 2. Stacked 3-Line Black Wordmark (Light Mode / Light Surfaces)
const typographyBlackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240" fill="none">
  <text x="0" y="65" font-family="'Helvetica Now', 'Helvetica Neue', Helvetica, Arial, sans-serif" font-weight="900" font-size="64" fill="#0A0A0A" letter-spacing="-0.03em">THE</text>
  <text x="0" y="145" font-family="'Helvetica Now', 'Helvetica Neue', Helvetica, Arial, sans-serif" font-weight="900" font-size="64" fill="#0A0A0A" letter-spacing="-0.03em">GRAVITY</text>
  <text x="0" y="225" font-family="'Helvetica Now', 'Helvetica Neue', Helvetica, Arial, sans-serif" font-weight="900" font-size="64" fill="#0A0A0A" letter-spacing="-0.03em">STUDIOS<tspan fill="#C610BD">.</tspan></text>
</svg>`;

fs.writeFileSync(path.join(publicDir, "logo-typography-white.svg"), typographyWhiteSvg);
fs.writeFileSync(path.join(publicDir, "logo-typography-black.svg"), typographyBlackSvg);

console.log("Stacked 3-line typography logo SVGs updated in public/");
