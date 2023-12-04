import { IconType } from 'react-icons';

export default function IconButton(props: {
  icon: JSX.Element;
  title: string;
  onClick: any;
}) {
  return (
    <button
      onClick={(e) => props.onClick(e)}
      className='flex bg-primary-1 bg-opacity-20 text-primary-1 px-4 py-2 rounded-xl min-w-full :hover:bg-primary-1 hover:bg-opacity-50 hover:text-white'
    >
      <div className='my-auto mr-6'>{props.icon}</div>
      <h1 className='my-auto font-semibold text'>{props.title}</h1>
    </button>
  );
}
