import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi } from '../lib/useApi';
import { doctorImage } from '../lib/directoryImages';
import Icon from '../components/Icon';
import StatBadge from '../components/StatBadge';
import StateMessage from '../components/StateMessage';
import ConsultationForm from '../components/ConsultationForm';

// Prose (the bio) is clamped by line count and only gets a toggle once it
// actually runs past a couple of lines — a "Read More" under two lines that
// don't overflow is worse than no toggle at all.
function ExpandableText({ text }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;

  const needsToggle = text.length > 240;

  return (
    <div>
      <p
        className={`text-body-md leading-relaxed text-on-surface-variant ${
          expanded || !needsToggle ? '' : 'line-clamp-3'
        }`}
      >
        {text}
      </p>
      {needsToggle && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-space-2xs text-label-sm font-semibold text-secondary hover:underline"
        >
          {expanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
}

// Awards and other list-shaped fields: shown a couple at a time rather than
// clamped by character count, since guessing where a list of short entries
// visually overflows is unreliable — counting entries isn't.
function ExpandableList({ items, previewCount = 2 }) {
  const [expanded, setExpanded] = useState(false);
  if (!items || items.length === 0) return null;

  const visible = expanded ? items : items.slice(0, previewCount);
  const hasMore = items.length > previewCount;

  return (
    <div>
      <ul className="space-y-space-xs">
        {visible.map((item) => (
          <li
            key={item}
            className="flex items-start gap-space-xs text-body-md leading-relaxed text-on-surface-variant"
          >
            <span className="mt-space-3xs text-secondary" aria-hidden="true">
              &bull;
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-space-xs text-label-sm font-semibold text-secondary hover:underline"
        >
          {expanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
}

function ProfileCard({ icon, title, children }) {
  return (
    <section className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <div className="mb-space-md flex items-center gap-space-xs">
        <Icon name={icon} className="!text-[20px] text-secondary" />
        <h2 className="text-headline-sm font-bold text-primary">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function DoctorDetail() {
  const { slug } = useParams();
  const { data: doctor, loading, error } = useApi(`/doctors/${slug}`);
  const [visitType, setVisitType] = useState('hospital'); // 'hospital' | 'video'
  const [shared, setShared] = useState(false);

  if (loading) return <StateMessage>Loading doctor details...</StateMessage>;
  if (error || !doctor) return <StateMessage>We couldn't find that doctor.</StateMessage>;

  const hospitalName = doctor.hospitals?.name || doctor.hospital_name;
  const image = doctorImage(doctor);

  // `department` can itself carry several areas as one comma-joined string
  // ("Vascular Surgery, Paediatric CTVS, Adult CTVS, Heart Transplant") for a
  // doctor who spans more than one — split it into its own pills rather than
  // rendering it as a single long tag.
  const tags = [doctor.specialty, ...(doctor.department ? doctor.department.split(',').map((d) => d.trim()) : [])].filter(
    Boolean
  );

  async function handleShare() {
    const shareData = {
      title: doctor.name,
      text: [doctor.name, doctor.specialty].filter(Boolean).join(' — '),
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled the native share sheet — nothing to do.
      }
      return;
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  }

  return (
    <div className="flex w-full flex-col">
      <div className="mx-auto w-full max-w-7xl px-space-md py-space-xl sm:px-space-xl">
        {/* Profile header: photo, name, tags, location, and the at-a-glance
            stats — everything a patient needs before reading further. */}
        <div className="relative flex flex-col gap-space-lg rounded-xl bg-surface-container-lowest p-space-lg shadow-sm sm:p-space-xl lg:flex-row lg:items-start lg:justify-between">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share this doctor's profile"
            className="absolute top-space-lg right-space-lg flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/30 text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary"
          >
            <Icon name={shared ? 'check' : 'share'} className="!text-[18px]" />
          </button>

          <div className="flex flex-col gap-space-md sm:flex-row sm:items-start">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-primary-fixed ring-4 ring-surface-container-low sm:h-28 sm:w-28">
              {image ? (
                <img src={image} alt={doctor.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-primary">
                  <Icon name="person" className="!text-[40px]" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h1 className="text-headline-lg font-bold text-on-surface">{doctor.name}</h1>
              {(doctor.designation || hospitalName) && (
                <p className="mt-space-3xs text-body-md text-on-surface-variant">
                  {[doctor.designation, hospitalName].filter(Boolean).join(' · ')}
                </p>
              )}

              {tags.length > 0 && (
                <div className="mt-space-sm flex flex-wrap gap-space-2xs">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary-fixed px-space-md py-space-3xs text-label-sm font-medium text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {hospitalName && (
                <div className="mt-space-sm flex items-start gap-space-2xs text-body-sm text-on-surface-variant">
                  <Icon name="location_on" className="mt-0.5 !text-[16px] shrink-0 text-secondary" />
                  <div>
                    <p>Available at 1 hospital</p>
                    {doctor.hospitals?.slug ? (
                      <Link
                        to={`/hospitals/${doctor.hospitals.slug}`}
                        className="font-medium text-on-surface hover:text-secondary hover:underline"
                      >
                        {hospitalName}
                      </Link>
                    ) : (
                      <span className="font-medium text-on-surface">{hospitalName}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {(doctor.experience_years || doctor.consultation_fee) && (
            <div className="flex gap-space-md sm:w-64 sm:flex-col lg:w-56">
              {doctor.experience_years && (
                <StatBadge
                  icon="schedule"
                  value={`${doctor.experience_years} Years`}
                  label="Experience"
                />
              )}
              {doctor.consultation_fee && (
                <StatBadge
                  icon="currency_rupee"
                  value={`₹${doctor.consultation_fee}`}
                  label="Consultation Fee"
                />
              )}
            </div>
          )}
        </div>

        {/* Body: profile detail on the left, the request card sticky on the
            right — same two-thirds/one-third split used across every other
            detail page in the app. */}
        <div className="mt-space-2xl grid grid-cols-1 gap-space-2xl lg:grid-cols-3">
          <div className="space-y-space-lg lg:col-span-2">
            {doctor.bio && (
              <ProfileCard icon="person" title="About">
                <ExpandableText text={doctor.bio} />
              </ProfileCard>
            )}

            {doctor.education?.length > 0 && (
              <ProfileCard icon="school" title="Education">
                <p className="text-body-md leading-relaxed text-on-surface-variant">
                  {doctor.education.join(', ')}
                </p>
              </ProfileCard>
            )}

            {doctor.career_history?.length > 0 && (
              <ProfileCard icon="work_history" title="Experience">
                <ExpandableList items={doctor.career_history} />
              </ProfileCard>
            )}

            {doctor.awards?.length > 0 && (
              <ProfileCard icon="military_tech" title="Awards & Accolades">
                <ExpandableList items={doctor.awards} />
              </ProfileCard>
            )}

            {doctor.publications?.length > 0 && (
              <ProfileCard icon="menu_book" title="Publications">
                <ExpandableList items={doctor.publications} />
              </ProfileCard>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm lg:sticky lg:top-[112px]">
              <div className="border-b border-outline-variant/15 p-space-lg pb-space-md">
                <h2 className="mb-space-md text-headline-sm font-bold text-primary">
                  Schedule Appointment
                </h2>

                <div className="grid grid-cols-2 gap-space-2xs rounded-lg bg-surface-container-low p-space-3xs">
                  {[
                    { key: 'hospital', label: 'Hospital Visit', icon: 'local_hospital' },
                    { key: 'video', label: 'Video Consult', icon: 'videocam' },
                  ].map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setVisitType(option.key)}
                      className={`flex items-center justify-center gap-space-2xs rounded-md py-space-xs text-label-sm font-semibold transition-colors ${
                        visitType === option.key
                          ? 'bg-surface-container-lowest text-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-primary'
                      }`}
                    >
                      <Icon name={option.icon} className="!text-[16px]" />
                      {option.label}
                    </button>
                  ))}
                </div>

                {hospitalName && (
                  <p className="mt-space-md flex items-center gap-space-2xs text-body-sm text-on-surface-variant">
                    <Icon name="local_hospital" className="!text-[16px] text-secondary" />
                    {hospitalName}
                  </p>
                )}
              </div>

              <div className="p-space-lg pt-space-md">
                <ConsultationForm bare sourcePage={`doctor-${slug}-${visitType}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
