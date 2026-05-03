'use client';

import React, { useState, useEffect } from 'react';
import { Printer, Mail, Plus, Trash2, Moon, Sun, Save, Circle, Square } from 'lucide-react';

import { TemplateClassic, TemplateBold, TemplateElegant, TemplateJapandi, TemplateNeoclassical, TemplateBrutalism } from '../components/InvoiceTemplates';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'NGN'];

const TEMPLATES = ['hybrid-classic', 'hybrid-bold', 'hybrid-elegant', 'japandi-ethereal', 'neoclassical-liquid', 'brutalism-coquette'] as const;
type TemplateType = typeof TEMPLATES[number];

type InvoiceItem = {
  id: string;
  desc: string;
  qty: number;
  price: number;
};

type ClientType = {
  id: string;
  name: string;
  address: string;
  email: string;
};

export default function InvoiceApp() {
  const [transmitting, setTransmitting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const [invoice, setInvoice] = useState({
    id: Math.random().toString(36).substring(2, 8).toUpperCase(),
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    clientName: 'Gatsby Enterprises',
    clientAddress: '1920 Deco Blvd, New York, NY',
    clientEmail: 'billing@gatsby.enterprises',
    currency: 'NGN',
    notes: 'PAYMENT DUE WITHIN 14 DAYS. THANK YOU FOR YOUR BUSINESS.',
    items: [{ id: Math.random().toString(36).substring(2, 8).toUpperCase(), desc: 'Architectural Consultation', qty: 1, price: 5000 }] as InvoiceItem[],
  });

  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light'|'dark'>('light');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<ClientType[]>([]);
  const [logo, setLogo] = useState<string | null>(null);
  const [template, setTemplate] = useState<TemplateType>('hybrid-classic');

  useEffect(() => {
    setMounted(true);

    const saved = localStorage.getItem('invoiceflow_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.invoices && parsed.invoices.length > 0) setInvoices(parsed.invoices);
        if (parsed.clients && parsed.clients.length > 0) setClients(parsed.clients);
        if (parsed.logo) setLogo(parsed.logo);
        if (parsed.template) setTemplate(parsed.template);
        if (parsed.theme) {
          setTheme(parsed.theme);
          if (parsed.theme === 'dark') document.documentElement.classList.add('dark');
        }
      } catch(e) {}
    }
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    const data = JSON.parse(localStorage.getItem('invoiceflow_data') || '{"invoices":[]}');
    data.theme = newTheme;
    localStorage.setItem('invoiceflow_data', JSON.stringify(data));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogo(base64String);
        const data = JSON.parse(localStorage.getItem('invoiceflow_data') || '{"invoices":[]}');
        data.logo = base64String;
        localStorage.setItem('invoiceflow_data', JSON.stringify(data));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogo(null);
    const data = JSON.parse(localStorage.getItem('invoiceflow_data') || '{"invoices":[]}');
    data.logo = null;
    localStorage.setItem('invoiceflow_data', JSON.stringify(data));
  };

  const handleSave = () => {
    const data = JSON.parse(localStorage.getItem('invoiceflow_data') || '{"invoices":[]}');
    const existingIdx = (data.invoices || []).findIndex((i: any) => i.id === invoice.id);
    let newInvoices = data.invoices || [];
    if (existingIdx !== undefined && existingIdx >= 0) {
       newInvoices[existingIdx] = invoice;
    } else {
       newInvoices.push(invoice);
    }
    data.invoices = newInvoices;
    localStorage.setItem('invoiceflow_data', JSON.stringify(data));
    setInvoices(newInvoices);
    alert(`[ SYSTEM ] DATA STORED IN LOCAL MEMORY.`);
  };

  const saveClient = () => {
    if (!invoice.clientName) return alert('[ ERROR ] CLIENT IDENTITY REQUIRED');
    const data = JSON.parse(localStorage.getItem('invoiceflow_data') || '{"invoices":[],"clients":[]}');
    let newClients: ClientType[] = data.clients || [];
    const existingIdx = newClients.findIndex((c) => c.name.toLowerCase() === invoice.clientName.toLowerCase());
    const clientData: ClientType = {
      id: existingIdx >= 0 ? newClients[existingIdx].id : Math.random().toString(36).substring(2, 8).toUpperCase(),
      name: invoice.clientName,
      address: invoice.clientAddress,
      email: invoice.clientEmail
    };
    if (existingIdx >= 0) {
      newClients[existingIdx] = clientData;
    } else {
      newClients.push(clientData);
    }
    data.clients = newClients;
    localStorage.setItem('invoiceflow_data', JSON.stringify(data));
    setClients(newClients);
    alert(`[ SYSTEM ] CLIENT STORED IN LOCAL MEMORY.`);
  };

  const createNew = () => {
    setInvoice({
      ...invoice,
      id: Math.random().toString(36).substring(2, 8).toUpperCase(),
      clientName: '',
      clientAddress: '',
      clientEmail: '',
      items: [{ id: Math.random().toString(36).substring(2, 8).toUpperCase(), desc: 'New Item', qty: 1, price: 0 }]
    });
  };

  const loadInvoice = (id: string) => {
    const found = invoices.find(i => i.id === id);
    if (found) setInvoice(found);
  };

  const handleUpdate = (field: string, value: string) => {
    setInvoice(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { id: Math.random().toString(36).substring(2, 8).toUpperCase(), desc: 'New Item', qty: 1, price: 0 }]
    }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(i => i.id === id ? { ...i, [field]: value } : i)
    }));
  };

  const removeItem = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(i => i.id !== id)
    }));
  };

  const handlePrint = async () => {
    setIsGeneratingPdf(true);
    const element = document.getElementById('invoice-preview');
    if (!element) {
      setIsGeneratingPdf(false);
      return;
    }
    
    // Create cloned element for PDF generation to avoid messing up the UI
    const clone = element.cloneNode(true) as HTMLElement;
    // Add print specific classes or modify styles if necessary on clone
    
    const opt = {
      margin:       10,
      filename:     `Invoice-${invoice.id}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
    };

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf().set(opt).from(element).save();
    } catch (error: any) {
      console.error("PDF generation failed", error);
      if (error?.name === 'ChunkLoadError') {
        alert("The application was updated in the background. Refreshing to load the latest version.");
        window.location.reload();
      } else {
        alert("Failed to generate PDF. Check console for details.");
      }
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleTransmit = () => {
    setTransmitting(true);
    setTimeout(() => {
      setTransmitting(false);
      const subject = encodeURIComponent(`Invoice ${invoice.id}`);
      const body = encodeURIComponent(`Please find the details for Invoice ${invoice.id} below.\n\nTotal Due: ${invoice.currency} ${finalTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}\nDue Date: ${invoice.dueDate}\n\nThank you.`);
      window.location.href = `mailto:${invoice.clientEmail}?subject=${subject}&body=${body}`;
    }, 2500);
  };

  const finalTotal = invoice.items.reduce((acc, it) => acc + (it.qty * it.price), 0);

  return (
    <div className="flex flex-col min-h-screen text-[var(--tx-primary)] font-sans">
      
      {/* MACRO HEADER */}
      <header className="no-print border-b border-[var(--border)] p-4 md:p-6 bg-[var(--bg-primary)] flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
        <div className="relative z-10 w-full flex items-center gap-6">
          <div className="h-16 w-16 bg-[var(--tx-primary)] flex items-center justify-center rounded-sm">
             <Circle className="text-[var(--accent)]" size={32} strokeWidth={1} />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight leading-none text-[var(--tx-primary)]">
              ATELIER INVOX
            </h1>
            <p className="font-sans text-xs tracking-[0.2em] font-medium uppercase mt-2 text-[var(--accent)]">
              Structured Elegance &middot; Commercial Protocol
            </p>
          </div>
        </div>
        
        <div className="font-sans text-xs flex flex-col gap-2 w-full md:w-auto z-10 uppercase tracking-widest text-right">
           <div className="flex items-center justify-end gap-3">
             <span className="border border-[var(--border)] px-2 py-1 text-[10px]">AESTHETIC HYBRID V1</span>
             <button onClick={toggleTheme} className="border border-[var(--border)] p-1 hover:bg-[var(--tx-primary)] hover:text-[var(--bg-primary)] transition-colors">
                {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
             </button>
           </div>
        </div>
      </header>

      {/* WORKSPACE */}
      <main className="flex-1 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-[var(--border)]">
        
        {/* LEFT COMPARTMENT - EDITOR */}
        <section className="no-print w-full lg:w-[450px] xl:w-[500px] bg-[var(--bg-secondary)] flex flex-col h-[calc(100vh-120px)] custom-scrollbar">
          
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between text-[var(--tx-primary)]">
             <span className="font-sans text-xs tracking-widest font-bold uppercase">Control Deck</span>
             <div className="flex gap-4">
               <button onClick={handleSave} className="flex gap-1 items-center hover:text-[var(--accent)] text-[10px] uppercase font-bold tracking-widest transition-colors"><Save size={14} /> Save</button>
               <button onClick={createNew} className="flex gap-1 items-center hover:text-[var(--accent)] text-[10px] uppercase font-bold tracking-widest transition-colors"><Plus size={14} /> New</button>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto w-full">
            <div className="divide-y divide-[var(--border)]">
              
              {invoices.length > 0 && (
                <div className="p-3 bg-[var(--bg-primary)] border-b border-[var(--border)] flex text-xs items-center gap-3">
                  <span className="font-bold uppercase tracking-widest">History:</span>
                  <select 
                    className="bg-transparent border border-[var(--border)] p-1 flex-1 focus:outline-none focus:border-[var(--accent)] transition-colors"
                    onChange={e => loadInvoice(e.target.value)}
                    value={invoice.id}
                  >
                    <option value="" disabled>Select Previous</option>
                    {invoices.map(inv => (
                      <option key={inv.id} value={inv.id} className="bg-[var(--bg-primary)]">
                        {inv.id} - {inv.clientName || 'Unnamed'}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="p-5 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                <legend className="text-xs uppercase font-bold tracking-widest text-[var(--accent)] mb-4">
                  Aesthetic Architecture
                </legend>
                <select 
                  className="w-full bg-transparent border border-[var(--border)] p-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors uppercase tracking-widest font-bold"
                  value={template}
                  onChange={e => {
                    const val = e.target.value as TemplateType;
                    setTemplate(val);
                    const data = JSON.parse(localStorage.getItem('invoiceflow_data') || '{"invoices":[]}');
                    data.template = val;
                    localStorage.setItem('invoiceflow_data', JSON.stringify(data));
                  }}
                >
                  <option value="hybrid-classic" className="bg-[var(--bg-primary)]">Hybrid Classic (Bauhaus + Deco)</option>
                  <option value="hybrid-bold" className="bg-[var(--bg-primary)]">Hybrid Bold (Structural)</option>
                  <option value="hybrid-elegant" className="bg-[var(--bg-primary)]">Hybrid Elegant (Opulent)</option>
                  <option value="japandi-ethereal" className="bg-[var(--bg-primary)]">Japandi Ethereal (Minimal + Glow)</option>
                  <option value="neoclassical-liquid" className="bg-[var(--bg-primary)]">Neoclassical Liquid Glass</option>
                  <option value="brutalism-coquette" className="bg-[var(--bg-primary)]">Brutalism Coquette (Raw + Soft)</option>
                </select>
              </div>
              
              {/* SOURCE IDENTITY */}
              <fieldset className="p-5">
                <legend className="text-xs uppercase font-bold tracking-widest text-[var(--accent)] mb-4">
                  Organization Symbol (Logo)
                </legend>
                <div className="space-y-4">
                  <div>
                    {logo ? (
                      <div className="flex items-center gap-4">
                        <img src={logo} alt="Logo" className="h-14 w-auto object-contain border border-[var(--border)] p-2 bg-[var(--bg-primary)]" />
                        <button onClick={removeLogo} className="text-xs uppercase tracking-widest text-red-500 hover:text-[var(--tx-primary)] transition-colors">
                          Remove Symbol
                        </button>
                      </div>
                    ) : (
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:border file:border-[var(--border)] file:bg-transparent file:text-[var(--tx-primary)] file:uppercase file:tracking-widest file:font-bold hover:file:bg-[var(--tx-primary)] hover:file:text-[var(--bg-primary)] cursor-pointer transition-colors"
                      />
                    )}
                  </div>
                </div>
              </fieldset>

              {/* TARGET */}
              <fieldset className="p-5 bg-[var(--bg-primary)] relative">
                <legend className="text-xs uppercase font-bold tracking-widest text-[var(--accent)] mb-4 flex justify-between w-full">
                  <span>Client Particulars</span>
                </legend>
                <div className="absolute top-5 right-5">
                  <button onClick={saveClient} className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-1 hover:text-[var(--accent)] transition-colors">
                    <Save size={12} /> Save Contact
                  </button>
                </div>
                
                {clients.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-xs uppercase tracking-widest mb-2 font-bold">Load Contact</label>
                    <select 
                      className="w-full bg-transparent border-b border-[var(--border)] p-1 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                      onChange={(e) => {
                        const cl = clients.find(c => c.id === e.target.value);
                        if (cl) {
                          setInvoice(prev => ({...prev, clientName: cl.name, clientAddress: cl.address, clientEmail: cl.email}));
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>Select Contact</option>
                      {clients.map(cl => (
                         <option key={cl.id} value={cl.id} className="bg-[var(--bg-primary)]">
                           {cl.name}
                         </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest mb-1 font-bold">Client Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-transparent border-b border-[var(--border)] py-1 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                      value={invoice.clientName || ''}
                      onChange={e => handleUpdate('clientName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest mb-1 font-bold">Address</label>
                    <input 
                      type="text" 
                      className="w-full bg-transparent border-b border-[var(--border)] py-1 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                      value={invoice.clientAddress || ''}
                      onChange={e => handleUpdate('clientAddress', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest mb-1 font-bold">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full bg-transparent border-b border-[var(--border)] py-1 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                      value={invoice.clientEmail || ''}
                      onChange={e => handleUpdate('clientEmail', e.target.value)}
                    />
                  </div>
                </div>
              </fieldset>

              {/* LOGISTICS */}
              <fieldset className="p-5">
                <legend className="text-xs uppercase font-bold tracking-widest text-[var(--accent)] mb-4">
                  Terms & Chronology
                </legend>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest mb-1 font-bold">Date of Issue</label>
                    <input 
                      type="date" 
                      className="w-full bg-transparent border-b border-[var(--border)] py-1 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                      value={invoice.date || ''}
                      onChange={e => handleUpdate('date', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest mb-1 font-bold">Due Date</label>
                    <input 
                      type="date" 
                      className="w-full bg-transparent border-b border-[var(--border)] py-1 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                      value={invoice.dueDate || ''}
                      onChange={e => handleUpdate('dueDate', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                     <label className="block text-[10px] uppercase tracking-widest mb-1 font-bold">Currency Paradigm</label>
                     <select 
                       className="w-full bg-transparent border-b border-[var(--border)] py-1 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                       value={invoice.currency || 'USD'}
                       onChange={e => handleUpdate('currency', e.target.value)}
                     >
                       {CURRENCIES.map(r => (
                         <option key={r} value={r} className="bg-[var(--bg-primary)]">{r}</option>
                       ))}
                     </select>
                  </div>
                </div>
              </fieldset>

              {/* LINE ITEMS */}
              <fieldset className="p-0 bg-[var(--bg-primary)]">
                <div className="p-5 flex items-center justify-between border-b border-[var(--border)]">
                  <legend className="text-xs uppercase font-bold tracking-widest text-[var(--accent)]">
                    Services Rendered
                  </legend>
                  <button 
                    onClick={addItem}
                    className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
                  >
                    <Plus size={14} /> Add Line
                  </button>
                </div>
                
                <div className="divide-y divide-[var(--border)]">
                  {invoice.items.map((it, idx) => (
                    <div key={it.id} className="p-4 md:p-5 flex flex-col xl:flex-row xl:items-end gap-4 hover:bg-[var(--bg-secondary)] transition-colors relative group/item">
                      {/* Mobile Header */}
                      <div className="flex xl:hidden justify-between items-center w-full">
                        <span className="text-xs font-bold text-[var(--accent)]">Item 0{idx + 1}</span>
                        <button onClick={() => removeItem(it.id)} className="text-[var(--border)] hover:text-red-500 transition-colors">
                           <Trash2 size={16} />
                         </button>
                      </div>

                      <div className="hidden xl:flex flex-none w-6 justify-center text-xs font-bold text-[var(--accent)] pb-2">
                        0{idx + 1}
                      </div>

                      <div className="w-full xl:flex-1 relative group">
                         <label className="block text-[10px] uppercase tracking-widest mb-1 font-bold opacity-50">Description</label>
                         <input 
                           type="text" 
                           className="w-full bg-transparent border-b border-[var(--border)] py-1 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors" 
                           value={it.desc}
                           onChange={e => updateItem(it.id, 'desc', e.target.value)} 
                         />
                      </div>
                      
                      <div className="flex gap-4 w-full xl:w-auto">
                        <div className="flex-1 xl:w-20 relative group">
                           <label className="block text-[10px] uppercase tracking-widest mb-1 font-bold opacity-50">Qty</label>
                           <input 
                             type="number" 
                             min="0"
                             className="w-full bg-transparent border-b border-[var(--border)] py-1 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors" 
                             value={it.qty}
                             onChange={e => updateItem(it.id, 'qty', Math.max(0, Number(e.target.value)))} 
                           />
                        </div>
                        <div className="flex-1 xl:w-24 relative group">
                           <label className="block text-[10px] uppercase tracking-widest mb-1 font-bold opacity-50">Unit</label>
                           <input 
                             type="number" 
                             min="0"
                             className="w-full bg-transparent border-b border-[var(--border)] py-1 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors" 
                             value={it.price}
                             onChange={e => updateItem(it.id, 'price', Math.max(0, Number(e.target.value)))} 
                           />
                        </div>
                      </div>
                      
                      <div className="hidden xl:flex flex-none w-6 justify-center pb-2 opacity-50 hover:opacity-100 transition-opacity">
                         <button onClick={() => removeItem(it.id)} className="text-[var(--border)] hover:text-[var(--tx-primary)] transition-colors">
                           <Trash2 size={16} />
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>

              <fieldset className="p-5">
                <legend className="text-xs uppercase font-bold tracking-widest text-[var(--accent)] mb-4">
                  Remarks / Memos
                </legend>
                <textarea 
                  className="w-full bg-transparent border border-[var(--border)] p-3 text-sm min-h-[100px] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  value={invoice.notes || ''}
                  onChange={e => handleUpdate('notes', e.target.value)}
                />
              </fieldset>

            </div>
          </div>
          
          {/* ACTION BAR */}
          <div className="border-t border-[var(--border)] grid grid-cols-2 divide-x divide-[var(--border)]">
             <button 
               onClick={handlePrint}
               disabled={isGeneratingPdf}
               className={`flex items-center justify-center p-5 gap-3 font-bold uppercase tracking-widest hover:bg-[var(--tx-primary)] hover:text-[var(--bg-primary)] transition-colors group text-sm ${isGeneratingPdf ? 'opacity-50 cursor-not-allowed' : ''}`}
             >
               <Printer size={16} className={isGeneratingPdf ? 'animate-pulse' : ''} /> {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
             </button>
             <button 
               onClick={handleTransmit}
               className="flex items-center justify-center p-5 gap-3 font-bold uppercase tracking-widest hover:text-[var(--accent)] transition-colors text-sm"
             >
               <Mail size={16} className={transmitting ? 'animate-pulse' : ''} /> {transmitting ? 'Sending...' : 'Email Client'}
             </button>
          </div>

        </section>

        {/* RIGHT COMPARTMENT - THE INVOICE PREVIEW */}
        {/* HYBRID: Bauhaus rigid structure containing Art Deco opulent typography/accents */}
        <section className="flex-1 bg-[#8c8c88] dark:bg-[#0a0a0a] p-4 md:p-12 lg:p-16 overflow-y-auto flex justify-center items-start print:p-0 print:bg-[white] no-print-scrollbar">
          
          <div 
            id="invoice-preview" 
            className="print-container bg-[var(--bg-primary)] text-[var(--tx-primary)] w-full max-w-[800px] p-10 md:p-14 relative transition-colors"
            style={{ 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(0, 0, 0, 0.1)'
            }}
          >
             
             
             {template === 'hybrid-classic' && <TemplateClassic invoice={invoice} logo={logo} finalTotal={finalTotal} />}
             {template === 'hybrid-bold' && <TemplateBold invoice={invoice} logo={logo} finalTotal={finalTotal} />}
             {template === 'hybrid-elegant' && <TemplateElegant invoice={invoice} logo={logo} finalTotal={finalTotal} />}
             {template === 'japandi-ethereal' && <TemplateJapandi invoice={invoice} logo={logo} finalTotal={finalTotal} />}
             {template === 'neoclassical-liquid' && <TemplateNeoclassical invoice={invoice} logo={logo} finalTotal={finalTotal} />}
             {template === 'brutalism-coquette' && <TemplateBrutalism invoice={invoice} logo={logo} finalTotal={finalTotal} />}

          </div>
        </section>

      </main>
      
      {/* TRANSMISSION MODAL */}
      {transmitting && (
        <div className="fixed inset-0 z-50 bg-[var(--bg-primary)]/90 flex items-center justify-center p-4 backdrop-blur-md">
           <div className="bg-[var(--bg-secondary)] border border-[var(--accent)] p-12 max-w-lg w-full text-center shadow-2xl">
              <div className="mb-6 flex justify-center text-[var(--accent)]">
                <Mail size={48} strokeWidth={1} className="animate-pulse" />
              </div>
              <h2 className="text-4xl font-serif font-black mb-4">Connecting...</h2>
              <p className="font-sans text-xs uppercase tracking-widest opacity-70">
                Transmitting Invoice NO. {invoice.id} to {invoice.clientEmail || 'Client'}
              </p>
           </div>
        </div>
      )}

    </div>
  );
}
