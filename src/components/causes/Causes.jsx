import React from 'react';
import CausesV1Data from '../../jsonData/CausesV1Data.json';
import SingleCauses from './SingleCauses';
import { useTranslation } from 'react-i18next';

const Causes = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    
    return (
        <>
            <div className={`recent-causes-sec pt-120 pb-90 ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className={`sec-title ${isRTL ? 'rtl-direction' : ''}`}>
                                <h1>{t('homepage.recentCauses.title')}</h1>
                                <div className="border-shape"></div>
                                <p>{t('homepage.recentCauses.description')} <span>{t('homepage.recentCauses.joinUs')}</span></p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {CausesV1Data.slice(0, 3).map(cause =>
                            <div className="col-lg-4 col-md-6 col-sm-12" key={cause.id}>
                                <SingleCauses cause={cause} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Causes;