import React from 'react';
import { ShoppingCart, X, Download, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const CartDropdown: React.FC = () => {
  const { state, removeFromCart, clearCart, checkout, toggleCart } = useCart();
  const { isAuthenticated } = useAuth();

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Free';
    return `${currency} ${price.toLocaleString()}`;
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('Please sign in to checkout');
      return;
    }
    checkout();
  };

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={toggleCart}
        className="relative p-2 text-gray-600 hover:text-purple-600 rounded-xl hover:bg-purple-50"
      >
        <ShoppingCart className="h-5 w-5" />
        {state.totalItems > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
            {state.totalItems}
          </span>
        )}
      </button>

      {/* Cart Dropdown */}
      {state.isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={toggleCart}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Shopping Cart</h3>
              <button
                onClick={toggleCart}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="max-h-96 overflow-y-auto">
              {state.items.length === 0 ? (
                <div className="p-8 text-center">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Add resources to get started
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Download className="h-6 w-6 text-gray-400" />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          {item.module} • {item.faculty}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-sm font-semibold ${
                            item.isFree ? 'text-green-600' : 'text-purple-600'
                          }`}>
                            {formatPrice(item.price, item.currency)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">
                    Total:
                  </span>
                  <span className="text-lg font-bold text-purple-600">
                    {formatPrice(state.totalPrice, 'LKR')}
                  </span>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleCheckout}
                    className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Checkout
                  </button>
                  
                  <button
                    onClick={clearCart}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Free resources will be added to your library immediately
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default CartDropdown;
