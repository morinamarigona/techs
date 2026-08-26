import React, { useState } from 'react';
import { Product } from '../types';
import { X, Layers, PlusCircle, MinusCircle, FileText } from 'lucide-react';

interface StockModalProps {
  isOpen: boolean;
  product: Product | null;
  currentUserEmri: string;
  onClose: () => void;
  onConfirm: (
    productId: string,
    sasiaNdryshuar: number,
    lloji: 'Hyrje Furnizimi' | 'Korigjim Stokut',
    perdoruesi: string,
    shenime?: string
  ) => void;
}

export const StockModal: React.FC<StockModalProps> = ({
  isOpen,
  product,
  currentUserEmri,
  onClose,
  onConfirm,
}) => {
  const [sasia, setSasia] = useState('10');
  const [lloji, setLloji] = useState<'Hyrje Furnizimi' | 'Korigjim Stokut'>('Hyrje Furnizimi');
  const [operacioni, setOperacioni] = useState<'shto' | 'zbrit'>('shto');
  const [shenime, setShenime] = useState('');

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSasia = parseInt(sasia, 10);
    if (isNaN(parsedSasia) || parsedSasia <= 0) return;

    const finalAmount = operacioni === 'shto' ? parsedSasia : -parsedSasia;
    onConfirm(product.id, finalAmount, lloji, currentUserEmri, shenime.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base">Furnizim & Menaxhim Stokut</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            id="close-stock-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Target Product Info */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center space-x-3">
            <img
              src={product.imazhi}
              alt={product.emri}
              className="w-12 h-12 rounded-lg object-cover bg-white border"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500 font-mono">{product.sku}</p>
              <h4 className="text-sm font-bold text-slate-900 truncate">{product.emri}</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Stoku Aktual:{' '}
                <span className="font-bold text-indigo-600">{product.stoku} copë</span>
              </p>
            </div>
          </div>

          {/* Operation type selector */}
          <div>
            <label htmlFor="input-stock-amount" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Veprimi i Stokut
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setOperacioni('shto');
                  setLloji('Hyrje Furnizimi');
                }}
                className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition ${
                  operacioni === 'shto'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-100'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                id="btn-stock-add"
              >
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <span>+ Shto Stok (Furnizim)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setOperacioni('zbrit');
                  setLloji('Korigjim Stokut');
                }}
                className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition ${
                  operacioni === 'zbrit'
                    ? 'border-rose-500 bg-rose-50 text-rose-800 ring-2 ring-rose-100'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                id="btn-stock-remove"
              >
                <MinusCircle className="w-4 h-4 text-rose-600" />
                <span>- Zbrit Stok (Korigjim)</span>
              </button>
            </div>
          </div>

          {/* Sasia */}
          <div>
            <label htmlFor="input-stock-amount" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Sasia në Stok
            </label>
            <input
              type="number"
              min="1"
              value={sasia}
              onChange={(e) => setSasia(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-base font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              required
              id="input-stock-amount"
            />
          </div>

          {/* Shënime */}
          <div>
            <label htmlFor="input-stock-notes" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Arsyeja / Shënime
            </label>
            <input
              type="text"
              value={shenime}
              onChange={(e) => setShenime(e.target.value)}
              placeholder={
                operacioni === 'shto'
                  ? 'sh.m. Furnizim i ri nga distributori'
                  : 'sh.m. Korigjim inventari / Produkt i dëmtuar'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              id="input-stock-notes"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 text-sm transition"
              id="cancel-stock-modal"
            >
              Anulo
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl text-white font-semibold text-sm shadow-sm transition ${
                operacioni === 'shto'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
              id="confirm-stock-modal"
            >
              Përditëso Stokun
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
