import React from 'react'
import HelpV1Data from '../../jsonData/HelpV1Data.json'
import SingleHelpV1 from './SingleHelpV1';
import DonationBox from './DonationBox';
import { useTranslation } from 'react-i18next';
import { IMAGE_BASE_URL } from '../../config/api.config';

const HelpV1 = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

    return (
        <>
            <div
                className={`how-to-help-sec pt-120 pb-90 ${isRTL ? 'rtl-direction' : ''}`}
                style={{
                    direction: isRTL ? 'rtl' : 'ltr',
                    backgroundImage: `url("${IMAGE_BASE_URL}/background/how_to_help_bg.jpg")`
                }}
            >
                <div className="how-to-help-sec-overlay"></div>
                <div className="container position-relative">
                    <div className="row align-items-center">
                        <div className="col-lg-12 col-12">
                            <div className="donate-help-row d-flex flex-lg-row flex-column align-items-center gap-4">
                                <div className="donate-box-wrapper">
                                    <DonationBox />
                                </div>
                                <div className="help-content-wrapper flex-grow-1">
                                    <div className="sec-title">
                                        <h1>{t('homepage.howToHelp.title')}</h1>
                                        <div className="border-shape"></div>
                                    </div>
                                    <div className={`how-to-help-box ${isRTL ? 'rtl-direction' : ''}`}>
                                        {HelpV1Data.map(help =>
                                            <SingleHelpV1 help={help} key={help.id} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HelpV1;