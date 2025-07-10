import {
  fetchPublicSubscriptionPlans,
  fetchSubscriptionPlans,
} from '@/redux/slices/subscriptionPlanSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useQueryParams from '../useQueryParams';
import { useSearchParams } from 'next/navigation';

const useSubscriptionPlansPublic = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchQuery = useSearchParams();

  const { org } = useSelector((state: RootState) => state.org);

  let { subscription_plans, loading, count } = useSelector(
    (state: RootState) => state.subscriptionPlan
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
  } = useQueryParams(subscription_plans);

  useEffect(() => {
    dispatch(
      fetchPublicSubscriptionPlans({
        ...(searchQuery.get('id') && { id: searchQuery.get('id')! }),
        page: currentPage,
        limit: perPage,
        ...(q && { q }),
        business_id: org?.id as string,
      })
    ).unwrap();
  }, [dispatch, currentPage, perPage, q, startDate, endDate, org]);

  return {
    subscription_plans,
    loading,
    count,
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

export default useSubscriptionPlansPublic;
