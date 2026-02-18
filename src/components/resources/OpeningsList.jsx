import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getOpportunities } from '../../services/opportunities.service';
import { formatDate } from '../../utils/apiUtils';

const OpeningsList = ({ onSelectPosition }) => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getOpportunities({ status: 'Published', limit: 50 });
        setItems(res.data || []);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return null;
  if (error) return null;
  if (!items.length) return null;

  return (
    <>
      <style>{`
        .jobs-container {
          background: #f8f9fa;
          padding: 40px 0;
        }
        .jobs-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .jobs-header h2 {
          font-size: 32px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 10px;
        }
        .jobs-header .border-shape {
          width: 60px;
          height: 3px;
          background: #f5b51e;
          margin: 0 auto;
        }
        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 25px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .job-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
          border: 1px solid #e9ecef;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .job-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: #0A4F9D;
        }
        .job-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }
        .job-title {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 15px;
          line-height: 1.3;
        }
        .job-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 20px;
        }
        .job-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #6c757d;
        }
        .job-meta-item i {
          color: #0A4F9D;
          font-size: 12px;
        }
        .job-deadline {
          background: #fff3cd;
          color: #856404;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 20px;
        }
        .job-deadline i {
          color: #ff6b6b;
        }
        .apply-btn {
          background: linear-gradient(135deg, #0A4F9D 0%, #0864d4 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }
        .apply-btn:hover {
          background: linear-gradient(135deg, #0864d4 0%, #0a4f9d 100%);
          transform: translateY(-1px);
        }
        @media (max-width: 768px) {
          .jobs-grid {
            grid-template-columns: 1fr;
            padding: 0 20px;
          }
          .jobs-container {
            padding: 20px 0;
          }
        }
      `}</style>
      
      <div className="jobs-container">
        <div className="container">
          <div className="jobs-header">
            <h2>{t('jobs.currentOpenings', 'Current Openings')}</h2>
            <div className="border-shape"></div>
          </div>
          <div className="jobs-grid">
            {items.map((op) => {
              const id = op._id || op.id;
              const title = op.title?.en || op.title || '-';
              const location = op.location || op.city || op.province || '';
              const deadline = op.deadline || op.closingDate || op.endDate;
              const type = op.employmentType || op.type || '';
              const category = op.category || op.department || '';
              
              return (
                <div className="job-card" key={id}>
                  <h3 className="job-title">{title}</h3>
                  
                  <div className="job-meta">
                    {location && (
                      <div className="job-meta-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{location}</span>
                      </div>
                    )}
                    {type && (
                      <div className="job-meta-item">
                        <i className="fas fa-briefcase"></i>
                        <span>{type}</span>
                      </div>
                    )}
                    {category && (
                      <div className="job-meta-item">
                        <i className="fas fa-tag"></i>
                        <span>{category}</span>
                      </div>
                    )}
                  </div>
                  
                  {deadline && (
                    <div className="job-deadline">
                      <i className="far fa-calendar"></i>
                      <span>{t('jobs.deadline', 'Deadline')}: {formatDate(deadline)}</span>
                    </div>
                  )}
                  
                  <button 
                    className="apply-btn" 
                    onClick={() => onSelectPosition && onSelectPosition(title)}
                  >
                    {t('jobs.apply', 'Apply Now')}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default OpeningsList;
