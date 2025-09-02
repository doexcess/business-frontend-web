import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchKYC } from '@/redux/slices/orgSlice';

const useKYC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { kyc, loading, error } = useSelector(
        (state: RootState) => state.org
    );

    useEffect(() => {
        dispatch(fetchKYC()).unwrap()
    }, [dispatch]);

    return {
        kyc,
        loading,
        error,
    };
};

export default useKYC;
