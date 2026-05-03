import React from 'react';
import { Square, Circle } from 'lucide-react';

type InvoiceItem = {
  id: string;
  desc: string;
  qty: number;
  price: number;
};

type TemplateProps = {
  invoice: {
    id: string;
    date: string;
    dueDate: string;
    clientName: string;
    clientAddress: string;
    clientEmail: string;
    currency: string;
    notes: string;
    items: InvoiceItem[];
  };
  logo: string | null;
  finalTotal: number;
};

export const TemplateClassic: React.FC<TemplateProps> = ({ invoice, logo, finalTotal }) => {
  return (
    <>
      {/* Art Deco Motif - Corner steps */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[var(--tx-primary)] m-4 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[var(--tx-primary)] m-4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[var(--tx-primary)] m-4 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[var(--tx-primary)] m-4 pointer-events-none"></div>

      {/* Double gold stroke inner border */}
      <div className="absolute inset-8 border border-[var(--accent)] pointer-events-none opacity-50"></div>
      <div className="absolute inset-[36px] border border-[var(--accent)] pointer-events-none opacity-20"></div>

      <div className="relative z-10 px-8 py-8">
        
        {/* HEADER */}
        <div className="flex flex-col items-center mb-16 text-center">
          {logo && <img src={logo} alt="Company Logo" className="h-16 w-auto object-contain mb-6" />}
          <div className="h-[2px] w-16 bg-[var(--accent)] mb-6"></div>
          <h2 className="text-6xl md:text-7xl font-serif font-black tracking-tight m-0 leading-none">
            INVOICE
          </h2>
          <div className="mt-4 font-sans text-xs tracking-[0.3em] uppercase opacity-70">
            NO. {invoice.id}
          </div>
        </div>

        {/* META DATA GRID (Bauhaus Structure) */}
        <div className="grid grid-cols-2 gap-0 border-y border-[var(--border)] mb-12">
          
          {/* Left Block */}
          <div className="p-6 border-r border-[var(--border)]">
            <h3 className="font-sans text-[10px] uppercase tracking-widest text-[var(--accent)] font-bold mb-4 flex items-center gap-2">
              <Square size={6} fill="currentColor"/> Bill To
            </h3>
            <div className="font-serif text-2xl font-bold leading-tight mb-2">
              {invoice.clientName || '——'}
            </div>
            <p className="font-sans text-sm opacity-80 whitespace-pre-wrap">
              {invoice.clientAddress || '——'}
            </p>
            {invoice.clientEmail && (
              <p className="font-sans text-xs mt-2 opacity-60">
                {invoice.clientEmail}
              </p>
            )}
          </div>

          {/* Right Block */}
          <div className="p-6 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-sans text-[10px] uppercase tracking-widest text-[var(--accent)] font-bold mb-2">Date</h3>
                <p className="font-sans text-sm font-bold">{invoice.date}</p>
              </div>
              <div>
                <h3 className="font-sans text-[10px] uppercase tracking-widest text-[var(--accent)] font-bold mb-2">Due</h3>
                <p className="font-sans text-sm font-bold">{invoice.dueDate}</p>
              </div>
              <div className="col-span-2">
                <h3 className="font-sans text-[10px] uppercase tracking-widest text-[var(--accent)] font-bold mb-2">Total Due</h3>
                <p className="font-serif text-3xl font-bold">
                  {invoice.currency} {finalTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* TABLE */}
        <table className="w-full text-left font-sans text-sm mb-12">
          <thead className="border-b-2 border-[var(--border)]">
            <tr>
              <th className="py-3 font-bold uppercase tracking-widest text-[10px] opacity-70">Item</th>
              <th className="py-3 font-bold uppercase tracking-widest text-[10px] opacity-70 text-center">Qty</th>
              <th className="py-3 font-bold uppercase tracking-widest text-[10px] opacity-70 text-right">Price</th>
              <th className="py-3 font-bold uppercase tracking-widest text-[10px] opacity-70 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] divide-dotted">
            {invoice.items.map(it => {
              const rowVal = it.qty * it.price;
              return (
                <tr key={it.id}>
                  <td className="py-5 pr-4">
                    <div className="font-bold flex items-start gap-2">
                      <span className="text-[var(--accent)] mt-[2px]"><Circle size={6} fill="currentColor"/></span>
                      {it.desc || '——'}
                    </div>
                  </td>
                  <td className="py-5 text-center">{it.qty}</td>
                  <td className="py-5 text-right opacity-80">{it.price}</td>
                  <td className="py-5 text-right font-bold">{(rowVal).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* TOTALS */}
        <div className="flex justify-end border-t border-[var(--border)] pt-8 mb-16">
          <div className="w-full md:w-1/2">
            <div className="flex justify-between py-2 border-b border-[var(--border)] opacity-80">
              <span className="text-xs uppercase tracking-widest font-bold">Subtotal</span>
              <span className="font-bold">{(finalTotal).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between py-4 border-b-2 border-[var(--border)] text-[var(--accent)] font-bold">
              <span className="text-xs uppercase tracking-widest">Grand Total</span>
              <span className="font-serif text-2xl text-[var(--tx-primary)]">
                {invoice.currency} {finalTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER / REMARKS */}
        <div className="text-center opacity-70 flex flex-col items-center">
          <div className="h-[2px] w-16 bg-[var(--border)] mb-4"></div>
          <p className="font-sans text-xs uppercase tracking-widest font-bold mb-2">Remarks</p>
          <p className="font-serif text-sm italic max-w-sm mx-auto">
            {invoice.notes}
          </p>
        </div>

      </div>
    </>
  );
};

export const TemplateBold: React.FC<TemplateProps> = ({ invoice, logo, finalTotal }) => {
  return (
    <>
      {/* Heavy Bauhaus Grid Layout */}
      <div className="absolute inset-4 border-4 border-[var(--tx-primary)] pointer-events-none"></div>
      
      <div className="relative z-10 px-8 py-8 flex flex-col h-full space-y-12">
        {/* HEADER */}
        <div className="grid grid-cols-2 gap-8 items-end border-b-4 border-[var(--tx-primary)] pb-8">
          <div>
            {logo ? <img src={logo} alt="Company Logo" className="h-20 w-auto object-contain mb-4" /> : <div className="h-20 w-20 bg-[var(--accent)] mb-4 flex items-center justify-center text-[var(--bg-primary)] font-bold text-4xl">L</div>}
            <div className="font-sans text-xs tracking-widest uppercase font-bold text-[var(--accent)]">Invoice No.</div>
            <div className="font-sans text-3xl font-black mt-1 uppercase">{invoice.id}</div>
          </div>
          <div className="text-right">
            <h2 className="text-7xl font-sans font-black tracking-tighter uppercase leading-none">
              INVOICE
            </h2>
            <div className="flex justify-end gap-1 mt-2">
              <div className="w-4 h-4 bg-[var(--tx-primary)]"></div>
              <div className="w-4 h-4 bg-[var(--accent)]"></div>
              <div className="w-4 h-4 border border-[var(--tx-primary)]"></div>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-2 gap-8 border-b-4 border-[var(--tx-primary)] pb-12">
          <div className="flex flex-col gap-4">
             <div className="bg-[var(--tx-primary)] text-[var(--bg-primary)] inline-block px-3 py-1 font-bold text-[10px] tracking-widest uppercase self-start">Billed To</div>
             <div>
               <h3 className="font-serif text-3xl font-bold mb-2 break-words">{invoice.clientName || '——'}</h3>
               <p className="font-sans text-sm opacity-80 whitespace-pre-wrap">{invoice.clientAddress || '——'}</p>
               <p className="font-sans text-xs pt-2 font-bold underline decoration-[var(--accent)]">{invoice.clientEmail}</p>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-y-8 gap-x-4">
             <div>
               <p className="font-bold text-[10px] tracking-widest uppercase text-[var(--accent)]">Date</p>
               <p className="font-sans text-xl font-bold mt-1">{invoice.date}</p>
             </div>
             <div>
               <p className="font-bold text-[10px] tracking-widest uppercase text-[var(--accent)]">Due Date</p>
               <p className="font-sans text-xl font-bold mt-1">{invoice.dueDate}</p>
             </div>
             <div className="col-span-2 bg-[var(--accent)]/10 p-4 border-l-4 border-[var(--accent)]">
               <p className="font-bold text-[10px] tracking-[0.2em] uppercase text-[var(--accent)]">Grand Total</p>
               <p className="font-serif text-4xl font-black mt-2">
                 {invoice.currency} {finalTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
               </p>
             </div>
          </div>
        </div>

        {/* ITEMS */}
        <div className="flex-1">
          <table className="w-full font-sans text-sm">
            <thead className="bg-[var(--tx-primary)] text-[var(--bg-primary)]">
              <tr>
                <th className="py-4 px-4 font-bold uppercase tracking-widest text-[10px] text-left">Description</th>
                <th className="py-4 px-4 font-bold uppercase tracking-widest text-[10px] text-center w-24">QTY</th>
                <th className="py-4 px-4 font-bold uppercase tracking-widest text-[10px] text-right w-32">Price</th>
                <th className="py-4 px-4 font-bold uppercase tracking-widest text-[10px] text-right w-32">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[var(--tx-primary)]/20">
               {invoice.items.map(it => (
                 <tr key={it.id}>
                    <td className="py-6 px-4 font-bold text-lg">{it.desc || '——'}</td>
                    <td className="py-6 px-4 text-center font-bold">{it.qty}</td>
                    <td className="py-6 px-4 text-right opacity-80">{it.price}</td>
                    <td className="py-6 px-4 text-right font-black">{(it.qty * it.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                 </tr>
               ))}
            </tbody>
          </table>
          <div className="flex justify-end pt-8">
            <div className="w-1/2">
              <div className="flex justify-between py-4 border-t-4 border-[var(--tx-primary)]">
                 <span className="font-bold text-xs tracking-widest uppercase opacity-70">Subtotal</span>
                 <span className="font-bold">{finalTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        {invoice.notes && (
          <div className="border border-[var(--tx-primary)] p-6 bg-[var(--bg-primary)] relative">
            <div className="absolute -top-3 left-4 bg-[var(--bg-primary)] px-2 font-bold text-[10px] tracking-widest uppercase">Remarks</div>
            <p className="font-mono text-sm leading-relaxed opacity-80 uppercase">{invoice.notes}</p>
          </div>
        )}
      </div>
    </>
  );
};

export const TemplateElegant: React.FC<TemplateProps> = ({ invoice, logo, finalTotal }) => {
  return (
    <>
      {/* Symmetrical Art Deco Minimalist */}
      <div className="absolute inset-x-12 top-0 h-4 bg-[var(--tx-primary)] pointer-events-none opacity-10"></div>
      <div className="absolute inset-x-12 bottom-0 h-4 bg-[var(--tx-primary)] pointer-events-none opacity-10"></div>
      
      <div className="relative z-10 px-12 py-16 flex flex-col items-center">
        
        {/* LOGO */}
        {logo && <img src={logo} alt="Company Logo" className="h-16 w-auto object-contain mb-8" />}
        {!logo && (
           <div className="flex gap-2 items-center mb-8">
             <div className="w-2 h-2 rounded-full bg-[var(--tx-primary)]"></div>
             <div className="w-16 h-[1px] bg-[var(--tx-primary)]"></div>
             <div className="w-2 h-2 rounded-full bg-[var(--tx-primary)]"></div>
           </div>
        )}

        <h1 className="font-serif text-5xl tracking-[0.2em] uppercase font-light text-center mb-10 border-b border-[var(--tx-primary)]/20 pb-10 w-full">
           <span className="text-[var(--accent)] font-bold mr-4 block mb-2 text-lg">STATEMENT &amp; INVOICE</span>
           {invoice.clientName || '——'}
        </h1>

        <div className="w-full grid grid-cols-3 gap-8 text-center mb-16 border-b border-[var(--tx-primary)]/20 pb-12">
          <div>
            <p className="font-sans text-[9px] uppercase tracking-[0.3em] opacity-60 mb-2">Invoice No.</p>
            <p className="font-serif text-xl">{invoice.id}</p>
          </div>
          <div>
            <p className="font-sans text-[9px] uppercase tracking-[0.3em] opacity-60 mb-2">Date / Due</p>
            <p className="font-serif text-xl">{invoice.date} &mdash; {invoice.dueDate}</p>
          </div>
          <div>
            <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-[var(--accent)] mb-2 font-bold">Total Request</p>
            <p className="font-serif text-2xl font-bold">{invoice.currency} {finalTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </div>
        </div>

        <div className="w-full text-center pb-16 mb-16">
          <p className="font-sans text-[9px] uppercase tracking-[0.3em] opacity-60 mb-3">Client Destination</p>
          <p className="font-serif text-xl mb-1">{invoice.clientAddress || '——'}</p>
          <p className="font-sans text-xs italic opacity-70">{invoice.clientEmail}</p>
        </div>

        <div className="w-full border-t border-[var(--tx-primary)]/20 pt-16">
           <table className="w-full text-left font-serif">
             <thead>
               <tr>
                 <th className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold opacity-60 pb-6 border-b border-[var(--tx-primary)]/20">Service Description</th>
                 <th className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold opacity-60 pb-6 border-b border-[var(--tx-primary)]/20 text-center w-24">QTY</th>
                 <th className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold opacity-60 pb-6 border-b border-[var(--tx-primary)]/20 text-right w-32">Rate</th>
                 <th className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold opacity-60 pb-6 border-b border-[var(--tx-primary)]/20 text-right w-32">Amt</th>
               </tr>
             </thead>
             <tbody>
               {invoice.items.map(it => (
                 <tr key={it.id}>
                    <td className="py-6 border-b border-[var(--tx-primary)]/10 pr-4 text-xl font-light">{it.desc || '——'}</td>
                    <td className="py-6 border-b border-[var(--tx-primary)]/10 text-center">{it.qty}</td>
                    <td className="py-6 border-b border-[var(--tx-primary)]/10 text-right opacity-70">{it.price}</td>
                    <td className="py-6 border-b border-[var(--tx-primary)]/10 text-right text-lg">{(it.qty * it.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                 </tr>
               ))}
               <tr>
                 <td colSpan={2} className="py-8">
                    {invoice.notes && (
                      <p className="font-serif italic text-sm opacity-60 text-center max-w-sm">"{invoice.notes}"</p>
                    )}
                 </td>
                 <td className="py-8 text-right font-sans text-[9px] uppercase tracking-[0.3em] font-bold">Subtotal</td>
                 <td className="py-8 text-right text-lg">{finalTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
               </tr>
               <tr>
                 <td colSpan={2} className="py-8 border-t border-[var(--tx-primary)]"></td>
                 <td className="py-8 border-t border-[var(--tx-primary)] text-right font-sans text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent)]">Final Balance</td>
                 <td className="py-8 border-t border-[var(--tx-primary)] text-right text-2xl font-bold">{invoice.currency} {finalTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
               </tr>
             </tbody>
           </table>
        </div>

      </div>
    </>
  );
};

export const TemplateJapandi: React.FC<TemplateProps> = ({ invoice, logo, finalTotal }) => {
  return (
    <>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)] rounded-full blur-[100px] opacity-[0.03] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--tx-primary)] rounded-full blur-[100px] opacity-[0.03] pointer-events-none"></div>

      <div className="relative z-10 px-12 py-16 flex flex-col h-full font-sans tracking-wide text-[var(--tx-primary)]">
        <div className="flex justify-between items-start mb-20">
          <div>
            {logo ? <img src={logo} alt="Logo" className="h-10 w-auto object-contain mb-8" /> : <div className="text-xl font-light tracking-[0.2em] uppercase mb-8">Studio</div>}
          </div>
          <div className="text-right">
            <h2 className="text-sm uppercase tracking-[0.3em] font-light opacity-50 mb-2">Invoice</h2>
            <div className="font-light text-2xl tracking-widest">{invoice.id}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-16 mb-20 font-light">
          <div>
             <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-3">Billed To</p>
             <p className="text-lg mb-1">{invoice.clientName || '——'}</p>
             <p className="text-sm opacity-60 whitespace-pre-wrap leading-relaxed">{invoice.clientAddress || '——'}</p>
             <p className="text-xs mt-2 opacity-40">{invoice.clientEmail}</p>
          </div>
          <div className="grid grid-cols-2 gap-8">
             <div>
               <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-3">Issued</p>
               <p className="text-sm">{invoice.date}</p>
             </div>
             <div>
               <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-3">Due</p>
               <p className="text-sm">{invoice.dueDate}</p>
             </div>
             <div className="col-span-2 pt-4">
               <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-3">Total Amount</p>
               <p className="text-3xl font-light tracking-wide text-[var(--accent)]">
                 <span className="font-sans text-lg mr-2 uppercase">{invoice.currency}</span>
                 {finalTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
               </p>
             </div>
          </div>
        </div>

        <div className="flex-1">
          <table className="w-full text-left text-sm font-light">
            <thead>
              <tr className="border-b border-[var(--tx-primary)]/10">
                <th className="py-4 font-normal uppercase tracking-[0.2em] text-[10px] opacity-40">Description</th>
                <th className="py-4 font-normal uppercase tracking-[0.2em] text-[10px] opacity-40 text-center">Qty</th>
                <th className="py-4 font-normal uppercase tracking-[0.2em] text-[10px] opacity-40 text-right">Rate</th>
                <th className="py-4 font-normal uppercase tracking-[0.2em] text-[10px] opacity-40 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
               {invoice.items.map(it => (
                 <tr key={it.id} className="border-b border-[var(--tx-primary)]/5">
                    <td className="py-6 pr-4">{it.desc || '——'}</td>
                    <td className="py-6 text-center">{it.qty}</td>
                    <td className="py-6 text-right opacity-60">{it.price}</td>
                    <td className="py-6 text-right">{(it.qty * it.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                 </tr>
               ))}
               <tr>
                 <td colSpan={2} className="py-6"></td>
                 <td className="py-6 text-right text-[10px] uppercase tracking-[0.2em] opacity-40 font-normal">Subtotal</td>
                 <td className="py-6 text-right">{finalTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
               </tr>
            </tbody>
          </table>
        </div>

        {invoice.notes && (
          <div className="pt-12 mt-12 text-center opacity-50">
            <p className="text-xs max-w-md mx-auto whitespace-pre-wrap leading-relaxed italic">{invoice.notes}</p>
          </div>
        )}
      </div>
    </>
  );
};

export const TemplateNeoclassical: React.FC<TemplateProps> = ({ invoice, logo, finalTotal }) => {
  return (
    <>
      <div className="absolute inset-0 bg-transparent pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.1) 100%)' }}></div>
      <div className="absolute inset-8 border border-[var(--tx-primary)] opacity-10 pointer-events-none rounded-2xl shadow-[0px_4px_24px_rgba(0,0,0,0.05)]"></div>
      
      <div className="relative z-10 px-14 py-16 flex flex-col h-full font-serif backdrop-blur-md bg-white/20 dark:bg-black/20 m-12 rounded-xl border border-white/40 dark:border-white/10 shadow-lg">
        
        <div className="text-center mb-12">
          {logo && <img src={logo} alt="Logo" className="h-16 w-auto object-contain mx-auto mb-6" />}
          <h1 className="text-5xl font-normal tracking-wide uppercase">Invoice</h1>
          <div className="mt-4 flex items-center justify-center gap-4">
             <div className="flex-1 border-b border-[var(--tx-primary)] opacity-20"></div>
             <span className="text-sm tracking-[0.2em] font-sans opacity-60 uppercase">REF: {invoice.id}</span>
             <div className="flex-1 border-b border-[var(--tx-primary)] opacity-20"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-16 rounded-xl bg-white/30 dark:bg-black/30 p-8 border border-white/40 dark:border-white/5">
          <div>
            <h3 className="font-sans text-[9px] uppercase tracking-[0.2em] opacity-60 mb-2">Invoiced To</h3>
            <p className="text-xl mb-1">{invoice.clientName || '——'}</p>
            <p className="text-sm opacity-80 whitespace-pre-wrap">{invoice.clientAddress || '——'}</p>
            <p className="text-xs mt-2 font-sans opacity-60 italic">{invoice.clientEmail}</p>
          </div>
          <div className="text-right">
            <h3 className="font-sans text-[9px] uppercase tracking-[0.2em] opacity-60 mb-2">Date Details</h3>
            <p className="text-sm mb-1 font-sans"><span className="opacity-60 mr-2">ISSUED:</span> {invoice.date}</p>
            <p className="text-sm mb-4 font-sans"><span className="opacity-60 mr-2">DUE:</span> {invoice.dueDate}</p>
            <h3 className="font-sans text-[9px] uppercase tracking-[0.2em] text-[var(--accent)] font-bold mb-1">Total Payable</h3>
            <p className="text-3xl tracking-wide">{invoice.currency} {finalTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </div>
        </div>

        <div className="flex-1">
           <table className="w-full text-left">
             <thead>
               <tr>
                 <th className="font-sans text-[9px] uppercase tracking-[0.2em] opacity-60 pb-4 border-b border-[var(--tx-primary)]/20">Rendered Service</th>
                 <th className="font-sans text-[9px] uppercase tracking-[0.2em] opacity-60 pb-4 border-b border-[var(--tx-primary)]/20 text-center">Qty</th>
                 <th className="font-sans text-[9px] uppercase tracking-[0.2em] opacity-60 pb-4 border-b border-[var(--tx-primary)]/20 text-right">Fee</th>
                 <th className="font-sans text-[9px] uppercase tracking-[0.2em] opacity-60 pb-4 border-b border-[var(--tx-primary)]/20 text-right">Line Total</th>
               </tr>
             </thead>
             <tbody>
               {invoice.items.map(it => (
                 <tr key={it.id}>
                    <td className="py-4 border-b border-[var(--tx-primary)]/10 pr-4 text-lg">{it.desc || '——'}</td>
                    <td className="py-4 border-b border-[var(--tx-primary)]/10 font-sans text-center">{it.qty}</td>
                    <td className="py-4 border-b border-[var(--tx-primary)]/10 font-sans text-right opacity-80">{it.price}</td>
                    <td className="py-4 border-b border-[var(--tx-primary)]/10 font-sans text-right">{(it.qty * it.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                 </tr>
               ))}
             </tbody>
           </table>
           <div className="flex justify-end pt-8">
             <div className="w-1/2">
                <div className="flex justify-between py-2 items-end">
                   <span className="font-sans text-[10px] uppercase tracking-[0.2em] opacity-60">Subtotal</span>
                   <span className="font-sans">{finalTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between py-4 border-t border-[var(--tx-primary)]/30 mt-2 items-end">
                   <span className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-[var(--accent)]">Final Total</span>
                   <span className="text-2xl font-bold">{invoice.currency} {finalTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
             </div>
           </div>
        </div>

        {invoice.notes && (
          <div className="mt-8 pt-8 border-t border-[var(--tx-primary)]/20 text-center">
            <p className="font-sans text-xs uppercase tracking-[0.3em] opacity-50 mb-2">Remarks</p>
            <p className="italic opacity-80 text-sm max-w-lg mx-auto">{invoice.notes}</p>
          </div>
        )}
      </div>
    </>
  );
};

export const TemplateBrutalism: React.FC<TemplateProps> = ({ invoice, logo, finalTotal }) => {
  return (
    <>
      <div className="relative z-10 p-0 flex flex-col h-full font-sans tracking-tight bg-[var(--bg-primary)]">
        
        <div className="absolute top-0 right-0 w-full h-8 bg-pink-300 dark:bg-pink-900 border-b-4 border-black dark:border-white"></div>
        <div className="absolute w-8 h-full left-0 top-0 bg-pink-100 dark:bg-pink-950 border-r-4 border-black dark:border-white"></div>

        <div className="pl-12 pt-16 pr-8 pb-8 flex flex-col h-full">
          <div className="flex justify-between items-start border-b-8 border-black dark:border-white pb-8 mb-8">
            <div className="border-4 border-black dark:border-white p-4 bg-pink-50 dark:bg-[#201015]">
              {logo ? <img src={logo} alt="Logo" className="h-12 w-auto object-contain" /> : <div className="text-4xl font-black uppercase tracking-tighter">INVOX</div>}
            </div>
            <div className="text-right flex flex-col items-end">
              <h2 className="text-8xl font-black uppercase tracking-tighter leading-none block border-4 border-black dark:border-white bg-[var(--tx-primary)] text-[var(--bg-primary)] px-4 py-2 transform rotate-2">INVOICE</h2>
              <div className="mt-4 font-mono text-xl border-2 border-black dark:border-white p-2 bg-pink-200 dark:bg-pink-800 text-black dark:text-white transform -rotate-1">#{invoice.id}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 mb-8">
             <div className="col-span-2 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] bg-white dark:bg-black relative">
               <div className="absolute -top-4 -left-4 bg-pink-300 dark:bg-pink-700 text-black dark:text-white border-2 border-black dark:border-white px-3 py-1 font-bold italic transform -rotate-3 text-sm">For your attention</div>
               <p className="font-black text-2xl uppercase mb-2 mt-2">{invoice.clientName || '——'}</p>
               <p className="font-mono text-sm whitespace-pre-wrap font-bold">{invoice.clientAddress || '——'}</p>
               <p className="font-mono text-xs mt-4 bg-yellow-200 dark:bg-yellow-900 inline-block px-2 text-black dark:text-white border border-black dark:border-white">{invoice.clientEmail}</p>
             </div>
             <div className="border-4 border-black dark:border-white p-6 bg-pink-100 dark:bg-pink-950 flex flex-col justify-center">
               <div className="mb-4 text-center border-b-2 border-black dark:border-white pb-4">
                 <p className="font-bold uppercase text-xs mb-1">Date</p>
                 <p className="font-mono text-lg font-bold">{invoice.date}</p>
               </div>
               <div className="text-center">
                 <p className="font-bold uppercase text-xs mb-1 bg-[var(--tx-primary)] text-[var(--bg-primary)] inline-block px-1">Due</p>
                 <p className="font-mono text-lg font-bold">{invoice.dueDate}</p>
               </div>
             </div>
          </div>

          <div className="flex-1 border-4 border-black dark:border-white bg-white dark:bg-black flex flex-col mb-8 overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <table className="w-full text-left font-mono">
              <thead className="bg-black dark:bg-white text-white dark:text-black">
                <tr>
                  <th className="py-3 px-4 font-black uppercase text-sm border-r-2 border-white dark:border-black">Item</th>
                  <th className="py-3 px-4 font-black uppercase text-sm border-r-2 border-white dark:border-black text-center">Qty</th>
                  <th className="py-3 px-4 font-black uppercase text-sm border-r-2 border-white dark:border-black text-right">Price</th>
                  <th className="py-3 px-4 font-black uppercase text-sm text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-black dark:divide-white">
                 {invoice.items.map(it => (
                   <tr key={it.id}>
                      <td className="py-4 px-4 font-bold border-r-4 border-black dark:border-white">{it.desc || '——'}</td>
                      <td className="py-4 px-4 text-center border-r-4 border-black dark:border-white bg-pink-50 dark:bg-[#201015]">{it.qty}</td>
                      <td className="py-4 px-4 text-right border-r-4 border-black dark:border-white">{it.price}</td>
                      <td className="py-4 px-4 text-right font-black bg-pink-100 dark:bg-pink-900">{(it.qty * it.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                   </tr>
                 ))}
                 <tr className="bg-black dark:bg-white text-white dark:text-black">
                   <td colSpan={2} className="py-4 px-4 border-r-4 border-white dark:border-black font-sans uppercase font-black tracking-widest">
                     Subtotal
                   </td>
                   <td colSpan={2} className="py-4 px-4 text-right font-black text-xl">
                     {finalTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                   </td>
                 </tr>
                 <tr className="bg-[var(--accent)] text-white">
                   <td colSpan={2} className="py-6 px-4 border-r-4 border-black font-sans uppercase font-black text-2xl tracking-tighter italic">
                     TOTAL DUE
                   </td>
                   <td colSpan={2} className="py-6 px-4 text-right font-black text-4xl">
                     {invoice.currency} {finalTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                   </td>
                 </tr>
              </tbody>
            </table>
          </div>

          {invoice.notes && (
            <div className="border-4 border-black dark:border-white p-4 font-mono font-bold uppercase relative bg-white dark:bg-black">
              <div className="absolute -top-3 left-4 bg-[var(--bg-primary)] px-2 font-bold text-[10px] tracking-widest uppercase">Remarks</div>
              {invoice.notes}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
