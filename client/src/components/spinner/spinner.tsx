import { ImSpinner8 } from 'react-icons/im';
import {TiTick} from 'react-icons/ti';

export default function Spinner({active}: {active: boolean}) {
  
  return <div className={`mx-4 my-6  bg-primary-red bg-opacity-30 aspect-square rounded-full text-2xl p-2 ${active ? 'animate-spin' : ''}`}>{active ? <ImSpinner8 /> : <TiTick />}</div>
};