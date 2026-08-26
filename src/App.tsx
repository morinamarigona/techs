import React, { useState, useEffect } from 'react';
import { User, Product, Sale, StockLog } from './types';
import {
  getCurrentUser,
  setCurrentUser,
  getAuthToken,
  setAuthToken,
} from './utils/storage';

import { Sidebar, TabType } from './components/Sidebar';
import { Header } from './components/Header';
import { Login } from './components/Login';

import { InvoiceModal } from './components/InvoiceModal';
import { ProductModal } from './components/ProductModal';
import { StockModal } from './components/StockModal';
import { UserModal } from './components/UserModal';

import { DashboardView } from './views/DashboardView';
import { ProductsView } from './views/ProductsView';
import { PosView } from './views/PosView';
import { StockView } from './views/StockView';
import { SalesHistoryView } from './views/SalesHistoryView';
import { UsersView } from './views/UsersView';
import { fetchWithRetry } from './utils/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [sessionLoadingMessage, setSessionLoadingMessage] = useState('Duke u ngarkuar...');

  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [activeInvoice, setActiveInvoice] = useState<Sale | null>(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockTargetProduct, setStockTargetProduct] = useState<Product | null>(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const authHeaders = () => {
    const token = getAuthToken();
    return token
      ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      : { 'Content-Type': 'application/json' };
  };

  const fetchUsersFromServer = async (): Promise<User[] | null> => {
    try {
      const res = await fetch(`${API_BASE}/api/users`, { headers: authHeaders() });
      if (!res.ok) return null;
      const payload = await res.json();
      return payload.users || null;
    } catch (e) {
      console.error('Failed to fetch users from server', e);
      return null;
    }
  };

  const fetchProductsFromServer = async (): Promise<Product[] | null> => {
    try {
      const res = await fetch(`${API_BASE}/api/products`, { headers: authHeaders() });
      if (!res.ok) return null;
      const payload = await res.json();
      return payload.products || null;
    } catch (e) {
      console.error('Failed to fetch products from server', e);
      return null;
    }
  };

  const fetchSalesFromServer = async (): Promise<Sale[] | null> => {
    try {
      const res = await fetch(`${API_BASE}/api/sales`, { headers: authHeaders() });
      if (!res.ok) return null;
      const payload = await res.json();
      return payload.sales || null;
    } catch (e) {
      console.error('Failed to fetch sales from server', e);
      return null;
    }
  };

  const fetchStockLogsFromServer = async (): Promise<StockLog[] | null> => {
    try {
      const res = await fetch(`${API_BASE}/api/stock/logs`, { headers: authHeaders() });
      if (!res.ok) return null;
      const payload = await res.json();
      return payload.stockLogs || null;
    } catch (e) {
      console.error('Failed to fetch stock logs from server', e);
      return null;
    }
  };

  const refreshAllData = async () => {
    const token = getAuthToken();
    if (!token) {
      setAllUsers([]);
      setProducts([]);
      setSales([]);
      setStockLogs([]);
      return;
    }

    const [serverUsers, serverProducts, serverSales, serverStockLogs] = await Promise.all([
      fetchUsersFromServer(),
      fetchProductsFromServer(),
      fetchSalesFromServer(),
      fetchStockLogsFromServer(),
    ]);

    if (serverUsers) setAllUsers(serverUsers);
    if (serverProducts) setProducts(serverProducts);
    if (serverSales) setSales(serverSales);
    if (serverStockLogs) setStockLogs(serverStockLogs);
  };

  const restoreSession = async () => {
    const token = getAuthToken();
    if (!token) {
      setIsSessionLoading(false);
      return;
    }

    try {
      setSessionLoadingMessage('Duke u lidhur me serverin...');
      const res = await fetchWithRetry(`${API_BASE}/api/auth/me`, { headers: authHeaders() });
      if (res.ok) {
        const payload = await res.json();
        const user = payload.user as User;
        setCurrentUser(user);
        setCurrentUserState(user);
        await refreshAllData();
      } else {
        setAuthToken(null);
        setCurrentUser(null);
        setCurrentUserState(null);
      }
    } catch (e) {
      console.error('Session restore failed', e);
      setSessionLoadingMessage('Serveri po ngrihet (hosting falas). Provoni përsëri...');
      const cachedUser = getCurrentUser();
      if (cachedUser) {
        setCurrentUserState(cachedUser);
        await refreshAllData();
      } else {
        setAuthToken(null);
        setCurrentUser(null);
      }
    } finally {
      setIsSessionLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentUserState(user);
    setCurrentTab('dashboard');
    showToast(`Mirë se vini, ${user.emri}! Kyçja u krye si ${user.roli}.`);
    refreshAllData();
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setCurrentUserState(null);
    setAllUsers([]);
    setProducts([]);
    setSales([]);
    setStockLogs([]);
  };

  const handleCompleteSale = (
    saleData: Omit<Sale, 'id' | 'nrFatures' | 'data'>
  ) => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/sales`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            items: saleData.items.map((item) => ({
              productId: item.productId,
              sasia: item.sasia,
            })),
            zbritja: saleData.zbritja,
            menyraPageses: saleData.menyraPageses,
            klientEmri: saleData.klientEmri || '',
          }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Server sale failed');
        }
        const payload = await res.json();
        const sale = payload.sale as Sale;
        setActiveInvoice(sale);
        showToast(`Shitja u regjistrua! Fatura #${sale.nrFatures}. Stoku u përditësua automatikisht.`);

        const [serverProducts, serverSales, serverStockLogs] = await Promise.all([
          fetchProductsFromServer(),
          fetchSalesFromServer(),
          fetchStockLogsFromServer(),
        ]);
        if (serverProducts) setProducts(serverProducts);
        if (serverSales) setSales(serverSales);
        if (serverStockLogs) setStockLogs(serverStockLogs);
      } catch (err: unknown) {
        console.error(err);
        const message = err instanceof Error ? err.message : 'Gabim me serverin gjatë regjistrimit të shitjes.';
        showToast(message);
      }
    })();
  };

  const handleSaveProduct = (
    pData: Omit<Product, 'id' | 'dataShtimit'> & { id?: string }
  ) => {
    (async () => {
      try {
        if (pData.id) {
          const res = await fetch(`${API_BASE}/api/products/${pData.id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(pData),
          });
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || 'Server update failed');
          }
          showToast(`Produkti "${pData.emri}" u ndryshua me sukses.`);
        } else {
          const res = await fetch(`${API_BASE}/api/products`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(pData),
          });
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || 'Server create failed');
          }
          showToast(`Produkti i ri "${pData.emri}" u shtua me sukses.`);
        }
      } catch (err: unknown) {
        console.error(err);
        const message = err instanceof Error ? err.message : 'Gabim me serverin gjatë ruajtjes së produktit.';
        showToast(message);
      }

      const serverProducts = await fetchProductsFromServer();
      if (serverProducts) setProducts(serverProducts);
    })();
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok) {
        showToast('Produkti u fshi nga katalogu.');
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.message || 'Dështoi fshirja nga serveri.');
      }
    } catch (e) {
      console.error('Delete product error', e);
      showToast('Gabim gjatë lidhjes me serverin për fshirje.');
    }

    const serverProducts = await fetchProductsFromServer();
    if (serverProducts) setProducts(serverProducts);
  };

  const handleConfirmStockAdjust = (
    productId: string,
    sasiaNdryshuar: number,
    lloji: 'Hyrje Furnizimi' | 'Korigjim Stokut',
    _perdoruesi: string,
    shenime?: string
  ) => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/stock/adjust`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            productId,
            sasiaNdryshuar,
            lloji,
            shenime: shenime || '',
          }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Stock adjust failed');
        }
        showToast('Stoku u përditësua me sukses!');

        const [serverProducts, serverStockLogs] = await Promise.all([
          fetchProductsFromServer(),
          fetchStockLogsFromServer(),
        ]);
        if (serverProducts) setProducts(serverProducts);
        if (serverStockLogs) setStockLogs(serverStockLogs);
      } catch (err: unknown) {
        console.error(err);
        const message = err instanceof Error ? err.message : 'Gabim me serverin gjatë përditësimit të stokut.';
        showToast(message);
      }
    })();
  };

  const handleSaveUser = (
    uData: Omit<User, 'id' | 'dataKrijimit'> & { id?: string }
  ) => {
    (async () => {
      try {
        if (uData.id) {
          const res = await fetch(`${API_BASE}/api/users/${uData.id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(uData),
          });
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || 'Server update failed');
          }
          showToast(`Të dhënat e përdoruesit ${uData.emri} u ruajtën.`);
        } else {
          const res = await fetch(`${API_BASE}/api/users`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(uData),
          });
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || 'Server create failed');
          }
          showToast(`Punëtori i ri ${uData.emri} ${uData.mbiemri} u shtua me sukses.`);
        }
      } catch (err: unknown) {
        console.error(err);
        const message = err instanceof Error ? err.message : 'Gabim me serverin gjatë ruajtjes së përdoruesit.';
        showToast(message);
      }

      const serverUsers = await fetchUsersFromServer();
      if (serverUsers) setAllUsers(serverUsers);
    })();
  };

  const handleToggleUserStatus = (userId: string) => {
    (async () => {
      const targetUser = allUsers.find((u) => u.id === userId);
      const newStatus = targetUser?.statusi === 'Aktiv' ? 'Jo-aktiv' : 'Aktiv';

      try {
        const res = await fetch(`${API_BASE}/api/users/${userId}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify({ statusi: newStatus }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Status update failed');
        }
        showToast(`Statusi i përdoruesit u përditësua (${newStatus}).`);
      } catch (e) {
        console.error('Toggle status error', e);
        showToast('Dështoi përditësimi i statusit në server.');
      }

      const serverUsers = await fetchUsersFromServer();
      if (serverUsers) setAllUsers(serverUsers);
    })();
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/${userId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok) {
        showToast('Përdoruesi u fshi me sukses!');
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.message || 'Dështoi fshirja nga serveri.');
      }
    } catch (e) {
      console.error('Delete user error', e);
      showToast('Gabim gjatë lidhjes me serverin për fshirje.');
    }

    const serverUsers = await fetchUsersFromServer();
    if (serverUsers) setAllUsers(serverUsers);
  };

  const lowStockCount = products.filter((p) => p.stoku <= p.stokuMin).length;

  if (isSessionLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
        <p className="text-slate-300 text-sm">{sessionLoadingMessage}</p>
        <p className="text-slate-500 text-xs max-w-sm text-center">
          Në hosting falas (Render), serveri mund të duhet 30–60 sekonda për të u zgjuar.
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'pos':
        return 'Regjistro Shitje (POS)';
      case 'products':
        return 'Katalogu i Produkteve';
      case 'stock':
        return 'Menaxhimi i Stokut';
      case 'sales':
        return currentUser.roli === 'menaxher' ? 'Të gjitha Shitjet' : 'Shitjet e Mia';
      case 'users':
        return 'Menaxhimi i Punëtorëve';
      default:
        return 'TechStore';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 antialiased flex">
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Header
          title={getTabTitle()}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          lowStockCount={lowStockCount}
          onQuickLowStockClick={() => setCurrentTab('stock')}
        />

        {toastMessage && (
          <div className="mx-4 lg:mx-8 mt-4 p-3 bg-slate-900 text-white font-medium text-xs rounded-xl shadow-lg flex items-center justify-between border border-slate-700 animate-in fade-in duration-200">
            <span>✨ {toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white text-xs font-bold ml-4"
            >
              Mbyll
            </button>
          </div>
        )}

        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              products={products}
              sales={sales}
              users={allUsers}
              stockLogs={stockLogs}
              currentUser={currentUser}
              onNavigateTab={(t) => setCurrentTab(t)}
              onOpenInvoice={(s) => setActiveInvoice(s)}
              onOpenAddProduct={() => {
                setProductToEdit(null);
                setIsProductModalOpen(true);
              }}
            />
          )}

          {currentTab === 'pos' && (
            <PosView
              products={products}
              currentUser={currentUser}
              onCompleteSale={handleCompleteSale}
            />
          )}

          {currentTab === 'products' && (
            <ProductsView
              products={products}
              currentUser={currentUser}
              onOpenAddModal={() => {
                setProductToEdit(null);
                setIsProductModalOpen(true);
              }}
              onOpenEditModal={(p) => {
                setProductToEdit(p);
                setIsProductModalOpen(true);
              }}
              onOpenStockModal={(p) => {
                setStockTargetProduct(p);
                setIsStockModalOpen(true);
              }}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {currentTab === 'stock' && (
            <StockView
              products={products}
              stockLogs={stockLogs}
              currentUser={currentUser}
              onOpenStockModal={(p) => {
                setStockTargetProduct(p);
                setIsStockModalOpen(true);
              }}
            />
          )}

          {currentTab === 'sales' && (
            <SalesHistoryView
              sales={sales}
              currentUser={currentUser}
              onOpenInvoice={(s) => setActiveInvoice(s)}
            />
          )}

          {currentTab === 'users' && (
            <UsersView
              users={allUsers}
              sales={sales}
              currentUser={currentUser}
              onOpenAddUser={() => {
                setUserToEdit(null);
                setIsUserModalOpen(true);
              }}
              onOpenEditUser={(u) => {
                setUserToEdit(u);
                setIsUserModalOpen(true);
              }}
              onToggleUserStatus={handleToggleUserStatus}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </main>

        <footer className="border-t border-slate-200/80 bg-white py-4 px-6 text-center text-xs text-slate-500">
          <p>TechStore Pro &copy; 2026 — Sistem i Menaxhimit të Dyqanit Elektronik (Projekt Universitar)</p>
        </footer>
      </div>

      <InvoiceModal
        sale={activeInvoice}
        onClose={() => setActiveInvoice(null)}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        productToEdit={productToEdit}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
        onSave={handleSaveProduct}
      />

      <StockModal
        isOpen={isStockModalOpen}
        product={stockTargetProduct}
        currentUserEmri={`${currentUser.emri} ${currentUser.mbiemri}`}
        onClose={() => {
          setIsStockModalOpen(false);
          setStockTargetProduct(null);
        }}
        onConfirm={handleConfirmStockAdjust}
      />

      <UserModal
        isOpen={isUserModalOpen}
        userToEdit={userToEdit}
        onClose={() => {
          setIsUserModalOpen(false);
          setUserToEdit(null);
        }}
        onSave={handleSaveUser}
      />
    </div>
  );
}
