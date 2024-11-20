'use client';
import {
  createContext,
  useState
} from 'react';
const thumbnailContext = createContext();
const ThumbnailProvider = ({
  children
}) => {
  const [thumbnail,
    setThumbnail] = useState([]);
  const thumbnailMethod = {
    thumbnail,
    setThumbnail
  };
  return (
    <thumbnailContext.Provider value={thumbnailMethod}>
      {children}
    </thumbnailContext.Provider>
  );
};

export {
  thumbnailContext,
  ThumbnailProvider
};