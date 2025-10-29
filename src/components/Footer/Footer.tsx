import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBemm } from '@/utils/bemm';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon/Icon';
import { NavMenu, type NavItem } from '@/components/NavMenu/NavMenu';
import { Colors, Size } from '@/types';
import './footer.scss';
import { Icons } from 'open-icon';

export const Footer: React.FC = () => {
  const bemm = useBemm('footer');
  const location = useLocation();
  const currentYear = new Date().getFullYear();
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Show/hide back to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Define NavMenu items for internal navigation
  const productNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', to: '/dashboard' },
    { id: 'keys', label: 'API Keys', to: '/keys' },
    { id: 'usage', label: 'Usage', to: '/usage' },
    { id: 'docs', label: 'Documentation', to: '/docs' },
    { id: 'about', label: 'About Console', to: '/about' },
  ];


  // Get the current active ID based on location
  const getActiveId = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'dashboard';
    if (path.startsWith('/keys')) return 'keys';
    if (path.startsWith('/usage')) return 'usage';
    if (path.startsWith('/docs')) return 'docs';
    if (path.startsWith('/about')) return 'about';
    return '';
  };

  const activeId = getActiveId();

  // Define NavMenu items for external links
  const companyNavItems: NavItem[] = [
    { id: 'about-zama', label: 'About Zama' },
    { id: 'blog', label: 'Blog' },
    { id: 'careers', label: 'Careers' },
  ];

  const resourcesNavItems: NavItem[] = [
    { id: 'tfhe-protocol', label: 'TFHE Protocol' },
    { id: 'concise-ml', label: 'Concise ML' },
    { id: 'github', label: 'GitHub' },
    { id: 'community', label: 'Community' },
  ];

  // External link mappings
  const externalLinks = {
    'about-zama': 'https://zama.ai',
    'blog': 'https://zama.ai/blog',
    'careers': 'https://zama.ai/careers',
    'tfhe-protocol': 'https://docs.zama.ai/protocol',
    'concise-ml': 'https://docs.zama.ai/concise',
    'github': 'https://github.com/zama-ai',
    'community': 'https://community.zama.ai',
  };

  // Handle NavMenu selection for external links
  const handleNavSelect = (id: string) => {
    const url = externalLinks[id as keyof typeof externalLinks];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const socialLinks = [
    { href: 'https://twitter.com/zama_fhe', label: 'Twitter/X', icon: 'social-x' },
    { href: 'https://github.com/zama-ai', label: 'GitHub', icon: 'social-github' },
    { href: 'https://discord.gg/7qFyGWRq2M', label: 'Discord', icon: 'social-discord' },
    { href: 'https://www.linkedin.com/company/zama-ai', label: 'LinkedIn', icon: 'social-linkedin' },
  ];

  
  return (
    <footer className={bemm()}>
      <div className={bemm('content')}>
        <div className={bemm('main')}>
          <div className={bemm('brand')}>
            <div className={bemm('logo')}>
              <Icon className={bemm('logo-icon')} name={Icons.SHIELD2_LINE} size="medium" />
              <div>
                <h3 className={bemm('logo-title')}>Zama Console</h3>
                <p className={bemm('logo-tagline')}>
                  Secure AI with Fully Homomorphic Encryption
                </p>
              </div>
            </div>
            <p className={bemm('description')}>
              Build privacy-preserving applications with Zama's TFHE technology.
              Our console provides tools for managing encrypted API keys and monitoring usage.
            </p>
            <div className={bemm('social')}>
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  size={Size.SMALL}
                  variant="ghost"
                  iconOnly
                  icon={social.icon}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={bemm('social-button')}
                  aria-label={social.label}
                />
              ))}
            </div>
          </div>

          <nav className={bemm('sections')}>
            <div className={bemm('section')}>
              <h4 className={bemm('section-title')}>Product</h4>
              <NavMenu
                items={productNavItems}
                activeId={activeId}
                orientation="vertical"
                className={bemm('navmenu')}
                ariaLabel="Product navigation"
              />
            </div>

            <div className={bemm('section')}>
              <h4 className={bemm('section-title')}>Company</h4>
              <NavMenu
                items={companyNavItems}
                activeId=""
                orientation="vertical"
                className={bemm('navmenu')}
                ariaLabel="Company navigation"
                onSelect={handleNavSelect}
              />
            </div>

            <div className={bemm('section')}>
              <h4 className={bemm('section-title')}>Resources</h4>
              <NavMenu
                items={resourcesNavItems}
                activeId=""
                orientation="vertical"
                className={bemm('navmenu')}
                ariaLabel="Resources navigation"
                onSelect={handleNavSelect}
              />
            </div>
          </nav>
        </div>

        <div className={bemm('bottom')}>
          <div className={bemm('legal')}>
            <p className={bemm('copyright')}>
              © {currentYear} Zama. All rights reserved.
            </p>
            <div className={bemm('legal-links')}>
              <a href="https://zama.ai/privacy" className={bemm('legal-link')} target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
              <a href="https://zama.ai/terms" className={bemm('legal-link')} target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>
              <Link to="/settings" className={bemm('legal-link')}>
                Cookie Settings
              </Link>
            </div>
          </div>

          <div className={bemm('badge')}>
            <Icon name="shield-check" size="small" />
            <span>Powered by TFHE</span>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <Button
          className={bemm('back-to-top')}
          size={Size.SMALL}
          color={Colors.PRIMARY}
          iconOnly
          icon="arrow-up"
          onClick={scrollToTop}
          aria-label="Back to top"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 1000,
          }}
        />
      )}
    </footer>
  );
};
