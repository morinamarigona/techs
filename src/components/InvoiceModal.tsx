import React from 'react';
import { Sale } from '../types';
import { jsPDF } from 'jspdf';
import { CheckCircle2, X, Store, FileText, Download } from 'lucide-react';

interface InvoiceModalProps {
  sale: Sale | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ sale, onClose }) => {
  if (!sale) return null;

  const handleDownload = () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 12;
      let y = margin;
      const lineHeight = 7;
      const sectionGap = 8;
      const labelStyle = { font: 'helvetica', style: 'normal', size: 10 };
      const valueStyle = { font: 'helvetica', style: 'bold', size: 10 };

      pdf.setFont(labelStyle.font, labelStyle.style);
      pdf.setFontSize(14);
      pdf.text('TechStore Sh.p.k.', pageWidth / 2, y, { align: 'center' });
      y += 8;
      pdf.setFontSize(10);
      pdf.text('Dyqani i Pajisjeve Elektronike & Teknologjisë', pageWidth / 2, y, { align: 'center' });
      y += 5;
      pdf.text('Rruga "Nënë Tereza" Nr. 45, Prishtinë | Tel: +383 38 200 300', pageWidth / 2, y, { align: 'center' });
      y += 5;
      pdf.text('NUI: 810293847 | TVSH Nr: 33029102', pageWidth / 2, y, { align: 'center' });
      y += sectionGap;

      pdf.setDrawColor(210);
      pdf.setLineWidth(0.3);
      pdf.line(margin, y, pageWidth - margin, y);
      y += sectionGap;

      pdf.setFontSize(labelStyle.size);
      pdf.setFont(labelStyle.font, labelStyle.style);
      pdf.text('Nr. i Faturës:', margin, y);
      pdf.setFont(valueStyle.font, valueStyle.style);
      pdf.text(sale.nrFatures, margin + 45, y);
      pdf.setFont(labelStyle.font, labelStyle.style);
      pdf.text('Data & Ora:', pageWidth / 2 + margin, y);
      pdf.setFont(valueStyle.font, valueStyle.style);
      pdf.text(formattedDate, pageWidth - margin, y, { align: 'right' });
      y += lineHeight;

      pdf.setFont(labelStyle.font, labelStyle.style);
      pdf.text('Shitësi / Punëtori:', margin, y);
      pdf.setFont(valueStyle.font, valueStyle.style);
      pdf.text(sale.punetoriEmri, margin + 45, y);
      pdf.setFont(labelStyle.font, labelStyle.style);
      pdf.text('Mënyra e Pagesës:', pageWidth / 2 + margin, y);
      pdf.setFont(valueStyle.font, valueStyle.style);
      pdf.text(sale.menyraPageses, pageWidth - margin, y, { align: 'right' });
      y += lineHeight;

      if (sale.klientEmri) {
        pdf.setFont(labelStyle.font, labelStyle.style);
        pdf.text('Blerësi / Klienti:', margin, y);
        pdf.setFont(valueStyle.font, valueStyle.style);
        pdf.text(sale.klientEmri, margin + 45, y);
        y += lineHeight;
      }

      y += sectionGap;
      pdf.setFontSize(11);
      pdf.setFont(valueStyle.font, valueStyle.style);
      pdf.text('Artikujt e Blerë', margin, y);
      y += lineHeight;

      const colX = [margin, pageWidth * 0.45, pageWidth * 0.65, pageWidth - margin];
      pdf.setFontSize(labelStyle.size);
      pdf.setFont(labelStyle.font, labelStyle.style);
      pdf.text('Produkti', colX[0], y);
      pdf.text('Sasia', colX[1], y, { align: 'center' });
      pdf.text('Çmimi', colX[2], y, { align: 'right' });
      pdf.text('Total', colX[3], y, { align: 'right' });
      y += lineHeight;
      pdf.setDrawColor(210);
      pdf.line(margin, y - 3, pageWidth - margin, y - 3);

      sale.items.forEach((item, index) => {
        pdf.setFont(valueStyle.font, valueStyle.style);
        pdf.text(item.produktEmri, colX[0], y);
        pdf.setFont(labelStyle.font, labelStyle.style);
        pdf.text(String(item.sasia), colX[1], y, { align: 'center' });
        pdf.text(`€${item.cmimiNjesi.toFixed(2)}`, colX[2], y, { align: 'right' });
        pdf.text(`€${item.total.toFixed(2)}`, colX[3], y, { align: 'right' });
        y += lineHeight;

        if (y > 270) {
          pdf.addPage();
          y = margin;
        }
      });

      y += sectionGap;
      pdf.setFont(labelStyle.font, labelStyle.style);
      pdf.text('Nëntotali (Bruto):', margin, y);
      pdf.setFont(valueStyle.font, valueStyle.style);
      pdf.text(`€${sale.shumaBruto.toFixed(2)}`, pageWidth - margin, y, { align: 'right' });
      y += lineHeight;

      if (sale.zbritja > 0) {
        pdf.setFont(labelStyle.font, labelStyle.style);
        pdf.text(`Zbritje e aplikuar (${sale.zbritja}%):`, margin, y);
        pdf.setFont(valueStyle.font, valueStyle.style);
        pdf.text(`-€${((sale.shumaBruto * sale.zbritja) / 100).toFixed(2)}`, pageWidth - margin, y, { align: 'right' });
        y += lineHeight;
      }

      pdf.setFont(labelStyle.font, labelStyle.style);
      pdf.text('Përfshirë TVSH (18%):', margin, y);
      pdf.setFont(valueStyle.font, valueStyle.style);
      pdf.text(`€${sale.tvsh.toFixed(2)}`, pageWidth - margin, y, { align: 'right' });
      y += lineHeight;

      pdf.setDrawColor(210);
      pdf.setLineWidth(0.3);
      pdf.line(margin, y, pageWidth - margin, y);
      y += lineHeight;

      pdf.setFontSize(12);
      pdf.setFont(valueStyle.font, valueStyle.style);
      pdf.text('TOTALI PËR PAGESË:', margin, y);
      pdf.text(`€${sale.shumaNeto.toFixed(2)}`, pageWidth - margin, y, { align: 'right' });
      y += sectionGap;

      pdf.setFontSize(9);
      pdf.setFont(labelStyle.font, labelStyle.style);
      pdf.text('Ju faleminderit për blerjen në TechStore!', margin, y);
      y += lineHeight;
      pdf.text('Garancia është e vlefshme vetëm duke ruajtur këtë kupon fiskal.', margin, y);
      y += lineHeight;
      pdf.text(`Kuponi Fiskal ID: ${sale.id.toUpperCase()}`, margin, y);

      pdf.save(`${sale.nrFatures}.pdf`);
    } catch (error) {
      console.error('PDF download failed:', error);
      alert(`Gabim gjatë ngarkimit të faturës. Provoni përsëri.\n${error}`);
    }
  };

  const formattedDate = new Date(sale.data).toLocaleString('sq-AL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 print:shadow-none print:border-none print:max-w-none">
        
        {/* Modal Header (Hidden during print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-lg">Fatura u Regjistrua me Sukses</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            id="close-invoice-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 font-sans" id="printable-receipt">
          
          {/* Header Store Info */}
          <div className="text-center pb-6 border-b border-slate-200">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-3 print:bg-transparent">
              <Store className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">TechStore Sh.p.k.</h2>
            <p className="text-xs text-slate-500 mt-1">Dyqani i Pajisjeve Elektronike & Teknologjisë</p>
            <p className="text-xs text-slate-500">Rruga "Nënë Tereza" Nr. 45, Prishtinë | Tel: +383 38 200 300</p>
            <p className="text-xs text-slate-500">NUI: 810293847 | TVSH Nr: 33029102</p>
          </div>

          {/* Invoice Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100 print:bg-transparent print:border-slate-300">
            <div>
              <span className="text-slate-400 block font-medium">Nr. i Faturës:</span>
              <span className="font-bold text-slate-900 text-sm">{sale.nrFatures}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Data & Ora:</span>
              <span className="font-semibold text-slate-800">{formattedDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Shitësi / Punëtori:</span>
              <span className="font-semibold text-slate-800">{sale.punetoriEmri}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Mënyra e Pagesës:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                {sale.menyraPageses}
              </span>
            </div>
            {sale.klientEmri && (
              <div className="col-span-2 border-t border-slate-200/60 pt-2">
                <span className="text-slate-400 block font-medium">Blerësi / Klienti:</span>
                <span className="font-semibold text-slate-800">{sale.klientEmri}</span>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Artikujt e Blerë</h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Produkti</th>
                    <th className="py-2.5 px-2 text-center">Sasia</th>
                    <th className="py-2.5 px-2 text-right">Çmimi</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sale.items.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        {item.produktEmri}
                        <span className="block text-[10px] text-slate-400 font-mono">{item.sku}</span>
                      </td>
                      <td className="py-2.5 px-2 text-center font-semibold text-slate-700">{item.sasia}</td>
                      <td className="py-2.5 px-2 text-right text-slate-600">€{item.cmimiNjesi.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">€{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Calculation Breakdown */}
          <div className="border-t border-slate-200 pt-4 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Nëntotali (Bruto):</span>
              <span className="font-semibold">€{sale.shumaBruto.toFixed(2)}</span>
            </div>
            {sale.zbritja > 0 && (
              <div className="flex justify-between text-rose-600 font-medium">
                <span>Zbritje e aplikuar ({sale.zbritja}%):</span>
                <span>-€{((sale.shumaBruto * sale.zbritja) / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Përfshirë TVSH (18%):</span>
              <span>€{sale.tvsh.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>TOTALI PËR PAGESË:</span>
              <span className="text-lg text-indigo-600 font-black">€{sale.shumaNeto.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer Receipt Message */}
          <div className="text-center pt-4 border-t border-dashed border-slate-200 text-[11px] text-slate-400 space-y-1">
            <p className="font-medium text-slate-600">Ju faleminderit për blerjen në TechStore!</p>
            <p>Garancia është e vlefshme vetëm duke ruajtur këtë kupon fiskal.</p>
            <p className="font-mono text-[10px]">Kuponi Fiskal ID: {sale.id.toUpperCase()}</p>
          </div>
        </div>

        {/* Modal Actions (Hidden during print) */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-3 justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 text-sm transition"
            id="close-invoice-btn"
          >
            Mbyll
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition"
            id="download-invoice-btn"
          >
            <Download className="w-4 h-4" />
            <span>Ngarko Faturën</span>
          </button>
        </div>

      </div>
    </div>
  );
};
