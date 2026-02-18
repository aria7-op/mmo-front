import React, { useMemo } from 'react';
import SingleCounter from './SingleCounter';
import { useTranslation } from 'react-i18next';
import { useStatistics } from '../../hooks/useStatistics';
import LoadingSpinner from '../common/LoadingSpinner';
import CounterV1Data from '../../jsonData/CounterV1Data.json'; // Fallback data

const Counter = () => {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const { statistics, loading, error } = useStatistics();

    // Map statistics API data to counter format
    const counterData = useMemo(() => {
        if (statistics) {
            return [
                {
                    id: 1,
                    icon: 'c_i_1.png',
                    end: statistics.totalDonor || statistics.totalDonations || 0,
                    info: 'TOTAL DONOR',
                },
                {
                    id: 2,
                    icon: 'c_i_2.png',
                    end: statistics.totalVolunteers || 0,
                    info: 'VOLUNTEER',
                },
                {
                    id: 3,
                    icon: 'c_i_3.png',
                    end: statistics.totalDonations || statistics.totalDonor || 0,
                    info: 'DONATION',
                },
                {
                    id: 4,
                    icon: 'c_i_4.png',
                    end: statistics.totalBeneficiaries || 0,
                    info: 'BENEFICIARIES',
                },
            ];
        }
        // Fallback to static data if API fails
        return CounterV1Data;
    }, [statistics]);

    if (loading && !statistics) {
        return (
            <div className={`count-up-sec ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div className="count-up-sec-overlay"></div>
                <div className="container">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={`count-up-sec ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div className="count-up-sec-overlay"></div>
                <div className="container">
                    <div className="row">
                        {counterData.map(counter =>
                            <div className="col-md-3 col-sm-6 col-xs-6 inner" key={counter.id}>
                                <SingleCounter counter={counter} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Counter;