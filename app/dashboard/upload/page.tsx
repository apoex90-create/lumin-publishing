import UploadWizard from '@/components/dashboard/UploadWizard';

export default function UploadPage() {
  return (
    <div>
      <div className="mb-10">
        <p className="eyebrow">New Publication</p>
        <h2 className="font-display text-4xl text-royal-900">Publish a new book</h2>
        <p className="text-ink-900/60 mt-2">Follow each step. You can save progress and return anytime.</p>
      </div>
      <UploadWizard />
    </div>
  );
}
