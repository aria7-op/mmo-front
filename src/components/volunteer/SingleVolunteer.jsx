import React from "react";
import SocialShare from "../others/SocialShare";
import { useTranslation } from "react-i18next";
import {
  formatMultilingualContent,
  getImageUrlFromObject,
} from "../../utils/apiUtils";
import "./SingleVolunteer.css";

const SingleVolunteer = ({ team }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "dr" || i18n.language === "ps";

  const name = formatMultilingualContent(team.name);
  const designation = formatMultilingualContent(team.position);

  // Robust image resolution with multiple fallbacks
  let imageUrl =
    getImageUrlFromObject(team.photo) ||
    getImageUrlFromObject(team.image) ||
    getImageUrlFromObject(team.avatar) ||
    getImageUrlFromObject(team.imageUrl);

  // Create a simple SVG fallback to avoid network requests
  const createSvgFallback = () => {
    const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
                <rect width="400" height="500" fill="#f8f9fa"/>
                <circle cx="200" cy="150" r="60" fill="#e9ecef"/>
                <rect x="120" y="240" width="160" height="120" rx="8" fill="#e9ecef"/>
                <text x="200" y="420" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#6c757d">Volunteer</text>
            </svg>
        `;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  };

  // Initial fallback if nothing is returned from resolver
  if (!imageUrl) imageUrl = createSvgFallback();

  const handleImageError = (e) => {
    e.target.src = createSvgFallback();
  };

  return (
    <div className="premium-card">
      <div className="card-image-wrapper">
        <img
          src={imageUrl}
          alt={`${name} - ${designation}`}
          onError={handleImageError}
        />
      </div>
      <div className="card-body p-4 text-center">
         <h4>{name}</h4>
         <p>{designation}</p>

         <div className="volunteer-social">
           <a href="#" title="Facebook">
             <i className="fab fa-facebook-f"></i>
           </a>
           <a href="#" title="Twitter">
             <i className="fab fa-twitter"></i>
           </a>
           <a href="#" title="LinkedIn">
             <i className="fab fa-linkedin-in"></i>
           </a>
         </div>
       </div>
    </div>
  );
};

export default SingleVolunteer;
