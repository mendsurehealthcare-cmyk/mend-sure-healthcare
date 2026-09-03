import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { authFetch } from '../lib/auth';
import { formatDateTime, formatFileSize } from '../lib/format';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';

// Mirrors the server's multer config so the patient gets an instant, specific
// error instead of a round-trip and a generic rejection.
const ALLOWED_TYPES = {
  'application/pdf': 'PDF',
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
};
const MAX_BYTES = 20 * 1024 * 1024;

function fileIcon(fileName = '') {
  return fileName.toLowerCase().endsWith('.pdf') ? 'picture_as_pdf' : 'image';
}

export default function Reports() {
  const { user } = useAuth();

  const [reports, setReports] = useState(null);
  const [listError, setListError] = useState('');

  const [file, setFile] = useState(null);
  const [note, setNote] = useState('');
  const [uploadState, setUploadState] = useState('idle'); // idle | uploading
  const [uploadError, setUploadError] = useState('');
  const [uploadNotice, setUploadNotice] = useState('');

  const [busyId, setBusyId] = useState(null);
  const fileInputRef = useRef(null);

  const loadReports = useCallback(async () => {
    try {
      setListError('');
      setReports(await authFetch('/reports'));
    } catch (err) {
      setListError(err.message);
      setReports([]);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  function chooseFile(selected) {
    setUploadError('');
    setUploadNotice('');

    if (!selected) {
      setFile(null);
      return;
    }

    if (!ALLOWED_TYPES[selected.type]) {
      setUploadError('Only PDF, JPG, and PNG files are allowed.');
      setFile(null);
      return;
    }

    if (selected.size > MAX_BYTES) {
      setUploadError(`That file is ${formatFileSize(selected.size)}. The limit is 20MB.`);
      setFile(null);
      return;
    }

    setFile(selected);
  }

  async function handleUpload(event) {
    event.preventDefault();
    if (!file) {
      setUploadError('Choose a file to upload first.');
      return;
    }

    setUploadState('uploading');
    setUploadError('');
    setUploadNotice('');

    try {
      const body = new FormData();
      body.append('file', file);
      if (note.trim()) body.append('note', note.trim());

      await authFetch('/reports', { method: 'POST', body });

      setUploadNotice(`"${file.name}" uploaded securely.`);
      setFile(null);
      setNote('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadReports();
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploadState('idle');
    }
  }

  // The file itself never becomes public — the API mints a signed URL that
  // expires after 60 seconds, and we open that.
  async function handleDownload(report) {
    setBusyId(report.id);
    setListError('');

    try {
      const { url } = await authFetch(`/reports/${report.id}/download`);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setListError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(report) {
    if (!window.confirm(`Permanently delete "${report.file_name}"? This can't be undone.`)) return;

    setBusyId(report.id);
    setListError('');

    try {
      await authFetch(`/reports/${report.id}`, { method: 'DELETE' });
      await loadReports();
    } catch (err) {
      setListError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex w-full flex-col">
      <PageHero
        eyebrow="Private & Encrypted"
        eyebrowIcon="lock"
        title="My Medical Reports"
        subtitle="Upload your scans, lab results, and discharge summaries. Only you can open them — our specialists see them when you ask for a review."
        aside={
          <div className="max-w-sm rounded-xl bg-primary-container/60 p-space-lg text-on-primary backdrop-blur-md">
            <div className="mb-space-md flex items-center gap-space-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <Icon name="account_circle" className="!text-[20px] text-on-secondary" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-headline-sm font-bold">
                  {user?.full_name || 'Signed in'}
                </div>
                <div className="truncate text-body-sm text-primary-fixed-dim">{user?.email}</div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-primary-fixed-dim/20 pt-space-md text-body-sm">
              <span className="text-primary-fixed-dim">Files stored</span>
              <span className="font-bold text-secondary-container">
                {reports === null ? '—' : reports.length}
              </span>
            </div>
          </div>
        }
      />

      <section className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-xl">
        <div className="grid grid-cols-1 gap-space-2xl lg:grid-cols-12">
          {/* Upload */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[112px]">
              <h2 className="mb-space-md text-headline-md font-bold text-primary">Upload a Report</h2>

              <form
                onSubmit={handleUpload}
                className="space-y-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
              >
                <div>
                  <label
                    htmlFor="report-file"
                    className="flex cursor-pointer flex-col items-center justify-center gap-space-xs rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low p-space-xl text-center transition-colors hover:border-secondary"
                  >
                    <Icon name="cloud_upload" className="!text-[32px] text-secondary" />
                    <span className="text-label-md font-semibold text-on-surface">
                      {file ? file.name : 'Choose a file'}
                    </span>
                    <span className="text-body-sm text-on-surface-variant">
                      {file
                        ? `${ALLOWED_TYPES[file.type]} · ${formatFileSize(file.size)}`
                        : 'PDF, JPG, or PNG · up to 20MB'}
                    </span>
                  </label>
                  <input
                    id="report-file"
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                    className="hidden"
                    onChange={(e) => chooseFile(e.target.files?.[0] || null)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="report-note"
                    className="mb-space-3xs block text-label-sm font-semibold text-on-surface-variant"
                  >
                    Note (optional)
                  </label>
                  <input
                    id="report-note"
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. MRI scan, March 2026"
                    className="w-full rounded-lg bg-surface-container-low px-space-md py-space-sm text-body-md text-on-surface transition-all focus:ring-2 focus:ring-secondary focus:outline-none"
                  />
                </div>

                {uploadError && (
                  <p className="flex items-start gap-space-xs rounded-lg bg-error-container p-space-sm text-body-sm text-on-error-container">
                    <Icon name="error" className="!text-[18px] shrink-0" />
                    {uploadError}
                  </p>
                )}

                {uploadNotice && (
                  <p className="flex items-start gap-space-xs rounded-lg bg-tertiary-fixed p-space-sm text-body-sm text-on-tertiary-fixed">
                    <Icon name="check_circle" className="!text-[18px] shrink-0" />
                    {uploadNotice}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={uploadState === 'uploading' || !file}
                  className="flex w-full items-center justify-center gap-space-xs rounded-lg bg-secondary py-space-md text-label-md text-on-secondary shadow-sm transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploadState === 'uploading' ? 'Uploading...' : 'Upload Securely'}
                  {uploadState !== 'uploading' && <Icon name="lock" className="!text-[18px]" />}
                </button>

                <p className="flex items-center justify-center gap-space-3xs text-center text-body-sm text-outline">
                  <Icon name="shield" className="!text-[14px]" />
                  Stored privately — never shared without your say-so.
                </p>
              </form>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-7">
            <div className="mb-space-md flex items-center justify-between">
              <h2 className="text-headline-md font-bold text-primary">Your Files</h2>
              {reports !== null && (
                <span className="text-body-sm text-on-surface-variant">
                  {reports.length} {reports.length === 1 ? 'file' : 'files'}
                </span>
              )}
            </div>

            {listError && (
              <p className="mb-space-md flex items-start gap-space-xs rounded-lg bg-error-container p-space-sm text-body-sm text-on-error-container">
                <Icon name="error" className="!text-[18px] shrink-0" />
                {listError}
              </p>
            )}

            {reports === null && (
              <div className="rounded-xl bg-surface-container-lowest p-space-2xl text-center text-body-md text-on-surface-variant shadow-sm">
                Loading your reports...
              </div>
            )}

            {reports?.length === 0 && (
              <div className="rounded-xl bg-surface-container-lowest p-space-2xl text-center shadow-sm">
                <div className="mx-auto mb-space-md flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed text-primary">
                  <Icon name="folder_open" className="!text-[32px]" />
                </div>
                <h3 className="text-headline-sm font-bold text-primary">No reports yet</h3>
                <p className="mx-auto mt-space-xs max-w-sm text-body-md text-on-surface-variant">
                  Upload your first scan or lab result and it'll appear here, visible only to you.
                </p>
              </div>
            )}

            {reports?.length > 0 && (
              <div className="space-y-space-sm">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex flex-wrap items-center justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex min-w-0 items-center gap-space-md">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                        <Icon name={fileIcon(report.file_name)} className="!text-[20px]" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-label-md font-semibold text-on-surface">
                          {report.file_name}
                        </p>
                        <p className="truncate text-body-sm text-on-surface-variant">
                          {report.note ? `${report.note} · ` : ''}
                          {formatDateTime(report.uploaded_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-space-xs">
                      <button
                        type="button"
                        onClick={() => handleDownload(report)}
                        disabled={busyId === report.id}
                        className="flex items-center gap-space-3xs rounded-lg bg-primary px-space-md py-space-xs text-label-sm font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Icon name="download" className="!text-[16px]" />
                        {busyId === report.id ? 'Opening...' : 'Open'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(report)}
                        disabled={busyId === report.id}
                        aria-label={`Delete ${report.file_name}`}
                        className="flex items-center justify-center rounded-lg bg-surface-container p-space-xs text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Icon name="delete" className="!text-[20px]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-space-xl rounded-xl bg-surface-container-low p-space-lg">
              <h3 className="mb-space-xs text-label-md font-semibold text-on-surface">
                Ready for a review?
              </h3>
              <p className="mb-space-md text-body-sm text-on-surface-variant">
                Once your reports are uploaded, request a free second opinion and our care team will
                review them alongside your enquiry.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-space-xs rounded-lg bg-secondary px-space-lg py-space-sm text-label-md text-on-secondary transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed"
              >
                Request a Free Review
                <Icon name="arrow_forward" className="!text-[18px]" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
