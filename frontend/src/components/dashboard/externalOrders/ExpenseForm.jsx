// frontend/src/components/dashboard/externalOrders/ExpenseForm.jsx
// Modal form for creating/editing expenses

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const EXPENSE_CATEGORIES = [
  'Matières premières',
  'Livraison',
  'Marketing',
  'Loyer',
  'Salaires',
  'Autre',
];

const ExpenseForm = ({ expense, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    label: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Autre',
    customCategory: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (expense) {
      setFormData({
        label: expense.label || '',
        amount: expense.amount || '',
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : '',
        category: expense.category || 'Autre',
        customCategory: expense.customCategory || '',
        notes: expense.notes || '',
      });
    }
  }, [expense]);

  const validate = () => {
    const errs = {};
    if (!formData.label.trim()) errs.label = 'Le libellé est requis';
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errs.amount = 'Le montant doit être supérieur à 0';
    }
    if (!formData.date) errs.date = 'La date est requise';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e8ddca]">
          <h3 className="text-xl font-bold text-[#111f35]">
            {expense ? 'Modifier la charge' : 'Nouvelle charge'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Label */}
          <div>
            <label className="block text-sm font-semibold text-[#111f35] mb-1.5">
              Libellé <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleChange}
              placeholder="Ex: Achat tissu, Frais de livraison..."
              className={`w-full px-4 py-2.5 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#5d1115]/20 transition-colors ${
                errors.label ? 'border-red-400' : 'border-[#e8ddca] focus:border-[#5d1115]'
              }`}
            />
            {errors.label && <p className="text-red-500 text-xs mt-1">{errors.label}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-[#111f35] mb-1.5">
              Montant (TND) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.001"
              min="0"
              placeholder="0.000"
              className={`w-full px-4 py-2.5 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#5d1115]/20 transition-colors ${
                errors.amount ? 'border-red-400' : 'border-[#e8ddca] focus:border-[#5d1115]'
              }`}
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-[#111f35] mb-1.5">
              Catégorie
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-[#e8ddca] focus:border-[#5d1115] focus:outline-none focus:ring-2 focus:ring-[#5d1115]/20 transition-colors"
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Custom Category Label (when Autre selected) */}
          {formData.category === 'Autre' && (
            <div>
              <label className="block text-sm font-semibold text-[#111f35] mb-1.5">
                Nom de catégorie personnalisée
              </label>
              <input
                type="text"
                name="customCategory"
                value={formData.customCategory}
                onChange={handleChange}
                placeholder="Ex: Fournitures, Transport..."
                className="w-full px-4 py-2.5 rounded-lg border-2 border-[#e8ddca] focus:border-[#5d1115] focus:outline-none focus:ring-2 focus:ring-[#5d1115]/20 transition-colors"
              />
              <p className="text-xs text-gray-400 mt-1">Optionnel — précisez le type de charge</p>
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-[#111f35] mb-1.5">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#5d1115]/20 transition-colors ${
                errors.date ? 'border-red-400' : 'border-[#e8ddca] focus:border-[#5d1115]'
              }`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-[#111f35] mb-1.5">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Notes supplémentaires (optionnel)"
              className="w-full px-4 py-2.5 rounded-lg border-2 border-[#e8ddca] focus:border-[#5d1115] focus:outline-none focus:ring-2 focus:ring-[#5d1115]/20 transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border-2 border-[#e8ddca] text-[#111f35] rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-[#5d1115] text-white rounded-lg hover:bg-[#7d1419] transition-colors font-medium disabled:opacity-50"
            >
              {submitting ? 'Enregistrement...' : expense ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
