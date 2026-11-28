import { brand } from '../../config/brand';
import { Modal } from './Modal';

const copy = {
  privacy: {
    title: 'Privacy Policy',
    body: [
      `The full privacy policy for ${brand.productName} will be published before commercial launch.`,
      'This preview website collects only the details you choose to submit in the demo request form. They are used solely to respond to your enquiry and are not sold or shared for marketing.',
      'Sample audio, dashboards and data on this page are demonstrations and do not contain personal information.',
    ],
  },
  terms: {
    title: 'Terms of Service',
    body: [
      `The full terms of service for ${brand.productName} will be published before commercial launch.`,
      'Features described as planned or supported by design are product intentions, not commitments of availability. Demonstration data does not represent product performance.',
    ],
  },
};

export function LegalModal({ which, onClose }: { which: 'privacy' | 'terms' | null; onClose: () => void }) {
  const c = which ? copy[which] : null;
  return (
    <Modal open={!!which} onClose={onClose} title={c?.title ?? 'Legal'} testId="legal-modal">
      {c && (
        <div className="px-6 pb-8 pt-10 sm:px-9">
          <h2 className="h-card text-[24px]">{c.title}</h2>
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed">{c.body.map((p) => <p key={p}>{p}</p>)}</div>
        </div>
      )}
    </Modal>
  );
}
