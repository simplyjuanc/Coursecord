import React from 'react';
import { IContentItem } from '../interfaces/types';

interface ContentAreaProps {
  content: IContentItem[];
}

const ContentArea: React.FC<ContentAreaProps> = ({ content }) => {
  const renderContentItem = (item: IContentItem) => {
    switch (item.type) {
      case 'text':
        return <p>{item.value}</p>;
      case 'link':
        return <a href={item.value} target="_blank" rel="noopener noreferrer">{item.value}</a>;
      case 'video':
        const videoUrl = `https://www.youtube.com/embed/${item.value}`;
        return <iframe src={videoUrl} width="560" height="315" frameBorder="0" allowFullScreen></iframe>;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-10 bg-white">
      {content.length > 0 ? content.map((item, index) => <div key={index}>{renderContentItem(item)}</div>) : <p>No content selected</p>}
    </div>
  );
};

export default ContentArea;
