import React from 'react';

const socialIconStyle = {
    display: 'inline-flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: '26px', 
    height: '26px', 
    borderRadius: '50%', 
    color: '#fff', 
    fontSize: '12px', 
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    border: 'none',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    opacity: 0.9,
    flexShrink: 0
};

const handleMouseOver = (e) => {
    e.currentTarget.style.opacity = '1';
    e.currentTarget.style.transform = 'translateY(-1px)';
    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.15)';
};

const handleMouseOut = (e) => {
    e.currentTarget.style.opacity = '0.9';
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
};

const SocialShare = () => {
    return (
        <>
            <ul style={{ 
                display: 'flex', 
                gap: '6px', 
                margin: 0, 
                padding: 0, 
                listStyle: 'none',
                alignItems: 'center'
            }}>
                {/* Facebook */}
                <li><a href="https://www.facebook.com/share/1ATV8QX2td/" target='_blank' rel="noopener noreferrer" title="Facebook" style={{ 
                    ...socialIconStyle,
                    background: '#1877f2'
                }} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}><i className="fab fa-facebook-f" style={{ margin: 0 }}></i></a></li>
                
                {/* Instagram */}
                <li><a href="https://www.instagram.com/missionmindorg" target='_blank' rel="noopener noreferrer" title="Instagram" style={{ 
                    ...socialIconStyle,
                    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
                }} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}><i className="fab fa-instagram" style={{ margin: 0 }}></i></a></li>
                
                {/* X (Twitter) */}
                <li><a href="https://twitter.com/MissionMindOrg" target='_blank' rel="noopener noreferrer" title="X (Twitter)" style={{ 
                    ...socialIconStyle,
                    background: '#000000'
                }} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}><i className="fab fa-x-twitter" style={{ margin: 0 }}></i></a></li>
                
                {/* LinkedIn */}
                <li><a href="https://www.linkedin.com/company/mission-mind-organization" target='_blank' rel="noopener noreferrer" title="LinkedIn" style={{ 
                    ...socialIconStyle,
                    background: '#0077b5'
                }} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}><i className="fab fa-linkedin-in" style={{ margin: 0 }}></i></a></li>
            </ul>
        </>
    );
};

export default SocialShare;