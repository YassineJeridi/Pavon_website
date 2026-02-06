// frontend/src/components/client/layout/CartButton.jsx
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { useNavigate } from 'react-router-dom';

const CartButton = () => {
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate('/panier');
  };

  return (
    <button
      onClick={handleClick}
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
    >
      <ShoppingBag className="w-6 h-6" />
      {cartItemsCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {cartItemsCount}
        </span>
      )}
    </button>
  );
};

export default CartButton;
