/**
 * Tutorial Configuration
 * Centralized configuration for all admin panel tutorials
 */

export const TUTORIAL_CONFIG = {
  // Dashboard Tutorial
  dashboard: {
    title: 'Dashboard Overview',
    description: 'Learn how to navigate and use the admin dashboard effectively',
    icon: 'fas fa-tachometer-alt',
    color: 'primary',
    estimatedTime: '5 minutes',
    difficulty: 'beginner',
    steps: [
      {
        title: 'Welcome to Admin Dashboard',
        content: 'This is your main control center. Here you can monitor all aspects of your organization at a glance.',
        tips: [
          'Use the sidebar to navigate between different sections',
          'The header shows user info and quick actions',
          'Real-time statistics update automatically',
          'Click on any metric to see detailed information'
        ],
        element: '.admin-sidebar',
        action: 'highlight',
        position: 'right'
      },
      {
        title: 'Navigation Basics',
        content: 'Learn how to navigate through different admin sections using the sidebar menu.',
        tips: [
          'Click on menu items to expand/collapse sections',
          'Use breadcrumbs to track your location',
          'Keyboard shortcuts: Ctrl+K for quick search',
          'Right-click on menu items for quick actions'
        ],
        element: '.admin-sidebar',
        action: 'highlight',
        position: 'right'
      },
      {
        title: 'Quick Actions',
        content: 'Access frequently used features from the header quick actions menu.',
        tips: [
          'Add new content quickly with the + button',
          'Refresh data with the sync button',
          'Access user settings and logout',
          'View notifications and alerts'
        ],
        element: '.admin-header',
        action: 'highlight',
        position: 'bottom'
      },
      {
        title: 'Statistics Overview',
        content: 'Monitor key metrics and performance indicators from the dashboard.',
        tips: [
          'Click on any stat card to see detailed breakdown',
          'Use date filters to view historical data',
          'Export reports in multiple formats',
          'Set up custom alerts for important metrics'
        ],
        element: '.stat-card',
        action: 'highlight',
        position: 'top'
      }
    ]
  },

  // Content Management Tutorial
  contentManagement: {
    title: 'Content Management',
    description: 'Master the art of creating, editing, and managing website content',
    icon: 'fas fa-edit',
    color: 'success',
    estimatedTime: '8 minutes',
    difficulty: 'intermediate',
    steps: [
      {
        title: 'Creating New Content',
        content: 'Start by creating new articles, news, or other content types with our intuitive editor.',
        tips: [
          'Use the "Add New" button in each section',
          'Fill in required fields marked with *',
          'Save drafts to continue later',
          'Use templates for consistent formatting'
        ],
        element: '.btn-primary',
        action: 'highlight',
        position: 'top'
      },
      {
        title: 'Rich Text Editor',
        content: 'Use the powerful rich text editor to format your content with professional styling.',
        tips: [
          'Highlight text and use formatting toolbar',
          'Add images, videos, and media files',
          'Use keyboard shortcuts for faster editing',
          'Preview changes before publishing'
        ],
        element: '.rich-text-editor',
        action: 'highlight',
        position: 'center'
      },
      {
        title: 'SEO Optimization',
        content: 'Optimize your content for search engines with built-in SEO tools.',
        tips: [
          'Add meta descriptions and keywords',
          'Set friendly URLs and slugs',
          'Add alt text to images for accessibility',
          'Use heading tags properly for structure'
        ],
        element: '.seo-settings',
        action: 'highlight',
        position: 'bottom'
      },
      {
        title: 'Publishing Content',
        content: 'Learn how to publish content and manage visibility across different channels.',
        tips: [
          'Set publication date and status',
          'Choose visibility options (public, private, draft)',
          'Schedule posts for future publishing',
          'Share directly to social media platforms'
        ],
        element: '.publish-controls',
        action: 'highlight',
        position: 'top'
      }
    ]
  },

  // Team Management Tutorial
  teamManagement: {
    title: 'Team Management',
    description: 'Manage team members, roles, permissions, and collaboration effectively',
    icon: 'fas fa-users',
    color: 'info',
    estimatedTime: '6 minutes',
    difficulty: 'intermediate',
    steps: [
      {
        title: 'Adding Team Members',
        content: 'Add new team members and assign appropriate roles and permissions.',
        tips: [
          'Upload professional photos and avatars',
          'Write compelling bios and descriptions',
          'Set contact information and social links',
          'Assign roles based on responsibilities'
        ],
        element: '.add-team-member',
        action: 'highlight',
        position: 'right'
      },
      {
        title: 'Role Assignment',
        content: 'Assign roles and permissions to control access levels and responsibilities.',
        tips: [
          'Admin has full access to all features',
          'Editor can modify content but not settings',
          'Viewer can only view published content',
          'Custom roles can be created for specific needs'
        ],
        element: '.role-selector',
        action: 'highlight',
        position: 'left'
      },
      {
        title: 'Team Communication',
        content: 'Set up team communication channels and notification preferences.',
        tips: [
          'Configure email notifications for different events',
          'Set up team chat or messaging systems',
          'Create team schedules and calendars',
          'Use @mentions to notify specific team members'
        ],
        element: '.team-settings',
        action: 'highlight',
        position: 'bottom'
      }
    ]
  },

  // Donations Tutorial
  donations: {
    title: 'Donations Management',
    description: 'Set up and manage donation campaigns, payment processing, and donor relations',
    icon: 'fas fa-heart',
    color: 'danger',
    estimatedTime: '10 minutes',
    difficulty: 'advanced',
    steps: [
      {
        title: 'Payment Gateway Setup',
        content: 'Configure payment gateways like Stripe for secure donation processing.',
        tips: [
          'Test with Stripe test keys first',
          'Configure webhook endpoints for real-time updates',
          'Set up recurring donations and subscriptions',
          'Enable multiple payment methods'
        ],
        element: '.payment-settings',
        action: 'highlight',
        position: 'center'
      },
      {
        title: 'Creating Campaigns',
        content: 'Create compelling donation campaigns with goals and progress tracking.',
        tips: [
          'Set clear and achievable fundraising goals',
          'Add compelling images and success stories',
          'Share campaign progress with donors',
          'Use social proof to build trust'
        ],
        element: '.campaign-creator',
        action: 'highlight',
        position: 'top'
      },
      {
        title: 'Donor Management',
        content: 'Manage donor relationships, send thank you messages, and track engagement.',
        tips: [
          'Segment donors by donation history',
          'Send personalized thank you messages',
          'Create donor recognition programs',
          'Track donor lifetime value'
        ],
        element: '.donor-management',
        action: 'highlight',
        position: 'left'
      },
      {
        title: 'Analytics & Reporting',
        content: 'Monitor donation performance with detailed analytics and reports.',
        tips: [
          'View detailed donation reports and trends',
          'Export donor data for analysis',
          'Set up automated reports for stakeholders',
          'Track campaign ROI and effectiveness'
        ],
        element: '.donation-reports',
        action: 'highlight',
        position: 'bottom'
      }
    ]
  },

  // Volunteers Tutorial
  volunteers: {
    title: 'Volunteer Management',
    description: 'Manage volunteer applications, schedules, and engagement programs',
    icon: 'fas fa-hands-helping',
    color: 'warning',
    estimatedTime: '7 minutes',
    difficulty: 'intermediate',
    steps: [
      {
        title: 'Application Process',
        content: 'Set up and manage volunteer application workflows.',
        tips: [
          'Create custom application forms',
          'Set up automated screening processes',
          'Schedule interviews and orientations',
          'Track application status and progress'
        ],
        element: '.volunteer-applications',
        action: 'highlight',
        position: 'right'
      },
      {
        title: 'Scheduling Management',
        content: 'Coordinate volunteer schedules and assignments efficiently.',
        tips: [
          'Use calendar views for scheduling',
          'Set up recurring volunteer shifts',
          'Send automated reminders and notifications',
          'Track volunteer hours and contributions'
        ],
        element: '.volunteer-schedule',
        action: 'highlight',
        position: 'center'
      },
      {
        title: 'Engagement Programs',
        content: 'Create and manage volunteer engagement and recognition programs.',
        tips: [
          'Set up volunteer training programs',
          'Create recognition and reward systems',
          'Organize team-building activities',
          'Track volunteer satisfaction and retention'
        ],
        element: '.volunteer-programs',
        action: 'highlight',
        position: 'left'
      }
    ]
  },

  // Events Tutorial
  events: {
    title: 'Event Management',
    description: 'Create, manage, and promote events with registration and attendance tracking',
    icon: 'fas fa-calendar',
    color: 'secondary',
    estimatedTime: '8 minutes',
    difficulty: 'intermediate',
    steps: [
      {
        title: 'Event Creation',
        content: 'Create engaging events with detailed information and registration options.',
        tips: [
          'Add event descriptions and schedules',
          'Set up registration forms and fees',
          'Add event images and promotional materials',
          'Configure event capacity and limits'
        ],
        element: '.event-creator',
        action: 'highlight',
        position: 'top'
      },
      {
        title: 'Registration Management',
        content: 'Manage event registrations, payments, and attendee communications.',
        tips: [
          'Monitor registration numbers and capacity',
          'Send confirmation and reminder emails',
          'Handle waitlists and cancellations',
          'Process payments and refunds'
        ],
        element: '.registration-management',
        action: 'highlight',
        position: 'right'
      },
      {
        title: 'Event Promotion',
        content: 'Promote your events across multiple channels and track engagement.',
        tips: [
          'Share events on social media',
          'Send email invitations to contacts',
          'Create event landing pages',
          'Track promotion effectiveness'
        ],
        element: '.event-promotion',
        action: 'highlight',
        position: 'bottom'
      }
    ]
  },

  // Reports Tutorial
  reports: {
    title: 'Reports & Analytics',
    description: 'Access detailed reports, analytics, and insights for data-driven decisions',
    icon: 'fas fa-chart-bar',
    color: 'dark',
    estimatedTime: '6 minutes',
    difficulty: 'advanced',
    steps: [
      {
        title: 'Dashboard Analytics',
        content: 'View comprehensive analytics and performance metrics.',
        tips: [
          'Customize dashboard widgets',
          'Set up automated report generation',
          'Create custom date ranges and filters',
          'Export data in multiple formats'
        ],
        element: '.analytics-dashboard',
        action: 'highlight',
        position: 'center'
      },
      {
        title: 'Custom Reports',
        content: 'Create custom reports tailored to your specific needs.',
        tips: [
          'Use drag-and-drop report builder',
          'Add charts, graphs, and visualizations',
          'Schedule automatic report delivery',
          'Share reports with stakeholders'
        ],
        element: '.custom-reports',
        action: 'highlight',
        position: 'left'
      },
      {
        title: 'Data Insights',
        content: 'Gain actionable insights from your data with AI-powered analysis.',
        tips: [
          'Use trend analysis for predictions',
          'Identify patterns and anomalies',
          'Get recommendations for improvements',
          'Set up alerts for important changes'
        ],
        element: '.data-insights',
        action: 'highlight',
        position: 'right'
      }
    ]
  }
};

