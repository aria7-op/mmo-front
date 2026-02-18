import React from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import NewsDetails from './NewsDetails';
import EventDetailsContent from '../components/event/EventDetailsContent';
import { useParams, Navigate } from 'react-router-dom';
import { useNews } from '../hooks/useNews';
import { useEvents } from '../hooks/useEvents';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';

const NewsEventDetails = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  // Try to load both, then decide which to render
  const { news, loading: loadingNews } = useNews({ status: 'Published', page: 1, limit: 200 });
  const { events, loading: loadingEvents } = useEvents({ page: 1, limit: 200 });

  if (loadingNews || loadingEvents) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner />
      </div>
    );
  }

  // Find by slug or id in both collections
  const itemNews = (news || []).find(n => (n.slug === slug || n._id === slug));
  const itemEvent = (events || []).find(e => {
    // Build a slug the same way EventCard does
    const title = (e && e.title && (e.title.en || e.title.dr || e.title.ps)) || '';
    const generated = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return generated === slug || e.slug === slug || e._id === slug;
  });

  // Decide
  const isNews = !!itemNews && !itemEvent;
  const isEvent = !!itemEvent && !itemNews;

  return (
    <>
      <SEOHead page="resources" customMeta={{
        title: isNews ? (itemNews?.title?.en || 'News') : (isEvent ? (itemEvent?.title?.en || 'Event') : 'Details'),
        description: isNews ? 'News details' : 'Event details'
      }} />
      <HeaderV1 />
      <Breadcrumb pageTitle={isNews ? t('resources.newsDetails', 'News Details') : t('resources.eventDetails', 'Event Details')} breadcrumb={isNews ? 'news' : 'events'} pageName="/resources/news-events" />

      {isNews && <NewsDetails />}
      {isEvent && (
        <div className="event-details-wrapper">
          <EventDetailsContent />
        </div>
      )}

      <Footer />
    </>
  );
};

export default NewsEventDetails;
