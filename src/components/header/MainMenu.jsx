import React from 'react';
import { Link } from 'react-router-dom';
import { getMenuConfig } from '../../config/menu.config';
import { useFocusAreas } from '../../hooks/useFocusAreas';
import { formatMultilingualContent } from '../../utils/apiUtils';
import SlugGenerator from '../common/SlugGenerator';
import { useTranslation } from 'react-i18next';

const MainMenu = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const { focusAreas } = useFocusAreas();
    const lang = i18n.language;
    
    const menu = getMenuConfig(t);
    
    // Build dynamic Focus Areas submenu - show all Focus Areas
    const visibleAreas = (focusAreas || []);
    
    const focusAreaLinks = visibleAreas.map((fa) => {
        const name = formatMultilingualContent(fa?.name, lang) || 'Focus Area';
        const slug = (fa?.slug && fa.slug.trim()) || SlugGenerator({ text: fa?.name?.en || name });
        const visibleInMenu = typeof fa?.visibleInMenu === 'boolean' ? fa.visibleInMenu : undefined;
        return { name, slug, visibleInMenu };
    });

    // Show every focus area in the dropdown (ignore visibility flags)
    const visibleLinks = focusAreaLinks;

    // Sort: Priority first, then alphabetical by name
    const priorityOrder = ['education','wash','nutrition','livelihood','gbv-protection','food-security','agriculture'];
    const priorityMap = priorityOrder.reduce((acc, slug, idx) => { acc[slug] = idx; return acc; }, {});

    const sortedVisibleLinks = [...visibleLinks].sort((a, b) => {
        const ap = priorityMap[a.slug] ?? 999;
        const bp = priorityMap[b.slug] ?? 999;
        if (ap !== bp) return ap - bp;
        // Fallback alphabetical by name
        return a.name.localeCompare(b.name);
    });
    
    return (
        <>
            <nav id="main-menu" className={`main-menu ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <ul>
                    {/* B. About Section - MAIN MENU with Dropdown */}
                    <li>
                        <Link to="/about">{t('navigation.about')}</Link>
                        <ul>
                            <li><Link to="/about">{t('navigation.submenu.aboutMMO')}</Link><span className="menu-desc">{t('navigation.about')}</span></li>
                            <li><Link to="/about/our-story">{t('navigation.submenu.ourStory')}</Link><span className="menu-desc">{t('navigation.submenu.ourStory')}</span></li>
                            <li><Link to="/about/mission-vision">{t('navigation.submenu.missionVision')}</Link><span className="menu-desc">{t('navigation.submenu.missionVision')}</span></li>
                            <li><Link to="/about/goals-objectives">{t('navigation.submenu.goalsObjectives')}</Link><span className="menu-desc">{t('navigation.submenu.goalsObjectives')}</span></li>
                            <li><Link to="/about/departments">{t('navigation.submenu.departments')}</Link><span className="menu-desc">{t('navigation.submenu.departments')}</span></li>
                            <li><Link to="/about/organization-profile">{t('navigation.submenu.organizationProfile')}</Link><span className="menu-desc">{t('navigation.submenu.organizationProfile')}</span></li>
                            <li><Link to="/about/strategic-units">{t('navigation.submenu.strategicUnits')}</Link><span className="menu-desc">{t('navigation.submenu.strategicUnits')}</span></li>
                            <li><Link to="/about/board-directors">{t('navigation.submenu.boardDirectors')}</Link><span className="menu-desc">{t('navigation.submenu.boardDirectors')}</span></li>
                            <li><Link to="/about/executive-team">{t('navigation.submenu.executiveTeam')}</Link><span className="menu-desc">{t('navigation.submenu.executiveTeam')}</span></li>
                            <li><Link to="/about/organizational-structure">{t('navigation.submenu.organizationalStructure')}</Link><span className="menu-desc">{t('navigation.submenu.organizationalStructure')}</span></li>
                            <li><Link to="/about/strategic-partnerships">{t('navigation.submenu.strategicPartnerships')}</Link><span className="menu-desc">{t('navigation.submenu.strategicPartnerships')}</span></li>
                            <li><Link to="/about/coverage-area">{t('navigation.submenu.coverageArea')}</Link><span className="menu-desc">{t('navigation.submenu.coverageArea')}</span></li>
                        </ul>
                    </li>
                    
                    {/* C. What We Do - MAIN MENU with Dropdown */}
                    <li>
                        <Link to="/what-we-do">{t('navigation.whatWeDo')}</Link>
                        <ul>
                            {/* Individual Focus Areas */}
                            {sortedVisibleLinks && sortedVisibleLinks.length > 0 && sortedVisibleLinks.map(({ name, slug }) => (
                                <li key={slug}><Link to={`/what-we-do/focus-areas/${slug}`}>{name}</Link><span className="menu-desc">{t('navigation.focusAreas')}</span></li>
                            ))}
                            {/* Keep Geographic Coverage */}
                            <li><Link to="/what-we-do/geographic-coverage">{t('navigation.submenu.geographicCoverage')}</Link><span className="menu-desc">{t('navigation.submenu.geographicCoverage')}</span></li>
                        </ul>
                    </li>
                    
                    {/* D. Programs - MAIN MENU with Dropdown */}
                    <li>
                        <Link to="/programs">{t('navigation.programs')}</Link>
                        <ul>
                            <li><Link to="/programs/sitc">{t('navigation.submenu.sitc')}</Link><span className="menu-desc">{t('navigation.submenu.sitc')}</span></li>
                            <li><Link to="/programs/taaban">{t('navigation.submenu.taaban')}</Link><span className="menu-desc">{t('navigation.submenu.taaban')}</span></li>
                            <li><Link to="/programs/stay-in-afghanistan">{t('navigation.submenu.stayInAfghanistan')}</Link><span className="menu-desc">{t('navigation.submenu.stayInAfghanistan')}</span></li>
                            <li><Link to="/programs/emergency-response">{t('navigation.submenu.emergencyResponse')}</Link><span className="menu-desc">{t('navigation.submenu.emergencyResponse')}</span></li>
                        </ul>
                    </li>
                    
                    {/* E. Resources - MAIN MENU with Dropdown */}
                    <li>
                        <Link to="/resources">{t('navigation.resources')}</Link>
                        <ul>
                            <li><Link to="/resources/news-events">{t('navigation.submenu.newsEvents')}</Link><span className="menu-desc">{t('navigation.submenu.newsEvents')}</span></li>
                            <li><Link to="/resources/reports">{t('navigation.submenu.reportsPublications')}</Link><span className="menu-desc">{t('navigation.submenu.reportsPublications')}</span></li>
                            <li><Link to="/resources/policies">{t('navigation.submenu.policies')}</Link><span className="menu-desc">{t('navigation.submenu.policies')}</span></li>
                            <li><Link to="/resources/rfq-rfp">{t('navigation.submenu.rfq')}</Link><span className="menu-desc">{t('navigation.submenu.rfq')}</span></li>
                            <li><Link to="/resources/jobs">{t('navigation.submenu.jobs')}</Link><span className="menu-desc">{t('navigation.submenu.jobs')}</span></li>
                            <li><Link to="/gallery-full">{t('navigation.submenu.gallery')}</Link><span className="menu-desc">{t('navigation.submenu.gallery')}</span></li>
                            <li><Link to="/resources/annual-reports">{t('navigation.submenu.annualReports')}</Link><span className="menu-desc">{t('navigation.submenu.annualReports')}</span></li>
                            <li><Link to="/resources/success-stories">{t('navigation.submenu.successStories')}</Link><span className="menu-desc">{t('navigation.submenu.successStories')}</span></li>
                            <li><Link to="/resources/certificates">{t('navigation.submenu.certificates')}</Link><span className="menu-desc">{t('navigation.submenu.certificates')}</span></li>
                            <li><Link to="/resources/case-studies">{t('navigation.submenu.caseStudies')}</Link><span className="menu-desc">{t('navigation.submenu.caseStudies')}</span></li>
                            <li><Link to="/volunteer">{t('navigation.submenu.volunteerSection')}</Link><span className="menu-desc">{t('navigation.submenu.volunteerSection')}</span></li>
                        </ul>
                    </li>
                    
                    {/* F. Additional Required Sections - MAIN MENU with Dropdown */}
                    <li>
                        <Link to="/complaints-feedback">{t('navigation.additionalSections')}</Link>
                        <ul>
                            <li><Link to="/complaints-feedback">{t('navigation.submenu.complaintsFeedback')}</Link><span className="menu-desc">{t('navigation.submenu.complaintsFeedback')}</span></li>
                            <li><Link to="/ethics-compliance">{t('navigation.submenu.ethicsCompliance')}</Link><span className="menu-desc">{t('navigation.submenu.ethicsCompliance')}</span></li>
                            <li><Link to="/terms-of-use">{t('navigation.submenu.termsOfUse')}</Link><span className="menu-desc">{t('navigation.submenu.termsOfUse')}</span></li>
                            <li><Link to="/privacy-policy">{t('navigation.submenu.privacyPolicy')}</Link><span className="menu-desc">{t('navigation.submenu.privacyPolicy')}</span></li>
                            <li><Link to="/cookies-settings">{t('navigation.submenu.cookiesSettings')}</Link><span className="menu-desc">{t('navigation.submenu.cookiesSettings')}</span></li>
                        </ul>
                    </li>
                    
                    {/* Contact */}
                    
                    <li><Link to="/contact">{t('navigation.contact')}</Link></li>
                </ul>
            </nav>
        </>
    );
};

export default MainMenu;
