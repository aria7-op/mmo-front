import { IMAGE_BASE_URL } from '../../config/api.config';

const WaterWidget = () => {
    return (
        <>
            <div className="support-widget">
                <img src={`${IMAGE_BASE_URL}/causes/clean-water.jpg`} alt="causes" />
                <div className="support-widget-overlay">
                    <div className="support-widget-wrapper">
                        <div className="support-widget-text">
                            <h2>help for provide clean water</h2>
                            <span>need:</span>
                            <span>$65000</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WaterWidget;