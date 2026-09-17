import React from 'react';

interface DPaulIconProps {
  className?: string;
}

export const DPaulIcon: React.FC<DPaulIconProps> = ({ className = "w-6 h-6" }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9h3.5c1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5H13v2h-2zm2-4h1.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5H13v3z" fill="currentColor"/>
    </svg>
  );
};
