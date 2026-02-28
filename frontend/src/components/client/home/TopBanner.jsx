// frontend/src/components/client/home/TopBanner.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import topBannerService from '../../../services/topBannerService';
import './TopBanner.css';

const TopBanner = () => {
  const [banners, setBanners] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await topBannerService.getActive();
      const data = response?.data || [];
      if (Array.isArray(data) && data.length > 0) {
        if (sessionStorage.getItem('topBannerClosed') === 'true') return;
        setBanners(data);
        setIsVisible(true);
      }
    } catch {
      /* silent */
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('topBannerClosed', 'true');
  };

  const handleBannerClick = (link) => {
    if (!link) return;
    // External link (starts with http:// or https://)
    if (/^https?:\/\//i.test(link)) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      // Internal route
      navigate(link);
    }
  };

  if (!isVisible || banners.length === 0) return null;

  const sep = '\u00A0\u00A0\u00A0\u2605\u00A0\u00A0\u00A0';

  return (
    <div className="top-banner-container">
      <div className="top-banner-content">
        {banners.map((banner, index) => (
          <span key={banner._id}>
            {index > 0 && <span>{sep}</span>}
            {banner.link ? (
              <span
                className="top-banner-link"
                onClick={() => handleBannerClick(banner.link)}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleBannerClick(banner.link)}
              >
                {banner.text}
              </span>
            ) : (
              <span>{banner.text}</span>
            )}
          </span>
        ))}
      </div>

      <button
        onClick={handleClose}
        className="top-banner-close"
        aria-label="Fermer la bannière"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TopBanner;
