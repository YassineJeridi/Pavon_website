// frontend/src/pages/dashboard/DashboardSettings.jsx

import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  KeyIcon,
  UserPlusIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline';
import authService from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

// ─── Tab IDs ─────────────────────────────────────────────────
const TABS = [
  { id: 'password', label: 'Changer le mot de passe', icon: KeyIcon },
  { id: 'create', label: 'Créer un admin', icon: UserPlusIcon },
  { id: 'manage', label: 'Gérer les admins', icon: UsersIcon },
];

// ─── Alert helper ────────────────────────────────────────────
const Alert = ({ type, message, onClose }) => {
  if (!message) return null;
  const isSuccess = type === 'success';
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border mb-4 ${
        isSuccess
          ? 'bg-green-50 border-green-200 text-green-800'
          : 'bg-red-50 border-red-200 text-red-800'
      }`}
    >
      {isSuccess ? (
        <CheckCircleIcon className="w-5 h-5 mt-0.5 shrink-0" />
      ) : (
        <XCircleIcon className="w-5 h-5 mt-0.5 shrink-0" />
      )}
      <span className="flex-1 text-sm">{message}</span>
      <button onClick={onClose} className="text-current opacity-60 hover:opacity-100">
        ✕
      </button>
    </div>
  );
};

// ─── Password visibility toggle ──────────────────────────────
const PasswordInput = ({ label, value, onChange, name, required, autoComplete, helpText }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
        </button>
      </div>
      {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
  );
};

// ─── Tab: Change Password ─────────────────────────────────────
const ChangePasswordTab = () => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });

    if (form.newPassword.length < 6) {
      setAlert({ type: 'error', message: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setAlert({ type: 'error', message: 'Les mots de passe ne correspondent pas.' });
      return;
    }

    try {
      setLoading(true);
      const res = await authService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      if (res.success) {
        setAlert({ type: 'success', message: res.message || 'Mot de passe changé avec succès.' });
        setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setAlert({ type: 'error', message: res.message || 'Erreur lors du changement.' });
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Erreur lors du changement de mot de passe.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Changer votre mot de passe</h2>
      <p className="text-sm text-gray-500 mb-6">
        Entrez votre mot de passe actuel puis définissez un nouveau mot de passe.
      </p>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordInput
          label="Mot de passe actuel"
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />
        <PasswordInput
          label="Nouveau mot de passe"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
          helpText="Minimum 6 caractères"
        />
        <PasswordInput
          label="Confirmer le nouveau mot de passe"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Enregistrement...' : 'Changer le mot de passe'}
          </button>
        </div>
      </form>
    </div>
  );
};

// ─── Tab: Create Admin ────────────────────────────────────────
const CreateAdminTab = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'admin',
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });

    if (form.password.length < 6) {
      setAlert({ type: 'error', message: 'Le mot de passe doit contenir au moins 6 caractères.' });
      return;
    }

    try {
      setLoading(true);
      const res = await authService.createAdmin(form);
      if (res.success) {
        setAlert({ type: 'success', message: `Administrateur "${res.data?.email}" créé avec succès.` });
        setForm({ firstName: '', lastName: '', email: '', password: '', role: 'admin' });
      } else {
        setAlert({ type: 'error', message: res.message || 'Erreur lors de la création.' });
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Erreur lors de la création de l\'administrateur.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Créer un nouvel administrateur</h2>
      <p className="text-sm text-gray-500 mb-6">
        Ajoutez un nouveau membre à l'équipe d'administration.
      </p>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <PasswordInput
          label="Mot de passe"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
          helpText="Minimum 6 caractères"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Création...' : 'Créer l\'administrateur'}
          </button>
        </div>
      </form>
    </div>
  );
};

// ─── Confirm Delete Modal ─────────────────────────────────────
const ConfirmModal = ({ admin, onConfirm, onCancel }) => {
  if (!admin) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <TrashIcon className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Supprimer l'administrateur</h3>
            <p className="text-sm text-gray-500">Cette action est irréversible.</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-6">
          Êtes-vous sûr de vouloir supprimer{' '}
          <span className="font-medium">{admin.firstName} {admin.lastName}</span>{' '}
          ({admin.email}) ?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors text-sm font-medium"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Reset Password Modal ─────────────────────────────────────
const ResetPasswordModal = ({ admin, onConfirm, onCancel }) => {
  const [newPassword, setNewPassword] = useState('');
  const [show, setShow] = useState(false);
  if (!admin) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
            <KeyIcon className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Réinitialiser le mot de passe</h3>
            <p className="text-sm text-gray-500">{admin.firstName} {admin.lastName}</p>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Min. 6 caractères"
            />
            <button
              type="button"
              onClick={() => setShow(s => !s)}
              className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-gray-600"
            >
              {show ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Annuler
          </button>
          <button
            onClick={() => newPassword.length >= 6 && onConfirm(newPassword)}
            disabled={newPassword.length < 6}
            className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white py-2 rounded-lg transition-colors text-sm font-medium"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Tab: Manage Admins ───────────────────────────────────────
const ManageAdminsTab = () => {
  const { admin: currentUser } = useContext(AuthContext);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [resetTarget, setResetTarget] = useState(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await authService.getAllAdmins();
      setAdmins(res.data || []);
    } catch (err) {
      setAlert({ type: 'error', message: 'Impossible de charger les administrateurs.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleToggle = async (id) => {
    try {
      const res = await authService.toggleAdminStatus(id);
      if (res.success) {
        setAdmins(prev =>
          prev.map(a => (a._id === id ? { ...a, isActive: res.data.isActive } : a))
        );
        setAlert({ type: 'success', message: res.message });
      }
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Erreur lors de la modification.' });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      const res = await authService.deleteAdmin(confirmDelete._id);
      if (res.success) {
        setAdmins(prev => prev.filter(a => a._id !== confirmDelete._id));
        setAlert({ type: 'success', message: res.message });
      }
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Erreur lors de la suppression.' });
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleResetPassword = async (newPassword) => {
    if (!resetTarget) return;
    try {
      const res = await authService.resetAdminPassword(resetTarget._id, newPassword);
      if (res.success) {
        setAlert({ type: 'success', message: `Mot de passe de ${resetTarget.firstName} réinitialisé.` });
      }
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Erreur lors de la réinitialisation.' });
    } finally {
      setResetTarget(null);
    }
  };

  const isSelf = (id) => currentUser?._id === id || currentUser?.id === id;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Gérer les administrateurs</h2>
          <p className="text-sm text-gray-500">
            {admins.length} administrateur{admins.length !== 1 ? 's' : ''} enregistré{admins.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={fetchAdmins}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Actualiser
        </button>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : admins.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Aucun administrateur trouvé.</div>
      ) : (
        <div className="space-y-3">
          {admins.map((a) => (
            <div
              key={a._id}
              className={`flex items-center justify-between p-4 rounded-xl border bg-white shadow-sm ${
                isSelf(a._id) ? 'border-indigo-200 bg-indigo-50/30' : 'border-gray-200'
              }`}
            >
              {/* Avatar + Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                    a.isActive ? 'bg-indigo-600' : 'bg-gray-400'
                  }`}
                >
                  {a.firstName?.[0]}{a.lastName?.[0]}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900 text-sm">
                      {a.firstName} {a.lastName}
                    </span>
                    {isSelf(a._id) && (
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                        Vous
                      </span>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        a.role === 'super_admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {a.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        a.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {a.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{a.email}</p>
                  {a.lastLogin && (
                    <p className="text-xs text-gray-400">
                      Dernière connexion : {new Date(a.lastLogin).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              {!isSelf(a._id) && (
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {/* Reset Password */}
                  <button
                    onClick={() => setResetTarget(a)}
                    title="Réinitialiser le mot de passe"
                    className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                  >
                    <KeyIcon className="w-4 h-4" />
                  </button>

                  {/* Toggle Active */}
                  <button
                    onClick={() => handleToggle(a._id)}
                    title={a.isActive ? 'Désactiver' : 'Activer'}
                    className={`p-1.5 rounded-lg transition-colors ${
                      a.isActive
                        ? 'text-red-500 hover:bg-red-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {a.isActive ? (
                      <ShieldExclamationIcon className="w-4 h-4" />
                    ) : (
                      <ShieldCheckIcon className="w-4 h-4" />
                    )}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setConfirmDelete(a)}
                    title="Supprimer"
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        admin={confirmDelete}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
      <ResetPasswordModal
        admin={resetTarget}
        onConfirm={handleResetPassword}
        onCancel={() => setResetTarget(null)}
      />
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────
const DashboardSettings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin } = useContext(AuthContext);
  const isSuperAdmin = admin?.role === 'super_admin';

  // Derive active tab from URL
  const pathTab = location.pathname.endsWith('/create')
    ? 'create'
    : location.pathname.endsWith('/manage')
    ? 'manage'
    : 'password';

  const [activeTab, setActiveTab] = useState(pathTab);

  useEffect(() => {
    setActiveTab(pathTab);
  }, [pathTab]);

  useEffect(() => {
    document.title = 'Paramètres - Pavone Admin';
  }, []);

  const handleTabClick = (id) => {
    setActiveTab(id);
    if (id === 'password') navigate('/dashboard/settings');
    else if (id === 'create') navigate('/dashboard/settings/create');
    else if (id === 'manage') navigate('/dashboard/settings/manage');
  };

  const visibleTabs = isSuperAdmin
    ? TABS
    : TABS.filter(t => t.id === 'password');

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gérez votre compte et les administrateurs de la plateforme.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {visibleTabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  active
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'password' && <ChangePasswordTab />}
          {activeTab === 'create' && isSuperAdmin && <CreateAdminTab />}
          {activeTab === 'manage' && isSuperAdmin && <ManageAdminsTab />}
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
