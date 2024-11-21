'use client';

import { cn } from '@/lib/utils';

const GuthubSvg = ({
  className,
  fill,
  background,
}: {
  className?: string;
  fill?: string;
  background?: string;
}) => {
  if (!fill) fill = 'foreground';
  if (!background) background = 'background';
  return (
    <div
      className={cn('rounded p-2 aspect-square w-10 h-10', className)}
      style={{ backgroundColor: `hsl(var(--${background}))` }}
    >
      <svg
        viewBox="0 0 554 543"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <g clipPath="url(#clip0_91_14)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M276.175 0C123.457 0 0 124.438 0 278.384C0 401.441 79.1033 505.607 188.84 542.474C202.56 545.246 207.586 536.484 207.586 529.114C207.586 522.66 207.134 500.539 207.134 477.489C130.309 494.085 114.311 444.304 114.311 444.304C101.964 412.041 83.671 403.749 83.671 403.749C58.5261 386.695 85.5025 386.695 85.5025 386.695C113.395 388.539 128.031 415.271 128.031 415.271C152.717 457.67 192.498 445.69 208.502 438.314C210.786 420.339 218.106 407.895 225.879 400.983C164.606 394.529 100.138 370.564 100.138 263.632C100.138 233.213 111.105 208.325 128.483 188.97C125.741 182.058 116.136 153.477 131.23 115.223C131.23 115.223 154.549 107.848 207.128 143.799C229.639 137.705 252.854 134.605 276.175 134.579C299.494 134.579 323.265 137.809 345.215 143.799C397.8 107.848 421.119 115.223 421.119 115.223C436.213 153.477 426.603 182.058 423.861 188.97C441.696 208.325 452.211 233.213 452.211 263.632C452.211 370.564 387.743 394.065 326.012 400.983C336.074 409.739 344.758 426.329 344.758 452.602C344.758 489.933 344.305 519.894 344.305 529.108C344.305 536.484 349.337 545.246 363.051 542.48C472.788 505.601 551.891 401.441 551.891 278.384C552.344 124.438 428.434 0 276.175 0Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_91_14">
            <rect width="554" height="543" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default GuthubSvg;
