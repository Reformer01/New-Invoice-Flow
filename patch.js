const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf-8');

const startIndex = code.indexOf('{/* Art Deco Motif - Corner steps */}');
const endIndex = code.indexOf('          </div>\n        </section>');

if (startIndex > -1 && endIndex > -1) {
  const newContent = `
             {template === 'hybrid-classic' && <TemplateClassic invoice={invoice} logo={logo} finalTotal={finalTotal} />}
             {template === 'hybrid-bold' && <TemplateBold invoice={invoice} logo={logo} finalTotal={finalTotal} />}
             {template === 'hybrid-elegant' && <TemplateElegant invoice={invoice} logo={logo} finalTotal={finalTotal} />}

`;
  code = code.substring(0, startIndex) + newContent + code.substring(endIndex);
  fs.writeFileSync('app/page.tsx', code);
  console.log("Patched successfully!");
} else {
  console.log("Could not find targets");
}
