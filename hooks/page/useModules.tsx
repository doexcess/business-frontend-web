import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchModules } from '@/redux/slices/productSlice';
import useQueryParams from '../useQueryParams';

const useModules = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    modules,
    modulesLoading: loading,
    error,
    modulesCount: count,
  } = useSelector((state: RootState) => state.product);
  const { org } = useSelector((state: RootState) => state.org);

  const {
    currentPage,
    perPage,
    q,
    startDate,
    endDate,
    onClickNext,
    onClickPrev,
  } = useQueryParams(modules);

  useEffect(() => {
    dispatch(
      fetchModules({
        page: currentPage,
        limit: perPage,
        ...(q && { q }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(org?.id && { business_id: org.id }),
      })
    ).unwrap();
  }, [dispatch, currentPage, perPage, q, startDate, endDate, org]);

  return {
    modules,
    count,
    loading,
    error,
    onClickNext,
    onClickPrev,
  };
};

export default useModules;
