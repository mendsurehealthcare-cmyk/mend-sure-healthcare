import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
  FlagImage,
  defaultCountries,
  parseCountry,
  usePhoneInput,
} from 'react-international-phone';
import 'react-international-phone/style.css';
import { isValidPhone } from '../lib/phone';
import Icon from './Icon';

/*
  International phone number field: flag + dial code selector and the number,
  inside one input-shaped box that matches the site's other fields.

  Built on react-international-phone's usePhoneInput hook (formatting, dial
  codes, E.164 output) rather than its ready-made <PhoneInput>, because that
  component's country dropdown (v4.8) has no search box. The hook is the
  library's documented way to supply your own selector; this one adds search
  by country name, ISO code and dial code.

  The value is always E.164, e.g. "+919876543210" — what the form stores and
  what the API receives.
*/

const COUNTRIES = defaultCountries.map(parseCountry);

// Common short names people type that aren't in the country's own name.
const ALIASES = {
  ae: 'uae emirates dubai',
  us: 'usa america',
  gb: 'uk britain england',
  kr: 'korea',
  ru: 'russia',
};

function matchesSearch(country, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const digits = q.replace(/[^\d]/g, '');
  if (digits && /^\+?\d+$/.test(q)) return country.dialCode.startsWith(digits);
  return `${country.name} ${country.iso2} ${ALIASES[country.iso2] || ''}`.toLowerCase().includes(q);
}

// Just the dial code (e.g. "+91") counts as empty.
function isEmptyPhone(phone, country) {
  return (phone || '').replace(/\D/g, '') === country.dialCode;
}

