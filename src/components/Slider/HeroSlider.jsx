import React from 'react';
import SingleHeroSlider from './SingleHeroSlider';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Autoplay, Pagination } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import { usePageSettings } from '../../context/PageSettingsContext';
import { getImageUrlFromObject } from '../../utils/apiUtils';

const HeroSlider = () => {
    const { i18n, t } = useTranslation();
    const { pageSettings } = usePageSettings();

    const pickLang = (obj) => {
        if (!obj || typeof obj !== 'object') return '';
        const lang = i18n.language?.startsWith('dr') ? 'dr' : i18n.language?.startsWith('ps') ? 'ps' : 'en';
        if (lang === 'dr') return obj.dr || obj.per || obj.en || obj.ps || '';
        if (lang === 'ps') return obj.ps || obj.en || obj.per || '';
        return obj.en || obj.dr || obj.per || obj.ps || '';
    };

    const homeSettings = pageSettings?.home || pageSettings?.['/'];
    const dynamicSlides = Array.isArray(homeSettings?.heroImages) && homeSettings.heroImages.length
        ? homeSettings.heroImages
            .map((img, idx) => {
                // Handle both full URLs and relative paths
                let url;
                if (typeof img === 'string') {
                    url = getImageUrlFromObject(img);
                } else if (img?.url) {
                    // Always use getImageUrlFromObject to ensure proper URL construction
                    url = getImageUrlFromObject(img);
                } else {
                    url = getImageUrlFromObject(img);
                }
                
                const imgTitle = pickLang(img?.title);
                const imgDesc = pickLang(img?.description);
                const btn1Label = pickLang(img?.btn1?.label);
                const btn2Label = pickLang(img?.btn2?.label);
                const btn1Url = img?.btn1?.url || '';
                const btn2Url = img?.btn2?.url || '';
                return {
                    id: `home-${idx+1}`,
                    apiBased: true,
                    fullImageUrl: url,
                    subTitleOverride: imgDesc || pickLang(homeSettings?.description) || '',
                    titleOverride: imgTitle || pickLang(homeSettings?.title) || '',
                    btn1Override: btn1Label || '',
                    btn2Override: btn2Label || '',
                    btn1Url,
                    btn2Url,
                };
            })
            // Show slides if they have images (even without titles/descriptions)
            .filter(s => !!s.fullImageUrl)
        : null;

    // Use only dynamic slides from Page Settings
    const slides = dynamicSlides || [];

    return (
        <div className="slider">
            <div className="all-slide hero-slider">
                <Swiper
                    key={i18n.language} // Force re-render on language change
                    modules={[Keyboard, Autoplay, Pagination]}
                    spaceBetween={10}
                    slidesPerView={1}
                    pagination={{
                        clickable: true,
                    }}
                    autoplay={{
                        delay: 2500,
                        stopOnLastSlide: false,
                        disableOnInteraction: false,
                    }}
                    loop={slides.length > 1}
                    keyboard={{
                        enabled: true,
                    }}
                    dir={i18n.language === 'dr' || i18n.language === 'ps' ? 'rtl' : 'ltr'}
                >
                    {slides.map(slider => (
                        <SwiperSlide key={slider.id}>
                            <SingleHeroSlider slider={slider} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default HeroSlider;