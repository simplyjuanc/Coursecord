'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem } from '@/types';

export function NavItemComponent({item}: { item: NavItem; }) {
  const pathname = usePathname();
  const isActive = pathname.split('/')[3] === item.href;
  return (
    <div className='flex'>
      <div
        className={`w-1.5 rounded-tr-2xl rounded-br-2xl bg-primary-1 bg-opacity-${isActive ? '50' : '10'}`}
      ></div>

      <Link href={item.href} className='w-full pr-4 pl-4'>
        <button
          className={`flex text-xl p-2 min-w-full rounded-xl` +
            (isActive
              ? ' bg-primary-1 bg-opacity-10 text-primary-1'
              : ' hover:bg-primary-1 hover:bg-opacity-5')}
        >
          <div className='my-auto'>{item.icon}</div>
          <h2 className='font-semibold pl-3'>{item.title}</h2>
        </button>
      </Link>
    </div>
  );
}
