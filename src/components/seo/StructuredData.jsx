import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Structured Data component for JSON-LD schema markup
 */

const StructuredData = ({ type, data }) => {
  const generateSchema = () => {
    switch (type) {
      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: data.name || '',
          alternateName: 'MMO',
          url: data.url || 'https://mmo.arg.af',
          logo: data.logo || 'https://mmo.arg.af/img/logo/logo.png',
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: data.phone || '+93-77-975-2121',
            contactType: 'Customer Service',
            email: data.email || 'info.missionmind@gmail.com',
            areaServed: 'AF',
            availableLanguage: ['en', 'dr', 'ps']
          },
          address: {
            '@type': 'PostalAddress',
            streetAddress: data.address?.street || '15th House, 4th St, Qalai Fatullah',
            addressLocality: 'Kabul',
            addressCountry: 'AF'
          },
          sameAs: data.socialMedia || [
            'https://www.facebook.com/MissionMindOrg',
            'https://wa.me/93779752121'
          ]
        };

      case 'Event':
        return {
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: data.name,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          location: {
            '@type': data.location?.type || 'Place',
            name: data.location?.name,
            address: {
              '@type': 'PostalAddress',
              addressLocality: data.location?.address?.locality || 'Kabul',
              addressCountry: 'AF'
            }
          },
          organizer: {
            '@type': 'Organization',
            name: 'Mission Mind Organization',
            url: 'https://mmo.arg.af'
          }
        };

      case 'JobPosting':
        return {
          '@context': 'https://schema.org',
          '@type': 'JobPosting',
          title: data.title,
          description: data.description,
          datePosted: data.datePosted,
          validThrough: data.validThrough,
          employmentType: data.employmentType || 'FULL_TIME',
          hiringOrganization: {
            '@type': 'Organization',
            name: 'Mission Mind Organization',
            sameAs: 'https://mmo.arg.af'
          },
          jobLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              addressLocality: data.location || 'Kabul',
              addressCountry: 'AF'
            }
          }
        };

      case 'Article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.headline,
          description: data.description,
          image: data.image,
          datePublished: data.datePublished,
          dateModified: data.dateModified,
          author: {
            '@type': 'Organization',
            name: 'Mission Mind Organization'
          },
          publisher: {
            '@type': 'Organization',
            name: 'Mission Mind Organization',
            logo: {
              '@type': 'ImageObject',
              url: 'https://mmo.arg.af/img/logo/logo.png'
            }
          }
        };

      case 'Publication':
        return {
          '@context': 'https://schema.org',
          '@type': 'PublicationVolume',
          name: data.name,
          description: data.description,
          datePublished: data.datePublished,
          publisher: {
            '@type': 'Organization',
            name: 'Mission Mind Organization',
            url: 'https://mmo.arg.af'
          },
          isPartOf: {
            '@type': 'Periodical',
            name: data.periodical || 'MMO Annual Report'
          }
        };

      default:
        return null;
    }
  };

  const schema = generateSchema();

  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default StructuredData;

