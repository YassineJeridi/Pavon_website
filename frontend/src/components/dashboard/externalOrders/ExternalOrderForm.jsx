// frontend/src/components/dashboard/externalOrders/ExternalOrderForm.jsx
// Modal form for creating/editing external orders — with customer name auto-suggest

import { useState, useEffect, useRef, useCallback } from 'react';
import { XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import externalOrderService from '../../../services/externalOrderService';

const ORDER_SOURCES = ['Facebook', 'Instagram', 'WhatsApp', 'Direct Contact', 'Other'];

const ExternalOrderForm = ({ order, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    source: 'Facebook',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Auto-suggest state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const suggestRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Pre-fill form when editing
  useEffect(() => {
    if (order) {
      setFormData({
        source: order.source || 'Facebook',
        amount: order.amount || '',
        date: order.date ? new Date(order.date).toISOString().split('T')[0] : '',
        customerName: order.customerName || '',
        notes: order.notes || '',
      });
    }
  }, [order]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback(async (query) => {
    if (!query || query.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const res = await externalOrderService.getCustomerSuggestions(query);
      if (res.success && res.data.length > 0) {
        setSuggestions(res.data);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch {
      setSuggestions([]);
    }
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.source) errs.source = 'La source est requise';
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

    // Trigger auto-suggest for customerName
    if (name === 'customerName') {
      setActiveSuggestion(-1);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchSuggestions(value), 250);
    }
  };

  const handleSelectSuggestion = (name) => {
    setFormData((prev) => ({ ...prev, customerName: name }));
    setShowSuggestions(false);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && activeSuggestion >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[activeSuggestion].name);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
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
            {order ? 'Modifier la commande' : 'Nouvelle commande externe'}
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
          {/* Source */}
          <div>
            <label className="block text-sm font-semibold text-[#111f35] mb-1.5">
              Source de la commande <span className="text-red-500">*</span>
            </label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#5d1115]/20 transition-colors ${
                errors.source ? 'border-red-400' : 'border-[#e8ddca] focus:border-[#5d1115]'
              }`}
            >
              {ORDER_SOURCES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.source && <p className="text-red-500 text-xs mt-1">{errors.source}</p>}
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

          {/* Customer Name with auto-suggest */}
          <div ref={suggestRef} className="relative">
            <label className="block text-sm font-semibold text-[#111f35] mb-1.5">
              Nom du client
            </label>
            <input
              ref={inputRef}
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (formData.customerName && suggestions.length > 0) setShowSuggestions(true);
              }}
              placeholder="Tapez pour rechercher un client..."
              autoComplete="off"
              className="w-full px-4 py-2.5 rounded-lg border-2 border-[#e8ddca] focus:border-[#5d1115] focus:outline-none focus:ring-2 focus:ring-[#5d1115]/20 transition-colors"
            />

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-xl border-2 border-[#e8ddca] max-h-48 overflow-y-auto">
                {suggestions.map((s, idx) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => handleSelectSuggestion(s.name)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                      idx === activeSuggestion
                        ? 'bg-[#5d1115]/10 text-[#5d1115]'
                        : 'hover:bg-[#fdf9ee] text-[#111f35]'
                    }`}
                  >
                    <UserIcon className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="font-medium truncate">{s.name}</span>
                    <span className="ml-auto text-xs text-gray-400 shrink-0">
                      {s.orderCount} cmd{s.orderCount > 1 ? 's' : ''}
                    </span>
                  </button>
                ))}
              </div>
            )}
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
              {submitting ? 'Enregistrement...' : order ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExternalOrderForm;
