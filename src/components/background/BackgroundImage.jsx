import { IMAGE_BASE_URL } from '../../config/api.config';

const BackgroundImage = () => {
    return (
        <>
            <div className="backgorund-image">
                <div className="backgorund-image-overlay"></div>
                <img className="img-fluid" src={`${IMAGE_BASE_URL}/background/background-img.jpg`} alt="backgroundThumb" />
            </div>
        </>
    );
};

export default BackgroundImage;