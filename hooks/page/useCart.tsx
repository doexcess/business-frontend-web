import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchCart, removeCartItem } from '@/redux/slices/cartSlice';

const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cart, count, loading, error } = useSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return {
    cart,
    count,
    loading,
    error,
  };
};

export default useCart;
