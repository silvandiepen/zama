import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/Card';
import { useBemm } from '@/utils/bemm';
import './docs.scss';
import { NavMenu } from '@/components/NavMenu/NavMenu';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { useTranslation } from 'react-i18next';
import { Markdown } from '@/components/Markdown/Markdown';

interface SectionItem { id: string }

/**
 * Documentation page component that renders markdown documentation with navigation.
 * Loads markdown files dynamically based on language preference and provides
 * a sidebar navigation for easy section access.
 * @returns {JSX.Element} The rendered documentation page.
 */
export const Docs: React.FC = () => {
  const bemm = useBemm('docs');
  const { t, i18n } = useTranslation();
  const [activeSection, setActiveSection] = useState('overview');

  // Load markdown files (root and per-locale) as raw strings via Vite
  // Supports: ./docs/<id>.md and ./docs/<lang>/<id>.md
  /**
   * Loads markdown files dynamically using Vite's import.meta.glob feature.
   * Supports both root-level and localized markdown files with fallback logic.
   * @returns {Map<string, string>} Map of section IDs to markdown content
   */
  const mdFiles = useMemo(() => {
    const root = import.meta.glob('./docs/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
    const localized = import.meta.glob('./docs/*/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
    const map = new Map<string, string>();
    Object.entries(root).forEach(([path, content]) => {
      const match = path.match(/\.\/docs\/(.+)\.md$/);
      if (match) map.set(match[1], content);
    });
    Object.entries(localized).forEach(([path, content]) => {
      const match = path.match(/\.\/docs\/([^/]+)\/(.+)\.md$/);
      if (match) map.set(`${match[1]}/${match[2]}`, content);
    });
    return map;
  }, []);

  const sections: SectionItem[] = [
    { id: 'quickstart' },
    { id: 'overview' },
    { id: 'architecture' },
    { id: 'styling' },
    { id: 'components' },
    { id: 'state-management' },
    { id: 'data-services' },
    { id: 'development-tools' },
    { id: 'best-practices' },
    { id: 'future-improvements' },
  ];

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (sections.find(section => section.id === hash)) {
      setActiveSection(hash);
    }
  }, []);

  /**
   * Handles section navigation by updating the active section and URL hash.
   * @param {string} sectionId - ID of the section to navigate to
   * @returns {void}
   */
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    window.history.pushState(null, '', `#${sectionId}`);
  };

  const lang = (i18n.language || 'en').split('-')[0];
  /**
   * Resolves markdown content for a given section with language fallback.
   * @param {string} sectionId - ID of the section to resolve markdown for
   * @returns {string | undefined} Markdown content or undefined if not found
   */
  const resolveMd = (sectionId: string) => mdFiles.get(`${lang}/${sectionId}`) || mdFiles.get(sectionId);

  return (
    <div className={bemm()}>
      <PageHeader title={t('docsPage.title')} description={t('docsPage.subtitle')} image="/documentation.png" />

      <div className={bemm('layout')}>
        <aside className={bemm('sidebar')}>
          <NavMenu
            items={sections.map(s => ({ id: s.id, label: t(`docs.nav.${s.id}`) }))}
            activeId={activeSection}
            orientation="vertical"
            ariaLabel={t('docs.nav.aria')}
            onSelect={(id) => handleSectionClick(id)}
          />
        </aside>

        <main className={bemm('main')}>
          <div className={bemm('content')}>
            {resolveMd(activeSection)
              ? <Markdown source={resolveMd(activeSection)!} className={bemm('md')} />
              : <Card><p>{t('docs.missing')}</p></Card>}
          </div>
        </main>
      </div>
    </div>
  );
}
