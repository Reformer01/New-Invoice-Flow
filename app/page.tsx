'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Printer, Mail, Plus, Trash2, Moon, Sun, Save, Circle, Square, Repeat, Loader2, Check } from 'lucide-react';

import { TemplateClassic, TemplateBold, TemplateElegant, TemplateJapandi, TemplateNeoclassical, TemplateBrutalism } from '../components/InvoiceTemplates';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'NGN'];

const TEMPLATES = ['hybrid-classic', 'hybrid-bold', 'hybrid-elegant', 'japandi-ethereal', 'neoclassical-liquid', 'brutalism-coquette'] as const;
type TemplateType = typeof TEMPLATES[number];

const TEMPLATE_PREVIEWS: { id: TemplateType; name: string; desc: string; preview: string; innerPreview: React.ReactNode }[] = [
  { 
    id: 'hybrid-classic', 
    name: 'Hybrid Classic', 
    desc: 'Bauhaus + Deco', 
    preview: 'bg-white dark:bg-zinc-900 border-2 border-[var(--tx-primary)]',
    innerPreview: <div className="flex flex-col h-full opacity-50 p-1"><div className="w-4 h-1 border-t border-l border-black dark:border-white mb-1"></div><div className="flex-1 border border-black/20 dark:border-white/20"></div></div>
  },
  { 
    id: 'hybrid-bold', 
    name: 'Hybrid Bold', 
    desc: 'Structural', 
    preview: 'bg-white dark:bg-black border-4 border-[var(--tx-primary)]',
    innerPreview: <div className="flex flex-col h-full p-0.5"><div className="w-full h-1/3 bg-black dark:bg-white mb-0.5"></div><div className="w-full flex-1 border-t-2 border-black dark:border-white"></div></div>
  },
  { 
    id: 'hybrid-elegant', 
    name: 'Hybrid Elegant', 
    desc: 'Opulent', 
    preview: 'bg-[#faf9f6] dark:bg-[#111110] border-4 border-[var(--accent)] border-double',
    innerPreview: <div className="flex flex-col h-full items-center p-1"><div className="w-full h-[1px] bg-[var(--accent)] mb-[1px]"></div><div className="w-full h-[1px] bg-[var(--accent)] mb-1"></div><div className="w-2 h-2 rounded-full border border-[var(--accent)]"></div></div>
  },
  { 
    id: 'japandi-ethereal', 
    name: 'Japandi', 
    desc: 'Minimal + Glow', 
    preview: 'bg-[#fcfbf9] dark:bg-[#1a1918] border border-[var(--accent)]/30',
    innerPreview: <div className="flex flex-col h-full items-center justify-center relative overflow-hidden"><div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-[var(--accent)]/20 blur-md"></div><div className="w-6 h-[1px] bg-[var(--tx-primary)]/40 mt-2"></div></div>
  },
  { 
    id: 'neoclassical-liquid', 
    name: 'Neoclassical', 
    desc: 'Glass + Marble', 
    preview: 'bg-gradient-to-br from-white/60 to-white/10 dark:from-white/10 dark:to-transparent border border-white/40 shadow-sm',
    innerPreview: <div className="flex flex-col h-full rounded-md border border-[var(--tx-primary)]/20 m-1"></div>
  },
  { 
    id: 'brutalism-coquette', 
    name: 'Brutalism', 
    desc: 'Raw + Soft', 
    preview: 'bg-pink-100 dark:bg-pink-950 border-2 border-black dark:border-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)]',
    innerPreview: <div className="flex h-full p-1"><div className="bg-pink-300 dark:bg-pink-800 w-1/3 h-full border border-black dark:border-white"></div><div className="w-2/3 h-2 bg-[var(--bg-primary)] border border-black dark:border-white mt-1 ml-1 transform rotate-2"></div></div>
  }
];

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

const generateDefaultInvoice = () => ({
  id: String(Math.random()).substring(2, 8).toUpperCase(),
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  clientName: 'Gatsby Enterprises',
  clientAddress: '1920 Deco Blvd, New York, NY',
  clientEmail: 'billing@gatsby.enterprises',
  currency: 'NGN',
  notes: 'PAYMENT DUE WITHIN 14 DAYS. THANK YOU FOR YOUR BUSINESS.',
  bankDetails: '',
  items: [{ id: String(Math.random()).substring(2, 8).toUpperCase(), desc: 'Architectural Consultation', qty: 1, price: 5000 }] as InvoiceItem[],
});

