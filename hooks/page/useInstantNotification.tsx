'use client';

import { fetchInstant } from '@/redux/slices/notificationSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useInstantNotification = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const queryParams = new URLSearchParams(searchParams.toString());

  // Get page from URL or default to 1
  const currentPage = Number(searchParams.get('page')) || 1;
  const perPage = Number(searchParams.get('limit')) || 10;
  const [q, setQ] = useState(searchParams.get('q'));
  const [startDate, setStartDate] = useState(searchParams.get('startDate'));
  const [endDate, setEndDate] = useState(searchParams.get('endDate'));

  let {
    instantNotificationLoading,
    instantNotifications,
    countInstantNotifications,
  } = useSelector((state: RootState) => state.notification);

  const { org } = useSelector((state: RootState) => state.org);

  useEffect(() => {
    dispatch(
      fetchInstant({
        page: currentPage,
        limit: perPage,
        ...(q && { q }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(org?.id && { business_id: org?.id }),
      })
    );
  }, [dispatch, currentPage, perPage, q, startDate, endDate]);

  const onClickNext = async () => {
    if (instantNotifications.length > 0) {
      queryParams.set('page', encodeURIComponent(currentPage + 1));
      router.push(`?${queryParams}`);
    }
  };

  const onClickPrev = async () => {
    if (currentPage - 1 > 0) {
      queryParams.set('page', encodeURIComponent(currentPage - 1));
      router.push(`?${queryParams}`);
    }
  };

  // Handle search submission
  const handleSearchSubmit = (input: string) => {
    setQ(input);

    if (input!.trim()) {
      queryParams.set('q', encodeURIComponent(input!));
    } else {
      queryParams.delete('q'); // Remove 'q' if input is empty
    }

    router.push(`?${queryParams.toString()}`);
  };

  // Handle filter by date submission
  const handleFilterByDateSubmit = (
    startDate: string,
    endDate: string,
    setOpenModal: (value: React.SetStateAction<boolean>) => void
  ) => {
    setStartDate(startDate);
    setEndDate(endDate);

    setOpenModal;
  };

  // Handle Refresh
  const handleRefresh = () => {
    setStartDate('');
    setEndDate('');
    setQ('');
    queryParams.delete('q');
    queryParams.delete('page');
    router.push(`?${queryParams.toString()}`);
  };

  return {
    instantNotifications,
    instantNotificationLoading,
    totalInstantNotifications: countInstantNotifications, // according to naming convention
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

export default useInstantNotification;
