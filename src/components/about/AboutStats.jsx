import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getAbout } from '../../services/about.service';

const AboutStats = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({
    queryKey: ['about'],
    queryFn: () => getAbout(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const male = data?.maleEmp ?? 0;
  const female = data?.femaleEmp ?? 0;
  const total = data?.totalEmp ?? male + female;
  const status = data?.status ?? '—';

  return (
    <section className="about-stats-sec pt-60 pb-60">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h2 className="mb-4">{t('about.aboutStatsTitle','Our Organization Stats')}</h2>
            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div style={{ color: 'red' }}>{error.message || 'Failed to load stats'}</div>
            ) : (
              <div className="row">
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="p-3 border rounded">
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{t('about.maleEmployees','Male Employees')}</div>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>{male}</div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="p-3 border rounded">
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{t('about.femaleEmployees','Female Employees')}</div>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>{female}</div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="p-3 border rounded">
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{t('about.totalEmployees','Total Employees')}</div>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>{total}</div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="p-3 border rounded">
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{t('about.status','Status')}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, textTransform: 'capitalize' }}>{status}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStats;
