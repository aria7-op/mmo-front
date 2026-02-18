import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getImageUrlFromObject,
  formatMultilingualContent,
  getPlaceholderImage,
} from "../../utils/apiUtils";
import { useTranslation } from "react-i18next";
import { useSlug } from "../../hooks/useSlug";
import {
  incrementGalleryViews,
  incrementGalleryLikes,
  incrementGalleryShares,
} from "../../services/gallery.service";

/**
 * Reusable FirstPostCard component
 * Displays a large featured gallery item suitable for placing above the grid.
 *
 * Props:
 * - gallery: gallery item object from API
 */
const FirstPostCard = ({ gallery }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "dr" || i18n.language === "ps";
  const [viewsCount, setViewsCount] = useState(gallery?.views || 0);
  const [likesCount, setLikesCount] = useState(gallery?.likes || 0);
  const [sharesCount, setSharesCount] = useState(gallery?.shares || 0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!gallery) return;
    setViewsCount(gallery.views || 0);
    setLikesCount(gallery.likes || 0);
    setSharesCount(gallery.shares || 0);

    try {
      const raw = window.localStorage.getItem("mmo_likes") || "{}";
      const likesMap = JSON.parse(raw);
      setIsLiked(Boolean(likesMap[gallery._id]));
    } catch (err) {
      // ignore
    }
  }, [gallery]);

  if (!gallery) return null;

  // Resolve image
  let imageUrl = null;
  if (gallery.image) {
    imageUrl = getImageUrlFromObject(gallery.image);
  } else if (
    gallery.images &&
    Array.isArray(gallery.images) &&
    gallery.images.length > 0
  ) {
    imageUrl = getImageUrlFromObject(gallery.images[0]);
  }

  const title = formatMultilingualContent(gallery.title, i18n.language);
  const description = formatMultilingualContent(
    gallery.description,
    i18n.language
  );
  const category = formatMultilingualContent(gallery.category, i18n.language);
  const slug = useSlug(`${title}-${gallery._id}`);

  const handleView = () => {
    setViewsCount((v) => v + 1);
    if (gallery._id) incrementGalleryViews(gallery._id).catch(() => {});
    navigate(`/gallery/${slug}`);
  };

  const handleLike = () => {
    if (isLiked) return;
    setLikesCount((l) => l + 1);
    setIsLiked(true);
    try {
      const raw = window.localStorage.getItem("mmo_likes") || "{}";
      const likesMap = JSON.parse(raw);
      likesMap[gallery._id] = true;
      window.localStorage.setItem("mmo_likes", JSON.stringify(likesMap));
    } catch (err) {}
    if (gallery._id) incrementGalleryLikes(gallery._id).catch(() => {});
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/gallery/${slug}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: description || "",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch (err) {
      // ignore
    } finally {
      setSharesCount((s) => s + 1);
      if (gallery._id) incrementGalleryShares(gallery._id).catch(() => {});
    }
  };

  return (
    <div
      className="first-post-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
        marginBottom: "30px",
        alignItems: "stretch",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <div
        className="first-post-image"
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          backgroundColor: "#fff",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={handleView}
      >
        <img
          src={imageUrl || getPlaceholderImage(800, 450)}
          alt={title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = getPlaceholderImage(800, 450);
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              marginBottom: "12px",
              flexDirection: isRTL ? "row-reverse" : "row",
            }}
          >
            {category && (
              <span
                style={{
                  backgroundColor: "#0f68bb",
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontWeight: 500,
                }}
              >
                {category}
              </span>
            )}
          </div>
          <h2
            className="first-post-title"
            style={{
              margin: "0 0 12px 0",
              fontSize: "28px",
              color: "#213547",
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {title}
          </h2>
          {description && (
            <p
              className="first-post-desc"
              style={{
                color: "#556",
                lineHeight: 1.6,
                fontSize: "16px",
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Enhanced stats & actions row placed before the View button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "18px",
            flexDirection: isRTL ? "row-reverse" : "row",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "18px",
              alignItems: "center",
              flexDirection: isRTL ? "row-reverse" : "row",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                color: "#666",
                flexDirection: isRTL ? "row-reverse" : "row",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 10px",
                  background: "#f7f9fb",
                  borderRadius: "999px",
                  flexDirection: isRTL ? "row-reverse" : "row",
                }}
              >
                <i className="far fa-eye" style={{ color: "#6c757d" }}></i>
                <span style={{ color: "#495057", fontWeight: 500 }}>
                  {viewsCount}
                </span>
              </div>

              <button
                onClick={handleLike}
                aria-pressed={isLiked}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 10px",
                  borderRadius: "999px",
                  border: "1px solid " + (isLiked ? "#1877f2" : "#e9ecef"),
                  background: isLiked ? "#e8f0fe" : "#fff",
                  color: isLiked ? "#1877f2" : "#495057",
                  cursor: isLiked ? "default" : "pointer",
                  fontWeight: 500,
                  flexDirection: isRTL ? "row-reverse" : "row",
                }}
              >
                <i
                  className="fas fa-thumbs-up"
                  style={{ color: isLiked ? "#1877f2" : "#6c757d" }}
                ></i>
                <span>{likesCount}</span>
              </button>

              <button
                onClick={handleShare}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 10px",
                  borderRadius: "999px",
                  border: "1px solid #e9ecef",
                  background: "#fff",
                  color: "#495057",
                  cursor: "pointer",
                  fontWeight: 500,
                  flexDirection: isRTL ? "row-reverse" : "row",
                }}
              >
                <i
                  className="fas fa-share-alt"
                  style={{ color: "#6c757d" }}
                ></i>
                <span>{sharesCount}</span>
              </button>
            </div>
          </div>

          <div
            style={{
              marginLeft: isRTL ? "0" : "auto",
              marginRight: isRTL ? "auto" : "0",
            }}
          >
            <button
              className="first-post-btn"
              onClick={handleView}
              style={{
                backgroundColor: "#0f68bb",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 6px 12px rgba(15,104,187,0.12)",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              {t("gallery.view", "View")}
            </button>
          </div>
        </div>
      </div>
      <style>{`
              @media (max-width: 768px) {
                .first-post-title { font-size: 22px !important; }
                .first-post-desc { font-size: 14px !important; }
                .first-post-btn { padding: 8px 16px !important; font-size: 13px !important; }
                .first-post-image { aspect-ratio: 4 / 3 !important; }
              }
              @media (max-width: 576px) {
                .first-post-title { font-size: 20px !important; }
                .first-post-desc { font-size: 13px !important; }
                .first-post-btn { padding: 8px 14px !important; font-size: 12px !important; }
                /* Give more height to the image on small screens */
                .first-post-image { aspect-ratio: 4 / 5 !important; }
              }

              @media (max-width: 992px) {
                .first-post-grid { grid-template-columns: 1fr; }
              }
            `}</style>
    </div>
  );
};

export default FirstPostCard;
