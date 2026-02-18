import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './OrganizationProfile.module.css';

/**
 * ProfileError component - displays error message
 * @param {Object} props
 * @param {Error} props.error - Error object with message property
 */
const ProfileError = ({ error }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.errorBox}>
      {error?.message || t('about.errorLoadingOrganizationProfile', 'Failed to load organization profile')}
    </div>
  );
};

export default ProfileError;
