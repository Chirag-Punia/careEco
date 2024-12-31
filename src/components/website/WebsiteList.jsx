import { useState } from 'react';
import WebsiteCard from './WebsiteCard';

const WebsiteList = ({ websites, onDelete }) => {
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {websites.map((website) => (
        <WebsiteCard
          key={website._id}
          website={website}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default WebsiteList;