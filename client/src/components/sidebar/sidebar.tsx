'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

export default function Sidebar() {
  const pathname = usePathname();
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

  const NavItemComponent = (props: { item: NavItem }) => {
    const isActive = pathname.split('/')[3] === props.item.href;
    return (
      <div className='flex'>
        <div
          className={`w-1.5 rounded-tr-2xl rounded-br-2xl bg-primary-1 bg-opacity-${
            isActive ? '50' : '0'
          }`}
        ></div>

        <Link href={props.item.href} className='w-full pr-4 pl-4'>
          <button
            className={
              `flex text-xl p-2 min-w-full rounded-xl` +
              (isActive
                ? ' bg-primary-1 bg-opacity-10 text-primary-1'
                : ' hover:bg-primary-1 hover:bg-opacity-5')
            }
          >
            <div className='my-auto'>{props.item.icon}</div>
            <h2 className='font-semibold pl-3'>{props.item.title}</h2>
          </button>
        </Link>
      </div>
    );
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
      <div onClick={() => {}} className='absolute bottom-0 mx-auto w-full p-3'>
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
