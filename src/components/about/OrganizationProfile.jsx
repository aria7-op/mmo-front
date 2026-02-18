import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getOrganizationProfile } from '../../services/organizationProfile.service';
import { formatMultilingualContent } from '../../utils/apiUtils';
import { useLanguage } from '../../hooks/useLanguage';
import ProfileLoader from './ProfileLoader';
import ProfileError from './ProfileError';
import RegistrationDetails from './RegistrationDetails';
import styles from './OrganizationProfile.module.css';

// Query configuration constants
const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
};

/**
 * OrganizationProfile component
 * Displays organization profile and registration details with i18n support
 */
const OrganizationProfile = () => {
  const { t } = useTranslation();
  const { uiLang } = useLanguage();

  // Fetch organization profile data
  const { data, isLoading, error } = useQuery({
    queryKey: ['organizationProfile', 'main'],
    queryFn: () => getOrganizationProfile({ force: true }),
    ...QUERY_CONFIG,
  });

  // Extract and process payload
  const payload = useMemo(() => data?.data || data, [data]);

  // Format multilingual fields
  const pickLang = (obj) => formatMultilingualContent(obj, uiLang);

  // Process organization data
  const orgData = useMemo(
    () => ({
      orgName: pickLang(payload?.organizationName) || '—',
      profile: pickLang(payload?.profile) || '',
      registeredWith: pickLang(payload?.registeredWith) || '—',
      address: pickLang(payload?.address) || '—',
      registrationNumber: payload?.registrationNumber || '—',
      registrationDate: payload?.registrationDate
        ? new Date(payload.registrationDate).toLocaleDateString(uiLang)
        : '—',
    }),
    [payload, uiLang, pickLang]
  );

  return (
    <div id="organization-profile" className={styles.orgProfile}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {/* Header Section */}
            <div className={styles.headerSection}>
              <h2 className={styles.headerTitle}>
                {t('about.organizationProfile', 'Organization Profile')}
              </h2>
              <div className={styles.headerUnderline}></div>
            </div>

            {/* Content Section */}
            {isLoading ? (
              <ProfileLoader />
            ) : error ? (
              <ProfileError error={error} />
            ) : (
              <div className={styles.profileContent}>
                {/* Profile Description */}
                {orgData.profile && (
                  <div className={styles.profileDescription}>
                    <p className={styles.profileDescriptionText}>
                      {orgData.profile}
                    </p>
                  </div>
                )}

                {/* Registration Details Card */}
                <RegistrationDetails
                  orgName={orgData.orgName}
                  registrationNumber={orgData.registrationNumber}
                  registrationDate={orgData.registrationDate}
                  registeredWith={orgData.registeredWith}
                  address={orgData.address}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationProfile;
