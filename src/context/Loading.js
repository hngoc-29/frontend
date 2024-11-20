'use client';
import {
  createContext,
  useState
} from 'react';
const loadingContext = createContext();
const LoadingProvider = ({
  children
}) => {
  const [loading,
    setLoading] = useState(true);
  const loadingMethod = {
    loading,
    setLoading
  };
  return (
    <loadingContext.Provider value={loadingMethod}>
      {children}
    </loadingContext.Provider>
  );
};

export {
  loadingContext,
  LoadingProvider
};