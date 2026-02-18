/**
 * Image Alt Text utility for keyword-rich alt text
 * Loads alt text from JSON files based on current language
 */

import { getKeywordsByGroup } from './keywords';

/**
 * Generate alt text for images based on type and context
 * @param {string} type - Image type (program, cause, gallery, etc.)
 * @param {Object} context - Context data (program name, location, year, etc.)
 * @param {string} lang - Language code ('en', 'dr', 'ps')
 * @returns {Promise<string>} Generated alt text
 */
export const generateImageAltText = async (type, context = {}, lang = 'en') => {
    const { program, location, year = '2025', service } = context;
    
    try {
        switch (type) {
            case 'program':
                const programKeywords = await getKeywordsByGroup('programs', lang);
                return `${program || 'Program'} MMO ${location || 'Afghanistan'} ${year}`;
            
            case 'wash':
                return `WASH project MMO ${location || 'Afghanistan'} ${year}`;
            
            case 'education':
                return `Education program MMO ${location || 'Afghanistan'} ${year}`;
            
            case 'foodSecurity':
                return `Food security program MMO ${location || 'Afghanistan'} ${year}`;
            
            case 'cause':
                return `${service || 'Cause'} MMO ${location || 'Afghanistan'} ${year}`;
            
            case 'gallery':
                return `${program || 'MMO'} ${location || 'Afghanistan'} ${year}`;
            
            default:
                return `Mission Mind Organization ${program || ''} ${location || 'Afghanistan'} ${year}`;
        }
    } catch (error) {
        console.warn('Error generating alt text:', error);
        return `Mission Mind Organization image`;
    }
};

/**
 * Get alt text for common image types
 * @param {string} imageType - Type of image
 * @param {string} lang - Language code
 * @returns {string} Alt text
 */
export const getCommonAltText = (imageType, lang = 'en') => {
    const altTexts = {
        en: {
            logo: 'Mission Mind Organization MMO logo',
            footerLogo: 'Mission Mind Organization MMO footer logo',
            slider: 'Mission Mind Organization humanitarian work Afghanistan',
            cause: 'MMO cause program Afghanistan',
            gallery: 'MMO gallery image Afghanistan',
            event: 'MMO event Afghanistan',
            blog: 'MMO blog post image',
            team: 'MMO team member'
        },
        dr: {
            logo: 'لوگو سازمان ماموریت ذهن',
            footerLogo: 'لوگوی فوتر سازمان ماموریت ذهن',
            slider: 'کار بشردوستانه سازمان ماموریت ذهن افغانستان',
            cause: 'برنامه علت سازمان ماموریت ذهن افغانستان',
            gallery: 'تصویر گالری سازمان ماموریت ذهن افغانستان',
            event: 'رویداد سازمان ماموریت ذهن افغانستان',
            blog: 'تصویر پست وبلاگ سازمان ماموریت ذهن',
            team: 'عضو تیم سازمان ماموریت ذهن'
        },
        ps: {
            logo: 'د ذهن ماموریت سازمان لوگو',
            footerLogo: 'د ذهن ماموریت سازمان د فوتر لوگو',
            slider: 'د ذهن ماموریت سازمان د بشري کار افغانستان',
            cause: 'د ذهن ماموریت سازمان د علت پروګرام افغانستان',
            gallery: 'د ذهن ماموریت سازمان د ګالري انځور افغانستان',
            event: 'د ذهن ماموریت سازمان پیښه افغانستان',
            blog: 'د ذهن ماموریت سازمان د بلاګ پوست انځور',
            team: 'د ذهن ماموریت سازمان د ټیم غړی'
        }
    };
    
    return altTexts[lang]?.[imageType] || altTexts.en[imageType] || 'Mission Mind Organization image';
};




