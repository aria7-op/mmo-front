import React from "react";
import { useParams } from "react-router-dom";
import { useGallery } from "../hooks/useGallery";
import HeaderV1 from "../components/header/HeaderV1";
import Footer from "../components/footer/Footer";
import SEOHead from "../components/seo/SEOHead";
import { formatMultilingualContent } from "../utils/apiUtils";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getImageUrlFromObject } from "../utils/apiUtils";
import { useSlug } from "../hooks/useSlug";

const GalleryDetail = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();

  // In a real implementation, you would fetch the specific gallery item by slug
  // For now, we'll simulate this with a placeholder
  const { galleryItems, loading, error } = useGallery({
    status: "published",
    limit: 100,
  });

  // Find the gallery item by matching the slug with the title
  // In a real implementation, you would have a proper slug field in your data
  const galleryItem = galleryItems?.find((item) => {
    const title = formatMultilingualContent(item.title, i18n.language);
    // Generate slug from title and ID for consistency with other components
    const itemSlug = useSlug(`${title}-${item._id}`);
    return itemSlug === slug;
  });

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !galleryItem) {
    return (
      <div>
        <HeaderV1 />
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              backgroundColor: "#fff",
              padding: "40px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h2>{t("gallery.itemNotFound", "Gallery item not found")}</h2>
            <p>
              {t(
                "gallery.itemNotFoundMessage",
                "Sorry, the gallery item you are looking for could not be found."
              )}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Get content in current language
  const title = formatMultilingualContent(galleryItem.title, i18n.language);
  const description = formatMultilingualContent(
    galleryItem.description,
    i18n.language
  );
  const category = formatMultilingualContent(
    galleryItem.category,
    i18n.language
  );

  // Get image URL
  let imageUrl;
  let imageObject = galleryItem.image;
  if (
    !imageObject &&
    galleryItem.images &&
    Array.isArray(galleryItem.images) &&
    galleryItem.images.length > 0
  ) {
    imageObject = galleryItem.images[0];
  }

  if (imageObject) {
    imageUrl = getImageUrlFromObject(imageObject);
  }

  return (
    <>
      <SEOHead
        page="gallery-detail"
        customMeta={{
          title: `${title} - Gallery | Mission Mind Organization`,
          description: description || `View details of ${title} in our gallery`,
          keywords: `gallery, ${category || "image"}, ${title}`,
        }}
      />
      <HeaderV1 />

      <div
        style={{
          paddingTop: "100px",
          paddingBottom: "80px",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div className="container">
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
              overflow: "hidden",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            {/* Back button */}
            <div style={{ padding: "20px 30px 0" }}>
              <button
                onClick={() => window.history.back()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "none",
                  border: "none",
                  color: "#0f68bb",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                  padding: "8px 0",
                }}
              >
                <i className="fas fa-arrow-left"></i>
                {t("gallery.backToGallery", "Back to Gallery")}
              </button>
            </div>

            {/* Gallery item content */}
            <div style={{ padding: "20px 30px 40px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "30px",
                }}
              >
                {/* Image section */}
                <div>
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={title}
                      style={{
                        width: "100%",
                        maxHeight: "600px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                </div>

                {/* Content section */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <div>
                      <h1
                        style={{
                          fontSize: "32px",
                          fontWeight: "700",
                          color: "#2c3e50",
                          margin: "0 0 10px 0",
                        }}
                      >
                        {title}
                      </h1>

                      {category && (
                        <span
                          style={{
                            display: "inline-block",
                            backgroundColor: "#0f68bb",
                            color: "#fff",
                            padding: "6px 16px",
                            borderRadius: "20px",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          {category}
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <button
                        style={{
                          backgroundColor: "#e9ecef",
                          border: "none",
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <i className="fas fa-share-alt"></i>
                      </button>

                      <button
                        style={{
                          backgroundColor: "#e9ecef",
                          border: "none",
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <i className="fas fa-heart"></i>
                      </button>
                    </div>
                  </div>

                  {description && (
                    <div
                      style={{
                        fontSize: "18px",
                        lineHeight: "1.6",
                        color: "#555",
                      }}
                    >
                      {description}
                    </div>
                  )}

                  <div
                    style={{
                      marginTop: "30px",
                      paddingTop: "20px",
                      borderTop: "1px solid #eee",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "15px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#777",
                      }}
                    >
                      <i className="far fa-calendar"></i>{" "}
                      {new Date(galleryItem.createdAt).toLocaleDateString()}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          color: "#777",
                        }}
                      >
                        <i className="far fa-eye"></i>
                        <span>{galleryItem.views || 0}</span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          color: "#777",
                        }}
                      >
                        <i className="far fa-heart"></i>
                        <span>{galleryItem.likes || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default GalleryDetail;
