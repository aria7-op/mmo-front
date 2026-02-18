/**
 * Tutorial Button Component
 * Floating question mark button to access tutorials and tips
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Badge, Card, Tabs, Tab } from 'react-bootstrap';
import { FaQuestionCircle, FaLightbulb, FaRocket, FaHeadset, FaShieldAlt } from 'react-icons/fa';
import { useTutorial, tutorials } from './TutorialProvider';
import SidebarTutorial from './SidebarTutorial';

const TutorialButton = () => {
  const { t } = useTranslation();
  const { startTutorial, isTutorialCompleted, getTutorialProgress, completedTutorials } = useTutorial();
  const [showQuickTips, setShowQuickTips] = useState(false);
  const [showSidebarTutorial, setShowSidebarTutorial] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [activeTab, setActiveTab] = useState('welcome');

  const progress = getTutorialProgress();
  const completedCount = completedTutorials.size;

  const quickTips = [
    {
      title: t('tutorial.quickTip.developer', 'Developed by Ariadelta'),
      content: t('tutorial.quickTip.developerContent', 'Thank you for choosing Ariadelta Consulting Group for developing your website'),
    },
    {
      title: t('tutorial.quickTip.support', 'Premium Support'),
      content: t('tutorial.quickTip.supportContent', 'Ariadelta Consulting Group provides 24/7 premium support for all your needs'),
    },
    {
      title: t('tutorial.quickTip.quality', 'Quality Assurance'),
      content: t('tutorial.quickTip.qualityContent', 'Built with cutting-edge technology and best practices by Ariadelta experts'),
    }
  ];

  return (
    <>
      {/* Floating Tutorial Button */}
      <div className="position-fixed" style={{ bottom: '20px', right: '20px', zIndex: 1000 }}>
        <Button
          variant="primary"
          onClick={() => setShowHelpModal(true)}
          className="rounded-circle shadow-lg"
          style={{
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid white'
          }}
        >
          <FaQuestionCircle size={24} />
          {completedCount > 0 && (
            <Badge 
              bg="success" 
              className="position-absolute top-0 start-100 translate-middle"
              style={{ fontSize: '10px' }}
            >
              {completedCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Help Modal */}
      <Modal 
        show={showHelpModal} 
        onHide={() => setShowHelpModal(false)}
        centered
        size="lg"
      >
        <Modal.Header className="bg-primary text-white">
          <Modal.Title className="d-flex align-items-center">
            <FaQuestionCircle className="me-2" />
            {t('tutorial.help.title', 'Ariadelta Consulting Group - Premium Support')}
          </Modal.Title>
          <Button 
            variant="link" 
            className="text-white ms-auto"
            onClick={() => setShowHelpModal(false)}
            style={{ 
              textDecoration: 'none', 
              padding: '0',
              fontSize: '24px',
              lineHeight: '1',
              opacity: '0.8'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '1'}
            onMouseLeave={(e) => e.target.style.opacity = '0.8'}
          >
            ×
          </Button>
        </Modal.Header>

        <Modal.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="welcome" title={
              <span className="d-flex align-items-center">
                <FaRocket className="me-2" />
                Welcome
              </span>
            }>
              {/* Welcome Message */}
              <div className="p-3">
                <h5 className="mb-3 d-flex align-items-center">
                  <FaRocket className="me-2 text-primary" />
                  Welcome to Your Premium Admin Panel!
                </h5>
                <p className="mb-3">
                  Thank you for choosing <strong>Ariadelta Consulting Group</strong> for developing your website. 
                  We've built this powerful admin panel with cutting-edge technology and best practices to ensure your success.
                </p>
                
                {/* Progress Summary */}
                <div className="p-3 bg-light rounded">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>{t('tutorial.progress.title', 'Tutorial Progress')}</strong>
                    <Badge bg="primary">
                      {Math.round(progress.percentage)}%
                    </Badge>
                  </div>
                  <div className="progress mb-2" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <small className="text-muted">
                    {progress.completed} / {progress.total} {t('tutorial.progress.completed', 'completed')}
                  </small>
                </div>
              </div>
            </Tab>

            <Tab eventKey="tips" title={
              <span className="d-flex align-items-center">
                <FaLightbulb className="me-2" />
                Quick Tips
              </span>
            }>
              {/* Quick Tips */}
              <div className="p-3">
                {quickTips.map((tip, index) => (
                  <Card key={index} className="mb-2 border-light">
                    <Card.Body className="p-3">
                      <div className="d-flex align-items-start">
                        <div className="me-2">
                          {index === 0 && <FaRocket className="text-primary" />}
                          {index === 1 && <FaHeadset className="text-success" />}
                          {index === 2 && <FaShieldAlt className="text-warning" />}
                        </div>
                        <div>
                          <strong className="small">{tip.title}</strong>
                          <p className="mb-0 small text-muted">{tip.content}</p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Tab>

            <Tab eventKey="support" title={
              <span className="d-flex align-items-center">
                <FaHeadset className="me-2" />
                Support
              </span>
            }>
              {/* Technical Support */}
              <div className="p-3">
                <Card className="border-success bg-success-light">
                  <Card.Body className="p-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <FaHeadset className="me-3 text-success" />
                        <div>
                          <div className="fw-semibold text-success">
                            {t('supportTitle', 'Need technical support?')}
                          </div>
                          <small className="text-muted">
                            {t('supportDescription', 'Get instant help from our support team')}
                          </small>
                        </div>
                      </div>
                      <Button
                        variant="success"
                        size="sm"
                        href="https://wa.me/93789301412"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-flex align-items-center"
                      >
                        <i className="fab fa-whatsapp me-2"></i>
                        {t('contactSupport', 'Contact Support')}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Tab>

            <Tab eventKey="tutorials" title={
              <span className="d-flex align-items-center">
                <FaLightbulb className="me-2" />
                Tutorials
              </span>
            }>
              {/* Tutorial List */}
              <div className="p-3">
                {/* Sidebar Tour */}
                <Card className="mb-2 border-primary">
                  <Card.Body className="p-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <FaLightbulb className="me-2 text-primary" />
                        <div>
                          <div className="fw-semibold">Sidebar Tour</div>
                          <small className="text-muted">Tour through all menu items</small>
                        </div>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setShowSidebarTutorial(true);
                          setShowHelpModal(false);
                        }}
                      >
                        {t('tutorial.start', 'Start')}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
                
                {Object.entries(tutorials).map(([key, tutorial]) => {
                  const isCompleted = isTutorialCompleted(key);
                  return (
                    <Card key={key} className="mb-2 border-light">
                      <Card.Body className="p-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <i className={`fas ${tutorial.icon} me-2 text-${tutorial.color}`} />
                            <div>
                              <div className="fw-semibold">{tutorial.title}</div>
                              <small className="text-muted">{tutorial.description}</small>
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            {isCompleted && <span className="text-success">✓</span>}
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => {
                                startTutorial(key);
                                setShowHelpModal(false);
                              }}
                            >
                              {isCompleted ? t('tutorial.review', 'Review') : t('tutorial.start', 'Start')}
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  );
                })}
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHelpModal(false)}>
            {t('common.close', 'Close')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Sidebar Tutorial */}
      <SidebarTutorial 
        isOpen={showSidebarTutorial}
        onClose={() => setShowSidebarTutorial(false)}
        onComplete={() => setShowSidebarTutorial(false)}
      />
    </>
  );
};

export default TutorialButton;
