// frontend/src/pages/dashboard/DashboardOrders.jsx

import { useEffect } from 'react';
import OrderList from '../../components/dashboard/orders/OrderList';

const DashboardOrders = () => {
  useEffect(() => {
    document.title = 'Commandes - Pavone Collection Admin';
  }, []);

  return (
    <div>
      <OrderList />
    </div>
  );
};

export default DashboardOrders;
