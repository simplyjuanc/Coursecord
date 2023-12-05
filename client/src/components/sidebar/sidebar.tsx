'use client';

import { FaUsersCog } from 'react-icons/fa';
import { IoIosHelpBuoy } from 'react-icons/io';
import { IoCaretBackOutline } from 'react-icons/io5';
import { MdTextSnippet } from 'react-icons/md';
import { RiDashboardFill, RiLogoutBoxLine } from 'react-icons/ri';
import IconButton from '../buttons/iconButton';
import { useRouter } from 'next/navigation';
import { NavItem } from '@/types';
import { signOut } from 'next-auth/react';
import { useAppSelector } from '@/store';
import { NavItemComponent } from './NavItemComponent';

export default function Sidebar() {
  const router = useRouter();
  const isUserAdmin = useAppSelector((state) => state.user.roles.admin);

  const NavItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: 'dashboard',
      icon: <RiDashboardFill />,
    },
    {
      title: 'Syllabus',
      href: 'syllabus',
      icon: <MdTextSnippet />,
    },
    {
      title: 'Help',
      href: 'help',
      icon: <IoIosHelpBuoy />,
    },
  ];

  const NavAdminPanel: NavItem = {
    title: 'User Management',
    href: 'admin',
    icon: <FaUsersCog />,
  };


  return (
    <div className='h-screen min-h-full min-w-max w-[12vw] bg-white shadow-xl relative box-border'>
      <div className='flex p-4'>
        <div className='w-10 h-10 rounded-full bg-primary-1 bg-opacity-50 mr-4'></div>
        <h1 className='my-auto text-3xl text-primary-2 font-semibold'>
          Coursecord
        </h1>
      </div>
      <div className='py-12'>
        <ul>
          {NavItems.map((item, index) => (
            <li key={index} className='pt-4'>
              <NavItemComponent item={item} />
            </li>
          ))}
          {isUserAdmin && (
            <li className='pt-4'>
              <NavItemComponent item={NavAdminPanel} />
            </li>
          )}
        </ul>
      </div>
      <div onClick={() => {}} className='absolute bottom-0 mx-auto w-full p-4'>
        <div className='pb-3'>
          <IconButton
            title='Courses'
            icon={<IoCaretBackOutline />}
            onClick={() => {
              router.push('/courses');
            }}
          />
        </div>
        <IconButton
          title='Logout'
          icon={<RiLogoutBoxLine />}
          onClick={() => {
            signOut();
            router.push('/');
          }}
        />
      </div>
    </div>
  );
}


