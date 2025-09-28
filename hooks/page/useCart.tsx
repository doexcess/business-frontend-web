import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchCart, removeCartItem } from '@/redux/slices/cartSlice';

const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cart, count, loading, error } = useSelector(
    (state: RootState) => state.cart
  );

  // Calculate totals
  const totals = {
    subtotal:
      cart?.items?.reduce((total, item) => {
        return total + parseFloat(item.price_at_time) * item.quantity;
      }, 0) || 0,
    itemCount: cart?.items?.length || 0,
    totalQuantity:
      cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0,
  };

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return {
    cart,
    count,
    loading,
    error,
    totals,
  };
};

export default useCart;
