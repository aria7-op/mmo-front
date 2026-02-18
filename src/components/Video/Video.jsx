import React, { useState } from 'react';
import ModalVideo from 'react-modal-video';
import { Link } from 'react-router-dom';

const Video = () => {
    const [isOpen, setOpen] = useState(false);
    const videoId = "YzDz8g1z83U";
    // Using hqdefault as it's more reliable than maxresdefault
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    return (
        <>
            <div className="vedio-sec" style={{
                backgroundImage: `url(${thumbnailUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                padding: '120px 0',
                minHeight: '400px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div className="vedio-sec-overlay" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(15, 104, 187, 0.7)',
                    zIndex: 1
                }}></div>
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <div className="vedio-button">
                                <ModalVideo channel='youtube' autoplay isOpen={isOpen} videoId={videoId} onClose={() => setOpen(false)} />
                                <Link className="mfp-iframe vedio-play" onClick={() => setOpen(true)} style={{
                                    width: '100px',
                                    height: '100px',
                                    lineHeight: '100px',
                                    textAlign: 'center',
                                    background: '#fff',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    color: '#0f68bb',
                                    fontSize: '30px',
                                    boxShadow: '0 0 0 15px rgba(255, 255, 255, 0.2)',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}>
                                    <i className="fa fa fa-play"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Video;