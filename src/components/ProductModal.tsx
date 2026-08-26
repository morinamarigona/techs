import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { X, Package, Tag, DollarSign, Layers, Image as ImageIcon, FileText, AlertCircle } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  productToEdit?: Product | null;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id' | 'dataShtimit'> & { id?: string }) => void;
}

const CATEGORIES: Category[] = [
  'Telefonë & Tabletë',
  'Laptops & Kompjuterë',
  'Audio & Dëgjuese',
  'TV & Video',
  'Pajisje Shtëpiake',
  'Aksesorë & Tjera',
];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  productToEdit,
  onClose,
  onSave,
}) => {
  const [emri, setEmri] = useState('');
  const [sku, setSku] = useState('');
  const [kategoria, setKategoria] = useState<Category>('Telefonë & Tabletë');
  const [cmimi, setCmimi] = useState('');
  const [cmimiBlerjes, setCmimiBlerjes] = useState('');
  const [stoku, setStoku] = useState('');
  const [stokuMin, setStokuMin] = useState('3');
  const [pershkrimi, setPershkrimi] = useState('');
  const [imazhi, setImazhi] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (productToEdit) {
      setEmri(productToEdit.emri);
      setSku(productToEdit.sku);
      setKategoria(productToEdit.kategoria);
      setCmimi(String(productToEdit.cmimi));
      setCmimiBlerjes(String(productToEdit.cmimiBlerjes || ''));
      setStoku(String(productToEdit.stoku));
      setStokuMin(String(productToEdit.stokuMin));
      setPershkrimi(productToEdit.pershkrimi);
      setImazhi(productToEdit.imazhi);
    } else {
      setEmri('');
      setSku(`PRD-${Math.floor(1000 + Math.random() * 9000)}`);
      setKategoria('Telefonë & Tabletë');
      setCmimi('');
      setCmimiBlerjes('');
      setStoku('');
      setStokuMin('3');
      setPershkrimi('');
      setImazhi('https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80');
    }
    setErrors({});
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!emri.trim()) errs.emri = 'Emri i produktit është i detyrueshëm.';
    if (!sku.trim()) errs.sku = 'SKU / Kodi është i detyrueshëm.';
    if (!cmimi || Number(cmimi) <= 0) errs.cmimi = 'Jepni një çmim të vlefshëm (€).';
    if (stoku === '' || Number(stoku) < 0) errs.stoku = 'Sasia në stok nuk mund të jetë negative.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...(productToEdit ? { id: productToEdit.id } : {}),
      emri: emri.trim(),
      sku: sku.trim().toUpperCase(),
      kategoria,
      cmimi: parseFloat(cmimi),
      cmimiBlerjes: cmimiBlerjes ? parseFloat(cmimiBlerjes) : parseFloat(cmimi) * 0.75,
      stoku: parseInt(stoku, 10),
      stokuMin: parseInt(stokuMin, 10) || 2,
      pershkrimi: pershkrimi.trim(),
      imazhi: imazhi.trim() || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-lg">
              {productToEdit ? 'Redakto Produktin' : 'Shto Produkt të Ri'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            id="close-product-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Emri */}
            <div className="md:col-span-2">
              <label htmlFor="input-product-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Emri i Produktit *
              </label>
              <input
                type="text"
                value={emri}
                onChange={(e) => setEmri(e.target.value)}
                placeholder="sh.m. iPhone 15 Pro 128GB"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                  errors.emri
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
                id="input-product-name"
              />
              {errors.emri && <p className="text-xs text-rose-500 mt-1">{errors.emri}</p>}
            </div>

            {/* SKU */}
            <div>
              <label htmlFor="input-product-sku" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Kodi / SKU *
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="sh.m. APL-IP15P-128"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 uppercase"
                id="input-product-sku"
              />
              {errors.sku && <p className="text-xs text-rose-500 mt-1">{errors.sku}</p>}
            </div>

            {/* Kategoria */}
            <div>
              <label htmlFor="input-product-category" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Kategoria *
              </label>
              <select
                value={kategoria}
                onChange={(e) => setKategoria(e.target.value as Category)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
                id="input-product-category"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Çmimi i Shitjes */}
            <div>
              <label htmlFor="input-product-price" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Çmimi i Shitjes (€) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">€</span>
                <input
                  type="number"
                  step="0.01"
                  value={cmimi}
                  onChange={(e) => setCmimi(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-semibold"
                  id="input-product-price"
                />
              </div>
              {errors.cmimi && <p className="text-xs text-rose-500 mt-1">{errors.cmimi}</p>}
            </div>

            {/* Çmimi i Blerjes / Kushtimi */}
            <div>
              <label htmlFor="input-product-cost" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Çmimi i Blerjes (€)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">€</span>
                <input
                  type="number"
                  step="0.01"
                  value={cmimiBlerjes}
                  onChange={(e) => setCmimiBlerjes(e.target.value)}
                  placeholder="Opsionale (sh.m. 150.00)"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  id="input-product-cost"
                />
              </div>
            </div>

            {/* Sasia në Stok */}
            <div>
              <label htmlFor="input-product-stock" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Sasia në Stok *
              </label>
              <input
                type="number"
                value={stoku}
                onChange={(e) => setStoku(e.target.value)}
                placeholder="0"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-semibold"
                id="input-product-stock"
              />
              {errors.stoku && <p className="text-xs text-rose-500 mt-1">{errors.stoku}</p>}
            </div>

            {/* Stoku Minimal Alert Limit */}
            <div>
              <label htmlFor="input-product-min-stock" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Paralajmërim për Stok të Ultë (&le;)
              </label>
              <input
                type="number"
                value={stokuMin}
                onChange={(e) => setStokuMin(e.target.value)}
                placeholder="3"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                id="input-product-min-stock"
              />
            </div>

            {/* URL e Imazhit */}
            <div className="md:col-span-2">
              <label htmlFor="input-product-image" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                URL e Imazhit / Foto
              </label>
              <input
                type="url"
                value={imazhi}
                onChange={(e) => setImazhi(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                id="input-product-image"
              />
            </div>

            {/* Përshkrimi */}
            <div className="md:col-span-2">
              <label htmlFor="input-product-description" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Përshkrimi i Produktit
              </label>
              <textarea
                rows={3}
                value={pershkrimi}
                onChange={(e) => setPershkrimi(e.target.value)}
                placeholder="Të dhëna dhe specifikime teknike për produktin..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                id="input-product-description"
              />
            </div>

          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 text-sm transition"
              id="cancel-product-modal-btn"
            >
              Anulo
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition"
              id="save-product-modal-btn"
            >
              {productToEdit ? 'Ruaj Ndryshimet' : 'Shto Produktin'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
