'use client';

import React, { useEffect, useRef, useState } from 'react';
import useProfile from '@/hooks/page/useProfile';
import ActionConfirmationModal from '@/components/ActionConfirmationModal';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/context/SocketProvider';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import Icon from '@/components/ui/Icon';
import Link from 'next/link';
import useOrgs from '@/hooks/page/useOrgs';
import { IoIosAdd } from 'react-icons/io';
import { fetchOrg } from '@/redux/slices/orgSlice';
import { getAvatar, SystemRole } from '@/lib/utils';

const Profile = ({
  isOpen,
  setIsOpen,
  handleClose,
}: {
  isOpen: {
    profileDialog: boolean;
    appsDialog: boolean;
  };
  setIsOpen: React.Dispatch<
    React.SetStateAction<{
      profileDialog: boolean;
      appsDialog: boolean;
    }>
  >;
  handleClose?: () => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { profile } = useProfile();
  const { orgs } = useOrgs();
  const { org: organization } = useSelector((state: RootState) => state.org);
  const { isConnected } = useSocket();

  const [logoutOpenModal, setLogoutOpenModal] = useState(false);
  const [allowAction, setAllowAction] = useState(false);

  const handleToggle = () =>
    setIsOpen({ profileDialog: !isOpen.profileDialog, appsDialog: false });

  const handleLogoutNavigation = () => {
    router.push('/logout');
    if (typeof handleClose === 'function') handleClose();
  };

  const handleSwitchOrg = (id: string) => {
    dispatch(fetchOrg(id));
  };

  useEffect(() => {
    if (!isConnected) return;

    if (allowAction) {
      handleLogoutNavigation();
      setAllowAction(false);
    }
  }, [allowAction, isConnected]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen((prev) => ({ ...prev, profileDialog: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div>
      <button
        type='button'
        onClick={handleToggle}
        className='relative flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600'
        id='user-menu-button'
      >
        <span className='sr-only'>Open user menu</span>
        <Icon
          className='w-8 h-8 rounded-full'
          url={profile?.profile?.profile_picture || '/icons/icon.png'}
        />
      </button>

      {isOpen.profileDialog && (
        <div
          ref={dropdownRef}
          className='absolute z-50 my-4 w-56 text-base list-none bg-white divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 rounded-xl right-3'
        >
          <div className='py-3 px-4'>
            <span className='block text-sm font-semibold text-gray-900 dark:text-white'>
              {profile?.name}
            </span>
            <span className='block text-sm text-gray-900 truncate dark:text-white'>
              {profile?.email}
            </span>
          </div>

          <ul className='py-1 text-gray-700 dark:text-gray-300'>
            <li>
              <Link
                href='/settings'
                className='block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
              >
                Settings
              </Link>
            </li>
            <li>
              <Link
                href='/help'
                className='block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
              >
                Help
              </Link>
            </li>
            <li>
              <button
                onClick={() => setLogoutOpenModal(true)}
                className='block w-full text-left py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
              >
                Sign out
              </button>
            </li>
          </ul>

          {profile?.role.role_id === SystemRole.BUSINESS_SUPER_ADMIN && (
            <div>
              <div className='pt-3 px-4'>
                <span className='block text-sm font-semibold text-gray-900 dark:text-white'>
                  Switch Business Account
                </span>
              </div>
              <ul className='py-1 text-gray-700 dark:text-gray-300'>
                {orgs.length > 0 &&
                  orgs.map((org) => (
                    <li key={org.id}>
                      <button
                        onClick={handleSwitchOrg.bind(this, org.id)}
                        className='flex items-center gap-2 w-full text-left py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white justify-between'
                      >
                        <p className='flex gap-1'>
                          {/* <img
                            src={org.logo_url}
                            alt={`${org.business_name} logo`}
                            className='w-5 h-5 rounded-full object-contain border dark:border-gray-600 border-graay-400 '
                          /> */}
                          <img
                            src={getAvatar(org.logo_url, org.business_name)}
                            alt={org.business_name}
                            className='w-5 h-5 rounded-full object-cover'
                          />
                          {org.business_name}{' '}
                        </p>
                        {org.id === organization?.id && (
                          <Icon url='/icons/course/selected.png' width={15} />
                        )}
                      </button>
                    </li>
                  ))}

                <li>
                  <Link
                    href='/settings?tab=business-account'
                    className='flex items-center gap-2 py-2 px-4 text-sm font-medium text-primary-main hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-primary-faded dark:hover:text-white'
                  >
                    <IoIosAdd size={20} />
                    Create New Business
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}

      <ActionConfirmationModal
        openModal={logoutOpenModal}
        setOpenModal={setLogoutOpenModal}
        allowAction={allowAction}
        setAllowAction={setAllowAction}
      />
    </div>
  );
};

export default Profile;
