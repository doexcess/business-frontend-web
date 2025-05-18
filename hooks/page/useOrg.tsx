import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrg, fetchOrgs } from '@/redux/slices/orgSlice';

const useOrg = (id: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const { org } = useSelector((state: RootState) => state.org);

  useEffect(() => {
    dispatch(fetchOrg(id)).unwrap();
  }, [dispatch]);

  return {
    org,
  };
};

export default useOrg;
