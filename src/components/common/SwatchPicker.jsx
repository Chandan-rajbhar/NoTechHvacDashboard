import React from 'react';
import { Check } from 'lucide-react';

/**
 * SwatchPicker
 * Renders the 10 front panel colors from COLOR_SPECTRUM
 */
export const SwatchPicker = ({
  colors = [],
  selectedColor,
  onSelectColor,
  size = 'md', // 'sm' | 'md' | 'lg'
}) => {
  const sizeClass = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {colors.map((c) => {
        const isSelected = selectedColor?.toLowerCase() === c.hex.toLowerCase();

        return (
          <button
            key={c.id || c.hex}
            type="button"
            onClick={() => onSelectColor && onSelectColor(c)}
            title={`${c.name} (${c.hex})`}
            className={`relative rounded-xl border transition-all duration-150 transform hover:scale-110 flex items-center justify-center shadow-xs ${sizeClass} ${
              isSelected
                ? 'ring-2 ring-[#A4A77E] ring-offset-2 dark:ring-offset-[#1A1D21] border-white scale-105'
                : 'border-black/10 dark:border-white/10 opacity-90 hover:opacity-100'
            }`}
            style={{ backgroundColor: c.hex }}
          >
            {isSelected && (
              <Check
                className="w-4 h-4 stroke-[3]"
                style={{ color: c.text || '#FFFFFF' }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
