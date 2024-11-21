'use client';
import Burger from '@/components/burger';
import UserAuth from '@/features/auth/components/user-auth';
import LocaleSwitcher from '@/features/internationalization/locale-switcher';
import { ThemeSwitcher } from '@/features/theme/theme-switcher';
import useOnScroll from '@/hooks/useOnScroll';
import { cn } from '@/lib/utils';
import { Home, LogOut, Paperclip, Settings, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import EzStartSvg from './svgs/ezstart-svg';
import UserMenu from './user-menu';

export const DesktopHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const scrollY = useOnScroll();
  const t = useTranslations('layout.header');
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <header
      className={cn('p-6 z-10 fixed w-full ', {
        'bg-background': isOpen,
        'p-2 bg-background': scrollY > 0,
      })}
    >
      <div className="mx-auto max-w-screen-lg h-fit">
        <div className="flex flex-wrap items-center justify-between">
          <Link href="/" className="flex items-center">
            <EzStartSvg background="transparent" />
            <h2 className="flex items-center text-xl font-semibold my-0">
              AS SIG
            </h2>
          </Link>
          {/* <Nav
            navClass="hidden lg:flex"
            t={'layout.header'}
            render={'nav-links'}
            root={[0]}
            dir={'row'}
          /> */}
          <nav className="hidden md:flex gap-2">
            <Link href={'/'}>Accueil</Link>
            <Link href={'/projects'}>Projets</Link>
          </nav>
          {!user && (
            <UserAuth setIsOpen={setIsOpen} className="hidden lg:flex" />
          )}

          <div className="flex items-center gap-2">
            {!user && (
              <>
                <LocaleSwitcher />
                <ThemeSwitcher />
              </>
            )}
            <Burger
              setIsOpen={setIsOpen}
              isOpen={isOpen}
              className="flex md:hidden"
            />
            <UserMenu />
          </div>
        </div>
        <div
          className={cn(
            'transition-all duration-500 ease-in-out lg:hidden overflow-hidden',
            { 'max-h-0': !isOpen, 'max-h-screen mt-4': isOpen },
          )}
        >
          {isOpen && (
            <nav
              className="flex flex-col gap-2 bg-accent text-accent-foreground p-2 border-b border-primary"
              onClick={() => setIsOpen(false)}
            >
              <ul>
                <li className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <Link href={'/'}>Accueil</Link>
                </li>
                <li className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />{' '}
                  <Link href={'/projects'}>Projets</Link>
                </li>
                <li className="flex items-center gap-2">
                  <User className="w-4 h-4" /> Profile
                </li>
                <li className="flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Settings
                </li>
                <li className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> log out
                </li>
              </ul>
            </nav>
          )}

          {!user && <UserAuth />}
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;
