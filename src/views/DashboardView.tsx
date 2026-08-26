import React from 'react';
import { Product, Sale, User, StockLog } from '../types';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  DollarSign,
  Users,
  ArrowUpRight,
  Layers,
  ChevronRight,
  Plus,
  Receipt,
  Store,
  CheckCircle2,
} from 'lucide-react';

interface DashboardViewProps {
  products: Product[];
  sales: Sale[];
  users: User[];
  stockLogs: StockLog[];
  currentUser: User | null;
  onNavigateTab: (tab: 'products' | 'pos' | 'stock' | 'sales' | 'users') => void;
  onOpenInvoice: (sale: Sale) => void;
  onOpenAddProduct: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  sales,
  users,
  stockLogs,
  currentUser,
  onNavigateTab,
  onOpenInvoice,
  onOpenAddProduct,
}) => {
  const isManager = currentUser?.roli === 'menaxher';

  // Filter sales if worker
  const relevantSales = isManager
    ? sales
    : sales.filter((s) => s.punetoriId === currentUser?.id);

  // Calculations
  const totalProducts = products.length;
  const totalSalesRevenue = relevantSales.reduce((acc, s) => acc + s.shumaNeto, 0);
  const totalSalesCount = relevantSales.length;

  const lowStockProducts = products.filter((p) => p.stoku > 0 && p.stoku <= p.stokuMin);
  const outOfStockProducts = products.filter((p) => p.stoku === 0);
  const totalLowStockAlerts = lowStockProducts.length + outOfStockProducts.length;

  const totalStockValue = products.reduce((acc, p) => acc + p.stoku * p.cmimi, 0);

  // Category summary
  const categoriesMap: Record<string, number> = {};
  products.forEach((p) => {
    categoriesMap[p.kategoria] = (categoriesMap[p.kategoria] || 0) + p.stoku;
  });

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Store className="w-3.5 h-3.5" />
              <span>TechStore - Dyqani i Elektronikës</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Mirë se vini, {currentUser?.emri} {currentUser?.mbiemri}! 
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              {isManager
                ? 'Pasqyra e përgjithshme e dyqanit, stokut aktual, shitjeve dhe aktivitetit të punëtorëve.'
                : 'Sistemi i regjistrimit të shitjeve, kontrollit të stokut dhe historikut tuaj personal.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('pos')}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
              id="dashboard-pos-shortcut"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Regjistro Shitje</span>
            </button>
            {isManager && (
              <button
                onClick={onOpenAddProduct}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs flex items-center space-x-2 transition"
                id="dashboard-add-product-shortcut"
              >
                <Plus className="w-4 h-4" />
                <span>Shto Produkt</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Sales Value */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isManager ? 'Xhiroja e Shitjeve' : 'Shitjet e Mia'}
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">
              €{totalSalesRevenue.toFixed(2)}
            </span>
            <p className="text-xs text-slate-500 mt-1 flex items-center">
              <span className="text-emerald-600 font-bold mr-1">{totalSalesCount}</span> shitje të realizuara
            </p>
          </div>
        </div>

        {/* Total Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3 cursor-pointer hover:border-indigo-300 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Produkte
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{totalProducts}</span>
            <p className="text-xs text-slate-500 mt-1">
              Vlera Stokut: <span className="font-bold text-slate-700">€{totalStockValue.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div
          onClick={() => onNavigateTab('stock')}
          className={`bg-white rounded-2xl p-5 border shadow-sm space-y-3 cursor-pointer transition ${
            totalLowStockAlerts > 0 ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Paralajmërim Stokut
            </span>
            <div
              className={`p-2.5 rounded-xl ${
                totalLowStockAlerts > 0
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{totalLowStockAlerts}</span>
            <p className="text-xs text-slate-500 mt-1">
              {outOfStockProducts.length > 0 ? (
                <span className="text-rose-600 font-bold">{outOfStockProducts.length} pa stok!</span>
              ) : (
                <span className="text-amber-600 font-medium">Produktet me stok të ultë</span>
              )}
            </p>
          </div>
        </div>

        {/* Employees or Shift Info */}
        <div
          onClick={() => isManager && onNavigateTab('users')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isManager ? 'Ekipi i Punëtorëve' : 'Statusi i Qasjes'}
            </span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">
              {isManager ? users.length : 'Aktiv'}
            </span>
            <p className="text-xs text-slate-500 mt-1">
              {isManager ? 'Punëtorë të regjistruar' : `Roli: ${currentUser?.roli}`}
            </p>
          </div>
        </div>

      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Sales List (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Shitjet e Fundit</h3>
              <p className="text-xs text-slate-500">Transaksionet e regjistruara së fundmi</p>
            </div>
            <button
              onClick={() => onNavigateTab('sales')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
            >
              <span>Shiko të gjitha</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {relevantSales.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Nuk ka ende asnjë shitje të regjistruar.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {relevantSales.slice(0, 5).map((sale) => (
                <div
                  key={sale.id}
                  onClick={() => onOpenInvoice(sale)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 p-2 rounded-xl cursor-pointer transition"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-mono text-xs font-bold">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{sale.nrFatures}</p>
                      <p className="text-[11px] text-slate-500">
                        {sale.items.length} artikull{sale.items.length > 1 ? 'j' : ''} • {sale.punetoriEmri}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-slate-900 text-sm">€{sale.shumaNeto.toFixed(2)}</p>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      {sale.menyraPageses}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Warning List (1 Col) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Alarmet e Stokut</h3>
              <p className="text-xs text-slate-500">Produktet që kërkojnë furnizim</p>
            </div>
            <button
              onClick={() => onNavigateTab('stock')}
              className="text-xs font-bold text-amber-600 hover:text-amber-800"
            >
              Ndrysho
            </button>
          </div>

          {totalLowStockAlerts === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-semibold text-slate-800">Të gjitha produktet kanë stok të mjaftueshëm!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...outOfStockProducts, ...lowStockProducts].slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <img
                      src={p.imazhi}
                      alt={p.emri}
                      className="w-9 h-9 rounded-lg object-cover bg-white border shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-xs truncate">{p.emri}</p>
                      <p className="text-[10px] text-slate-500">{p.kategoria}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-bold shrink-0 ${
                      p.stoku === 0
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {p.stoku === 0 ? '0 (Jashtë)' : `${p.stoku} në stok`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
