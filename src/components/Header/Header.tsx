import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/store/theme";
import { useLocale } from "@/store/locale";
import { Button } from "@/components/Button";
import { Colors, Size } from "@/types";
import { useBemm } from "@/utils/bemm";
import "./header.scss";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { UserMenu } from "@/components/UserMenu/UserMenu";
import { Icons } from "open-icon";
import { NavMenu } from "@/components/NavMenu/NavMenu";
import { useFeatureFlags } from "@/store/featureFlags";
import { Tooltip } from "@/components/Tooltip/Tooltip";
import { MobileMenu } from "@/components/Header/MobileMenu";

type Props = {
  onOpenSettings: () => void;
};

/**
 * Application header component with navigation, theme toggle, language switcher,
 * and user menu. Handles scroll behavior to hide/show on scroll and supports
 * mobile responsive design.
 * @param {Props} props - Component props
 * @param {() => void} props.onOpenSettings - Function to open settings modal
 * @returns {JSX.Element} The rendered header component.
 */
export const Header: React.FC<Props> = ({ onOpenSettings }) => {
  const { t } = useTranslation();
  const { theme, toggleTheme, setTheme } = useTheme();
  const { lang, setLang } = useLocale();
  const { flags } = useFeatureFlags();
  const bemm = useBemm("header");
  const [openLang, setOpenLang] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastY = useRef<number>(typeof window !== 'undefined' ? window.scrollY : 0);
  const ticking = useRef(false);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!langRef.current) return;
      if (!langRef.current.contains(e.target as Node)) setOpenLang(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Enforce default theme when color mode switcher is disabled
  useEffect(() => {
    if (!flags.enableColorModeSwitch) {
      const desired = flags.defaultTheme || 'light';
      if (theme !== desired) setTheme(desired);
    }
  }, [flags.enableColorModeSwitch, flags.defaultTheme]);

  useEffect(() => {
    const threshold = 4; // avoid jitter on tiny scrolls
    const onScroll = () => {
      const current = window.scrollY;
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const delta = current - lastY.current;
          const goingDown = delta > 0;
          const isAtTop = current <= 0;
          setAtTop(isAtTop);
          if (isAtTop) {
            setHidden(false);
          } else if (Math.abs(delta) > threshold) {
            setHidden(goingDown);
          }
          lastY.current = current;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // user menu open/close is handled inside UserMenu component

  const langs: Array<{ value: string; label: string }> = [
    { value: "en", label: t("lang.english") },
    { value: "nl", label: t("lang.dutch") },
    { value: "fr", label: t("lang.french") },
  ];
  const location = useLocation();
  const navItems = [
    { id: "/dashboard", label: t('nav.dashboard'), to: "/dashboard" },
    { id: "/docs", label: t('nav.docs'), to: "/docs" },
    { id: "/about", label: t('nav.about'), to: "/about" }
  ];

  // nav highlight handled by NavMenu via CSS anchors

  return (
    <header className={bemm("", { hidden: hidden && !atTop })}>
      <div className={bemm("container")}>
        <NavMenu
          items={navItems}
          activeId={location.pathname}
          orientation="horizontal"
          ariaLabel="Primary"
        />
        <h1 className={bemm("title")}>{t("app.title")}</h1>
        <div className={bemm("actions")}>
          <Button className={bemm('hamburger')} size={Size.SMALL} iconOnly icon={'menu'} onClick={() => setMobileOpen(true)} />
          {/* Theme toggle button - controlled by feature flags */}
          {flags.enableColorModeSwitch && flags.enableDarkMode && flags.enableLightMode && (
            <>
              {flags.enableTooltips ? (
                <Tooltip content={'Toggle theme'} position="bottom">
                  <Button
                    size={Size.SMALL}
                    onClick={toggleTheme}
                    iconOnly={true}
                    variant={'outline'}
                    color={theme == 'dark' ? Colors.BLUE : Colors.BABY_BLUE}
                    icon={theme == 'dark' ? Icons.SUN : Icons.MOON01}
                  />
                </Tooltip>
              ) : (
                <Button
                  size={Size.SMALL}
                  onClick={toggleTheme}
                  iconOnly={true}
                  color={theme == 'dark' ? Colors.BLUE : Colors.BABY_BLUE}
                  icon={theme == 'dark' ? Icons.SUN : Icons.MOON01}
                />
              )}
            </>
          )}

          {/* Language switcher - controlled by feature flags */}
          {flags.enableLanguageSwitcher && (
            <div className={bemm("lang")} ref={langRef}>
              {flags.enableTooltips ? (
                <Tooltip content={'Change language'} position="bottom">
                  <Button
                    size={Size.SMALL}
                    variant={'outline'}
                    onClick={() => setOpenLang((v) => !v)}
                  >
                    {lang.toUpperCase()}
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  size={Size.SMALL}
                  onClick={() => setOpenLang((v) => !v)}
                >
                  {lang.toUpperCase()}
                </Button>
              )}
            {openLang && (
              <div className={bemm("lang-menu")} role="menu">
                {langs.map((l) => (
                  <button
                    key={l.value}
                    className={bemm("lang-item", { active: lang === l.value })}
                    onClick={() => {
                      setLang(l.value);
                      setOpenLang(false);
                    }}
                    role="menuitemradio"
                    aria-checked={lang === l.value}
                  >
                    <span className={bemm("lang-text")}>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
            </div>
          )}

          {user && flags.enableUserMenu && <UserMenu onOpenSettings={onOpenSettings} />}
        </div>
      </div>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} items={navItems} />
    </header>
  );
};
