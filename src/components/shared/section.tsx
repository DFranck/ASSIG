import { cn } from '@/lib/utils';
import React from 'react';

const Section = ({
  children,
  className,
  bgImg,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  bgImg?: string;
  id?: string;
}) => {
  const backgroundStyle = {
    backgroundImage: bgImg ? `url(${bgImg})` : 'none',
    backgroundSize: '60%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  };

  return (
    <section
      className={cn(
        'flex items-center justify-center flex-col flex-grow w-full relative py-10 max-w-7xl mx-auto',
        className,
      )}
      id={id}
      style={backgroundStyle}
    >
      {children}
    </section>
  );
};

export default Section;
