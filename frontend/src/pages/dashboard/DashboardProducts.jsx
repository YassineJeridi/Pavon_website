// frontend/src/pages/dashboard/DashboardProducts.jsx

import { useEffect } from 'react';
import ProductList from '../../components/dashboard/products/ProductList';

const DashboardProducts = () => {
  useEffect(() => {
    document.title = 'Produits - Pavone Collection Admin';
  }, []);

  return (
    <div>
      <ProductList />
    </div>
  );
};

export default DashboardProducts;
