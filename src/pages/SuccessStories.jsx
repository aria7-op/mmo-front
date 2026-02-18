import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import HeaderV1 from "../components/header/HeaderV1";
import Breadcrumb from "../components/breadcrumb/Breadcrumb";
import PageHero from "../components/common/PageHero";
import Footer from "../components/footer/Footer";
import SEOHead from "../components/seo/SEOHead";
import { useSuccessStories } from "../hooks/useSuccessStories";
import { formatMultilingualContent, getImageUrlFromObject, stripHtmlTags } from '../utils/apiUtils';
import NumberedPagination from "../components/others/NumberedPagination";
import { useTranslation } from "react-i18next";

const SuccessStories = () => {
  const { t, i18n } = useTranslation();
  const isRTL = ["dr", "ps"].includes(i18n.language);
  const [page, setPage] = useState(1);
  const limit = 4;

  const [search, setSearch] = useState('');
  const [recentOnly, setRecentOnly] = useState(false);

  const { successStories, pagination, loading, error } = useSuccessStories({
    status: "Published",
    page,
    limit,
    search: search || undefined,
    sort: recentOnly ? 'desc' : undefined,
  });

  // Derived client-side filtering and optional recent sort
  const filteredStories = useMemo(() => {
    const list = Array.isArray(successStories) ? [...successStories] : [];
    const lang = i18n.language;
    const q = (search || '').toLowerCase();
    const filtered = q
      ? list.E(s => {
          const title = formatMultilingualContent(s.title, lang) || '';
          const text = stripHtmlTags(formatMultilingualContent(s.story || s.content, lang)) || '';
          return title.toLowerCase().includes(q) || text.toLowerCase().includes(q);
        })
      : list;
    if (recentOnly) {
      filtered.sort((a,b) => {
        const ad = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const bd = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return bd - ad;
      });
    }
    return filtered;
  }, [successStories, search, recentOnly, i18n.language]);

  // Client-side pagination
  const paginatedStories = useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredStories.slice(startIndex, endIndex);
  }, [filteredStories, page, limit]);

  // Calculate total pages based on filtered stories
  const totalPages = Math.ceil(filteredStories.length / limit) || 1;

  if (error) {
    return (
      <>
        <SEOHead
          page="resources"
          customMeta={{
            title: "Success Stories - Mission Mind Organization",
            description:
              "Read inspiring success stories from Mission Mind Organization beneficiaries. MMO success stories from education, WASH, and other programs.",
          }}
        />
        <HeaderV1 />
        <PageHero pageName="/resources/success-stories" />
        <Breadcrumb pageTitle="Success Stories" breadcrumb={t('breadcrumb.successStories', 'success-stories')} />
        <div className="success-stories-page-sec pt-120 pb-100">
          <div className="container">
            <div className="alert alert-danger">
              Error loading success stories. Please try again later.
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div>
      <SEOHead
        page="resources"
        customMeta={{
          title: "Success Stories - Mission Mind Organization",
          description:
            "Read inspiring success stories from Mission Mind Organization beneficiaries. MMO success stories from education, WASH, and other programs.",
        }}
      />
      <HeaderV1 />
      <Breadcrumb
        pageTitle={t("successStories.pageTitle", "Success Stories")}
        breadcrumb={t("successStories.breadcrumb", "success-stories")}
        pageName="/resources/success-stories"
      />
      <div
        className="event-sidebar-sec pt-120 pb-120"
        style={{
          direction: isRTL ? "rtl" : "ltr",
          backgroundColor: "#fafbfc",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-12">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (paginatedStories.length > 0) ? (
                <div className="success-stories-list responsive-grid-ss" style={{ gap: "24px" }}>
                    {paginatedStories.map((story, idx) => {
                    const title = formatMultilingualContent(story.title, i18n.language);
                    const isFeatured = idx === 0;
                    return (
                      <div key={story._id || story.id} className={isFeatured ? 'featured-ss-card' : ''}>
                        {(() => {
                          const content = formatMultilingualContent(
                            story.story || story.content,
                            i18n.language
                          );
                          // Robust image resolution
                          let imageUrl = null;
                          if (
                            story.images &&
                            Array.isArray(story.images) &&
                            story.images.length > 0
                          ) {
                            imageUrl = getImageUrlFromObject(story.images[0]);
                          } else if (story.image) {
                            imageUrl = getImageUrlFromObject(story.image);
                          } else if (story.imageUrl) {
                            imageUrl = story.imageUrl;
                          }

                          return (
                      <article key={story._id || story.id} className="mb-4">
                        <div
                          className="card"
                          style={{
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                          }}
                        >
                          {imageUrl && (
                            <div
                              style={{
                                width: "100%",
                                height: "220px",
                                overflow: "hidden",
                              }}
                            >
                              <img
                                src={imageUrl}
                                alt={title}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  display: "block",
                                }}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                          )}
                          <div
                            className="card-body"
                            style={{ padding: "18px" }}
                          >
                            <h3
                              style={{
                                margin: 0,
                                fontSize: "20px",
                                color: "#213547",
                              }}
                            >
                              {title}
                            </h3>
                            {content && (
                              <p
                                style={{
                                  marginTop: "8px",
                                  color: "#556",
                                  lineHeight: 1.6,
                                  maxHeight: "120px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {stripHtmlTags(content)}
                              </p>
                            )}
                            <div className="mt-3">
                              <Link
                                to={`/resources/success-stories/${
                                  story.slug || story._id || story.id
                                }`}
                                className="btn btn-primary"
                                style={{
                                  background: "#2563eb",
                                  border: "none",
                                  padding: "8px 20px",
                                  borderRadius: "6px",
                                  color: "white",
                                  textDecoration: "none",
                                  fontWeight: "400",
                                  transition: "background-color 0.3s ease",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "#1d4ed8")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "#2563eb")
                                }
                              >
                                {t("common.readMore", "Read More")}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </article>
                          );
                        })()}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="alert alert-info mt-4">
                   {t("successStories.noStories", "No success stories found.")}
                 </div>
                )}
            </div>
            <div className="col-lg-4 col-12">
              <div
                className="sidebar"
                style={{
                  textAlign: isRTL ? "right" : "left",
                  padding: "20px",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <div className="mb-3">
                  <div
                    className="widget-title"
                    style={{ fontWeight: 700, marginBottom: "12px", color: "#213547", fontSize: "16px" }}
                  >
                    {t("common.search", "Search")}
                  </div>
                  <div className="widget-body">
                    <input
                         type="search"
                         className="form-control"
                         value={search}
                         onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                         placeholder={t(
                           "successStories.searchPlaceholder",
                           "Search success stories"
                         )}
                         style={{
                           direction: isRTL ? "rtl" : "ltr",
                           borderRadius: "6px",
                           border: "1px solid #d1d5db",
                           padding: "8px 12px",
                         }}
                         aria-label={t("successStories.searchPlaceholder", "Search success stories")}
                       />
                  </div>
                </div>
                <div className="mb-0">
                  <div
                    className="widget-title"
                    style={{ fontWeight: 700, marginBottom: "12px", color: "#213547", fontSize: "16px" }}
                  >
                    {t("common.filters", "Filters")}
                  </div>
                  <div className="widget-body" style={{ color: "#556" }}>
                    <div className="form-check" style={{ display: 'flex', alignItems: 'center', gap: "10px" }}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="recentOnly"
                        checked={recentOnly}
                        onChange={(e) => { setPage(1); setRecentOnly(e.target.checked); }}
                        style={{ cursor: 'pointer', margin: 0 }}
                      />
                      <label className="form-check-label" htmlFor="recentOnly" style={{ cursor: 'pointer', margin: 0 }}>
                         {t("successStories.filterRecent", "Recent")}
                       </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12">
              <NumberedPagination
                current={page}
                pages={totalPages}
                isRTL={isRTL}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                onChange={(p) => setPage(p)}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SuccessStories;
