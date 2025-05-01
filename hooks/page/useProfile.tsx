import { viewProfile } from '@/redux/slices/authSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useProfile = () => {
  const dispatch = useDispatch<AppDispatch>();

  let { profile, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(viewProfile());
  }, [dispatch]);

  return {
    profile,
    loading,
  };
};

export default useProfile;
