/**
 * Sidebar Tutorial Component
 * Shows small tip windows next to each menu item in the sidebar
 */

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './SidebarTutorial.css';

const SidebarTutorial = ({ isOpen, onClose, onComplete }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [tipPosition, setTipPosition] = useState({ top: 0, left: 0 });
  const menuRefs = useRef({});

  // Menu items from AdminSidebar
  const menuItems = [
    {
      id: 'dashboard',
      titleKey: 'admin.dashboard',
      path: '/admin',
      tip: t('tutorial.sidebar.dashboard', 'View your main dashboard with statistics and overview'),
    },
    {
      id: 'news',
      titleKey: 'admin.news',
      path: '/admin/news',
      tip: t('tutorial.sidebar.news', 'Manage news articles and announcements'),
    },
    {
      id: 'events',
      titleKey: 'admin.events',
      path: '/admin/events',
      tip: t('tutorial.sidebar.events', 'Create and manage events and registrations'),
    },
    {
      id: 'programs',
      titleKey: 'admin.programs',
      path: '/admin/programs',
      tip: t('tutorial.sidebar.programs', 'Manage programs and activities'),
    },
    {
      id: 'focus-areas',
      titleKey: 'admin.focusAreas',
      path: '/admin/focus-areas',
      tip: t('tutorial.sidebar.focusAreas', 'Define organizational focus areas'),
    },
    {
      id: 'resources',
      titleKey: 'admin.resources',
      path: '/admin/resources',
      tip: t('tutorial.sidebar.resources', 'Manage resources and documents'),
    },
    {
      id: 'certificates',
      titleKey: 'admin.certificates',
      path: '/admin/certificates',
      tip: t('tutorial.sidebar.certificates', 'Issue and manage certificates'),
    },
    {
      id: 'team',
      titleKey: 'admin.team',
      path: '/admin/team',
      tip: t('tutorial.sidebar.team', 'Manage team members and roles'),
    },
    {
      id: 'success-stories',
      titleKey: 'admin.successStories',
      path: '/admin/success-stories',
      tip: t('tutorial.sidebar.successStories', 'Share success stories and testimonials'),
    },
    {
      id: 'case-studies',
      titleKey: 'admin.caseStudies',
      path: '/admin/case-studies',
      tip: t('tutorial.sidebar.caseStudies', 'Document case studies and research'),
    },
    {
      id: 'annual-reports',
      titleKey: 'admin.annualReports',
      path: '/admin/annual-reports',
      tip: t('tutorial.sidebar.annualReports', 'Generate and view annual reports'),
    },
    {
      id: 'policies',
      titleKey: 'admin.policies',
      path: '/admin/policies',
      tip: t('tutorial.sidebar.policies', 'Manage organizational policies'),
    },
    {
      id: 'rfqs',
      titleKey: 'admin.rfqs',
      path: '/admin/rfqs',
      tip: t('tutorial.sidebar.rfqs', 'Handle RFQs and procurement'),
    },
    {
      id: 'gallery',
      titleKey: 'admin.gallery',
      path: '/admin/gallery',
      tip: t('tutorial.sidebar.gallery', 'Manage photo gallery and media'),
    },
    {
      id: 'partners',
      titleKey: 'admin.partners',
      path: '/admin/partners',
      tip: t('tutorial.sidebar.partners', 'Manage partnerships and collaborations'),
    },
    {
      id: 'projects',
      titleKey: 'admin.projects',
      path: '/admin/projects',
      tip: t('tutorial.sidebar.projects', 'Track and manage projects'),
    },
    {
      id: 'strategic-partnerships',
      titleKey: 'admin.strategicPartnerships',
      path: '/admin/strategic-partnerships',
      tip: t('tutorial.sidebar.strategicPartnerships', 'Manage strategic partnerships'),
    },
    {
      id: 'faqs',
      titleKey: 'admin.faqs',
      path: '/admin/faqs',
      tip: t('tutorial.sidebar.faqs', 'Manage frequently asked questions'),
    },
    {
      id: 'contacts',
      titleKey: 'admin.contacts',
      path: '/admin/contacts',
      tip: t('tutorial.sidebar.contacts', 'Manage contact submissions'),
    },
    {
      id: 'donations',
      titleKey: 'admin.donations',
      path: '/admin/donations',
      tip: t('tutorial.sidebar.donations', 'Manage donations and campaigns'),
    },
    {
      id: 'volunteers',
      titleKey: 'admin.volunteers',
      path: '/admin/volunteers',
      tip: t('tutorial.sidebar.volunteers', 'Manage volunteer applications'),
    },
    {
      id: 'jobs',
      titleKey: 'admin.jobs',
      path: '/admin/jobs',
      tip: t('tutorial.sidebar.jobs', 'Post job openings and applications'),
    },
    {
      id: 'complaints',
      titleKey: 'admin.complaints',
      path: '/admin/complaints',
      tip: t('tutorial.sidebar.complaints', 'Handle complaints and feedback'),
    },
    {
      id: 'newsletter',
      titleKey: 'admin.newsletter',
      path: '/admin/newsletter',
      tip: t('tutorial.sidebar.newsletter', 'Manage newsletter subscribers'),
    },
    {
      id: 'organization',
      titleKey: 'admin.organization',
      path: '/admin/organization',
      tip: t('tutorial.sidebar.organization', 'Manage organization profile and settings'),
    },
    {
      id: 'about-content',
      titleKey: 'admin.aboutContent',
      path: '/admin/about-content',
      tip: t('tutorial.sidebar.aboutContent', 'Manage about us content'),
    },
    {
      id: 'mission-vision',
      titleKey: 'admin.missionVision',
      path: '/admin/mission-vision',
      tip: t('tutorial.sidebar.missionVision', 'Set mission and vision statements'),
    },
    {
      id: 'our-story',
      titleKey: 'admin.ourStory',
      path: '/admin/our-story',
      tip: t('tutorial.sidebar.ourStory', 'Tell your organization story'),
    },
    {
      id: 'goals-objectives',
      titleKey: 'admin.goalsObjectives',
      path: '/admin/goals-objectives',
      tip: t('tutorial.sidebar.goalsObjectives', 'Define goals and objectives'),
    },
    {
      id: 'departments',
      titleKey: 'admin.departments',
      path: '/admin/departments',
      tip: t('tutorial.sidebar.departments', 'Manage departments and structure'),
    },
    {
      id: 'stakeholders',
      titleKey: 'admin.stakeholders',
      path: '/admin/stakeholders',
      tip: t('tutorial.sidebar.stakeholders', 'Manage stakeholder relationships'),
    },
    {
      id: 'competencies',
      titleKey: 'admin.competencies',
      path: '/admin/competencies',
      tip: t('tutorial.sidebar.competencies', 'Define organizational competencies'),
    },
    {
      id: 'registrations',
      titleKey: 'admin.registrations',
      path: '/admin/registrations',
      tip: t('tutorial.sidebar.registrations', 'Handle registrations and applications'),
    },
  ];

  useEffect(() => {
    if (isOpen && currentStep < menuItems.length) {
      const menuItem = menuItems[currentStep];
      const element = document.querySelector(`[data-menu-id="${menuItem.id}"]`);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        const sidebarElement = document.querySelector('.admin-sidebar');
        const sidebarRect = sidebarElement ? sidebarElement.getBoundingClientRect() : { left: 0 };
        
        // Position tip to the right of the menu item
        setTipPosition({
          top: rect.top + window.scrollY,
          left: rect.right + sidebarRect.left + 10
        });

        // Scroll menu item into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Highlight the menu item
        element.style.transition = 'all 0.3s ease';
        element.style.backgroundColor = '#007bff';
        element.style.color = 'white';
        element.style.borderRadius = '4px';
        
        setTimeout(() => {
          element.style.backgroundColor = '';
          element.style.color = '';
          element.style.borderRadius = '';
        }, 2000);
      }
    }
  }, [isOpen, currentStep]);

  const handleNext = () => {
    if (currentStep < menuItems.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setCurrentStep(menuItems.length);
    if (onComplete) {
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isOpen || currentStep >= menuItems.length) {
    return null;
  }

  const currentItem = menuItems[currentStep];

  return (
    <div className="sidebar-tutorial" style={{ top: tipPosition.top, left: tipPosition.left }}>
      <div className="tutorial-title">
        {t(currentItem.titleKey)}
      </div>
      <div className="tutorial-content">
        {currentItem.tip}
      </div>
      
      <div className="tutorial-progress">
        <div>
          {currentStep + 1} / {menuItems.length}
        </div>
      </div>
      
      <div className="tutorial-controls">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="tutorial-btn tutorial-btn-prev"
        >
          ←
        </button>
        <button
          onClick={handleNext}
          className="tutorial-btn tutorial-btn-next"
        >
          {currentStep === menuItems.length - 1 ? '✓' : '→'}
        </button>
        <button
          onClick={handleSkip}
          className="tutorial-btn tutorial-btn-skip"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default SidebarTutorial;
