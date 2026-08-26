import React from 'react';
import { User } from '../types';
import {
  LayoutDashboard,
  Layers,
  LogOut,
  Package,
  Receipt,
  Shield,
  ShoppingCart,
  Store,
  Users,
} from 'lucide-react';

export type TabType = 'dashboard' | 'products' | 'pos' | 'stock' | 'sales' | 'users';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  currentUser: User | null;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onLogout,
  isOpenMobile,
  onCloseMobile,
}) => {
  const isManager = currentUser?.roli === 'menaxher';

  const menuItems = [
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      roles: ['menaxher', 'punetor'],
      badge: 'Statistikat',
    },
    {
      id: 'pos' as TabType,
      label: 'Regjistro Shitje (POS)',
      icon: ShoppingCart,
      roles: ['menaxher', 'punetor'],
      badge: 'Shpejt',
    },
    {
      id: 'products' as TabType,
      label: 'Katalogu i Produkteve',
      icon: Package,
      roles: ['menaxher', 'punetor'],
    },
    {
      id: 'stock' as TabType,
      label: 'Menaxhimi i Stokut',
      icon: Layers,
      roles: ['menaxher', 'punetor'],
    },
    {
      id: 'sales' as TabType,
      label: isManager ? 'Te gjitha Shitjet' : 'Shitjet e Mia',
      icon: Receipt,
      roles: ['menaxher', 'punetor'],
    },
    {
      id: 'users' as TabType,
      label: 'Menaxhimi i Punetoreve',
      icon: Users,
      roles: ['menaxher'],
      badge: 'Menaxher',
    },
  ];

  const filteredItems = menuItems.filter((item) =>
    currentUser ? item.roles.includes(currentUser.roli) : false
  );

  return (
    <>
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-tight leading-none">
                TechStore <span className="text-indigo-400 font-extrabold">PRO</span>
              </h1>
              <p className="text-[11px] text-slate-400 mt-1">Sistemi i Dyqanit Elektronik</p>
            </div>
          </div>
        </div>

        {currentUser && (
          <div className="mx-4 my-4 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                isManager ? 'bg-indigo-600' : 'bg-emerald-600'
              }`}
            >
              {currentUser.emri[0]}
              {currentUser.mbiemri[0]}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-white text-xs truncate">
                {currentUser.emri} {currentUser.mbiemri}
              </span>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    isManager
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  <Shield className="w-2.5 h-2.5 mr-1" />
                  {isManager ? 'Menaxher' : 'Punetor'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Menuja Kryesore
          </p>

          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-xs transition group ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
                id={`nav-item-${item.id}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 transition ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-3 border-t border-slate-800 bg-slate-950">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-semibold text-xs transition"
            id="logout-sidebar-btn"
          >
            <LogOut className="w-4 h-4" />
            <span>Çkyçu nga llogaria</span>
          </button>
        </div>
      </aside>
    </>
  );
};
