const fs = require('fs');

// Patch app/page.tsx
let pageCode = fs.readFileSync('app/page.tsx', 'utf-8');

// 1. Add bankDetails to initial state
pageCode = pageCode.replace(
  "notes: 'PAYMENT DUE WITHIN 14 DAYS. THANK YOU FOR YOUR BUSINESS.',",
  "notes: 'PAYMENT DUE WITHIN 14 DAYS. THANK YOU FOR YOUR BUSINESS.',\n    bankDetails: '',"
);

// 2. Add bankDetails to createNew
pageCode = pageCode.replace(
  "currency: 'NGN',",
  "currency: 'NGN',\n      bankDetails: '',"
);

// 3. Add bank details input field (next to notes)
const notesSectionStr = `<fieldset className="p-5">
                <legend className="text-xs uppercase font-bold tracking-widest text-[var(--accent)] mb-4">
                  Remarks / Notes
                </legend>
                <textarea 
                  className="w-full bg-transparent border-b border-[var(--border)] py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors resize-none" 
                  rows={2}
                  value={invoice.notes}
                  onChange={e => setInvoice({ ...invoice, notes: e.target.value })}
                ></textarea>
              </fieldset>`;

const newNotesSectionStr = `<fieldset className="p-5">
                <legend className="text-xs uppercase font-bold tracking-widest text-[var(--accent)] mb-4">
                  Remarks / Notes
                </legend>
                <textarea 
                  className="w-full bg-transparent border-b border-[var(--border)] py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors resize-none mb-6" 
                  rows={2}
                  value={invoice.notes}
                  onChange={e => setInvoice({ ...invoice, notes: e.target.value })}
                ></textarea>

                <legend className="text-xs uppercase font-bold tracking-widest text-[var(--accent)] mb-4">
                  Bank Details
                </legend>
                <textarea 
                  className="w-full bg-transparent border-b border-[var(--border)] py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors resize-none" 
                  rows={3}
                  placeholder="Bank Name&#10;Account Name&#10;Account Number"
                  value={invoice.bankDetails || ''}
                  onChange={e => setInvoice({ ...invoice, bankDetails: e.target.value })}
                ></textarea>
              </fieldset>`;

pageCode = pageCode.replace(notesSectionStr, newNotesSectionStr);

fs.writeFileSync('app/page.tsx', pageCode);

// Patch components/InvoiceTemplates.tsx
let tplCode = fs.readFileSync('components/InvoiceTemplates.tsx', 'utf-8');

// Add to props definition
tplCode = tplCode.replace(
  "notes: string;",
  "notes: string;\n    bankDetails?: string;"
);

// 1. TemplateClassic
tplCode = tplCode.replace(
  `<p className="font-serif text-sm italic max-w-sm mx-auto">
            {invoice.notes}
          </p>
        </div>`,
  `<p className="font-serif text-sm italic max-w-sm mx-auto mb-4">
            {invoice.notes}
          </p>
          {invoice.bankDetails && (
            <>
              <p className="font-sans text-[10px] uppercase tracking-widest font-bold mb-2">Payment Details</p>
              <p className="font-sans text-xs whitespace-pre-wrap max-w-sm mx-auto">{invoice.bankDetails}</p>
            </>
          )}
        </div>`
);

// 2. TemplateBold
tplCode = tplCode.replace(
  `<p className="font-mono text-sm leading-relaxed opacity-80 uppercase">{invoice.notes}</p>
          </div>
        )}`,
  `<p className="font-mono text-sm leading-relaxed opacity-80 uppercase">{invoice.notes}</p>
          </div>
        )}
        {invoice.bankDetails && (
          <div className="border-l-4 border-[var(--tx-primary)] pl-4">
            <p className="font-bold text-[10px] tracking-widest uppercase mb-1">Bank Details</p>
            <p className="font-mono text-xs whitespace-pre-wrap">{invoice.bankDetails}</p>
          </div>
        )}`
);

