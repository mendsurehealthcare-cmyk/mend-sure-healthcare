import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { searchLocations } from '../lib/locations';
import Icon from './Icon';

// Free-text input with a suggestion list, following the ARIA combobox pattern.
//
// It stays a plain text field on purpose: patients can type a town we don't
// have in the dataset and still submit the form. The suggestions are a
// shortcut, never a gate.
export default function Autocomplete({
  index,
  value,
  onChange,
  onSelect,
  priority = [],
  icon,
  inputClassName = '',
  priorityLabel,
  ...inputProps
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const listRef = useRef(null);
  const listId = useId();

  const suggestions = useMemo(
    () => (open ? searchLocations(index, value, { priority }) : []),
    // `priority` is typically a fresh array each render, so depending on it
    // directly would recompute on every keystroke of an unrelated field.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [index, value, open, priority.join('|')]
  );

  // Close when focus or a click lands outside the field.
  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  // Keep the highlighted row visible when arrowing past the visible window.
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    listRef.current.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  function commit(suggestion) {
    onChange(suggestion.value);
    onSelect?.(suggestion.value);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleChange(event) {
    onChange(event.target.value);
    setOpen(true);
    setActiveIndex(-1);
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowDown' && !open) {
      setOpen(true);
      return;
    }

    if (!open || suggestions.length === 0) {
      // Escape should still clear a stale open state even with no matches.
      if (event.key === 'Escape') setOpen(false);
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((current) => (current + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((current) => (current <= 0 ? suggestions.length - 1 : current - 1));
        break;
      case 'Enter':
        // Only swallow Enter when a row is actually highlighted, so pressing it
        // straight after typing still submits the surrounding form.
        if (activeIndex >= 0) {
          event.preventDefault();
          commit(suggestions[activeIndex]);
        } else {
          setOpen(false);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        break;
    }
  }

  const expanded = open && suggestions.length > 0;

  return (
    <div className="relative" ref={wrapperRef}>
      {icon && (
        <Icon
          name={icon}
          className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 !text-[20px] text-outline"
        />
      )}

      <input
        {...inputProps}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => value && setOpen(true)}
        role="combobox"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        autoComplete="off"
        className={`${inputClassName} ${icon ? 'pl-10' : ''}`}
      />

      {expanded && (
        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          className="absolute z-50 mt-space-2xs max-h-72 w-full overflow-y-auto rounded-xl bg-surface-container-lowest py-space-2xs shadow-xl"
        >
          {suggestions.map((suggestion, position) => (
            <li
              key={suggestion.value}
              id={`${listId}-${position}`}
              role="option"
              aria-selected={position === activeIndex}
              // mousedown rather than click: click fires after blur, by which
              // point the list has already closed and the row is gone.
              onMouseDown={(event) => {
                event.preventDefault();
                commit(suggestion);
              }}
              onMouseEnter={() => setActiveIndex(position)}
              className={`flex cursor-pointer items-center gap-space-sm px-space-md py-space-xs text-body-md transition-colors ${
                position === activeIndex
                  ? 'bg-primary-fixed text-on-primary-fixed'
                  : 'text-on-surface'
              }`}
            >
              {suggestion.flag ? (
                <span className="text-body-lg leading-none">{suggestion.flag}</span>
              ) : (
                <Icon
                  name="location_on"
                  className="!text-[18px] shrink-0 text-outline"
                />
              )}

              <span className="min-w-0 flex-1 truncate">
                <Highlighted
                  text={suggestion.value}
                  start={suggestion.matchIndex}
                  length={suggestion.matchLength}
                />
                {suggestion.via && (
                  <span className="ml-space-2xs text-body-sm text-on-surface-variant">
                    · also called {suggestion.via}
                  </span>
                )}
              </span>

              {suggestion.isPriority && priorityLabel && (
                <span className="shrink-0 rounded-full bg-tertiary-fixed px-space-xs py-space-3xs text-label-sm whitespace-nowrap text-on-tertiary-fixed-variant">
                  {priorityLabel}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Bolds the run of characters the query matched, so it's obvious why a row is
// in the list. Matches found through an alias have no offset into this string,
// and fall through to plain text with the "also called" hint doing that job.
function Highlighted({ text, start, length }) {
  if (start < 0 || length <= 0) return text;

  return (
    <>
      {text.slice(0, start)}
      <mark className="bg-transparent font-bold text-inherit">
        {text.slice(start, start + length)}
      </mark>
      {text.slice(start + length)}
    </>
  );
}
