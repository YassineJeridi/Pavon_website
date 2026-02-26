// frontend/src/pages/dashboard/DashboardProducts.jsx

import { useEffect } from 'react';
import ProductList from '../../components/dashboard/products/ProductList';

const DashboardProducts = () => {
  useEffect(() => {
    document.title = 'Produits - Élégance Admin';
  }, []);

  return (
    <div>
      <ProductList />
    </div>
  );
};

export default DashboardProducts;
