import React, { useState } from 'react';
import { Product, StockLog, User } from '../types';
import {
  Layers,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  User as UserIcon,
  ShieldAlert,
} from 'lucide-react';

interface StockViewProps {
  products: Product[];
  stockLogs: StockLog[];
  currentUser: User | null;
  onOpenStockModal: (product: Product) => void;
}

export const StockView: React.FC<StockViewProps> = ({
  products,
  stockLogs,
  currentUser,
  onOpenStockModal,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'history'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  // Filtered inventory
  const inventoryList = products.filter((p) => {
    const matchesSearch =
      p.emri.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLow = filterLowStockOnly ? p.stoku <= p.stokuMin : true;
    return matchesSearch && matchesLow;
  });

  const lowStockCount = products.filter((p) => p.stoku <= p.stokuMin).length;
  const outOfStockCount = products.filter((p) => p.stoku === 0).length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Low Stock Warning */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Artikuj në Stok
            </span>
            <span className="text-2xl font-medium text-slate-900">
              {products.reduce((acc, p) => acc + p.stoku, 0)} copë
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-amber-200 bg-amber-50/20 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-700">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
              Stok i Ultë (&le; Limit)
            </span>
            <span className="text-2xl font-medium text-amber-900">{lowStockCount} produkte</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-rose-200 bg-rose-50/20 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-rose-100 text-rose-700">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
              Pa Stok (0 Produkte)
            </span>
            <span className="text-2xl font-medium text-rose-900">{outOfStockCount} produkte</span>
          </div>
        </div>

      </div>

      {/* Main Tabs Navigation */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'inventory'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
              id="stock-tab-inventory"
            >
              Gjendja e Stokut ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'history'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
              id="stock-tab-history"
            >
              Historiku i Lëvizjeve ({stockLogs.length})
            </button>
          </div>

          {activeTab === 'inventory' && (
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterLowStockOnly}
                  onChange={(e) => setFilterLowStockOnly(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  id="filter-low-stock-checkbox"
                />
                <span className="font-bold text-amber-700">Shiko vetëm stokun e ultë</span>
              </label>
            </div>
          )}
        </div>

        {activeTab === 'inventory' ? (
          
          /* Inventory Table */
          <div className="space-y-3">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kërko me emër ose SKU..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                id="stock-inventory-search"
              />
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Produkti</th>
                    <th className="py-3 px-4">Kategoria</th>
                    <th className="py-3 px-4">Stoku Minimal</th>
                    <th className="py-3 px-4">Gjendja Aktuale</th>
                    <th className="py-3 px-4">Statusi</th>
                    <th className="py-3 px-4 text-right">Furnizo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventoryList.map((p) => {
                    const isZero = p.stoku === 0;
                    const isLow = p.stoku > 0 && p.stoku <= p.stokuMin;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={p.imazhi}
                              alt={p.emri}
                              className="w-9 h-9 rounded-lg object-cover border shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900 text-xs">{p.emri}</p>
                              <p className="font-mono text-[10px] text-slate-400">{p.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">{p.kategoria}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono">{p.stokuMin} copë</td>
                        <td className="py-3 px-4 font-black text-slate-900 text-sm">
                          {p.stoku} copë
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                              isZero
                                ? 'bg-rose-100 text-rose-800'
                                : isLow
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isZero ? 'Jashtë Stokut' : isLow ? 'Stok i Ultë' : 'Gjendje Normale'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onOpenStockModal(p)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition"
                            id={`add-stock-modal-btn-${p.id}`}
                          >
                            + Rimbush Stokun
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          
          /* Stock Movement Logs */
          <div className="space-y-3">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Data & Ora</th>
                    <th className="py-3 px-4">Produkti</th>
                    <th className="py-3 px-4">Lloji i Lëvizjes</th>
                    <th className="py-3 px-4 text-center">Ndryshimi</th>
                    <th className="py-3 px-4">Gjendja e Re</th>
                    <th className="py-3 px-4">Kryer Nga</th>
                    <th className="py-3 px-4">Shënime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stockLogs.map((log) => {
                    const isAddition = log.lloji === 'Hyrje Furnizimi';
                    const isSale = log.lloji === 'Dalje (Shitje)';

                    return (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          {new Date(log.data).toLocaleString('sq-AL', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">{log.produktEmri}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isAddition
                                ? 'bg-emerald-100 text-emerald-800'
                                : isSale
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {log.lloji}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-black text-sm">
                          <span className={isAddition ? 'text-emerald-600' : 'text-rose-600'}>
                            {isAddition ? `+${log.sasia}` : `-${log.sasia}`}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">{log.sasiaRe} copë</td>
                        <td className="py-3 px-4 font-medium text-slate-700">{log.perdoruesi}</td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {log.shenime || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
