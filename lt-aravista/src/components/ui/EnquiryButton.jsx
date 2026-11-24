import Button from './Button';
import { useEnquiry } from '../../context/useEnquiry';

export default function EnquiryButton({ children, title = 'Register Your Interest', variant = 'primary', className = '' }) {
  const { openEnquiry } = useEnquiry();
  return (
    <Button variant={variant} className={className} onClick={() => openEnquiry(title)}>
      {children}
    </Button>
  );
}
