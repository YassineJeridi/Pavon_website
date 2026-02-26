// frontend/src/components/dashboard/orders/OrderStatus.jsx

const OrderStatus = ({ status, orderId, onChange }) => {
  const statuses = {
    'en attente': {
      label: 'En attente',
      color: 'bg-[#e8ddca] text-[#111f35]',
      dotColor: 'bg-[#5d1115]',
    },
    'on delivery': {
      label: 'On Delivery',
      color: 'bg-[#5d1115]/10 text-[#5d1115]',
      dotColor: 'bg-[#5d1115]',
    },
    'done': {
      label: 'Done',
      color: 'bg-green-100 text-green-800',
      dotColor: 'bg-green-400',
    },
    'cancelled': {
      label: 'Annulée',
      color: 'bg-red-100 text-red-800',
      dotColor: 'bg-red-400',
    },
  };

  const currentStatus = statuses[status] || statuses['en attente'];

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    if (onChange) {
      onChange(orderId, newStatus);
    }
  };

  if (onChange) {
    // Editable dropdown for dashboard
    return (
      <select
        value={status}
        onChange={handleStatusChange}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentStatus.color}`}
      >
        <option value="en attente">En attente</option>
        <option value="on delivery">On Delivery</option>
        <option value="done">Done</option>
        <option value="cancelled">Annulée</option>
      </select>
    );
  }

  // Read-only badge
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${currentStatus.color}`}>
      <span className={`w-2 h-2 rounded-full ${currentStatus.dotColor} mr-2`}></span>
      {currentStatus.label}
    </span>
  );
};

export default OrderStatus;
