import React from "react";
import { useNavigate } from "react-router-dom";
import {
  getImageUrlFromObject,
  formatMultilingualContent,
  getPlaceholderImage,
} from "../../utils/apiUtils";
import { useSlug } from "../../hooks/useSlug";
import { useTranslation } from "react-i18next";

const EventCard = ({ event, onNavigate }) => {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === "dr" || i18n.language === "ps";
  const navigate = useNavigate();
  const title = formatMultilingualContent(event.title);
  const slug = useSlug(`${title}-${event._id}`);
  const date = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString()
    : "";
  const location = formatMultilingualContent(event.location || {});
  const imageUrl = getImageUrlFromObject(event.image);

  return (
    <article
      onClick={() =>
        onNavigate ? onNavigate(slug) : navigate(`/events/${slug}`)
      }
      style={{
        display: "flex",
        gap: 12,
        background: "#fff",
        padding: 12,
        borderRadius: 10,
        boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          flex: "0 0 84px",
          height: 64,
          overflow: "hidden",
          borderRadius: 8,
          background: "#f4f6f8",
        }}
      >
        <img
          src={imageUrl || getPlaceholderImage(160, 120)}
          alt={title}
          loading="lazy"
          width="84"
          height="64"
          onError={(e) => {
            e.currentTarget.src = getPlaceholderImage(160, 120);
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      <div style={{ flex: 1 }}>
        <h5
          style={{
            margin: 0,
            fontSize: 15,
            color: "#213547",
            lineHeight: 1.25,
          }}
        >
          {title}
        </h5>
        <div
          style={{
            marginTop: 6,
            display: "flex",
            gap: 8,
            alignItems: "center",
            color: "#777",
            fontSize: 13,
          }}
        >
          <span>{date}</span>
          {location && <span style={{ opacity: 0.8 }}>• {location}</span>}
        </div>
      </div>

      <div style={{ flex: "0 0 auto", marginLeft: "8px" }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate ? onNavigate(slug) : navigate(`/events/${slug}`);
          }}
          aria-label={t("common.readMore", "Read More")}
          title={t("common.readMore", "Read More")}
          style={{
            background: "#0f68bb",
            color: "#fff",
            border: "none",
            padding: "8px 12px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
            boxShadow: "0 6px 12px rgba(15,104,187,0.12)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i
            className={isRTL ? "fas fa-arrow-left" : "fas fa-arrow-right"}
            style={{ fontSize: 14 }}
          ></i>
        </button>
      </div>
    </article>
  );
};

export default EventCard;
