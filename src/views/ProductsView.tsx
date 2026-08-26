import React, { useMemo, useState } from 'react';
import { Product, Category, User } from '../types';
import {
  sortProducts,
  SortAlgorithm,
  SortKey,
  SortOrder,
} from '../utils/sortingAlgorithms';
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  Layers,
  AlertTriangle,
  LayoutGrid,
  List,
  Tag,
  CheckCircle2,
  X,
} from 'lucide-react';

interface ProductsViewProps {
  products: Product[];
  currentUser: User | null;
  onOpenAddModal: () => void;
  onOpenEditModal: (product: Product) => void;
  onOpenStockModal: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const CATEGORIES: (Category | 'Të gjitha')[] = [
  'Të gjitha',
  'Telefonë & Tabletë',
  'Laptops & Kompjuterë',
  'Audio & Dëgjuese',
  'TV & Video',
  'Pajisje Shtëpiake',
  'Aksesorë & Tjera',
];

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  currentUser,
  onOpenAddModal,
  onOpenEditModal,
  onOpenStockModal,
  onDeleteProduct,
}) => {
  const isManager = currentUser?.roli === 'menaxher';
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Të gjitha'>('Të gjitha');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'Të gjitha' | 'Në Stok' | 'Stok i Ultë' | 'Jashtë Stokut'>('Të gjitha');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [sortAlgorithm, setSortAlgorithm] = useState<SortAlgorithm>('merge');
  const [sortKey, setSortKey] = useState<SortKey>('emri');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'Të gjitha' || p.kategoria === selectedCategory;
    const matchesSearch =
      p.emri.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pershkrimi.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesStock = true;
    if (stockFilter === 'Në Stok') matchesStock = p.stoku > p.stokuMin;
    if (stockFilter === 'Stok i Ultë') matchesStock = p.stoku > 0 && p.stoku <= p.stokuMin;
    if (stockFilter === 'Jashtë Stokut') matchesStock = p.stoku === 0;

    return matchesCat && matchesSearch && matchesStock;
  });

  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, sortAlgorithm, sortKey, sortOrder),
    [filteredProducts, sortAlgorithm, sortKey, sortOrder]
  );

  return (
    <>
      <div className="space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Katalogu i Produkteve</h2>
            <p className="text-xs text-slate-500">
              Gjithsej {filteredProducts.length} nga {products.length} produkte të regjistruara
            </p>
          </div>

          {isManager && (
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition"
              id="add-product-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Shto Produkt të Ri</span>
            </button>
          )}
        </div>

        {/* Filter and Controls */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kërko me emër, SKU ose përshkrim..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                id="product-search-input"
              />
            </div>

            {/* Stock Filter Dropdown */}
            <div className="flex items-center space-x-2 flex-wrap">
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:border-indigo-500"
                id="product-stock-filter"
              >
                <option value="Të gjitha">Të Gjitha Gjendjet</option>
                <option value="Në Stok">Në Stok</option>
                <option value="Stok i Ultë">Stok i Ultë (&le; Limit)</option>
                <option value="Jashtë Stokut">Jashtë Stokut (0)</option>
              </select>

              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:border-indigo-500"
                id="product-sort-key"
              >
                <option value="emri">Rendit sipas: Emri</option>
                <option value="cmimi">Rendit sipas: Çmimi</option>
                <option value="stoku">Rendit sipas: Stoku</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:border-indigo-500"
                id="product-sort-order"
              >
                <option value="asc">A→Z ↑</option>
                <option value="desc">Z→A ↓</option>
              </select>

              <select
                value={sortAlgorithm}
                onChange={(e) => setSortAlgorithm(e.target.value as SortAlgorithm)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:border-indigo-500"
                id="product-sort-algorithm"
              >
                <option value="bubble">Bubble Sort</option>
                <option value="shell">Shell Sort</option>
                <option value="quick">Quick Sort</option>
                <option value="heap">Heap Sort</option>
                <option value="radix">Radix Sort</option>
                <option value="merge">Merge Sort</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg text-xs transition ${
                    viewMode === 'table' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Tabelë"
                  id="view-mode-table"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs transition ${
                    viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Kartela"
                  id="view-mode-grid"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content: Table vs Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400 space-y-3">
            <Package className="w-12 h-12 mx-auto text-slate-300" />
            <h4 className="font-bold text-slate-700 text-base">Nuk u gjet asnjë produkt</h4>
            <p className="text-xs">Provo të ndryshosh kërkimin ose filtrat e zgjedhur.</p>
          </div>
        ) : viewMode === 'table' ? (
          
          /* Table View */
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Produkt & SKU</th>
                    <th className="py-3.5 px-4">Kategoria</th>
                    <th className="py-3.5 px-4">Çmimi i Shitjes</th>
                    {isManager && <th className="py-3.5 px-4">Kushtimi / Fitimi</th>}
                    <th className="py-3.5 px-4">Gjendja e Stokut</th>
                    <th className="py-3.5 px-4 text-right">Veprimet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedProducts.map((p) => {
                    const isLow = p.stoku > 0 && p.stoku <= p.stokuMin;
                    const isZero = p.stoku === 0;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition">
                        
                        {/* Product Name & Image */}
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={p.imazhi}
                              alt={p.emri}
                              className="w-10 h-10 rounded-xl object-cover border bg-white shrink-0"
                            />
                            <div>
                              <h4 className="font-bold text-slate-900 text-xs">{p.emri}</h4>
                              <span className="font-mono text-[10px] text-slate-400">{p.sku}</span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 text-slate-600 font-medium">{p.kategoria}</td>

                        {/* Price */}
                        <td className="py-3 px-4 font-black text-slate-900 text-sm">
                          €{p.cmimi.toFixed(2)}
                        </td>

                        {/* Cost/Profit (Manager only) */}
                        {isManager && (
                          <td className="py-3 px-4 text-slate-500">
                            <span className="block text-[11px]">Blerja: €{p.cmimiBlerjes.toFixed(2)}</span>
                            <span className="block font-bold text-emerald-600 text-[10px]">
                              Marzha: +€{(p.cmimi - p.cmimiBlerjes).toFixed(2)}
                            </span>
                          </td>
                        )}

                        {/* Stock Level */}
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                                isZero
                                  ? 'bg-rose-100 text-rose-800'
                                  : isLow
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {isZero ? '0 Jashtë Stokut' : `${p.stoku} copë`}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => onOpenStockModal(p)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-semibold text-xs transition"
                            title="Furnizo ose korigjo stokun"
                            id={`stock-btn-${p.id}`}
                          >
                            + Stok
                          </button>

                          {isManager && (
                            <>
                              <button
                                onClick={() => onOpenEditModal(p)}
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition"
                                title="Redakto produktin"
                                id={`edit-btn-${p.id}`}
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setProductToDelete(p)}
                                className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                                title="Fshij produktin"
                                id={`delete-btn-${p.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition space-y-3"
              >
                <div className="space-y-2">
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-50 border">
                    <img src={p.imazhi} alt={p.emri} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block">{p.sku}</span>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-2">{p.emri}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{p.pershkrimi}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Çmimi</span>
                    <span className="font-extrabold text-indigo-600 text-base">€{p.cmimi.toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Stoku</span>
                    <span className="font-bold text-slate-900 text-xs">{p.stoku} copë</span>
                  </div>
                </div>

                {isManager && (
                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      onClick={() => onOpenEditModal(p)}
                      className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs text-center transition"
                    >
                      Redakto
                    </button>
                    <button
                      onClick={() => onOpenStockModal(p)}
                      className="flex-1 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs text-center transition"
                    >
                      + Stok
                    </button>
                    <button
                      onClick={() => setProductToDelete(p)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Fshij produktin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Delete Product Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Fshi produktin?
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  A jeni të sigurt që dëshironi të fshini produktin{' '}
                  <span className="font-semibold text-slate-700">
                    "{productToDelete.emri}"
                  </span>
                  ?
                </p>
              </div>
              <button
                onClick={() => setProductToDelete(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Anulo
              </button>
              <button
                onClick={() => {
                  onDeleteProduct(productToDelete.id);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 transition"
              >
                Po, Fshije
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

