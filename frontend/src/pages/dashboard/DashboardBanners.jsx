// frontend/src/pages/dashboard/DashboardBanners.jsx

import { useEffect } from 'react';
import BannerManagerNew from '../../components/dashboard/banners/BannerManagerNew';

const DashboardBanners = () => {
  useEffect(() => {
    document.title = 'Bannières - Élégance Admin';
  }, []);

  return (
    <div>
      <BannerManagerNew />
    </div>
  );
};

export default DashboardBanners;
