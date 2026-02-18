/**
 * Tutorial Modal Component
 * Interactive tutorial system with step-by-step guidance and tips
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button, Card, Badge } from 'react-bootstrap';
import { FaQuestionCircle, FaCheck, FaArrowRight, FaTimes, FaLightbulb, FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';

const TutorialModal = ({ 
  isOpen, 
  onClose, 
  tutorialKey, 
  onComplete 
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showTips, setShowTips] = useState(true);

  // Tutorial configurations
  const tutorials = {
    'dashboard': {
      title: t('tutorial.dashboard.title', 'Dashboard Overview'),
      description: t('tutorial.dashboard.description', 'Learn how to navigate and use the admin dashboard'),
      steps: [
        {
          title: t('tutorial.dashboard.step1.title', 'Welcome to Admin Dashboard'),
          content: t('tutorial.dashboard.step1.content', 'This is your main control center. Here you can monitor all aspects of your organization.'),
          tips: [
            t('tutorial.dashboard.step1.tip1', 'Use the sidebar to navigate between different sections'),
            t('tutorial.dashboard.step1.tip2', 'The header shows user info and quick actions'),
            t('tutorial.dashboard.step1.tip3', 'Real-time statistics update automatically')
          ],
          element: '.admin-sidebar',
          action: 'highlight'
        },
        {
          title: t('tutorial.dashboard.step2.title', 'Navigation Basics'),
          content: t('tutorial.step2.content', 'Learn how to navigate through different admin sections using the sidebar menu.'),
          tips: [
            t('tutorial.step2.tip1', 'Click on menu items to expand/collapse sections'),
            t('tutorial.step2.tip2', 'Use breadcrumbs to track your location'),
            t('tutorial.step2.tip3', 'Keyboard shortcuts: Ctrl+K for quick search')
          ],
          element: '.admin-sidebar',
          action: 'highlight'
        },
        {
          title: t('tutorial.dashboard.step3.title', 'Quick Actions'),
          content: t('tutorial.step3.content', 'Access frequently used features from the header quick actions menu.'),
          tips: [
            t('tutorial.step3.tip1', 'Add new content quickly with the + button'),
            t('tutorial.step3.tip2', 'Refresh data with the sync button'),
            t('tutorial.step3.tip3', 'Access user settings and logout')
          ],
          element: '.admin-header',
          action: 'highlight'
        }
      ]
    },
    'content-management': {
      title: t('tutorial.contentManagement.title', 'Content Management'),
      description: t('tutorial.contentManagement.description', 'Learn how to create, edit, and manage website content'),
      steps: [
        {
          title: t('tutorial.contentManagement.step1.title', 'Creating New Content'),
          content: t('tutorial.contentManagement.step1.content', 'Start by creating new articles, news, or other content types.'),
          tips: [
            t('tutorial.contentManagement.step1.tip1', 'Use the "Add New" button in each section'),
            t('tutorial.contentManagement.step1.tip2', 'Fill in required fields marked with *'),
            t('tutorial.step1.tip3', 'Save drafts to continue later')
          ],
          element: '.btn-primary',
          action: 'highlight'
        },
        {
          title: t('tutorial.contentManagement.step2.title', 'Rich Text Editor'),
          content: t('tutorial.contentManagement.step2.content', 'Use the rich text editor to format your content with bold, italics, links, and more.'),
          tips: [
            t('tutorial.contentManagement.step2.tip1', 'Highlight text and use formatting toolbar'),
            t('tutorial.contentManagement.step2.tip2', 'Add images and media files'),
            t('tutorial.contentManagement.step2.tip3', 'Preview changes before publishing')
          ],
          element: '.rich-text-editor',
          action: 'highlight'
        },
        {
          title: t('tutorial.contentManagement.step3.title', 'Publishing Content'),
          content: t('tutorial.contentManagement.step3.content', 'Learn how to publish content and manage visibility.'),
          tips: [
            t('tutorial.contentManagement.step3.tip1', 'Set publication date and status'),
            t('tutorial.contentManagement.step3.tip2', 'Choose visibility options'),
            t('tutorial.contentManagement.step3.tip3', 'Schedule posts for future publishing')
          ],
          element: '.publish-controls',
          action: 'highlight'
        }
      ]
    },
    'team-management': {
      title: t('tutorial.teamManagement.title', 'Team Management'),
      description: t('tutorial.teamManagement.description', 'Manage team members, roles, and permissions'),
      steps: [
        {
          title: t('tutorial.teamManagement.step1.title', 'Adding Team Members'),
          content: t('tutorial.teamManagement.step1.content', 'Add new team members and assign appropriate roles and permissions.'),
          tips: [
            t('tutorial.teamManagement.step1.tip1', 'Upload professional photos'),
            t('tutorial.teamManagement.step1.tip2', 'Write compelling bios and descriptions'),
            t('tutorial.step1.tip3', 'Set contact information and social links')
          ],
          element: '.add-team-member',
          action: 'highlight'
        },
        {
          title: t('tutorial.teamManagement.step2.title', 'Role Assignment'),
          content: t('tutorial.teamManagement.step2.content', 'Assign roles and permissions to control access levels.'),
          tips: [
            t('tutorial.teamManagement.step2.tip1', 'Admin has full access to all features'),
            t('tutorial.teamManagement.step2.tip2', 'Editor can modify content but not settings'),
            t('tutorial.step2.tip3', 'Viewer can only view published content')
          ],
          element: '.role-selector',
          action: 'highlight'
        },
        {
          title: t('tutorial.teamManagement.step3.title', 'Team Communication'),
          content: t('tutorial.teamManagement.step3.content', 'Set up team communication channels and notifications.'),
          tips: [
            t('tutorial.teamManagement.step3.tip1', 'Configure email notifications'),
            t('tutorial.teamManagement.step3.tip2', 'Set up team chat or messaging'),
            t('tutorial.teamManagement.step3.tip3', 'Create team schedules and calendars')
          ],
          element: '.team-settings',
          action: 'highlight'
        }
      ]
    },
    'donations': {
      title: t('tutorial.donations.title', 'Donations Management'),
      description: t('tutorial.donations.description', 'Set up and manage donation campaigns and track contributions'),
      steps: [
        {
          title: t('tutorial.donations.step1.title', 'Setting Up Payment Gateway'),
          content: t('tutorial.donations.step1.content', 'Configure payment gateways like Stripe for secure donations.'),
          keys: ['stripe'],
          tips: [
            t('tutorial.donations.step1.tip1', 'Test with Stripe test keys first'),
            t('tutorial.donations.step1.tip2', 'Configure webhook endpoints'),
            t('tutorial.donations.step1.tip3', 'Set up recurring donations')
          ],
          element: '.payment-settings',
          action: 'highlight'
        },
        {
          title: t('tutorial.donations.step2.title', 'Creating Campaigns'),
          content: t('tutorial.donations.step2.content', 'Create compelling donation campaigns with goals and progress tracking.'),
          tips: [
            t('tutorial.donations.step2.tip1', 'Set clear fundraising goals'),
            t('tutorial.donations.step2.tip2', 'Add compelling images and stories'),
            t('tutorial.donations.step2.tip3', 'Share on social media platforms')
          ],
          element: '.campaign-creator',
          action: 'highlight'
        },
        {
          title: t('tutorial.donations.step3.title', 'Tracking Donations'),
          content: t('tutorial.donations.step3.content', 'Monitor donation progress and send thank you messages.'),
          tips: [
            t('tutorial.donations.step3.tip1', 'View detailed donation reports'),
            t('tutorial.donations.step3.tip2', 'Export donor data for analysis'),
            t('tutorial.donations.step3.tip3', 'Send automated thank you emails')
          ],
          element: '.donation-reports',
          action: 'highlight'
        }
      ]
    }
  };

  const currentTutorial = tutorials[tutorialKey];
  const currentStepData = currentTutorial?.steps[currentStep];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setCompletedSteps(new Set());
      setIsPaused(false);
    }
  }, [isOpen, tutorialKey]);

  const handleNext = () => {
    if (currentStep < currentTutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCompletedSteps(prev => new Set([...prev, currentStep]));
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
    setCompletedSteps(new Set(currentTutorial.steps.map((_, index) => index)));
    if (onComplete) {
      onComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const highlightElement = (elementSelector) => {
    const element = document.querySelector(elementSelector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.style.transition = 'all 0.3s ease';
      element.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.5)';
      element.style.borderRadius = '8px';
      
      setTimeout(() => {
        element.style.boxShadow = '';
        element.style.borderRadius = '';
      }, 2000);
    }
  };

  useEffect(() => {
    if (currentStepData?.element && isOpen && !isPaused) {
      const timer = setTimeout(() => {
        highlightElement(currentStepData.element);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isOpen, isPaused, currentStepData]);

  const progress = ((completedSteps.size + (isPaused ? 0 : 1)) / currentTutorial?.steps.length) * 100;

  return (
    <Modal 
      show={isOpen} 
      onHide={onClose}
      size="lg"
      centered
      backdrop="static"
      className="tutorial-modal"
    >
      <Modal.Header className="bg-primary text-white">
        <Modal.Title className="d-flex align-items-center justify-content-between">
          <div>
            <FaLightbulb className="me-2" />
            {currentTutorial?.title}
          </div>
          <div className="d-flex gap-2 align-items-center">
            <Button
              variant="light"
              size="sm"
              onClick={togglePause}
              className="d-flex align-items-center"
            >
              {isPaused ? <FaPlay /> : <FaPause />}
            </Button>
            <Button
              variant="light"
              size="sm"
              onClick={() => setShowTips(!showTips)}
              className="d-flex align-items-center"
            >
              <FaQuestionCircle />
            </Button>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="tutorial-content">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted">
                {t('tutorial.progress', 'Progress')}: {currentStep + 1} / {currentTutorial?.steps?.length}
              </span>
              <Badge bg="success">
                {Math.round(progress)}%
              </Badge>
            </div>
            <div className="progress mb-4" style={{ height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
              <div 
                className="progress-bar bg-success" 
                style={{ 
                  width: `${progress}%`, 
                  height: '100%', 
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>

          {/* Tips Section */}
          {showTips && currentStepData?.tips && (
            <div className="alert alert-info mb-4">
              <div className="d-flex align-items-start">
                <FaLightbulb className="me-2 mt-1" />
                <div>
                  <strong>{t('tutorial.tips', 'Tips')}:</strong>
                  <ul className="mb-0 mt-2">
                    {currentStepData.tips.map((tip, index) => (
                      <li key={index} className="mb-1">{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step Content */}
          <Card className="mb-4">
            <Card.Header className="bg-light">
              <Card.Title className="d-flex align-items-center justify-content-between">
                <span className="d-flex align-items-center">
                  <span className="badge bg-primary me-2">{currentStep + 1}</span>
                  {currentStepData?.title}
                </span>
                {completedSteps.has(currentStep) && (
                  <Badge bg="success" className="ms-2">
                    <FaCheck />
                  </Badge>
                )}
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-3">
                {currentStepData?.content}
              </p>
              
              {currentStepData?.keys && (
                <div className="alert alert-warning">
                  <small>
                    <strong>{t('tutorial.requiredKeys', 'Required')}:</strong> {currentStepData.keys.join(', ')}
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Navigation */}
          <div className="d-flex justify-content-between align-items-center">
            <Button
              variant="outline-secondary"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="d-flex align-items-center"
            >
              <FaStepBackward className="me-2" />
              {t('tutorial.previous', 'Previous')}
            </Button>

            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                onClick={handleSkip}
                className="d-flex align-items-center"
              >
                {t('tutorial.skip', 'Skip Tutorial')}
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                className="d-flex align-items-center"
              >
                {currentStep === currentTutorial?.steps.length - 1 
                  ? t('tutorial.complete', 'Complete') 
                  : t('tutorial.next', 'Next')
                }
                <FaStepForward className="ms-2" />
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default TutorialModal;
