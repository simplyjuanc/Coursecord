import { IconType } from 'react-icons';

export default function IconButton(props: {
  icon: JSX.Element;
  title: string;
  onClick: any;
}) {
  return (
    <button
      onClick={(e) => props.onClick(e)}
      className='text-3xl flex bg-primary-red bg-opacity-20 text-primary-red px-4 py-2 rounded-xl min-w-full'
    >
      <div className='my-auto mr-6'>{props.icon}</div>
      <h1 className='my-auto text font-semibold'>{props.title}</h1>
    </button>
  );
}