export default function InvoiceApp() {
  const [transmitting, setTransmitting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const [invoice, setInvoice] = useState(generateDefaultInvoice);

  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light'|'dark'>('light');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<ClientType[]>([]);
  const [logo, setLogo] = useState<string | null>(null);
  const [template, setTemplate] = useState<TemplateType>('hybrid-classic');
  const [pdfOrientation, setPdfOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [pdfQuality, setPdfQuality] = useState<'high' | 'medium' | 'low'>('medium');
  const [footerText, setFooterText] = useState<string>('');
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showTemplateWarning, setShowTemplateWarning] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<TemplateType | null>(null);
  const [showManageContacts, setShowManageContacts] = useState(false);

  const invoiceRef = useRef(invoice);
  useEffect(() => {
    invoiceRef.current = invoice;
  }, [invoice]);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setIsAutoSaving(true);
      setShowSaveSuccess(false);
      
      setTimeout(() => {
        const currentInvoice = invoiceRef.current;
        const data = JSON.parse(localStorage.getItem('invoiceflow_data') || '{"invoices":[]}');
        const existingIdx = (data.invoices || []).findIndex((i: any) => i.id === currentInvoice.id);
        let newInvoices = data.invoices || [];
        if (existingIdx !== undefined && existingIdx >= 0) {
           newInvoices[existingIdx] = currentInvoice;
        } else {
           newInvoices.push(currentInvoice);
        }
        data.invoices = newInvoices;
        localStorage.setItem('invoiceflow_data', JSON.stringify(data));
        setInvoices(newInvoices);
        
        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSaved(timeString);
        setIsAutoSaving(false);
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 2000);
      }, 800); // Add a small delay so the auto-save indicator is visible
    }, 60000);
    return () => clearInterval(interval);
  }, [mounted]);

  useEffect(() => {
    // eslint-disable-next-line
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

  const getClientSuggestions = (query: string) => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return clients.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) || 
      c.address.toLowerCase().includes(lowerQuery) || 
      c.email.toLowerCase().includes(lowerQuery)
    );
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

  const deleteClient = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const data = JSON.parse(localStorage.getItem('invoiceflow_data') || '{"invoices":[],"clients":[]}');
    const newClients = (data.clients || []).filter((c: ClientType) => c.id !== id);
    data.clients = newClients;
    localStorage.setItem('invoiceflow_data', JSON.stringify(data));
    setClients(newClients);
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
    
    try {
      const htmlToImage = await import('html-to-image');
      const { jsPDF } = await import('jspdf');
      
      const qualityOptions = {
        high: { quality: 1.0, pixelRatio: 3 },
        medium: { quality: 0.98, pixelRatio: 2 },
        low: { quality: 0.8, pixelRatio: 1 }
      };
      
      const imgOptions = qualityOptions[pdfQuality] || qualityOptions.medium;
      const dataUrl = await htmlToImage.toJpeg(element, imgOptions);
      
      const pdf = new jsPDF({
        orientation: pdfOrientation,
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const printWidth = pdfWidth - (margin * 2);
      
      const imgProps = pdf.getImageProperties(dataUrl);
      const printHeight = (imgProps.height * printWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, 'JPEG', margin, margin, printWidth, printHeight);
      pdf.save(`Invoice-${invoice.id}.pdf`);
      
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

  const confirmTemplateChange = () => {
    if (pendingTemplate) {
      setTemplate(pendingTemplate);
      const data = JSON.parse(localStorage.getItem('invoiceflow_data') || '{"invoices":[]}');
      data.template = pendingTemplate;
      localStorage.setItem('invoiceflow_data', JSON.stringify(data));
    }
    setShowTemplateWarning(false);
    setPendingTemplate(null);
  };

  const cancelTemplateChange = () => {
    setShowTemplateWarning(false);
    setPendingTemplate(null);
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
             <div className="flex gap-4 items-center">
               {isAutoSaving ? (
                 <span className="text-[10px] text-[var(--accent)] font-bold italic flex items-center gap-1.5">
                   <span className="relative flex h-1.5 w-1.5">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--accent)]"></span>
                   </span>
                   Auto-saving...
                 </span>
               ) : showSaveSuccess ? (
                 <span 
                   className="text-[10px] text-green-600 dark:text-green-400 font-bold italic flex items-center gap-1"
                   style={{ animation: 'fadeOut 2s ease-in-out forwards' }}
                 >
                   ✅ Saved
                 </span>
               ) : lastSaved ? (
                 <span className="text-[9px] opacity-60 italic mr-2 flex items-center gap-1">
                   <Save size={10} /> Saved {lastSaved}
                 </span>
               ) : null}
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
              
              <div className="p-5 border-b border-[var(--border)] bg-[var(--bg-secondary)] pb-6">
                <legend className="text-xs uppercase font-bold tracking-widest text-[var(--accent)] mb-4">
                  Aesthetic Architecture
                </legend>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {TEMPLATE_PREVIEWS.map((tp) => (
                    <button
                      key={tp.id}
                      onClick={() => {
                        if (template !== tp.id) {
                          setPendingTemplate(tp.id);
                          setShowTemplateWarning(true);
                        }
                      }}
                      className={`flex flex-col items-start p-2 border transition-all text-left outline-none ${template === tp.id ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]' : 'border-[var(--border)] hover:border-[var(--tx-primary)]'}`}
                    >
                      <div className={`w-full h-16 mb-2 flex-shrink-0 relative overflow-hidden ${tp.preview}`}>
                         {tp.innerPreview}
                         {template === tp.id && <div className="absolute inset-0 bg-[var(--accent)]/10 pointer-events-none"></div>}
                      </div>
                      <div className="font-bold text-[9px] uppercase tracking-widest leading-tight">{tp.name}</div>
                      <div className="text-[9px] opacity-70 italic truncate w-full">{tp.desc}</div>
                    </button>
                  ))}
                </div>

                <legend className="text-xs uppercase font-bold tracking-widest text-[var(--accent)] mb-4 mt-6">
                  PDF Orientation
                </legend>
                <div className="flex gap-4 mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="pdfOrientation" 
                      value="portrait" 
                      checked={pdfOrientation === 'portrait'} 
                      onChange={() => setPdfOrientation('portrait')}
                      className="accent-[var(--tx-primary)]"
                    />
                    <span className="text-sm font-bold uppercase tracking-widest">Portrait</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="pdfOrientation" 
                      value="landscape" 
                      checked={pdfOrientation === 'landscape'} 
                      onChange={() => setPdfOrientation('landscape')}
                      className="accent-[var(--tx-primary)]"
                    />
                    <span className="text-sm font-bold uppercase tracking-widest">Landscape</span>
                  </label>
                </div>

                <legend className="text-xs uppercase font-bold tracking-widest text-[var(--accent)] mb-4">
                  Export Quality
                </legend>
                <select 
                  className="w-full bg-transparent border border-[var(--border)] p-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors uppercase tracking-widest font-bold mb-6"
                  value={pdfQuality}
                  onChange={e => setPdfQuality(e.target.value as any)}
                >
                  <option value="high" className="bg-[var(--bg-primary)]">High (Print Ready)</option>
                  <option value="medium" className="bg-[var(--bg-primary)]">Medium (Standard)</option>
                  <option value="low" className="bg-[var(--bg-primary)]">Low (Email/Draft)</option>
                </select>

                <legend className="text-xs uppercase font-bold tracking-widest text-[var(--accent)] mb-4">
                  Document Footer Notice
                </legend>
                <textarea 
                  className="w-full bg-transparent border border-[var(--border)] p-3 text-sm min-h-[60px] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  placeholder="Legal notices, company info, or payment terms..."
                  value={footerText}
                  onChange={e => setFooterText(e.target.value)}
                />
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
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs uppercase tracking-widest font-bold">Load Contact</label>
                      <button 
                        onClick={() => setShowManageContacts(true)}
                        className="text-[10px] uppercase font-bold tracking-widest text-[var(--accent)] hover:opacity-70 transition-opacity"
                      >
                        Manage Contacts
                      </button>
                    </div>
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
                  <div className="relative">
                    <label className="block text-[10px] uppercase tracking-widest mb-1 font-bold">Client Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-transparent border-b border-[var(--border)] py-1 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                      value={invoice.clientName || ''}
                      onChange={e => handleUpdate('clientName', e.target.value)}
                      onFocus={() => setFocusedField('clientName')}
                      onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                    />
                    {focusedField === 'clientName' && getClientSuggestions(invoice.clientName || '').length > 0 && (
                      <div className="absolute z-10 w-full mt-1 border border-[var(--border)] shadow-lg max-h-60 overflow-y-auto bg-[var(--bg-secondary)] text-[var(--tx-primary)] flex flex-col">
                        {getClientSuggestions(invoice.clientName || '').map(c => (
                          <div 
                            key={c.id} 
                            className="p-3 text-sm cursor-pointer hover:bg-[var(--bg-primary)] border-b border-[var(--border)] last:border-b-0 flex flex-col gap-1 group"
                            onMouseDown={(e) => { e.preventDefault(); setInvoice(prev => ({...prev, clientName: c.name, clientAddress: c.address, clientEmail: c.email})) }}
                          >
                            <div className="font-bold flex justify-between items-center">
                              <span>{c.name}</span>
                              <button 
                                onMouseDown={(e) => deleteClient(e, c.id)}
                                className="text-[var(--tx-primary)] opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity p-1"
                                title="Delete Client"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="text-xs opacity-70 truncate">{c.address}</div>
                            <div className="text-xs opacity-50 truncate">{c.email}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <label className="block text-[10px] uppercase tracking-widest mb-1 font-bold">Address</label>
                    <input 
                      type="text" 
                      className="w-full bg-transparent border-b border-[var(--border)] py-1 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                      value={invoice.clientAddress || ''}
                      onChange={e => handleUpdate('clientAddress', e.target.value)}
                      onFocus={() => setFocusedField('clientAddress')}
                      onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                    />
                    {focusedField === 'clientAddress' && getClientSuggestions(invoice.clientAddress || '').length > 0 && (
                      <div className="absolute z-10 w-full mt-1 border border-[var(--border)] shadow-lg max-h-60 overflow-y-auto bg-[var(--bg-secondary)] text-[var(--tx-primary)] flex flex-col">
                        {getClientSuggestions(invoice.clientAddress || '').map(c => (
                          <div 
                            key={c.id} 
                            className="p-3 text-sm cursor-pointer hover:bg-[var(--bg-primary)] border-b border-[var(--border)] last:border-b-0 flex flex-col gap-1 group"
                            onMouseDown={(e) => { e.preventDefault(); setInvoice(prev => ({...prev, clientName: c.name, clientAddress: c.address, clientEmail: c.email})) }}
                          >
                            <div className="font-bold flex justify-between items-center">
                              <span>{c.name}</span>
                              <button 
                                onMouseDown={(e) => deleteClient(e, c.id)}
                                className="text-[var(--tx-primary)] opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity p-1"
                                title="Delete Client"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="text-xs opacity-70 truncate">{c.address}</div>
                            <div className="text-xs opacity-50 truncate">{c.email}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <label className="block text-[10px] uppercase tracking-widest mb-1 font-bold">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full bg-transparent border-b border-[var(--border)] py-1 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                      value={invoice.clientEmail || ''}
                      onChange={e => handleUpdate('clientEmail', e.target.value)}
                      onFocus={() => setFocusedField('clientEmail')}
                      onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                    />
                    {focusedField === 'clientEmail' && getClientSuggestions(invoice.clientEmail || '').length > 0 && (
                      <div className="absolute z-10 w-full mt-1 border border-[var(--border)] shadow-lg max-h-60 overflow-y-auto bg-[var(--bg-secondary)] text-[var(--tx-primary)] flex flex-col">
                        {getClientSuggestions(invoice.clientEmail || '').map(c => (
                          <div 
                            key={c.id} 
                            className="p-3 text-sm cursor-pointer hover:bg-[var(--bg-primary)] border-b border-[var(--border)] last:border-b-0 flex flex-col gap-1 group"
                            onMouseDown={(e) => { e.preventDefault(); setInvoice(prev => ({...prev, clientName: c.name, clientAddress: c.address, clientEmail: c.email})) }}
                          >
                            <div className="font-bold flex justify-between items-center">
                              <span>{c.name}</span>
                              <button 
                                onMouseDown={(e) => deleteClient(e, c.id)}
                                className="text-[var(--tx-primary)] opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity p-1"
                                title="Delete Client"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="text-xs opacity-70 truncate">{c.address}</div>
                            <div className="text-xs opacity-50 truncate">{c.email}</div>
                          </div>
                        ))}
                      </div>
                    )}
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

              <fieldset className="p-5 border-b border-[var(--border)]">
                <legend className="text-xs uppercase font-bold tracking-widest text-[var(--accent)] mb-4">
                  Remarks / Memos
                </legend>
                <textarea 
                  className="w-full bg-transparent border border-[var(--border)] p-3 text-sm min-h-[100px] focus:outline-none focus:border-[var(--accent)] transition-colors mb-6"
                  value={invoice.notes || ''}
                  onChange={e => handleUpdate('notes', e.target.value)}
                />

                <legend className="text-xs uppercase font-bold tracking-widest text-[var(--accent)] mb-4">
                  Bank Details
                </legend>
                <textarea 
                  className="w-full bg-transparent border border-[var(--border)] p-3 text-sm min-h-[100px] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  placeholder="Bank Name&#10;Account Name&#10;Account Number"
                  value={invoice.bankDetails || ''}
                  onChange={e => handleUpdate('bankDetails', e.target.value)}
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
               <Printer size={16} className={isGeneratingPdf ? "animate-pulse" : ""} /> {isGeneratingPdf ? 'Generating...' : 'Print / Save PDF'}
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
        <section className="flex-1 bg-[#8c8c88] dark:bg-[#0a0a0a] p-4 md:p-12 lg:p-16 overflow-auto flex justify-start lg:justify-center items-start print:p-0 print:bg-[white] no-print-scrollbar">
          
          <div 
            id="invoice-preview" 
            className={`print-container bg-[var(--bg-primary)] text-[var(--tx-primary)] ${pdfOrientation === 'landscape' ? 'w-[1131px] min-w-[1131px]' : 'w-[800px] min-w-[800px]'} shrink-0 p-14 relative transition-colors`}
            style={{ 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(0, 0, 0, 0.1)'
            }}
          >
             
             
             {template === 'hybrid-classic' && <TemplateClassic invoice={invoice} logo={logo} finalTotal={finalTotal} footerText={footerText} />}
             {template === 'hybrid-bold' && <TemplateBold invoice={invoice} logo={logo} finalTotal={finalTotal} footerText={footerText} />}
             {template === 'hybrid-elegant' && <TemplateElegant invoice={invoice} logo={logo} finalTotal={finalTotal} footerText={footerText} />}
             {template === 'japandi-ethereal' && <TemplateJapandi invoice={invoice} logo={logo} finalTotal={finalTotal} footerText={footerText} />}
             {template === 'neoclassical-liquid' && <TemplateNeoclassical invoice={invoice} logo={logo} finalTotal={finalTotal} footerText={footerText} />}
             {template === 'brutalism-coquette' && <TemplateBrutalism invoice={invoice} logo={logo} finalTotal={finalTotal} footerText={footerText} />}

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

      {/* TEMPLATE WARNING MODAL */}
      {showTemplateWarning && (
        <div className="fixed inset-0 z-50 bg-[var(--bg-primary)]/80 flex items-center justify-center p-4 backdrop-blur-md">
           <div className="bg-[var(--bg-secondary)] border-2 border-[var(--accent)] p-8 max-w-md w-full shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)]">
              <h2 className="text-2xl font-serif font-black mb-4 uppercase tracking-tighter">Layout Warning</h2>
              <p className="font-sans text-sm mb-8 opacity-80 leading-relaxed">
                Changing the template architecture may alter the visual density and block arrangement of your current invoice data. Proceed with transformation?
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={cancelTemplateChange}
                  className="flex-1 p-3 font-bold uppercase tracking-widest text-xs border border-[var(--border)] hover:bg-[var(--bg-primary)] transition-colors"
                >
                  Terminate
                </button>
                <button 
                  onClick={confirmTemplateChange}
                  className="flex-1 p-3 font-bold uppercase tracking-widest text-xs bg-[var(--tx-primary)] text-[var(--bg-primary)] hover:opacity-90 transition-opacity"
                >
                  Proceed
                </button>
              </div>
           </div>
        </div>
      )}

      {/* MANAGE CONTACTS MODAL */}
      {showManageContacts && (
        <div className="fixed inset-0 z-50 bg-[var(--bg-primary)]/80 flex items-center justify-center p-4 backdrop-blur-md">
           <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-8 max-w-md w-full max-h-[80vh] flex flex-col shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)]">
              <h2 className="text-2xl font-serif font-black mb-6 uppercase tracking-tighter shrink-0 flex justify-between items-center">
                <span>Manage Contacts</span>
                <button onClick={() => setShowManageContacts(false)} className="text-sm font-sans tracking-tight opacity-50 hover:opacity-100">✕</button>
              </h2>
              <div className="font-sans text-sm mb-6 flex-1 overflow-y-auto pr-2">
                {clients.length === 0 ? (
                  <p className="opacity-50 italic text-center py-4">No saved contacts found.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {clients.map(c => (
                      <div key={c.id} className="border border-[var(--border)] p-3 flex justify-between items-start gap-4 hover:border-[var(--accent)] transition-colors group bg-[var(--bg-primary)]">
                        <div className="overflow-hidden">
                          <div className="font-bold truncate">{c.name}</div>
                          {c.address && <div className="text-xs opacity-70 truncate" title={c.address}>{c.address}</div>}
                          {c.email && <div className="text-xs opacity-50 truncate">{c.email}</div>}
                        </div>
                        <button 
                          onClick={(e) => deleteClient(e, c.id)}
                          className="shrink-0 p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          title="Delete Contact"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button 
                onClick={() => setShowManageContacts(false)}
                className="w-full p-3 font-bold uppercase tracking-widest text-xs border border-[var(--border)] hover:bg-[var(--bg-primary)] transition-colors shrink-0"
              >
                Done
              </button>
           </div>
        </div>
      )}

    </div>
  );
}
