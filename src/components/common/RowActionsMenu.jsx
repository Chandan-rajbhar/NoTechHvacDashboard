import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';

/**
 * RowActionsMenu
 * A portal-rendered dropdown menu for table row actions.
 * - Single 32px rounded button with vertical three-dot (⋮) icon
 * - Portaled to document.body so overflow never clips it
 * - Automatically flips upward if near the bottom of the viewport
 * - Closes on Escape, outside click, and window resize/scroll
 * - Supports keyboard navigation and ARIA roles
 */
export const RowActionsMenu = ({
  items = [],
  onViewDetails,
  onEdit,
  onDelete,
  deleteLabel = 'Delete',
  deleteConfirmMessage = 'Are you sure you want to delete this record?',
  className = '',
  menuWidth = 195,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, placement: 'bottom' });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  // If items array is not explicitly provided, build default items from standard props
  const menuItems = React.useMemo(() => {
    if (items && items.length > 0) return items;

    const list = [];
    if (onViewDetails) {
      list.push({
        label: 'View Details',
        icon: Eye,
        onClick: onViewDetails,
      });
    }
    if (onEdit) {
      list.push({
        label: 'Edit',
        icon: Edit,
        onClick: onEdit,
      });
    }
    if (onDelete) {
      if (list.length > 0) {
        list.push({ divider: true });
      }
      list.push({
        label: deleteLabel,
        icon: Trash2,
        variant: 'danger',
        onClick: onDelete,
        confirmMessage: deleteConfirmMessage,
      });
    }
    return list;
  }, [items, onViewDetails, onEdit, onDelete, deleteLabel, deleteConfirmMessage]);

  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const dropdownHeight = 44 * Math.max(menuItems.length, 1) + 16;
    const padding = 8;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const shouldFlip = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

    const top = shouldFlip
      ? Math.max(padding, rect.top - dropdownHeight - 4)
      : Math.min(window.innerHeight - dropdownHeight - padding, rect.bottom + 4);

    // Right-aligned to button
    let left = rect.right - menuWidth;
    if (left < padding) left = padding;
    if (left + menuWidth > window.innerWidth - padding) {
      left = window.innerWidth - menuWidth - padding;
    }

    setCoords({
      top,
      left,
      placement: shouldFlip ? 'top' : 'bottom',
    });
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!isOpen) {
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    const handleScrollOrResize = () => {
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleScrollOrResize, true);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleScrollOrResize, true);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen]);

  const handleItemClick = (e, item) => {
    e.stopPropagation();
    if (item.disabled) return;

    if (item.confirmMessage) {
      const confirmed = window.confirm(item.confirmMessage);
      if (!confirmed) {
        setIsOpen(false);
        return;
      }
    }

    setIsOpen(false);
    if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <div className={`relative inline-block ${className}`} onClick={(e) => e.stopPropagation()}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-label="Row actions"
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 border ${
          isOpen
            ? 'bg-[#1E2227] text-white border-[#1E2227] dark:bg-[#A4A77E] dark:text-[#121417] dark:border-[#A4A77E] shadow-sm ring-2 ring-[#A4A77E]/30'
            : 'bg-white dark:bg-[#22262C] border-slate-200/90 dark:border-white/10 text-slate-600 dark:text-slate-300 shadow-2xs hover:bg-[#A4A77E]/15 hover:border-[#A4A77E]/50 hover:text-slate-900 dark:hover:text-white hover:shadow-xs group-hover:border-slate-300 dark:group-hover:border-white/20'
        }`}
      >
        <MoreVertical className="w-4 h-4 stroke-[2.4]" />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-orientation="vertical"
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${menuWidth}px`,
              zIndex: 99999,
            }}
            className="bg-white dark:bg-[#1E2227] border border-slate-200/90 dark:border-white/10 rounded-[14px] shadow-2xl py-1.5 text-xs text-left animate-scale-up select-none backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            {menuItems.map((item, index) => {
              if (item.divider) {
                return (
                  <div
                    key={`div-${index}`}
                    className="my-1 border-t border-slate-100 dark:border-[#2E353F]"
                    role="separator"
                  />
                );
              }

              if (item.header) {
                const HeaderIcon = item.icon;
                return (
                  <div
                    key={`header-${index}`}
                    className="px-3.5 pt-2 pb-1 text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 select-none"
                  >
                    {HeaderIcon && <HeaderIcon className="w-3 h-3 text-slate-400 dark:text-slate-500" />}
                    <span>{item.header}</span>
                  </div>
                );
              }

              if (item.custom) {
                return (
                  <div key={`custom-${index}`} className="px-2.5 py-1">
                    {typeof item.custom === 'function' ? item.custom(() => setIsOpen(false)) : item.custom}
                  </div>
                );
              }

              const Icon = item.icon;
              const isDanger = item.variant === 'danger';

              return (
                <button
                  key={item.label || index}
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={(e) => handleItemClick(e, item)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-left transition-colors ${
                    isDanger
                      ? 'text-[#B4443C] dark:text-[#E89994] hover:bg-red-50 dark:hover:bg-red-950/30'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-[#A4A77E]/12 hover:text-slate-900 dark:hover:text-white dark:hover:bg-[#282F38]'
                  } ${item.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {Icon && (
                    <Icon
                      className={`w-3.5 h-3.5 flex-shrink-0 ${
                        isDanger ? 'text-[#B4443C] dark:text-[#E89994]' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    />
                  )}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
};
