import { useState } from "react";
import WebsiteCard from "./WebsiteCard";

const WebsiteList = ({ websites, onDelete }) => {
  if (!websites) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          No websites found. Create your first website!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {websites.map((website) => (
        <WebsiteCard key={website._id} website={website} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default WebsiteList;
