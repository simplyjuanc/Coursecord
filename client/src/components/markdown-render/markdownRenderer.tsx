import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

import MarkdownStyle from './markdown.module.css';

export default function Markdown({ markdown }: { markdown: string }) {
  return (
    <div className='w-full'>
      <ReactMarkdown
        className={MarkdownStyle.markdown}
        rehypePlugins={[rehypeRaw]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
