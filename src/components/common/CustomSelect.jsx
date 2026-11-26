import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

/**
 * CustomSelect
 * Premium, theme-aligned custom select dropdown component for No-Tech HVAC dashboard.
 * - Squircles (rounded-xl) with subtle borders and glassmorphic popover
 * - Portal-rendered to document.body so tables and overflow containers never clip it
 * - Auto-flips upward if near bottom of viewport (essential for table pagination footers)
 * - Olive (#A4A77E) active and hover states
 * - Fully accessible with keyboard navigation (Arrows, Enter, Escape, Space)
 * - Supports options array or standard <option> children
 * - Emits standard synthetic event { target: { value, name } } for drop-in replacement
 */
export const CustomSelect = ({
  value,
  defaultValue,
  onChange,
  onValueChange,
  options,
  children,
  placeholder = 'Select option...',
  className = '',
  menuClassName = '',
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: LeadingIcon,
  align = 'left',
  placement = 'auto', // 'auto' | 'top' | 'bottom'
  minWidth,
  disabled = false,
  name,
  id,
  fontMono = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [coords, setCoords] = useState({ top: undefined, bottom: undefined, left: 0, width: 0, maxHeight: 260, placement: 'bottom' });

  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  // Controlled vs Uncontrolled value
  const currentValue = value !== undefined ? value : internalValue;

  // Normalize options from either options prop or children (<option>)
  const parsedOptions = useMemo(() => {
    if (options && Array.isArray(options)) {
      return options.map((opt) => {
        if (typeof opt === 'object' && opt !== null) {
          return {
            value: opt.value !== undefined ? opt.value : opt.id,
            label: opt.label !== undefined ? opt.label : (opt.name || String(opt.value)),
            disabled: !!opt.disabled,
            icon: opt.icon,
            badge: opt.badge,
          };
        }
        return {
          value: opt,
          label: String(opt),
          disabled: false,
        };
      });
    }

    if (children) {
      const list = [];
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
          const val = child.props.value !== undefined ? child.props.value : child.props.children;
          list.push({
            value: val,
            label: child.props.children !== undefined ? child.props.children : String(val),
            disabled: !!child.props.disabled,
          });
        }
      });
      return list;
    }

    return [];
  }, [options, children]);

  // Find currently selected option
  const selectedOption = useMemo(() => {
    return parsedOptions.find((opt) => String(opt.value) === String(currentValue));
  }, [parsedOptions, currentValue]);

  // Update dropdown portal position
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const triggerWidth = rect.width;
    const finalWidth = Math.max(triggerWidth, minWidth || 0);

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    let shouldPlaceTop = false;
    if (placement === 'top') {
      shouldPlaceTop = true;
    } else if (placement === 'bottom') {
      shouldPlaceTop = false;
    } else {
      // 'auto': if space below is limited (< 260px) and space above has more room, flip upward
      shouldPlaceTop = spaceBelow < 260 && spaceAbove > spaceBelow;
    }

    const safeMargin = 16;
    const maxAvailableHeight = shouldPlaceTop
      ? Math.max(80, rect.top - safeMargin - 6)
      : Math.max(80, window.innerHeight - rect.bottom - safeMargin - 6);
    const finalMaxHeight = Math.min(maxAvailableHeight, 260);

    let top = undefined;
    let bottom = undefined;

    if (shouldPlaceTop) {
      bottom = window.innerHeight - rect.top + 6;
    } else {
      top = rect.bottom + 6;
    }

    let left = align === 'right' ? rect.right - finalWidth : rect.left;

    // Viewport horizontal clamp
    if (left < 12) left = 12;
    if (left + finalWidth > window.innerWidth - 12) {
      left = window.innerWidth - finalWidth - 12;
    }

    setCoords({
      top,
      bottom,
      left,
      width: finalWidth,
      maxHeight: finalMaxHeight,
      placement: shouldPlaceTop ? 'top' : 'bottom',
    });
  }, [parsedOptions.length, minWidth, align, placement]);

  // Reposition when opened, scrolled, or resized
  useEffect(() => {
    if (!isOpen) return;

    updatePosition();
    const handleScroll = (e) => {
      // Don't close or jerk if scrolling inside the dropdown menu itself
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      updatePosition();
    };

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, updatePosition]);

  // Click outside and Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Handle item selection
  const handleSelect = (opt) => {
    if (opt.disabled) return;

    setInternalValue(opt.value);
    setIsOpen(false);

    if (onValueChange) {
      onValueChange(opt.value);
    }

    if (onChange) {
      const syntheticEvent = {
        target: { value: opt.value, name },
        currentTarget: { value: opt.value, name },
        value: opt.value,
        preventDefault: () => {},
        stopPropagation: () => {},
      };
      onChange(syntheticEvent, opt.value);
    }

    triggerRef.current?.focus();
  };

  // Keyboard navigation on trigger
  const handleTriggerKeyDown = (e) => {
    if (disabled) return;

    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        const selIdx = parsedOptions.findIndex((o) => String(o.value) === String(currentValue));
        setHighlightedIndex(selIdx >= 0 ? selIdx : 0);
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (highlightedIndex >= 0 && highlightedIndex < parsedOptions.length) {
          handleSelect(parsedOptions[highlightedIndex]);
        }
      }
    } else if (e.key === 'ArrowUp' && isOpen) {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : parsedOptions.length - 1));
    } else if (e.key === 'ArrowDown' && isOpen) {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < parsedOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'Tab' && isOpen) {
      setIsOpen(false);
    }
  };

  // Size styling tokens
  const sizeClasses = {
    sm: 'h-8 py-1 pl-2.5 pr-7 text-xs',
    md: 'h-9 sm:h-10 py-2 pl-3 pr-8 text-xs sm:text-sm',
    lg: 'h-11 py-2.5 pl-3.5 pr-9 text-sm',
  };

  const isMono = fontMono || size === 'sm';

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        name={name}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
            const selIdx = parsedOptions.findIndex((o) => String(o.value) === String(currentValue));
            setHighlightedIndex(selIdx >= 0 ? selIdx : 0);
          }
        }}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`group relative inline-flex items-center justify-between select-none cursor-pointer outline-none rounded-xl border ${
          isOpen
            ? 'border-[#A4A77E] ring-2 ring-[#A4A77E]/25 dark:border-[#A4A77E] dark:ring-[#A4A77E]/25 bg-white dark:bg-[#22262C]'
            : 'border-slate-200/90 dark:border-white/10 hover:border-[#A4A77E] dark:hover:border-[#A4A77E] bg-white dark:bg-[#22262C] hover:bg-slate-50 dark:hover:bg-[#282D34]'
        } ${sizeClasses[size] || sizeClasses.md} ${
          isMono ? 'font-mono' : 'font-sans'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        {...props}
      >
        <span className="flex items-center gap-2 truncate">
          {LeadingIcon && (
            <LeadingIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#A4A77E] flex-shrink-0" />
          )}
          <span className="truncate text-slate-800 dark:text-slate-100 font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-400 group-hover:text-[#A4A77E] absolute right-2.5 pointer-events-none ${
            isOpen ? 'rotate-180 text-[#A4A77E]' : ''
          }`}
        />
      </button>

      {/* Modern Portal-Rendered Dropdown Menu (No Animation) */}
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: coords.top !== undefined ? `${coords.top}px` : undefined,
              bottom: coords.bottom !== undefined ? `${coords.bottom}px` : undefined,
              left: `${coords.left}px`,
              width: coords.width ? `${coords.width}px` : undefined,
              maxHeight: coords.maxHeight ? `${coords.maxHeight}px` : undefined,
              zIndex: 99999,
            }}
            role="listbox"
            className={`bg-white dark:bg-[#1E2227] border border-slate-200/90 dark:border-white/10 rounded-xl shadow-xl shadow-black/15 dark:shadow-black/60 p-1 overflow-hidden flex flex-col ${menuClassName}`}
          >
            <div
              className="overflow-y-auto overflow-x-hidden scrollbar-thin py-0.5 space-y-0.5"
              style={{ maxHeight: coords.maxHeight ? `${coords.maxHeight - 10}px` : undefined }}
            >
              {parsedOptions.map((opt, idx) => {
                const isSelected = String(opt.value) === String(currentValue);
                const isHighlighted = idx === highlightedIndex;

                return (
                  <div
                    key={`${opt.value}-${idx}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`relative flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs md:text-sm cursor-pointer select-none outline-none ${
                      isMono ? 'font-mono' : 'font-sans'
                    } ${
                      opt.disabled
                        ? 'opacity-40 cursor-not-allowed text-slate-400'
                        : isSelected
                        ? 'bg-[#A4A77E]/20 text-[#4E5434] dark:text-[#D7DBB0] font-semibold'
                        : isHighlighted
                        ? 'bg-[#A4A77E]/10 dark:bg-white/5 text-slate-900 dark:text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-[#A4A77E]/10 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon && <opt.icon className="w-3.5 h-3.5 flex-shrink-0" />}
                      <span className="truncate">{opt.label}</span>
                      {opt.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400">
                          {opt.badge}
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#A4A77E] ml-2 flex-shrink-0 stroke-[2.5]" />
                    )}
                  </div>
                );
              })}

              {parsedOptions.length === 0 && (
                <div className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500 text-center">
                  No options
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default CustomSelect;
