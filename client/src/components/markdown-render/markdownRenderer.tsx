import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

import MarkdownStyle from './markdown.module.css';

export default function Markdown({ markdown }: { markdown: string }) {
  return (
    <div className=' flex justify-center w-full p-8'>
      <div className='flex justify-center'>
        <ReactMarkdown
          className={MarkdownStyle.markdown}
          rehypePlugins={[rehypeRaw]}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
