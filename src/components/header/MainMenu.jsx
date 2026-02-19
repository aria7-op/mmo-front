import React, { memo, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getMenuConfig } from '../../config/menu.config';
import { useFocusAreas } from '../../hooks/useFocusAreas';
import { formatMultilingualContent } from '../../utils/apiUtils';
import SlugGenerator from '../common/SlugGenerator';
import { useTranslation } from 'react-i18next';

const MenuItem = memo(({ item, isRTL }) => {
  return (
    <li>
      <Link to={item.to}>{item.label}</Link>
      {item.submenu && (
        <ul>
          {item.submenu.map((subItem, index) => (
            <li key={index}>
              <Link to={subItem.to}>{subItem.label}</Link>
              {subItem.desc && <span className="menu-desc">{subItem.desc}</span>}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
});

MenuItem.displayName = 'MenuItem';

const MainMenu = memo(() => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const { focusAreas } = useFocusAreas();
    const lang = i18n.language;
    
    const menu = useMemo(() => getMenuConfig(t), [t]);
    
    // Build dynamic Focus Areas submenu - show all Focus Areas
    const focusAreaLinks = useMemo(() => {
        const visibleAreas = (focusAreas || []);
        return visibleAreas.map((fa) => {
            const name = formatMultilingualContent(fa?.name, lang) || 'Focus Area';
            const slug = (fa?.slug && fa.slug.trim()) || SlugGenerator({ text: fa?.name?.en || name });
            const visibleInMenu = typeof fa?.visibleInMenu === 'boolean' ? fa.visibleInMenu : undefined;
            return { name, slug, visibleInMenu };
        });
    }, [focusAreas, lang]);

    // Show every focus area in the dropdown (ignore visibility flags)
    const visibleLinks = focusAreaLinks;

    // Sort: Priority first, then alphabetical by name
    const priorityOrder = useMemo(() => ['education','wash','nutrition','livelihood','gbv-protection','food-security','agriculture'], []);
    const priorityMap = useMemo(() => 
        priorityOrder.reduce((acc, slug, idx) => { acc[slug] = idx; return acc; }, {}), 
        [priorityOrder]
    );

    const sortedVisibleLinks = useMemo(() => {
        return [...visibleLinks].sort((a, b) => {
            const ap = priorityMap[a.slug] ?? 999;
            const bp = priorityMap[b.slug] ?? 999;
            if (ap !== bp) return ap - bp;
            // Fallback alphabetical by name
            return a.name.localeCompare(b.name);
        });
    }, [visibleLinks, priorityMap]);

    const menuItems = useMemo(() => [
        {
            to: '/about',
            label: t('navigation.about'),
            submenu: [
                { to: '/about', label: t('navigation.submenu.aboutMMO'), desc: t('navigation.about') },
                { to: '/about/our-story', label: t('navigation.submenu.ourStory'), desc: t('navigation.submenu.ourStory') },
                { to: '/about/mission-vision', label: t('navigation.submenu.missionVision'), desc: t('navigation.submenu.missionVision') },
                { to: '/about/goals-objectives', label: t('navigation.submenu.goalsObjectives'), desc: t('navigation.submenu.goalsObjectives') },
                { to: '/about/departments', label: t('navigation.submenu.departments'), desc: t('navigation.submenu.departments') },
                { to: '/about/organization-profile', label: t('navigation.submenu.organizationProfile'), desc: t('navigation.submenu.organizationProfile') },
                { to: '/about/strategic-units', label: t('navigation.submenu.strategicUnits'), desc: t('navigation.submenu.strategicUnits') },
                { to: '/about/board-directors', label: t('navigation.submenu.boardDirectors'), desc: t('navigation.submenu.boardDirectors') },
                { to: '/about/organizational-structure', label: t('navigation.submenu.organizationalStructure'), desc: t('navigation.submenu.organizationalStructure') },
                { to: '/about/strategic-partnerships', label: t('navigation.submenu.strategicPartnerships'), desc: t('navigation.submenu.strategicPartnerships') },
                { to: '/about/coverage-area', label: t('navigation.submenu.coverageArea'), desc: t('navigation.submenu.coverageArea') }
            ]
        },
        {
            to: '/what-we-do',
            label: t('navigation.whatWeDo'),
            submenu: [
                ...sortedVisibleLinks.map(({ name, slug }) => ({
                    to: `/what-we-do/focus-areas/${slug}`,
                    label: name,
                    desc: t('navigation.focusAreas')
                })),
                { to: '/what-we-do/geographic-coverage', label: t('navigation.submenu.geographicCoverage'), desc: t('navigation.submenu.geographicCoverage') }
            ]
        },
        {
            to: '/programs',
            label: t('navigation.programs'),
            submenu: [
                { to: '/programs/sitc', label: t('navigation.submenu.sitc'), desc: t('navigation.submenu.sitc') },
                { to: '/programs/taaban', label: t('navigation.submenu.taaban'), desc: t('navigation.submenu.taaban') },
                { to: '/programs/stay-in-afghanistan', label: t('navigation.submenu.stayInAfghanistan'), desc: t('navigation.submenu.stayInAfghanistan') },
                { to: '/programs/emergency-response', label: t('navigation.submenu.emergencyResponse'), desc: t('navigation.submenu.emergencyResponse') }
            ]
        },
        {
            to: '/resources',
            label: t('navigation.resources'),
            submenu: [
                { to: '/resources/news-events', label: t('navigation.submenu.newsEvents'), desc: t('navigation.submenu.newsEvents') },
                { to: '/resources/reports', label: t('navigation.submenu.reportsPublications'), desc: t('navigation.submenu.reportsPublications') },
                { to: '/resources/policies', label: t('navigation.submenu.policies'), desc: t('navigation.submenu.policies') },
                { to: '/resources/rfq', label: t('navigation.submenu.rfq'), desc: t('navigation.submenu.rfq') },
                { to: '/resources/jobs', label: t('navigation.submenu.jobs'), desc: t('navigation.submenu.jobs') },
                { to: '/gallery-full', label: t('navigation.submenu.gallery'), desc: t('navigation.submenu.gallery') },
                { to: '/resources/annual-reports', label: t('navigation.submenu.annualReports'), desc: t('navigation.submenu.annualReports') },
                { to: '/resources/success-stories', label: t('navigation.submenu.successStories'), desc: t('navigation.submenu.successStories') },
                { to: '/resources/certificates', label: t('navigation.submenu.certificates'), desc: t('navigation.submenu.certificates') },
                { to: '/resources/case-studies', label: t('navigation.submenu.caseStudies'), desc: t('navigation.submenu.caseStudies') },
                { to: '/volunteer', label: t('navigation.submenu.volunteerSection'), desc: t('navigation.submenu.volunteerSection') }
            ]
        },
        {
            to: '/complaints-feedback',
            label: t('navigation.additionalSections'),
            submenu: [
                { to: '/complaints-feedback', label: t('navigation.submenu.complaintsFeedback'), desc: t('navigation.submenu.complaintsFeedback') },
                { to: '/ethics-compliance', label: t('navigation.submenu.ethicsCompliance'), desc: t('navigation.submenu.ethicsCompliance') },
                { to: '/terms-of-use', label: t('navigation.submenu.termsOfUse'), desc: t('navigation.submenu.termsOfUse') },
                { to: '/privacy-policy', label: t('navigation.submenu.privacyPolicy'), desc: t('navigation.submenu.privacyPolicy') },
                { to: '/cookies-settings', label: t('navigation.submenu.cookiesSettings'), desc: t('navigation.submenu.cookiesSettings') }
            ]
        },
        { to: '/contact', label: t('navigation.contact') }
    ], [t, sortedVisibleLinks]);
    
    return (
        <nav id="main-menu" className={`main-menu ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <ul>
                {menuItems.map((item, index) => (
                    <MenuItem key={item.to || index} item={item} isRTL={isRTL} />
                ))}
            </ul>
        </nav>
    );
});

MainMenu.displayName = 'MainMenu';

export default MainMenu;