// Quick tips for different contexts
export const QUICK_TIPS = {
  general: [
    {
      title: 'Quick Navigation',
      content: 'Press Ctrl+K to quickly search for any page or feature',
      icon: 'fas fa-keyboard'
    },
    {
      title: 'Auto-Save',
      content: 'Your work is automatically saved every 30 seconds',
      icon: 'fas fa-save'
    },
    {
      title: 'Help Available',
      content: 'Click the question mark (?) button anytime for help',
      icon: 'fas fa-question-circle'
    }
  ],
  dashboard: [
    {
      title: 'Real-time Updates',
      content: 'Dashboard data refreshes automatically every 60 seconds',
      icon: 'fas fa-sync'
    },
    {
      title: 'Customizable Widgets',
      content: 'Drag and drop widgets to customize your dashboard layout',
      icon: 'fas fa-arrows-alt'
    }
  ],
  content: [
    {
      title: 'Keyboard Shortcuts',
      content: 'Use Ctrl+B for bold, Ctrl+I for italic in the editor',
      icon: 'fas fa-keyboard'
    },
    {
      title: 'Media Library',
      content: 'Access all your uploaded files from the media library',
      icon: 'fas fa-images'
    }
  ]
};

// Tutorial completion rewards
export const TUTORIAL_REWARDS = {
  beginner: {
    title: 'Getting Started',
    description: 'Complete basic tutorials to unlock advanced features',
    badge: 'fas fa-seedling',
    color: 'success'
  },
  intermediate: {
    title: 'Power User',
    description: 'Master intermediate features for efficient workflow',
    badge: 'fas fa-rocket',
    color: 'primary'
  },
  advanced: {
    title: 'Expert',
    description: 'Unlock advanced features and customization options',
    badge: 'fas fa-crown',
    color: 'warning'
  }
};
