import React from 'react';
import { Bell, Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  onOpenMobileSidebar: () => void;
  lowStockCount?: number;
  onQuickLowStockClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onOpenMobileSidebar,
  lowStockCount = 0,
  onQuickLowStockClick,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 lg:hidden hover:bg-slate-100 transition"
          id="mobile-sidebar-toggle"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {lowStockCount > 0 && onQuickLowStockClick && (
          <button
            onClick={onQuickLowStockClick}
            className="relative p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition flex items-center space-x-1.5"
            title={`${lowStockCount} produkte me stok te ulet`}
            id="low-stock-alert-btn"
          >
            <Bell className="w-4 h-4 text-rose-600 animate-pulse" />
            <span className="text-xs font-bold">{lowStockCount}</span>
          </button>
        )}
      </div>
    </header>
  );
};
