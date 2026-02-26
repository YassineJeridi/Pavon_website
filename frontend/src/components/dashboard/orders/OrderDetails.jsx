// frontend/src/components/dashboard/orders/OrderDetails.jsx

import { XMarkIcon } from '@heroicons/react/24/outline';
import OrderStatus from './OrderStatus';
import { getImageUrl } from '../../../utils/imageUtils';

const OrderDetails = ({ order, onClose, onStatusChange }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Commande #{order.orderNumber}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Statut de la commande</h3>
            <OrderStatus
              status={order.status}
              orderId={order._id}
              onChange={onStatusChange}
            />
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Informations client</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Nom:</span>{' '}
                  <span className="font-medium text-gray-900">
                    {order.customer.firstName} {order.customer.lastName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>{' '}
                  <span className="font-medium text-gray-900">{order.customer.email}</span>
                </div>
                <div>
                  <span className="text-gray-600">Téléphone:</span>{' '}
                  <span className="font-medium text-gray-900">{order.customer.phone}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Adresse de livraison</h3>
              <div className="space-y-1 text-sm text-gray-900">
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.postalCode} {order.shippingAddress.city}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Articles commandés</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Produit
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Prix
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Quantité
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                            }}
                          />
                          <div>
                            <div className="font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">
                              {item.color} • {item.size}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">{item.price} TND</td>
                      <td className="px-4 py-4 text-sm text-gray-900">×{item.quantity}</td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 text-right">
                        {(item.price * item.quantity).toFixed(2)} TND
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-4 py-4 text-right font-semibold text-gray-900">
                      Total
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-lg text-gray-900">
                      {order.total} TND
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
