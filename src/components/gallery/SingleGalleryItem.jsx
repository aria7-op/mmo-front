import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Item } from "react-photoswipe-gallery";
import { getImageUrlFromObject } from "../../utils/apiUtils";
import { useTranslation } from "react-i18next";
import { formatMultilingualContent } from "../../utils/apiUtils";
import { useSlug } from "../../hooks/useSlug";
import { LazyImage } from "../../hooks/useLazyImage.jsx";

const SingleGalleryItem = ({ gallery, onOpenModal }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "dr" || i18n.language === "ps";
  const [isHovered, setIsHovered] = useState(false);

  // Handle both old static data format and new API format
  let imageUrl;
  let originalUrl;

  if (gallery.thumb) {
    // Old static data format
    imageUrl = `/img/gallery/${gallery.thumb}`;
    originalUrl = `/img/gallery/${gallery.thumb}`;
  } else {
    // New API format - get image from item.image or item.images array
    let imageObject = gallery.image;
    if (
      !imageObject &&
      gallery.images &&
      Array.isArray(gallery.images) &&
      gallery.images.length > 0
    ) {
      imageObject = gallery.images[0]; // Use first image from array
    }

    if (imageObject) {
      imageUrl = getImageUrlFromObject(imageObject);
      originalUrl = getImageUrlFromObject(imageObject);
    } else {
      // Fallback if no image
      return null;
    }
  }

  if (!imageUrl) {
    return null;
  }

  // Get multilingual content
  const title = formatMultilingualContent(gallery.title, i18n.language);
  const description = formatMultilingualContent(
    gallery.description,
    i18n.language
  );
  const category = formatMultilingualContent(gallery.category, i18n.language);

  // Generate slug from title and ID using the reusable hook
  const slug = useSlug(`${title}-${gallery._id}`);

  // Handle view button click
  const handleViewClick = (e) => {
    e.stopPropagation();
    console.log("View button clicked, opening modal with item:", gallery);
    // Open modal with this gallery item
    if (onOpenModal) {
      onOpenModal(gallery);
    }
  };

  // Handle card click (opens modal instead of navigating)
  const handleCardClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Card clicked, opening modal with item:", gallery);
    if (onOpenModal) {
      onOpenModal(gallery);
    }
  };

  return (
    <>
      <div
        className="gallery-item"
        style={{
          height: "300px",
          overflow: "hidden",
          position: "relative",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          cursor: "pointer",
        }}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Item
          original={originalUrl}
          thumbnail={imageUrl}
          width="428"
          height="375"
        >
          {({ ref, open }) => (
            <>
              <LazyImage
                ref={ref}
                src={imageUrl}
                alt={title || "Gallery image"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.3s ease",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log(
                    "Image clicked, opening modal with item:",
                    gallery
                  );
                  if (onOpenModal) {
                    onOpenModal(gallery);
                  }
                }}
              />

              {/* Hover overlay with blurred background */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backdropFilter: "blur(5px)",
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "20px",
                  textAlign: isRTL ? "right" : "center",
                  color: "white",
                  transition: "opacity 0.3s ease",
                  opacity: isHovered ? 1 : 0,
                  zIndex: 10,
                  pointerEvents: isHovered ? "auto" : "none",
                  direction: isRTL ? "rtl" : "ltr",
                }}
              >
                <div
                  style={{
                    transform: isHovered ? "translateY(0)" : "translateY(20px)",
                    transition: "transform 0.3s ease",
                    transitionDelay: isHovered ? "0.1s" : "0s",
                    opacity: isHovered ? 1 : 0,
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                      lineHeight: "1.3",
                    }}
                  >
                    {title}
                  </h3>

                  {category && (
                    <span
                      style={{
                        fontSize: "12px",
                        backgroundColor: "#0f68bb",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        marginBottom: "10px",
                        display: "inline-block",
                      }}
                    >
                      {category}
                    </span>
                  )}

                  {description && (
                    <p
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.4",
                        maxHeight: "80px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginBottom: "15px",
                      }}
                    >
                      {description}
                    </p>
                  )}

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={handleViewClick}
                      style={{
                        backgroundColor: "#0f68bb",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "500",
                        fontSize: "14px",
                        transition: "background-color 0.3s",
                        transform: isHovered
                          ? "translateY(0)"
                          : "translateY(20px)",
                        transitionDelay: isHovered ? "0.2s" : "0s",
                        opacity: isHovered ? 1 : 0,
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#0d5ba0")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#0f68bb")
                      }
                    >
                      {t("gallery.view", "View")}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/gallery/${slug}`);
                      }}
                      style={{
                        backgroundColor: "transparent",
                        color: "#fff",
                        border: "1px solid #fff",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "500",
                        fontSize: "14px",
                        transition: "background-color 0.3s, color 0.3s",
                        transform: isHovered
                          ? "translateY(0)"
                          : "translateY(20px)",
                        transitionDelay: isHovered ? "0.25s" : "0s",
                        opacity: isHovered ? 1 : 0,
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#fff";
                        e.target.style.color = "#0f68bb";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.color = "#fff";
                      }}
                    >
                      {t("common.readMore", "Read More")}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </Item>
      </div>
    </>
  );
};

export default SingleGalleryItem;
