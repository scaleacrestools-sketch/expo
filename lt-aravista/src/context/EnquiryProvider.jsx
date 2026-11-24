import { useCallback, useMemo, useState } from 'react';
import { EnquiryContext } from './useEnquiry';
import EnquiryModal from '../components/layout/EnquiryModal';

export default function EnquiryProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('Register Your Interest');
  const openEnquiry = useCallback((t = 'Register Your Interest') => {
    setTitle(t);
    setOpen(true);
  }, []);
  const value = useMemo(() => ({ openEnquiry }), [openEnquiry]);
  return (
    <EnquiryContext.Provider value={value}>
      {children}
      <EnquiryModal isOpen={open} title={title} onClose={() => setOpen(false)} />
    </EnquiryContext.Provider>
  );
}
