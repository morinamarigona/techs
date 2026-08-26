import React, { useState } from 'react';
import { Sale, User } from '../types';
import { Receipt, Search, Filter, Eye, Printer, Calendar, UserCheck, DollarSign } from 'lucide-react';

interface SalesHistoryViewProps {
  sales: Sale[];
  currentUser: User | null;
  onOpenInvoice: (sale: Sale) => void;
}

export const SalesHistoryView: React.FC<SalesHistoryViewProps> = ({
  sales,
  currentUser,
  onOpenInvoice,
}) => {
  const isManager = currentUser?.roli === 'menaxher';
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('Të gjitha');

  // Filter sales
  const userSales = isManager
    ? sales
    : sales.filter((s) => s.punetoriId === currentUser?.id);

  const filteredSales = userSales.filter((s) => {
    const matchesSearch =
      s.nrFatures.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.punetoriEmri.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.klientEmri && s.klientEmri.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPayment = paymentFilter === 'Të gjitha' || s.menyraPageses === paymentFilter;

    return matchesSearch && matchesPayment;
  });

  const totalRevenue = filteredSales.reduce((acc, s) => acc + s.shumaNeto, 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {isManager ? 'Historiku i të Gjitha Shitjeve' : 'Shitjet e Mia të Realizuara'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isManager
              ? 'Transaksionet e plota të regjistruara nga të gjithë punëtorët e dyqanit.'
              : 'Përmbledhja e faturave dhe xhiros suaj personale.'}
          </p>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 p-3.5 rounded-2xl text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 block">
            Totali i Filtruar
          </span>
          <span className="text-2xl font-black text-indigo-900">
            €{totalRevenue.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kërko me numër fature, punëtor ose klient..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            id="sales-search-input"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Pagesa:</span>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-800 focus:outline-none"
            id="sales-payment-filter"
          >
            <option value="Të gjitha">Të gjitha mënyrat</option>
            <option value="Kesh">Kesh</option>
            <option value="Kartelë">Kartelë</option>
            <option value="Me Këste">Me Këste</option>
          </select>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {filteredSales.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Receipt className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs font-semibold">Nuk u gjet asnjë faturë shitjeje.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Nr. i Faturës</th>
                  <th className="py-3.5 px-4">Data & Ora</th>
                  {isManager && <th className="py-3.5 px-4">Shitësi / Punëtori</th>}
                  <th className="py-3.5 px-4">Blerësi / Klienti</th>
                  <th className="py-3.5 px-4">Artikujt</th>
                  <th className="py-3.5 px-4">Mënyra Pagesës</th>
                  <th className="py-3.5 px-4 text-right">Shuma Neto</th>
                  <th className="py-3.5 px-4 text-center">Fatura</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/70 transition">
                    
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                      {sale.nrFatures}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(sale.data).toLocaleString('sq-AL', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {isManager && (
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {sale.punetoriEmri}
                      </td>
                    )}

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {sale.klientEmri || '—'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {sale.items.length} produkt{sale.items.length > 1 ? 'e' : ''}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {sale.menyraPageses}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-black text-slate-900 text-sm">
                      €{sale.shumaNeto.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onOpenInvoice(sale)}
                        className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition inline-flex items-center space-x-1"
                        title="Shiko Faturën me mundësi printimi"
                        id={`view-invoice-btn-${sale.id}`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Fatura</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