// 3. TemplateElegant
tplCode = tplCode.replace(
  `<td colSpan={2} className="py-8">
                    {invoice.notes && (
                      <p className="font-serif italic text-sm opacity-60 text-center max-w-sm">"{invoice.notes}"</p>
                    )}
                 </td>`,
  `<td colSpan={2} className="py-8">
                    {invoice.notes && (
                      <p className="font-serif italic text-sm opacity-60 text-left mb-4">"{invoice.notes}"</p>
                    )}
                    {invoice.bankDetails && (
                      <div className="text-left mt-4 opacity-80">
                        <p className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold mb-1">Payment Information</p>
                        <p className="font-serif text-xs whitespace-pre-wrap">{invoice.bankDetails}</p>
                      </div>
                    )}
                 </td>`
);

// 4. TemplateJapandi
tplCode = tplCode.replace(
  `{invoice.notes && (
          <div className="pt-12 mt-12 text-center opacity-50">
            <p className="text-xs max-w-md mx-auto whitespace-pre-wrap leading-relaxed italic">{invoice.notes}</p>
          </div>
        )}`,
  `<div className="pt-12 mt-12 grid grid-cols-2 gap-8 text-sm opacity-60">
          <div>
            {invoice.bankDetails && (
              <>
                <p className="text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">Transfer To</p>
                <p className="whitespace-pre-wrap inline-block leading-relaxed">{invoice.bankDetails}</p>
              </>
            )}
          </div>
          <div className="text-right">
             {invoice.notes && (
               <p className="whitespace-pre-wrap leading-relaxed italic">{invoice.notes}</p>
             )}
          </div>
        </div>`
);

// 5. TemplateNeoclassical
tplCode = tplCode.replace(
  `{invoice.notes && (
          <div className="mt-8 pt-8 border-t border-[var(--tx-primary)]/20 text-center">
            <p className="font-sans text-xs uppercase tracking-[0.3em] opacity-50 mb-2">Remarks</p>
            <p className="italic opacity-80 text-sm max-w-lg mx-auto">{invoice.notes}</p>
          </div>
        )}`,
  `<div className="mt-8 pt-8 border-t border-[var(--tx-primary)]/20 grid grid-cols-2 gap-8">
          {invoice.bankDetails && (
            <div className="text-left">
              <p className="font-sans text-[9px] uppercase tracking-[0.3em] opacity-50 mb-2">Bank Details</p>
              <p className="opacity-80 text-sm whitespace-pre-wrap font-sans">{invoice.bankDetails}</p>
            </div>
          )}
          {invoice.notes && (
            <div className={invoice.bankDetails ? "text-right" : "text-center col-span-2"}>
              <p className="font-sans text-[9px] uppercase tracking-[0.3em] opacity-50 mb-2">Remarks</p>
              <p className="italic opacity-80 text-sm">{invoice.notes}</p>
            </div>
          )}
        </div>`
);

// 6. TemplateBrutalism
tplCode = tplCode.replace(
  `{invoice.notes && (
            <div className="border-4 border-black dark:border-white p-4 font-mono font-bold uppercase relative bg-white dark:bg-black">
              <div className="absolute -top-3 left-4 bg-[var(--bg-primary)] px-2 font-bold text-[10px] tracking-widest uppercase">Remarks</div>
              {invoice.notes}
            </div>
          )}`,
  `{invoice.notes && (
            <div className="border-4 border-black dark:border-white p-4 font-mono font-bold uppercase relative bg-white dark:bg-black mb-4">
              <div className="absolute -top-3 left-4 bg-[var(--bg-primary)] px-2 font-bold text-[10px] tracking-widest uppercase">Remarks</div>
              {invoice.notes}
            </div>
          )}
          {invoice.bankDetails && (
            <div className="border-4 border-black dark:border-white p-4 font-mono font-bold uppercase relative bg-[var(--accent)] text-white">
              <div className="absolute -top-3 left-4 bg-black dark:bg-white text-white dark:text-black px-2 font-bold text-[10px] tracking-widest uppercase">Bank Details</div>
              <div className="whitespace-pre-wrap">{invoice.bankDetails}</div>
            </div>
          )}`
);

fs.writeFileSync('components/InvoiceTemplates.tsx', tplCode);
console.log('Patched correctly');
