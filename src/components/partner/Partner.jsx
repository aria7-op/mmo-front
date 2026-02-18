import React from 'react';
import { usePartners } from '../../hooks/usePartners';
import { getImageUrlFromObject } from '../../utils/apiUtils';
import { useTranslation } from 'react-i18next';

const Partner = () => {
  const { i18n, t } = useTranslation();
  const { partners, loading } = usePartners({ status: 'Published' });
  const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
  return (
    <section className="partner-banner" style={{ padding: '44px 0', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .partner-banner {
          background: linear-gradient(135deg, rgba(15, 104, 187, 0.06) 0%, rgba(248, 251, 252, 1) 55%, rgba(15, 104, 187, 0.04) 100%);
        }

        .partner-banner__panel {
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(15, 104, 187, 0.10);
          box-shadow: 0 16px 40px rgba(15, 104, 187, 0.08), 0 10px 24px rgba(0, 0, 0, 0.06);
          border-radius: 18px;
          padding: 24px;
          backdrop-filter: blur(6px);
        }

        .partner-banner__tag {
          color: #0f68bb;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 800;
          font-size: 12px;
          margin: 0 0 10px 0;
        }

        .partner-banner__title {
          font-size: 26px;
          font-weight: 900;
          color: #292929;
          margin: 0;
        }

        .partner-banner__subtitle {
          margin: 10px auto 0 auto;
          max-width: 820px;
          color: #666;
          font-size: 15px;
          line-height: 1.6;
        }

        .partner-banner__logoCard {
          height: 84px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          border: 1px solid #f0f0f0;
          border-radius: 14px;
          background: #fff;
          filter: grayscale(100%) opacity(0.72);
          transform: translateY(0);
          transition: transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease, filter 260ms ease;
        }

        .partner-banner__logoCard:hover {
          filter: grayscale(0%) opacity(1);
          transform: translateY(-4px);
          border-color: rgba(15, 104, 187, 0.18);
          box-shadow: 0 16px 40px rgba(15, 104, 187, 0.10), 0 10px 24px rgba(0, 0, 0, 0.06);
        }

        .partner-banner__logo {
          width: 100%;
          height: 100%;
          max-height: 56px;
          object-fit: contain;
        }

        .partner-banner__logos {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: center;
          gap: 12px;
          overflow-x: auto;
          padding: 2px;
          -webkit-overflow-scrolling: touch;
        }

        .partner-banner__logos::-webkit-scrollbar {
          height: 6px;
        }

        .partner-banner__logos::-webkit-scrollbar-thumb {
          background: rgba(15, 104, 187, 0.18);
          border-radius: 999px;
        }

        .partner-banner__logoItem {
          flex: 0 0 auto;
          width: 140px;
        }

        .partner-banner__marquee {
          position: relative;
          overflow: hidden;
          width: 100%;
          padding: 2px;
        }

        .partner-banner__track {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          gap: 12px;
          width: max-content;
          animation: partner-marquee 22s linear infinite;
          will-change: transform;
        }

        .partner-banner__marquee:hover .partner-banner__track,
        .partner-banner__marquee:focus-within .partner-banner__track {
          animation-play-state: paused;
        }

        @keyframes partner-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes partner-marquee-rtl {
          from { transform: translateX(0); }
          to { transform: translateX(50%); }
        }

        .rtl-direction .partner-banner__track {
          direction: rtl;
          animation: partner-marquee-rtl 22s linear infinite;
        }

        @media (max-width: 768px) {
          .partner-banner__panel { padding: 18px; }
          .partner-banner__title { font-size: 22px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .partner-banner__logoCard { transition: none !important; }
          .partner-banner__track { animation: none !important; }
        }
      `}</style>

      <div className="container">
        <div className="partner-banner__panel">
          <div className="text-center" style={{ marginBottom: 18 }}>
            <p className="partner-banner__tag">{t('partners.tag', 'Our Partners')}</p>
            <h2 className="partner-banner__title">{t('partners.title', 'Trusted By Organizations')}</h2>
            <p className="partner-banner__subtitle">
              {t('partners.subtitle', 'Working together with local and global partners to deliver sustainable impact.')}
            </p>
          </div>

          {loading && (
            <div className="text-center text-muted">
              <i className="fas fa-spinner fa-spin" /> {t('partners.loading', 'Loading partners...')}
            </div>
          )}

          {!loading && partners && partners.length > 0 ? (
            <div className={`partner-banner__marquee ${isRTL ? 'rtl-direction' : ''}`} aria-label={t('partners.ariaLabel', 'Partners')}>
              <div className="partner-banner__track">
                {[...partners.slice(0, 8), ...partners.slice(0, 8)].map((p, idx) => (
                  <div className="partner-banner__logoItem" key={`partner-${p._id}-${idx}`} aria-hidden={idx >= Math.min(8, partners.length) ? 'true' : 'false'}>
                    <div className="partner-banner__logoCard">
                      <a
                        href={p.website || '#'}
                        target="_blank"
                        rel="noreferrer"
                        style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        aria-label={`${t('partners.visitWebsite', 'Visit website of')} ${p.name?.[i18n.language] || p.name?.en || 'Partner'}`}
                      >
                        <img
                          src={getImageUrlFromObject(p.logo)}
                          alt={p.name?.[i18n.language] || p.name?.en || 'Partner'}
                          className="partner-banner__logo"
                          loading="lazy"
                        />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            !loading && (
              <div className="text-center text-muted">{t('partners.noPartners', 'No partners to display.')}</div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Partner;
