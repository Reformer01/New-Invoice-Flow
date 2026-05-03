const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf-8');

// 1. imports
code = code.replace(
  "import { TemplateClassic, TemplateBold, TemplateElegant } from '../components/InvoiceTemplates';",
  "import { TemplateClassic, TemplateBold, TemplateElegant, TemplateJapandi, TemplateNeoclassical, TemplateBrutalism } from '../components/InvoiceTemplates';"
);

// 2. TEMPLATES
code = code.replace(
  "const TEMPLATES = ['hybrid-classic', 'hybrid-bold', 'hybrid-elegant'] as const;",
  "const TEMPLATES = ['hybrid-classic', 'hybrid-bold', 'hybrid-elegant', 'japandi-ethereal', 'neoclassical-liquid', 'brutalism-coquette'] as const;"
);

// 3. Select options
const optionsReplacement = `<option value="hybrid-classic" className="bg-[var(--bg-primary)]">Hybrid Classic (Bauhaus + Deco)</option>
                  <option value="hybrid-bold" className="bg-[var(--bg-primary)]">Hybrid Bold (Structural)</option>
                  <option value="hybrid-elegant" className="bg-[var(--bg-primary)]">Hybrid Elegant (Opulent)</option>
                  <option value="japandi-ethereal" className="bg-[var(--bg-primary)]">Japandi Ethereal (Minimal + Glow)</option>
                  <option value="neoclassical-liquid" className="bg-[var(--bg-primary)]">Neoclassical Liquid Glass</option>
                  <option value="brutalism-coquette" className="bg-[var(--bg-primary)]">Brutalism Coquette (Raw + Soft)</option>`;
                  
code = code.replace(
  /<option value="hybrid-classic" className="bg-\[var\(--bg-primary\)\]">Hybrid Classic \(Bauhaus \+ Deco\)<\/option>[\s\S]*?<option value="hybrid-elegant" className="bg-\[var\(--bg-primary\)\]">Hybrid Elegant \(Opulent\)<\/option>/,
  optionsReplacement
);

// 4. Conditional Rendering
const renderReplacement = `{template === 'hybrid-classic' && <TemplateClassic invoice={invoice} logo={logo} finalTotal={finalTotal} />}
             {template === 'hybrid-bold' && <TemplateBold invoice={invoice} logo={logo} finalTotal={finalTotal} />}
             {template === 'hybrid-elegant' && <TemplateElegant invoice={invoice} logo={logo} finalTotal={finalTotal} />}
             {template === 'japandi-ethereal' && <TemplateJapandi invoice={invoice} logo={logo} finalTotal={finalTotal} />}
             {template === 'neoclassical-liquid' && <TemplateNeoclassical invoice={invoice} logo={logo} finalTotal={finalTotal} />}
             {template === 'brutalism-coquette' && <TemplateBrutalism invoice={invoice} logo={logo} finalTotal={finalTotal} />}`;

code = code.replace(
  /\{template === 'hybrid-classic' && <TemplateClassic invoice=\{invoice\} logo=\{logo\} finalTotal=\{finalTotal\} \/>\}[\s\S]*?\{template === 'hybrid-elegant' && <TemplateElegant invoice=\{invoice\} logo=\{logo\} finalTotal=\{finalTotal\} \/>\}/,
  renderReplacement
);

fs.writeFileSync('app/page.tsx', code);
console.log('Patched app/page.tsx');
