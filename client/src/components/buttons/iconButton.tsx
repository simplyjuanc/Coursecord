import { IconType } from 'react-icons';

export default function IconButton(props: {
  icon: JSX.Element;
  title: string;
  onClick: any;
}) {
  return (
    <button
      onClick={(e) => props.onClick(e)}
      className='flex min-w-full px-4 py-2 text-2xl bg-primary-red bg-opacity-20 text-primary-red rounded-xl'
    >
      <div className='my-auto mr-6'>{props.icon}</div>
      <h1 className='my-auto font-semibold text'>{props.title}</h1>
    </button>
  );
}
