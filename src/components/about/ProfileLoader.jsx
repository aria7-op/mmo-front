import React from 'react';
import styles from './OrganizationProfile.module.css';

/**
 * ProfileLoader component - displays loading spinner
 */
const ProfileLoader = () => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default ProfileLoader;