export default function PhoneField({
  id,
  label,
  labelClassName,
  value,
  onChange,
  name = 'phone',
  required = false,
  showError = false,
  defaultCountry = 'in',
}) {
  const { t } = useTranslation();
  const listId = useId();
  const errorId = useId();
  const searchRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [touched, setTouched] = useState(false);
  const [position, setPosition] = useState(null);

  const { inputValue, phone, country, setCountry, handlePhoneValueChange, inputRef } = usePhoneInput({
    defaultCountry,
    value,
    countries: defaultCountries,
    // The dial code is shown on the selector button, so the text box holds
    // only the national number — `phone` is still the full E.164 value.
    disableDialCodeAndPrefix: true,
    onChange: (data) => onChange(data.phone),
  });

  const empty = isEmptyPhone(phone, country);
  const error = empty
    ? required
      ? t('form.phoneRequired')
      : null
    : isValidPhone(phone)
      ? null
      : t('form.phoneInvalid', { country: country.name });
  const errorVisible = Boolean(error) && (touched || showError);

  const results = useMemo(() => COUNTRIES.filter((item) => matchesSearch(item, search)), [search]);

  // Fixed-position and portalled to <body>, so a form container with
  // overflow hidden can't clip it; opens upward when there's no room below.
  const place = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const height = 320;
    const below = window.innerHeight - rect.bottom;
    const up = below < height + 16 && rect.top > below;
    setPosition({
      left: Math.max(8, Math.min(rect.left, window.innerWidth - 328)),
      top: up ? undefined : rect.bottom + 6,
      bottom: up ? window.innerHeight - rect.top + 6 : undefined,
    });
  };

  useLayoutEffect(() => {
    if (!open) return undefined;
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    searchRef.current?.focus();
    function onPointerDown(event) {
      if (!listRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  // Keep the highlighted option in view while arrowing through the list.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  function openList() {
    setSearch('');
    const current = COUNTRIES.findIndex((item) => item.iso2 === country.iso2);
    setActiveIndex(Math.max(0, current));
    setOpen(true);
  }

  function choose(iso2) {
    setCountry(iso2, { focusOnInput: true });
    setOpen(false);
  }

  function onSearchKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(results.length - 1, index + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (results[activeIndex]) choose(results[activeIndex].iso2);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    } else if (event.key === 'Tab') {
      setOpen(false);
    }
  }

  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>

      <div
        className={`flex w-full items-stretch rounded-lg bg-surface-container-low transition-all focus-within:ring-2 ${
          errorVisible ? 'ring-2 ring-error focus-within:ring-error' : 'focus-within:ring-secondary'
        }`}
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' && !open) {
              event.preventDefault();
              openList();
            }
          }}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-label={t('form.phoneCountry', { country: country.name, dialCode: country.dialCode })}
          className="flex shrink-0 items-center gap-space-2xs rounded-l-lg border-r border-outline-variant/40 py-space-sm pr-space-xs pl-space-sm text-body-md text-on-surface transition-colors hover:bg-surface-container focus:outline-none"
        >
          <FlagImage iso2={country.iso2} size="20px" />
          <span>+{country.dialCode}</span>
          <Icon
            name="expand_more"
            className={`!text-[18px] text-on-surface-variant transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>

        <input
          ref={inputRef}
          id={id}
          type="tel"
          name={name}
          autoComplete="tel-national"
          inputMode="tel"
          required={required}
          value={inputValue}
          onChange={handlePhoneValueChange}
          onBlur={() => setTouched(true)}
          placeholder={t('form.phoneNumberPlaceholder')}
          aria-invalid={errorVisible}
          aria-describedby={errorVisible ? errorId : undefined}
          className="min-w-0 flex-1 rounded-r-lg bg-transparent px-space-sm py-space-sm text-body-md text-on-surface focus:outline-none"
        />
      </div>

      {errorVisible && (
        <p id={errorId} role="alert" className="mt-space-3xs flex items-center gap-space-3xs text-body-sm text-error">
          <Icon name="error" className="!text-[16px]" />
          {error}
        </p>
      )}

      {open &&
        position &&
        createPortal(
          <div
            ref={listRef}
            style={{ position: 'fixed', left: position.left, top: position.top, bottom: position.bottom }}
            className="z-[100] flex max-h-80 w-80 max-w-[calc(100vw-16px)] flex-col overflow-hidden rounded-xl border border-outline-variant/30 bg-white shadow-xl"
          >
            <div className="border-b border-outline-variant/30 p-space-xs">
              <div className="relative">
                <Icon
                  name="search"
                  className="pointer-events-none absolute top-1/2 left-space-xs -translate-y-1/2 !text-[18px] text-outline"
                />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={onSearchKeyDown}
                  placeholder={t('form.phoneSearch')}
                  aria-label={t('form.phoneSearch')}
                  aria-controls={listId}
                  aria-activedescendant={results[activeIndex] ? `${listId}-${results[activeIndex].iso2}` : undefined}
                  role="combobox"
                  aria-expanded="true"
                  aria-autocomplete="list"
                  className="w-full rounded-lg bg-surface-container-low py-space-xs pr-space-sm pl-8 text-body-md text-on-surface focus:ring-2 focus:ring-secondary focus:outline-none"
                />
              </div>
            </div>

            <ul id={listId} role="listbox" aria-label={label} className="flex-1 overflow-y-auto py-space-3xs">
              {results.length === 0 && (
                <li className="px-space-md py-space-sm text-body-sm text-on-surface-variant">
                  {t('form.phoneNoCountries')}
                </li>
              )}
              {results.map((item, index) => {
                const selected = item.iso2 === country.iso2;
                return (
                  <li
                    key={item.iso2}
                    id={`${listId}-${item.iso2}`}
                    data-index={index}
                    role="option"
                    aria-selected={selected}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => choose(item.iso2)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex cursor-pointer items-center gap-space-sm px-space-md py-space-xs text-body-md ${
                      index === activeIndex ? 'bg-surface-container-low' : ''
                    } ${selected ? 'font-semibold text-primary' : 'text-on-surface'}`}
                  >
                    <FlagImage iso2={item.iso2} size="20px" />
                    <span className="flex-1 truncate">{item.name}</span>
                    <span className="shrink-0 text-body-sm text-on-surface-variant">+{item.dialCode}</span>
                    {selected && <Icon name="check" className="!text-[16px] text-secondary" />}
                  </li>
                );
              })}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
}
