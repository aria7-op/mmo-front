// Shared menu configuration. Build with i18n translator passed in.
export function getMenuConfig(t) {
  return [
    {
      label: t('navigation.about'),
      path: '/about',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE7U6wRG44ggphkUBKSCv9FW33JOAe15R1rw&s',
      description: t('navigation.menuDescriptions.about'),
      children: [
        {
          label: t('navigation.about'),
          path: null, 
          isCategory: true,
          children: [
            { label: t('navigation.submenu.ourStory'), path: '/about/our-story' },
            { label: t('navigation.submenu.missionVision'), path: '/about/mission-vision' },
            { label: t('navigation.submenu.goalsObjectives'), path: '/about/goals-objectives' },
            { label: t('navigation.submenu.departments'), path: '/about/departments' },
          ]
        },
        { 
          label: t('navigation.submenu.leadership'),
          path: null, 
          isCategory: true,
          children: [
            { label: t('navigation.submenu.boardDirectors'), path: '/about/board-directors' },
            { label: t('navigation.submenu.executiveTeam'), path: '/about/executive-team' },
            { label: t('navigation.submenu.organizationalStructure'), path: '/about/organizational-structure' },
          ]
        },
        { 
          label: t('navigation.submenu.operations'),
          path: null, 
          isCategory: true,
          children: [
            { label: t('navigation.submenu.strategicPartnerships'), path: '/about/strategic-partnerships' },
            { label: t('navigation.submenu.coverageArea'), path: '/about/coverage-area' },
          ]
        },
      ],
    },
    {
      label: t('navigation.whatWeDo'),
      path: '/what-we-do',
      image: 'https://www.unicefusa.org/sites/default/files/styles/large/public/UN0694154_0.jpg.webp?itok=jE416piJ',
      description: t('navigation.menuDescriptions.whatWeDo'),
      children: [
        {
          label: t('navigation.whatWeDo'),
          path: null, 
          isCategory: true,
          children: [
            { label: t('navigation.submenu.educationPrograms'), path: '/what-we-do/education-programs' },
            { label: t('navigation.submenu.healthcareServices'), path: '/what-we-do/healthcare-services' },
            { label: t('navigation.submenu.washPrograms'), path: '/what-we-do/wash-programs' },
            { label: t('navigation.submenu.foodSecurity'), path: '/what-we-do/food-security' },
            { label: t('navigation.submenu.livelihoodSupport'), path: '/what-we-do/livelihood-support' },
            // { label: t('navigation.submenu.gbvProtection'), path: '/what-we-do/gbv-protection' },
            // { label: t('navigation.submenu.agricultureDevelopment'), path: '/what-we-do/agriculture-development' },
          ]
        },
        { 
          label: t('navigation.submenu.monitoringEvaluation'),
          path: null, 
          isCategory: true,
          children: [
            { label: t('navigation.submenu.monitoringEvaluation'), path: '/what-we-do/monitoring-evaluation' },
          ]
        },
      ],
    },
    {
      label: t('navigation.programs'),
      path: '/programs',
      image: 'https://en.radiozamaneh.com/wp-content/uploads/2025/09/shutterstock_1779012608-1000x570.jpg',
      description: t('navigation.menuDescriptions.programs'),
      children: [
        {
          label: t('navigation.submenu.programs'),
          path: null,
          isCategory: true,
          children: [
            { label: t('navigation.submenu.stayInAfghanistan'), path: '/programs/stay-in-afghanistan' },
            { label: t('navigation.submenu.sitc'), path: '/programs/sitc' },
             { label: t('navigation.submenu.emergencyResponse'), path: '/programs/emergency-response' },
            { label: t('navigation.submenu.taaban'), path: '/programs/taaban' },
          ]
        },
       
      ],
    },
    {
      label: t('navigation.projects'),
      path: '/projects',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE7U6wRG44ggphkUBKSCv9FW33JOAe15R1rw&s',
      description: t('navigation.menuDescriptions.projects'),
      children: [
        {
          label: t('navigation.submenu.ongoingProjects'),
          path: null,
          isCategory: true,
          children: [
            { label: t('navigation.submenu.ongoingProjects'), path: '/projects/ongoing' },
          ]
        },
        {
          label: t('navigation.submenu.completedProjects'),
          path: null,
          isCategory: true,
          children: [
            { label: t('navigation.submenu.completedProjects'), path: '/projects/completed' },
          ]
        },
      ],
    },
    {
      label: t('navigation.submenu.resources'),
      path: '/resources',
      image: 'https://en.radiozamaneh.com/wp-content/uploads/2025/09/shutterstock_1779012608-1000x570.jpg',
      description: t('navigation.menuDescriptions.resources'),
      customComponent: 'certificateSearch',
      children: [
        {
          label: t('navigation.submenu.documents'),
          path: null, 
          isCategory: true,
          children: [
            { label: t('navigation.submenu.reportsPublications'), path: '/resources/reports' },
            { label: t('navigation.submenu.policies'), path: '/resources/policies' },
            // { label: t('navigation.submenu.certificates'), path: '/resources/certificates' },
            // { label: t('navigation.submenu.procurements'), path: '/resources/procurements' },
            // { label: t('navigation.submenu.tenders'), path: '/resources/tenders' },
            { label: t('navigation.submenu.rfp'), path: '/resources/rfp' },
            { label: t('navigation.submenu.rfq'), path: '/resources/rfq' },
            { label: t('navigation.submenu.gallery'), path: '/gallery-full' },
          ]
        },
        
        { 
          label: t('navigation.submenu.vacancies'),
          path: null, 
          isCategory: true,
          children: [
            { label: t('navigation.submenu.vacancies'), path: '/resources/jobs' },
          ]
        },
        
        { 
          label: t('navigation.submenu.impact'),
          path: null, 
          isCategory: true,
          children: [
            { label: t('navigation.submenu.successStories'), path: '/resources/success-stories' },
            { label: t('navigation.submenu.caseStudies'), path: '/resources/case-studies' },
          ]
        },
      ],
    },
    {
      label: t('navigation.contact'),
      path: '/contact',
      description: t('navigation.menuDescriptions.contact'),
    },
  ];
}
