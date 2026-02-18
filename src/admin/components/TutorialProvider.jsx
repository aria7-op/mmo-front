/**
 * Tutorial Provider Component
 * Manages tutorial state and provides tutorial context to the admin panel
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import TutorialModal from './TutorialModal';

const TutorialContext = createContext();

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};

export const TutorialProvider = ({ children }) => {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [completedTutorials, setCompletedTutorials] = useState(new Set());
  const [showWelcome, setShowWelcome] = useState(false);

  // Load completed tutorials from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('completedTutorials');
    if (saved) {
      try {
        setCompletedTutorials(new Set(JSON.parse(saved)));
      } catch (error) {
        console.error('Error loading completed tutorials:', error);
      }
    }

    // Check if it's first visit
    const hasVisited = localStorage.getItem('adminPanelVisited');
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('adminPanelVisited', 'true');
    }
  }, []);

  const startTutorial = (tutorialKey) => {
    setCurrentTutorial(tutorialKey);
    setIsTutorialOpen(true);
  };

  const closeTutorial = () => {
    setIsTutorialOpen(false);
    setCurrentTutorial(null);
  };

  const completeTutorial = (tutorialKey) => {
    setCompletedTutorials(prev => {
      const newSet = new Set([...prev, tutorialKey]);
      localStorage.setItem('completedTutorials', JSON.stringify([...newSet]));
      return newSet;
    });
  };

  const markTutorialCompleted = (tutorialKey) => {
    completeTutorial(tutorialKey);
  };

  const resetTutorials = () => {
    setCompletedTutorials(new Set());
    localStorage.removeItem('completedTutorials');
  };

  const isTutorialCompleted = (tutorialKey) => {
    return completedTutorials.has(tutorialKey);
  };

  const getTutorialProgress = () => {
    const totalTutorials = Object.keys(tutorials).length;
    const completed = completedTutorials.size;
    return {
      total: totalTutorials,
      completed,
      percentage: totalTutorials > 0 ? (completed / totalTutorials) * 100 : 0
    };
  };

  const value = {
    isTutorialOpen,
    currentTutorial,
    completedTutorials,
    showWelcome,
    startTutorial,
    closeTutorial,
    completeTutorial,
    markTutorialCompleted,
    resetTutorials,
    isTutorialCompleted,
    getTutorialProgress,
    setShowWelcome
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={closeTutorial}
        tutorialKey={currentTutorial}
        onComplete={() => completeTutorial(currentTutorial)}
      />
    </TutorialContext.Provider>
  );
};

// Tutorial configurations
const tutorials = {
  'dashboard': {
    title: 'Dashboard Overview',
    description: 'Learn how to navigate and use the admin dashboard',
    icon: 'fas fa-tachometer-alt',
    color: 'primary'
  },
  'content-management': {
    title: 'Content Management',
    description: 'Learn how to create, edit, and manage website content',
    icon: 'fas fa-edit',
    color: 'success'
  },
  'team-management': {
    title: 'Team Management',
    description: 'Manage team members, roles, and permissions',
    icon: 'fas fa-users',
    color: 'info'
  },
  'donations': {
    title: 'Donations Management',
    description: 'Set up and manage donation campaigns',
    icon: 'fas fa-heart',
    color: 'danger'
  },
  'volunteers': {
    title: 'Volunteer Management',
    description: 'Manage volunteer applications and activities',
    icon: 'fas fa-hands-helping',
    color: 'warning'
  },
  'events': {
    title: 'Event Management',
    description: 'Create and manage events and registrations',
    icon: 'fas fa-calendar',
    color: 'secondary'
  },
  'reports': {
    title: 'Reports & Analytics',
    description: 'View detailed reports and analytics',
    icon: 'fas fa-chart-bar',
    color: 'dark'
  }
};

export { tutorials };
