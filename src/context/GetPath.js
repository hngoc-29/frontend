'use client'
import {
  usePathname
} from 'next/navigation';
import {
  createContext
} from 'react';
const pathContext = createContext();
const GetPath = ({
  children
}) => {
  const pathname = usePathname();
  return(
    <pathContext.Provider value={pathname}>
      {children}
    </pathContext.Provider>
  )
}
export {
  GetPath,
  pathContext
}