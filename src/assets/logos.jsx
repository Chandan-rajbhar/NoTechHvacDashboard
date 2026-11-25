import React from 'react';
import notechLogoWithText from './notech-logo-with-text.png';
import notechLogoWhite from './notech-logo-white.png';
import notechIcon from './notech-icon.png';

// Official No-Tech HVAC Logo (with brand typography)
export const NoTechHvacLogo = ({ className = "h-8", variant = "white" }) => {
  return (
    <img
      src={variant === "white" ? notechLogoWhite : notechLogoWithText}
      alt="No-Tech HVAC"
      className={`w-auto object-contain select-none ${className}`}
    />
  );
};

// Official No-Tech HVAC Icon (emblem/symbol only)
export const NoTechHvacIcon = ({ className = "h-8" }) => {
  return (
    <img
      src={notechIcon}
      alt="No-Tech HVAC"
      className={`w-auto object-contain select-none ${className}`}
    />
  );
};

// Backward-compatible alias for existing components
export const LocalIndustriesLogo = ({ className = "h-8", variant = "white" }) => {
  return <NoTechHvacLogo className={className} variant={variant} />;
};

// Official Local Mechanical Regulatory Emblem
// Described in PDF as official contractor certification & quality enforcement authority
export const LocalMechanicalBadge = ({ className = "", showLabel = true, size = "md" }) => {
  return (
    <div className={`inline-flex items-center gap-2 bg-[#F8FAF6] dark:bg-[#22262C] border border-[#CCD4BE] dark:border-[#4D5640] px-3 py-1.5 rounded-full shadow-xs ${className}`}>
      <svg viewBox="0 0 40 40" className="w-4 h-4 flex-shrink-0 text-[#73784F]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" stroke="#73784F" strokeWidth="2.5" fill="rgba(164, 167, 126, 0.2)" />
        <circle cx="20" cy="20" r="10" stroke="#C2B59B" strokeWidth="1.2" strokeDasharray="2 2" />
        <path d="M15 20L18.5 23.5L25 17" stroke="#73784F" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {showLabel && (
        <div className="flex flex-col leading-none">
          <span className="text-[10px] font-extrabold tracking-wider text-slate-900 dark:text-slate-100 uppercase">
            LOCAL MECHANICAL
          </span>
          <span className="text-[8px] tracking-wide text-[#73784F] dark:text-[#BFC399] font-semibold mt-0.5">
            Verified Authority
          </span>
        </div>
      )}
    </div>
  );
};

// Compact "Approved by Local Mechanical" Seal for pills and tables
export const ApprovedByLocalMechanicalSeal = ({ className = "" }) => {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF1EB] dark:bg-[#1E251E] border border-[#CCD4BE] dark:border-[#4D5640] text-[#555A38] dark:text-[#BFC399] text-[10px] font-bold tracking-wide uppercase shadow-2xs ${className}`}>
      <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#73784F] dark:text-[#A4A77E]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
      <span>Approved by Local Mechanical</span>
    </span>
  );
};

// No-Tech Systems EST. 2022 Wordmark per requirements
export const NoTechWordmarkEst2022 = ({ className = "" }) => {
  return (
    <div className={`inline-flex flex-col items-center justify-center border border-slate-300 dark:border-slate-700 px-3.5 py-1.5 rounded-full bg-slate-100/60 dark:bg-slate-800/40 text-center ${className}`}>
      <span className="text-[10.5px] font-bold tracking-[0.2em] uppercase text-slate-800 dark:text-slate-200 font-mono">
        NO-TECH SYSTEMS
      </span>
      <span className="text-[8px] font-semibold tracking-widest text-[#6D6E71] dark:text-[#8D8E92] uppercase mt-0.5">
        EST. 2022 · MODULAR INDUSTRIAL
      </span>
    </div>
  );
};
