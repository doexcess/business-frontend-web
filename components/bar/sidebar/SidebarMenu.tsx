'use client';

import React from 'react';
import { groups, sidebarLinks } from '@/constants';

import { Sidebar } from 'flowbite-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const SidebarMenu = ({ handleClose }: { handleClose?: () => void }) => {
  const router = useRouter();
  const pathname = usePathname(); // Get current path

  const groupOneSidebarLinks = sidebarLinks.filter(
    (sidebarLink) => sidebarLink.group === groups.ONE
  );
  const groupTwoSidebarLinks = sidebarLinks.filter(
    (sidebarLink) => sidebarLink.group === groups.TWO
  );

  const html = groupTwoSidebarLinks.map((sidebarLink) =>
    sidebarLink.items ? (
      <Sidebar.Collapse
        key={sidebarLink.route}
        icon={sidebarLink.icon}
        label={sidebarLink.label}
      >
        {sidebarLink.items.map((item) => (
          <Sidebar.Item
            key={item.route}
            onClick={() => handleNavigation(item.route)}
            className={cn(
              'cursor-pointer',
              pathname === item.route && 'bg-gray-200 dark:bg-gray-700' // Active class
            )}
          >
            {item.label}
          </Sidebar.Item>
        ))}
      </Sidebar.Collapse>
    ) : (
      <Sidebar.Item
        key={sidebarLink.route}
        onClick={() => handleNavigation(sidebarLink.route)}
        icon={sidebarLink.icon}
        className={cn(
          'cursor-pointer',
          pathname === sidebarLink.route && 'bg-gray-200 dark:bg-gray-700' // Active class
        )}
      >
        {sidebarLink.label}
      </Sidebar.Item>
    )
  );

  const handleNavigation = (route: string) => {
    router.push(route);
    if (typeof handleClose === 'function') handleClose();
  };

  return (
    <>
      <Sidebar
        className='mt-6 md:mt-0'
        aria-label='Sidebar menu for core features'
      >
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <p className='text-xs uppercase'>Main menu</p>
            {groupOneSidebarLinks.map((sidebarLink) =>
              sidebarLink.items ? (
                <Sidebar.Collapse
                  key={sidebarLink.route}
                  icon={sidebarLink.icon}
                  label={sidebarLink.label}
                >
                  {sidebarLink.items.map((item) => (
                    <Sidebar.Item
                      key={item.route}
                      onClick={() => handleNavigation(item.route)}
                      className={cn(
                        'cursor-pointer',
                        pathname === item.route &&
                          'bg-gray-200 dark:bg-gray-700' // Active class
                      )}
                    >
                      {item.label}
                    </Sidebar.Item>
                  ))}
                </Sidebar.Collapse>
              ) : (
                <Sidebar.Item
                  key={sidebarLink.route}
                  onClick={() => handleNavigation(sidebarLink.route)}
                  icon={sidebarLink.icon}
                  className={cn(
                    'cursor-pointer',
                    pathname === sidebarLink.route &&
                      'bg-gray-200 dark:bg-gray-700' // Active class
                  )}
                >
                  {sidebarLink.label}
                </Sidebar.Item>
              )
            )}
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup>
            <p className='text-xs uppercase'>Supports</p>

            {groupTwoSidebarLinks.map((sidebarLink) =>
              sidebarLink.items ? (
                <Sidebar.Collapse
                  key={sidebarLink.route}
                  icon={sidebarLink.icon}
                  label={sidebarLink.label}
                >
                  {sidebarLink.items.map((item) => (
                    <Sidebar.Item
                      key={item.route}
                      onClick={() => handleNavigation(item.route)}
                      className={cn(
                        'cursor-pointer',
                        pathname === item.route &&
                          'bg-gray-200 dark:bg-gray-700' // Active class
                      )}
                    >
                      {item.label}
                    </Sidebar.Item>
                  ))}
                </Sidebar.Collapse>
              ) : (
                <Sidebar.Item
                  key={sidebarLink.route}
                  onClick={() => handleNavigation(sidebarLink.route)}
                  icon={sidebarLink.icon}
                  className={cn(
                    'cursor-pointer',
                    pathname === sidebarLink.route &&
                      'bg-gray-200 dark:bg-gray-700' // Active class
                  )}
                >
                  {sidebarLink.label}
                </Sidebar.Item>
              )
            )}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </>
  );
};

export default SidebarMenu;
