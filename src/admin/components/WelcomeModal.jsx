/**
 * Welcome Modal Component
 * First-time user welcome and onboarding experience
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button, Card, Badge, Carousel } from 'react-bootstrap';
import { FaRocket, FaPlay, FaCheck, FaArrowRight, FaLightbulb, FaUsers, FaChartLine, FaShieldAlt } from 'react-icons/fa';
import { useTutorial } from './TutorialProvider';

const WelcomeModal = ({ isOpen, onClose, onStartTour }) => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { startTutorial } = useTutorial();

  const features = [
    {
      icon: <FaRocket />,
      title: t('welcome.features.quickStart', 'Quick Start'),
      description: t('welcome.features.quickStartDesc', 'Get up and running in minutes with our intuitive interface'),
      color: 'primary'
    },
    {
      icon: <FaUsers />,
      title: t('welcome.features.team', 'Team Collaboration'),
      description: t('welcome.features.teamDesc', 'Work together seamlessly with your team members'),
      color: 'success'
    },
    {
      icon: <FaChartLine />,
      title: t('welcome.features.analytics', 'Powerful Analytics'),
      description: t('welcome.features.analyticsDesc', 'Track performance with detailed reports and insights'),
      color: 'info'
    },
    {
      icon: <FaShieldAlt />,
      title: t('welcome.features.security', 'Secure & Reliable'),
      description: t('welcome.features.securityDesc', 'Enterprise-grade security to protect your data'),
      color: 'warning'
    }
  ];

  const quickActions = [
    {
      title: t('welcome.actions.createContent', 'Create Your First Content'),
      description: t('welcome.actions.createContentDesc', 'Start by creating your first article or news post'),
      tutorial: 'content-management',
      icon: 'fas fa-edit'
    },
    {
      title: t('welcome.actions.addTeam', 'Add Team Members'),
      description: t('welcome.actions.addTeamDesc', 'Invite your team to collaborate'),
      tutorial: 'team-management',
      icon: 'fas fa-users'
    },
    {
      title: t('welcome.actions.setupDonations', 'Setup Donations'),
      description: t('welcome.actions.setupDonationsDesc', 'Configure payment gateway for donations'),
      tutorial: 'donations',
      icon: 'fas fa-heart'
    }
  ];

  const handleStartTour = () => {
    onClose();
    startTutorial('dashboard');
  };

  const handleQuickAction = (tutorialKey) => {
    onClose();
    startTutorial(tutorialKey);
  };

  return (
    <Modal 
      show={isOpen} 
      onHide={onClose}
      size="xl"
      centered
      backdrop="static"
      className="welcome-modal"
    >
      <Modal.Header className="bg-gradient-primary text-white border-0">
        <Modal.Title className="text-center w-100">
          <div className="mb-3">
            <FaRocket size={48} className="mb-3" />
          </div>
          <h1 className="display-4 fw-bold mb-2">
            {t('welcome.title', 'Welcome to Admin Panel!')}
          </h1>
          <p className="lead mb-0">
            {t('welcome.subtitle', 'Let\'s get you started with a quick tour of your new dashboard')}
          </p>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {/* Features Carousel */}
        <div className="mb-5">
          <h3 className="text-center mb-4">
            <FaLightbulb className="me-2 text-warning" />
            {t('welcome.features.title', 'What You Can Do')}
          </h3>
          <Carousel 
            activeIndex={currentSlide} 
            onSelect={setCurrentSlide}
            interval={null}
            indicators={false}
            controls={false}
          >
            {features.map((feature, index) => (
              <Carousel.Item key={index}>
                <div className="text-center py-4">
                  <div className={`text-${feature.color} mb-3`} style={{ fontSize: '3rem' }}>
                    {feature.icon}
                  </div>
                  <h4 className="mb-3">{feature.title}</h4>
                  <p className="text-muted mx-auto" style={{ maxWidth: '400px' }}>
                    {feature.description}
                  </p>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
          
          {/* Carousel Indicators */}
          <div className="d-flex justify-content-center gap-2 mt-3">
            {features.map((_, index) => (
              <Button
                key={index}
                variant={currentSlide === index ? 'primary' : 'outline-secondary'}
                size="sm"
                className="rounded-circle"
                style={{ width: '12px', height: '12px', padding: '0' }}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-5">
          <h3 className="text-center mb-4">
            <FaPlay className="me-2 text-primary" />
            {t('welcome.actions.title', 'Quick Actions')}
          </h3>
          <div className="row g-3">
            {quickActions.map((action, index) => (
              <div key={index} className="col-md-4">
                <Card 
                  className="h-100 border-0 shadow-sm hover-lift"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleQuickAction(action.tutorial)}
                >
                  <Card.Body className="text-center p-4">
                    <div className="text-primary mb-3" style={{ fontSize: '2rem' }}>
                      <i className={action.icon} />
                    </div>
                    <h5 className="mb-2">{action.title}</h5>
                    <p className="text-muted small mb-0">{action.description}</p>
                    <Badge bg="light" text="dark" className="mt-2">
                      <FaPlay className="me-1" />
                      {t('welcome.actions.startTutorial', 'Start Tutorial')}
                    </Badge>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Getting Started Tips */}
        <div className="bg-light rounded p-4">
          <h4 className="mb-3">
            <FaLightbulb className="me-2 text-warning" />
            {t('welcome.tips.title', 'Pro Tips')}
          </h4>
          <div className="row">
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li className="mb-2">
                  <FaCheck className="text-success me-2" />
                  {t('welcome.tips.tip1', 'Click the question mark (?) button anytime for help')}
                </li>
                <li className="mb-2">
                  <FaCheck className="text-success me-2" />
                  {t('welcome.tips.tip2', 'Use Ctrl+K for quick navigation search')}
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li className="mb-2">
                  <FaCheck className="text-success me-2" />
                  {t('welcome.tips.tip3', 'Your work is automatically saved every 30 seconds')}
                </li>
                <li className="mb-2">
                  <FaCheck className="text-success me-2" />
                  {t('welcome.tips.tip4', 'Access detailed tutorials from the help menu')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 bg-light">
        <div className="d-flex justify-content-between w-100">
          <Button variant="outline-secondary" onClick={onClose}>
            {t('welcome.skip', 'Skip for Now')}
          </Button>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" onClick={handleStartTour}>
              <FaPlay className="me-2" />
              {t('welcome.startTour', 'Start Tour')}
            </Button>
            <Button variant="primary" onClick={onClose}>
              {t('welcome.getStarted', 'Get Started')}
              <FaArrowRight className="ms-2" />
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default WelcomeModal;
