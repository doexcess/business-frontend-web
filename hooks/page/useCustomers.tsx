import { fetchCustomers } from '@/redux/slices/orgSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useQueryParams from '../useQueryParams';
import { useParams } from 'next/navigation';
import { SystemRole } from '@/lib/utils';

interface UseCustomersProps {
  role?: SystemRole;
  limit?: number;
}
const useCustomers = ({
  role = SystemRole.USER,
  limit = 100,
}: UseCustomersProps = {}) => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();

  let { customers, customersLoading, totalCustomers, org } = useSelector(
    (state: RootState) => state.org
  );

  const {
    currentPage,
    perPage,
    q,
    startDate,
    endDate,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useQueryParams(customers, limit);

  useEffect(() => {
    dispatch(
      fetchCustomers({
        page: currentPage,
        limit: perPage,
        ...(q && { q }),
        ...(role && { role }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(org?.id && { business_id: org?.id as string }),
      })
    );
  }, [dispatch, currentPage, perPage, q, role, startDate, endDate]);

  return {
    customers,
    customersLoading,
    count: totalCustomers,
    currentPage,
    q,
    startDate,
    endDate,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  };
};

export default useCustomers;
