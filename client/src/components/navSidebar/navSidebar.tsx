'use client';
import { NavItem } from '../../types';
import { RiDashboardFill, RiLogoutBoxLine } from 'react-icons/ri';

import Sidebar from '../sidebar/sidebar';

import { IoCaretBackOutline } from 'react-icons/io5';
import {signOut} from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function NavSidebar() {
  const router = useRouter();
  

  const buttonList = [
    {
      title: 'Courses',
      icon: <IoCaretBackOutline />,
      onClick: () => {},
    },
    {
      title: 'Logout',
      icon: <RiLogoutBoxLine />,
      onClick: () => {
        signOut();
        router.push('/')
      },
    },
  ];

  return <Sidebar />;
}
