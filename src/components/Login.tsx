import React, { useState } from 'react';
import { User } from '../types';
import { setAuthToken, setCurrentUser } from '../utils/storage';
import { fetchWithRetry } from '../utils/api';
import { Store, Lock, Mail } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    (async () => {
      try {
        const res = await fetchWithRetry(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        });

        if (res.ok) {
          const payload = await res.json();
          const { token, user } = payload;
          setAuthToken(token);
          setCurrentUser(user);
          onLogin(user);
          return;
        }

        const errData = await res.json().catch(() => ({}));
        setError(errData.message || 'Email ose fjalekalim i pasakte.');
      } catch (err) {
        console.error('Backend login failed', err);
        setError('Nuk u lidh dot me serverin. Në hosting falas duhet 30–60s për të u zgjuar — provoni përsëri.');
      } finally {
        setIsLoading(false);
      }
    })();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-emerald-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-xl w-full space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/30">
            <Store className="w-9 h-9" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            TechStore <span className="text-indigo-400">PRO</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
            Sistemi i Menaxhimit te Dyqanit te Elektronikes - kyquni me llogarine tuaj per te vazhduar
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Kyquni me email dhe fjalekalim:
          </p>

          <form onSubmit={handleCustomLogin} className="space-y-3">
            <div>
              <label htmlFor="login-email-input" className="block text-xs font-medium text-slate-300 mb-1">Email:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="username@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  id="login-email-input"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password-input" className="block text-xs font-medium text-slate-300 mb-1">Fjalekalimi:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  id="login-password-input"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-400 font-medium bg-rose-950/40 p-2.5 rounded-lg border border-rose-800/40">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-600/20"
              id="submit-login-btn"
            >
              {isLoading ? 'Duke u kyqur...' : 'Hyr ne Sistem'}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-slate-500">
          TechStore Pro &copy; 2026 - Sistem i Menaxhimit te Dyqanit Elektronik
        </p>
      </div>
    </div>
  );
};
