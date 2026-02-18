import React, { useEffect, useRef, useState } from 'react';
import Isotope from 'isotope-layout';
import SingleBlogV1 from './SingleBlogV1';
import imagesLoaded from 'imagesloaded';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useNews } from '../../hooks/useNews';

const BlogV1 = () => {
	const { t, i18n } = useTranslation();
	const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
	const galleryRef = useRef(null);
	const [filter, setFilter] = useState("*");

	// Fetch dynamic news data
	const { news, loading, error } = useNews({ limit: 4, status: 'Published' });
	const isotope = useRef(null);

	useEffect(() => {
		if (!galleryRef.current || news.length === 0) return;

		// Initialize Isotope
		isotope.current = new Isotope(galleryRef.current, {
			itemSelector: '.blog-gallery-item',
			layoutMode: 'masonry',
			filter: filter,
			transitionDuration: '0.5s',
		});

		const handleImagesLoaded = () => {
			if (isotope.current) {
				isotope.current.layout();
			}
		};

		imagesLoaded(galleryRef.current).on('progress', handleImagesLoaded);

		return () => {
			if (isotope.current) {
				isotope.current.destroy();
			}
		};
	}, [news, i18n.language]);

	// Handle filter application
	useEffect(() => {
		if (isotope.current) {
			isotope.current.arrange({ filter: filter });
		}
	}, [filter]);

	const handleFilterChange = (newFilter) => {
		setFilter(newFilter);
	};

	if (loading && news.length === 0) {
		return (
			<div className="text-center py-5">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className={`home-blog-sec pt-120 pb-120 ${isRTL ? 'rtl-direction' : ''}`} style={{
				direction: isRTL ? 'rtl' : 'ltr',
				background: '#fcfdfe',
				position: 'relative',
				overflow: 'hidden'
			}}>
				{/* Decorative Background */}
				<div style={{
					position: 'absolute',
					bottom: '-5%',
					right: '-2%',
					width: '25%',
					height: '35%',
					background: 'radial-gradient(circle, rgba(15, 104, 187, 0.03) 0%, transparent 70%)',
					zIndex: 0
				}}></div>

				<div className="container" style={{ position: 'relative', zIndex: 1 }}>
					<div className="row justify-content-center">
						<div className="col-lg-8">
							<div className={`sec-title text-center mb-60 ${isRTL ? 'rtl-direction' : ''}`}>
								<h6 style={{ color: '#0f68bb', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', marginBottom: '15px' }}>
									{t('homepage.blog.subtitle', { defaultValue: 'Our News' })}
								</h6>
								<h1 style={{ fontSize: '42px', fontWeight: '800', color: '#292929' }}>{t('homepage.blog.title')}</h1>
								<div className="border-shape mx-auto" style={{ width: '80px', height: '4px', background: '#0f68bb', marginTop: '20px' }}></div>
								<p className="mt-4" style={{ fontSize: '18px', color: '#666', lineHeight: '1.6' }}>
									{t('homepage.blog.description')} <span>{t('homepage.blog.impact')}</span>
								</p>
							</div>
						</div>
					</div>

					<div className="row">
						<div className="col-md-12">
							<ul className={`blog-grid-filter mb-50 d-flex justify-content-center flex-wrap gap-3 ${isRTL ? 'rtl-direction' : ''}`}
								style={{ direction: isRTL ? 'rtl' : 'ltr', listStyle: 'none', padding: 0 }}>
								{[
									{ id: '*', label: t('homepage.blog.filters.all') },
									{ id: '.Events, .Workshops', label: t('homepage.blog.filters.topNews') },
									{ id: '.News, .Update', label: t('homepage.blog.filters.latestNews') },
									{ id: '.Success-Stories', label: t('homepage.blog.filters.eventNews') },
									{ id: '.Others', label: t('homepage.blog.filters.others') }
								].map(item => (
									<li key={item.id}
										className={filter === item.id ? 'active' : ''}
										onClick={() => handleFilterChange(item.id)}
										style={{
											padding: '10px 25px',
											borderRadius: '30px',
											cursor: 'pointer',
											fontSize: '15px',
											fontWeight: '600',
											transition: 'all 0.3s ease',
											background: filter === item.id ? '#0f68bb' : '#fff',
											color: filter === item.id ? '#fff' : '#666',
											boxShadow: filter === item.id ? '0 5px 15px rgba(15, 104, 187, 0.2)' : '0 2px 5px rgba(0,0,0,0.05)',
											border: '1px solid' + (filter === item.id ? '#0f68bb' : '#eee')
										}}>
										{item.label}
									</li>
								))}
							</ul>

							<div className="blog-grid">
								<div className="row g-4" ref={galleryRef}>
									{news.map(blog =>
										<div className={`col-lg-3 col-md-6 blog-gallery-item ${blog.category?.en || 'Others'}`} key={blog._id}>
											<SingleBlogV1 blog={blog} />
										</div>
									)}
								</div>
							</div>

							<div className="text-center mt-5">
								<Link to="/blog" className="btn btn-outline-primary" style={{
									borderColor: '#0f68bb',
									color: '#0f68bb',
									padding: '14px 40px',
									borderRadius: '50px',
									fontWeight: '600',
									transition: 'all 0.3s'
								}}
									onMouseEnter={(e) => {
										e.currentTarget.style.background = '#0f68bb';
										e.currentTarget.style.color = '#fff';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.background = 'transparent';
										e.currentTarget.style.color = '#0f68bb';
									}}>
									{t('homepage.blog.viewAll', { defaultValue: 'View All News' })}
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default BlogV1;