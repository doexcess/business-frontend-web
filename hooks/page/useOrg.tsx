import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrg, fetchOrgs } from '@/redux/slices/orgSlice';

const useOrg = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { org } = useSelector((state: RootState) => state.org);
  const { profile } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchOrg(profile?.id!)).unwrap();
  }, [dispatch]);

  return {
    org,
  };
};

export default useOrg;
