import React, { useState } from 'react';
import { Product, CartItem, Category, User, Sale } from '../types';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Check,
  CreditCard,
  DollarSign,
  AlertCircle,
  Sparkles,
  Tag,
  UserCheck,
  Receipt,
  Layers,
} from 'lucide-react';

interface PosViewProps {
  products: Product[];
  currentUser: User | null;
  onCompleteSale: (saleData: Omit<Sale, 'id' | 'nrFatures' | 'data'>) => void;
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

export const PosView: React.FC<PosViewProps> = ({
  products,
  currentUser,
  onCompleteSale,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Të gjitha'>('Të gjitha');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Kesh' | 'Kartelë' | 'Me Këste'>('Kesh');
  const [customerName, setCustomerName] = useState('');

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'Të gjitha' || p.kategoria === selectedCategory;
    const matchesSearch =
      p.emri.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.kategoria.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Cart operations
  const addToCart = (product: Product) => {
    if (product.stoku <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        // Check stock limit
        if (existing.sasia >= product.stoku) {
          alert(`Nuk mund të shtoni më shumë se ${product.stoku} copë pasi kaq është sasia totale në stok!`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                sasia: item.sasia + 1,
                cmimiTotal: (item.sasia + 1) * item.product.cmimi,
              }
            : item
        );
      } else {
        return [
          ...prev,
          {
            product,
            sasia: 1,
            cmimiTotal: product.cmimi,
          },
        ];
      }
    });
  };

  const updateQuantity = (productId: string, newQty: number) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    if (newQty <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }

    if (newQty > targetProduct.stoku) {
      alert(`Stoku maksimal në dispozicion është ${targetProduct.stoku} copë!`);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              sasia: newQty,
              cmimiTotal: newQty * item.product.cmimi,
            }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const grossTotal = cart.reduce((acc, item) => acc + item.cmimiTotal, 0);
  const discountValue = (grossTotal * discountPercent) / 100;
  const netTotal = Math.max(0, grossTotal - discountValue);
  const tvshValue = netTotal * 0.18; // 18% TVSH included

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (!currentUser) return;

    const saleItems = cart.map((item) => ({
      productId: item.product.id,
      produktEmri: item.product.emri,
      sku: item.product.sku,
      sasia: item.sasia,
      cmimiNjesi: item.product.cmimi,
      total: item.cmimiTotal,
    }));

    onCompleteSale({
      punetoriId: currentUser.id,
      punetoriEmri: `${currentUser.emri} ${currentUser.mbiemri}`,
      items: saleItems,
      shumaBruto: grossTotal,
      zbritja: discountPercent,
      tvsh: tvshValue,
      shumaNeto: netTotal,
      menyraPageses: paymentMethod,
      klientEmri: customerName.trim() || undefined,
    });

    // Reset POS form
    clearCart();
    setDiscountPercent(0);
    setCustomerName('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Left Column: Product Selection Grid (7 Cols on desktop) */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-4">
        
        {/* Search & Category Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kërko produktin me emër ose SKU barkod..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              id="pos-search-input"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
                id={`pos-category-${cat.toLowerCase().replace(/ /g, '-')}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredProducts.map((p) => {
            const itemInCart = cart.find((c) => c.product.id === p.id);
            const isOutOfStock = p.stoku <= 0;

            return (
              <div
                key={p.id}
                onClick={() => !isOutOfStock && addToCart(p)}
                className={`group relative bg-white rounded-2xl p-3 border transition flex flex-col justify-between ${
                  isOutOfStock
                    ? 'opacity-50 cursor-not-allowed border-slate-200 bg-slate-50'
                    : 'cursor-pointer hover:border-indigo-500 hover:shadow-md border-slate-200/80'
                }`}
                id={`pos-product-card-${p.id}`}
              >
                {/* Stock Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase truncate">
                    {p.sku}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isOutOfStock
                        ? 'bg-rose-100 text-rose-700'
                        : p.stoku <= p.stokuMin
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isOutOfStock ? 'Ska Stok' : `${p.stoku} në stok`}
                  </span>
                </div>

                {/* Product Image */}
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-50 mb-2 border border-slate-100">
                  <img
                    src={p.imazhi}
                    alt={p.emri}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                {/* Title & Price */}
                <div>
                  <h4 className="font-bold text-slate-900 text-xs line-clamp-2 h-8 leading-snug">
                    {p.emri}
                  </h4>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <span className="font-extrabold text-indigo-600 text-sm">
                      €{p.cmimi.toFixed(2)}
                    </span>
                    {itemInCart ? (
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-600 text-white font-bold text-xs">
                        x{itemInCart.sasia}
                      </span>
                    ) : (
                      <div className="p-1 rounded-lg bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Right Column: Active Cart & Checkout Panel (5 Cols on desktop) */}
      <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-md p-5 space-y-4 sticky top-20">
        
        {/* Cart Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">Shporta e Shitjes</h3>
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs">
              {cart.reduce((a, b) => a + b.sasia, 0)}
            </span>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-500 hover:text-rose-700 font-medium transition"
              id="clear-cart-btn"
            >
              Pastro
            </button>
          )}
        </div>

        {/* Cart Items List */}
        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 pr-1">
          {cart.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <ShoppingCart className="w-10 h-10 mx-auto text-slate-200" />
              <p className="text-xs font-medium">Klikoni mbi produktet për t'i shtuar në shportë</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="py-3 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h5 className="font-bold text-slate-800 text-xs truncate">{item.product.emri}</h5>
                  <p className="text-[11px] text-slate-500">
                    €{item.product.cmimi.toFixed(2)} / copë
                  </p>
                </div>

                {/* Quantity Buttons */}
                <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.sasia - 1)}
                    className="p-1 rounded-lg hover:bg-white text-slate-700 transition"
                    id={`decrease-qty-${item.product.id}`}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-slate-900">
                    {item.sasia}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.sasia + 1)}
                    className="p-1 rounded-lg hover:bg-white text-slate-700 transition"
                    id={`increase-qty-${item.product.id}`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Line Total */}
                <div className="text-right min-w-[60px]">
                  <p className="font-bold text-slate-900 text-xs">€{item.cmimiTotal.toFixed(2)}</p>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-slate-300 hover:text-rose-500 transition"
                    id={`remove-item-${item.product.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5 ml-auto" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Options */}
        {cart.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-slate-100">
            
            {/* Customer Name & Discount */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="pos-customer-input" className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Blerësi (Opsionale)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Emri i klientit"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                  id="pos-customer-input"
                />
              </div>
              <div>
                <label htmlFor="pos-discount-input" className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Zbritje (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={discountPercent || ''}
                  onChange={(e) => setDiscountPercent(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  placeholder="0%"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                  id="pos-discount-input"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Mënyra e Pagesës
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Kesh', 'Kartelë', 'Me Këste'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition border ${
                      paymentMethod === method
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                    id={`payment-method-${method.toLowerCase()}`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Totals Summary */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Shuma Bruto:</span>
                <span className="font-semibold">€{grossTotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>Zbritja ({discountPercent}%):</span>
                  <span>-€{discountValue.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Përfshirë TVSH (18%):</span>
                <span>€{tvshValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>TOTALI:</span>
                <span className="text-indigo-600">€{netTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2"
              id="confirm-sale-checkout-btn"
            >
              <Receipt className="w-4 h-4" />
              <span>Përfundo & Ngarko Faturën</span>
            </button>

          </div>
        )}

      </div>

    </div>
  );
};
