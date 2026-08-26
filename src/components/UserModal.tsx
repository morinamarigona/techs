import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { X, User as UserIcon, Shield, Mail, Phone, Lock } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  userToEdit?: User | null;
  onClose: () => void;
  onSave: (userData: Omit<User, 'id' | 'dataKrijimit'> & { id?: string }) => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  userToEdit,
  onClose,
  onSave,
}) => {
  const [emri, setEmri] = useState('');
  const [mbiemri, setMbiemri] = useState('');
  const [email, setEmail] = useState('');
  const [roli, setRoli] = useState<UserRole>('punetor');
  const [statusi, setStatusi] = useState<'Aktiv' | 'Jo-aktiv'>('Aktiv');
  const [numriTelefonit, setNumriTelefonit] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (userToEdit) {
      setEmri(userToEdit.emri);
      setMbiemri(userToEdit.mbiemri);
      setEmail(userToEdit.email);
      setRoli(userToEdit.roli);
      setStatusi(userToEdit.statusi);
      setNumriTelefonit(userToEdit.numriTelefonit);
    } else {
      setEmri('');
      setMbiemri('');
      setEmail('');
      setRoli('punetor');
      setStatusi('Aktiv');
      setNumriTelefonit('+383 49 ');
    }
    setPassword('');
    setConfirmPassword('');
    setErrors({});
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!emri.trim()) errs.emri = 'Emri është i detyrueshëm.';
    if (!mbiemri.trim()) errs.mbiemri = 'Mbiemri është i detyrueshëm.';
    if (!email.trim() || !email.includes('@')) errs.email = 'Jepni një email të vlefshëm.';

    if (!userToEdit) {
      if (!password) errs.password = 'Fjalëkalimi është i detyrueshëm.';
      else if (password.length < 6) errs.password = 'Fjalëkalimi duhet të ketë të paktën 6 karaktere.';
      if (password !== confirmPassword) errs.confirmPassword = 'Fjalëkalimet nuk përputhen.';
    } else if (password) {
      if (password.length < 6) errs.password = 'Fjalëkalimi duhet të ketë të paktën 6 karaktere.';
      if (password !== confirmPassword) errs.confirmPassword = 'Fjalëkalimet nuk përputhen.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...(userToEdit ? { id: userToEdit.id } : {}),
      emri: emri.trim(),
      mbiemri: mbiemri.trim(),
      email: email.trim().toLowerCase(),
      roli,
      statusi,
      numriTelefonit: numriTelefonit.trim(),
      ...(password ? { password } : {}),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center space-x-2">
            <UserIcon className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base">
              {userToEdit ? 'Redakto Përdoruesin' : 'Shto Punëtor / Përdorues'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            id="close-user-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            {/* Emri */}
            <div>
              <label htmlFor="input-user-first-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Emri *
              </label>
              <input
                type="text"
                value={emri}
                onChange={(e) => setEmri(e.target.value)}
                placeholder="sh.m. Yllka"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                id="input-user-first-name"
              />
              {errors.emri && <p className="text-xs text-rose-500 mt-1">{errors.emri}</p>}
            </div>

            {/* Mbiemri */}
            <div>
              <label htmlFor="input-user-last-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Mbiemri *
              </label>
              <input
                type="text"
                value={mbiemri}
                onChange={(e) => setMbiemri(e.target.value)}
                placeholder="sh.m. Rama"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                id="input-user-last-name"
              />
              {errors.mbiemri && <p className="text-xs text-rose-500 mt-1">{errors.mbiemri}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="input-user-email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Adresa e Email-it *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="punetori@techstore.al"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              id="input-user-email"
            />
            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
          </div>

          {/* Numri Telefonit */}
          <div>
            <label htmlFor="input-user-phone" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Numri i Telefonit
            </label>
            <input
              type="text"
              value={numriTelefonit}
              onChange={(e) => setNumriTelefonit(e.target.value)}
              placeholder="+383 49 123 456"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              id="input-user-phone"
            />
          </div>

          {/* Fjalëkalimi */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label htmlFor="input-user-password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {userToEdit ? 'Fjalëkalim i Ri' : 'Fjalëkalimi *'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={userToEdit ? 'Lëreni bosh për ta mbajtur' : 'Min. 6 karaktere'}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  id="input-user-password"
                />
              </div>
              {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="input-user-confirm-password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {userToEdit ? 'Konfirmo Fjalëkalimin' : 'Konfirmo Fjalëkalimin *'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Përsërit fjalëkalimin"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  id="input-user-confirm-password"
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-rose-500 mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Roli */}
            <div>
              <label htmlFor="select-user-role" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Roli i Qasjes
              </label>
              <select
                value={roli}
                onChange={(e) => setRoli(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white font-medium"
                id="select-user-role"
              >
                <option value="punetor">Punëtor (Shitje & Stok)</option>
                <option value="menaxher">Menaxher (Qasje e Plotë)</option>
              </select>
            </div>

            {/* Statusi */}
            <div>
              <label htmlFor="select-user-status" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Statusi i Llogarisë
              </label>
              <select
                value={statusi}
                onChange={(e) => setStatusi(e.target.value as 'Aktiv' | 'Jo-aktiv')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white font-medium"
                id="select-user-status"
              >
                <option value="Aktiv">Aktiv</option>
                <option value="Jo-aktiv">Jo-aktiv (I bllokuar)</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-xl text-xs text-amber-800 flex items-start space-x-2">
            <Shield className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p>
              Punëtorët kanë qasje vetëm te shikimi i stokut, regjistrimi i shitjeve të reja dhe historiku i shitjeve personale. Menaxheri kontrollon menytë e plota administrative.
            </p>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 text-sm transition"
              id="cancel-user-modal"
            >
              Anulo
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition"
              id="save-user-modal"
            >
              Ruaj Përdoruesin
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
