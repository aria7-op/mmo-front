import React from 'react';
import { useTranslation } from 'react-i18next';
import DetailItem from './DetailItem';
import styles from './OrganizationProfile.module.css';

/**
 * RegistrationDetails component - displays organization registration information
 * @param {Object} props
 * @param {string} props.orgName - Organization name
 * @param {string} props.registrationNumber - Registration number
 * @param {string} props.registrationDate - Registration date
 * @param {string} props.registeredWith - Registered with entity
 * @param {string} props.address - Organization address
 */
const RegistrationDetails = ({
  orgName,
  registrationNumber,
  registrationDate,
  registeredWith,
  address,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.registrationCard}>
      <div className={styles.cardHeader}>
        {t('about.registrationDetails', 'Registration Details')}
      </div>
      <div className={styles.cardContent}>
        <div className={styles.detailsGrid}>
          <div className={styles.itemsContainer}>
            <DetailItem
              label={t('about.organizationName', 'Organization Name')}
              value={orgName}
            />
            <DetailItem
              label={t('about.registrationNumber', 'Registration Number')}
              value={registrationNumber}
            />
            <DetailItem
              label={t('about.registrationDate', 'Registration Date')}
              value={registrationDate}
            />
            <DetailItem
              label={t('about.registeredWith', 'Registered With')}
              value={registeredWith}
            />
          </div>

          <DetailItem
            label={t('about.address', 'Address')}
            value={address}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
};

export default RegistrationDetails;
