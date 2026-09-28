import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('foodie_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [restaurantId, setRestaurantId] = useState(() => {
    return localStorage.getItem('foodie_cart_restaurant') || null;
  });
  const [restaurantName, setRestaurantName] = useState(() => {
    return localStorage.getItem('foodie_cart_restaurant_name') || '';
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('foodie_cart', JSON.stringify(cartItems));
    if (cartItems.length === 0) {
      setRestaurantId(null);
      setRestaurantName('');
      setAppliedCoupon(null);
      setDiscountAmount(0);
      localStorage.removeItem('foodie_cart_restaurant');
      localStorage.removeItem('foodie_cart_restaurant_name');
    }
  }, [cartItems]);

  const addToCart = (item, rId, rName) => {
    // If cart has items from another restaurant, reset cart
    if (restaurantId && restaurantId !== rId && cartItems.length > 0) {
      if (!window.confirm('Your cart contains items from another restaurant. Would you like to reset your cart and add items from this restaurant?')) {
        return false;
      }
      setCartItems([]);
    }

    setRestaurantId(rId);
    setRestaurantName(rName);
    localStorage.setItem('foodie_cart_restaurant', rId);
    localStorage.setItem('foodie_cart_restaurant_name', rName);

    setCartItems(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
    return true;
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(i => i._id !== itemId));
  };

  const updateQuantity = (itemId, delta) => {
    setCartItems(prev => {
      return prev.map(i => {
        if (i._id === itemId) {
          const newQty = i.quantity + delta;
          return newQty > 0 ? { ...i, quantity: newQty } : null;
        }
        return i;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurantId(null);
    setRestaurantName('');
    setAppliedCoupon(null);
    setDiscountAmount(0);
    localStorage.removeItem('foodie_cart');
    localStorage.removeItem('foodie_cart_restaurant');
    localStorage.removeItem('foodie_cart_restaurant_name');
  };

  const getItemTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const deliveryFee = cartItems.length > 0 ? 30 : 0;
  const tax = Math.round(getItemTotal() * 0.05); // 5% tax
  const grandTotal = Math.max(0, getItemTotal() + deliveryFee + tax - discountAmount);

  const applyCoupon = (coupon, discount) => {
    setAppliedCoupon(coupon);
    setDiscountAmount(discount);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      restaurantId,
      restaurantName,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemTotal,
      totalCount,
      deliveryFee,
      tax,
      discountAmount,
      grandTotal,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
