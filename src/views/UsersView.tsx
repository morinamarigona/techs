import React, { useState } from 'react';
import { User, Sale } from '../types';
import { Plus, Edit, Trash2, Phone, Mail, X } from 'lucide-react';

interface UsersViewProps {
  users: User[];
  sales: Sale[];
  currentUser: User | null;
  onOpenAddUser: () => void;
  onOpenEditUser: (user: User) => void;
  onToggleUserStatus: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export const UsersView: React.FC<UsersViewProps> = ({
  users,
  sales,
  currentUser,
  onOpenAddUser,
  onOpenEditUser,
  onToggleUserStatus,
  onDeleteUser,
}) => {
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const isManager = currentUser?.roli === 'menaxher';

  if (!isManager) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center max-w-md">
          <h3 className="text-lg font-bold text-slate-900">
            Qasje e Kufizuar
          </h3>

          <p className="text-sm text-slate-500 mt-2">
            Vetëm Menaxheri i dyqanit ka të drejtë të menaxhojë llogaritë dhe
            rolet e punëtorëve.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Menaxhimi i Punëtorëve
            </h2>

            <p className="text-xs text-slate-500">
              Ekipi i punëtorëve të dyqanit dhe menaxhimi i të drejtave të qasjes
            </p>
          </div>

          <button
            onClick={onOpenAddUser}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition"
            id="add-user-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Shto Punëtor të Ri</span>
          </button>
        </div>

        {/* Users */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => {
            const userSales = sales.filter(
              (s) => s.punetoriId === u.id
            );

            const totalSalesRevenue = userSales.reduce(
              (acc, s) => acc + s.shumaNeto,
              0
            );

            const avatarClass =
              u.roli === 'menaxher'
                ? 'w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-white text-sm shadow-md bg-indigo-600'
                : 'w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-white text-sm shadow-md bg-emerald-600';

            const roleClass =
              u.roli === 'menaxher'
                ? 'inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700'
                : 'inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700';

            const statusClass =
              u.statusi === 'Aktiv'
                ? 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200';

            const actionClass =
              u.statusi === 'Aktiv'
                ? 'px-3 py-1.5 rounded-xl text-xs font-semibold transition bg-rose-50 text-rose-700 hover:bg-rose-100'
                : 'px-3 py-1.5 rounded-xl text-xs font-semibold transition bg-emerald-50 text-emerald-700 hover:bg-emerald-100';

            return (
              <div
                key={u.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-300 transition"
              >
                <div className="space-y-3">

                  {/* User Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">

                      <div className={avatarClass}>
                        {u.emri?.[0] || ''}
                        {u.mbiemri?.[0] || ''}
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {u.emri} {u.mbiemri}
                        </h4>

                        <span className={roleClass}>
                          {u.roli === 'menaxher'
                            ? 'Menaxher'
                            : 'Punëtor'}
                        </span>
                      </div>
                    </div>

                    <span className={statusClass}>
                      {u.statusi}
                    </span>
                  </div>

                  {/* Contact */}
                  <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">

                    <div className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{u.email}</span>
                    </div>

                    {u.numriTelefonit && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{u.numriTelefonit}</span>
                      </div>
                    )}

                  </div>

                  {/* Sales */}
                  <div className="p-3 bg-slate-50 rounded-xl grid grid-cols-2 gap-2 text-xs">

                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        Shitjet Total:
                      </span>

                      <span className="font-bold text-slate-900">
                        {userSales.length} faturime
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        Xhiroja:
                      </span>

                      <span className="font-extrabold text-emerald-600">
                        €{totalSalesRevenue.toFixed(2)}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">

                  <button
                    onClick={() => onToggleUserStatus(u.id)}
                    className={actionClass}
                    id={'toggle-status-btn-' + u.id}
                  >
                    {u.statusi === 'Aktiv'
                      ? 'Çaktivizo'
                      : 'Aktivizo'}
                  </button>

                  <div className="flex items-center space-x-1">

                    <button
                      onClick={() => onOpenEditUser(u)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition"
                      title="Redakto të dhënat"
                      id={'edit-user-btn-' + u.id}
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {u.id !== currentUser?.id && (
                      <button
                        onClick={() => setUserToDelete(u)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Fshij përdoruesin"
                        id={'delete-user-btn-' + u.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">

          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6">

            <div className="flex items-start justify-between">

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Fshi punëtorin?
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  A jeni të sigurt që dëshironi të fshini{' '}
                  <span className="font-semibold text-slate-700">
                    {userToDelete.emri} {userToDelete.mbiemri}
                  </span>
                  ?
                </p>
              </div>

              <button
                onClick={() => setUserToDelete(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            <div className="flex justify-end gap-2 mt-6">

              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Anulo
              </button>

              <button
                onClick={() => {
                  onDeleteUser(userToDelete.id);
                  setUserToDelete(null);
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
