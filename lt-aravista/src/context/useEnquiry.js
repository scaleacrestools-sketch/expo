import { createContext, useContext } from 'react';

export const EnquiryContext = createContext(null);

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw Error('useEnquiry must be used within EnquiryProvider');
  return ctx;
}
