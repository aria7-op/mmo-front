import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { usePrograms } from "../../hooks/usePrograms";
import {
  formatMultilingualContent,
  getImageUrlFromObject,
  getPlaceholderImage,
  truncateText,
} from "../../utils/apiUtils";
import { useNavigate } from "react-router-dom";
import { useSlug } from "../../hooks/useSlug";
import LoadingSpinner from "../common/LoadingSpinner";

const WhatWeDoContent = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "dr" || i18n.language === "ps";
  const { programs, loading, error } = usePrograms();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const programsPerPage = 8; // Show 8 programs per page

  // Filter programs for current page
  const indexOfLastProgram = currentPage * programsPerPage;
  const indexOfFirstProgram = indexOfLastProgram - programsPerPage;
  const currentPrograms = programs
    ? programs.slice(indexOfFirstProgram, indexOfLastProgram)
    : [];
  const totalPages = programs
    ? Math.ceil(programs.length / programsPerPage)
    : 0;

  // Reset to first page when programs change
  useEffect(() => {
    setCurrentPage(1);
  }, [programs]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 60,
          paddingBottom: 60,
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div
      className={`what-we-do-page-sec pt-120 pb-100 ${
        isRTL ? "rtl-direction" : ""
      }`}
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 20px" }}>
        <div style={{ marginBottom: 60 }}>
          <div style={{ marginBottom: 40 }}>
            <h1
              style={{
                margin: "0 0 16px 0",
                fontSize: 40,
                fontWeight: 700,
                color: "#213547",
              }}
            >
              {t("whatWeDo.pageTitle", "What We Do")}
            </h1>
            <p
              style={{
                color: "#6b7785",
                fontSize: 16,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {t(
                "whatWeDo.intro",
                "Mission Mind Organization implements comprehensive programs across Afghanistan."
              )}
            </p>
          </div>
        </div>

        {/* Programs Grid */}
        <div style={{ marginBottom: 80 }}>
          <h2
            style={{
              margin: "0 0 32px 0",
              fontSize: 32,
              fontWeight: 700,
              color: "#213547",
            }}
          >
            {t("programs.title", "Our Programs")}
          </h2>

          {programs && programs.length > 0 ? (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 28,
                }}
              >
                {currentPrograms.map((program) => {
                  const programName = formatMultilingualContent(
                    program.name,
                    i18n.language
                  );
                  const programDescription = formatMultilingualContent(
                    program.description,
                    i18n.language
                  );
                  const programSlug = useSlug(`${programName}-${program._id}`);
                  const heroImage =
                    getImageUrlFromObject(program.heroImage) ||
                    getPlaceholderImage(400, 250);

                  return (
                    <div
                      key={program._id}
                      onClick={() => navigate(`/programs/${programSlug}`)}
                      style={{
                        background: "#fff",
                        borderRadius: 12,
                        overflow: "hidden",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 32px rgba(0,0,0,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 6px 18px rgba(0,0,0,0.06)";
                      }}
                    >
                      {/* Hero Image */}
                      <div
                        style={{
                          height: 200,
                          overflow: "hidden",
                          background: "#f4f6f8",
                        }}
                      >
                        <img
                          src={heroImage}
                          alt={programName}
                          loading="lazy"
                          width="100%"
                          height="200"
                          onError={(e) =>
                            (e.target.src = getPlaceholderImage(400, 250))
                          }
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            transition: "transform 0.3s ease",
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div
                        style={{
                          padding: 20,
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <h3
                          style={{
                            margin: "0 0 12px 0",
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#213547",
                            lineHeight: 1.4,
                          }}
                        >
                          {programName}
                        </h3>
                        <p
                          style={{
                            color: "#6b7785",
                            fontSize: 14,
                            margin: "0 0 16px 0",
                            flex: 1,
                            lineHeight: 1.6,
                          }}
                        >
                          {truncateText(programDescription, 120)}
                        </p>

                        {/* Status Badge */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "auto",
                            paddingTop: 12,
                            borderTop: "1px solid #e0e0e0",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              background:
                                program.status === "active"
                                  ? "#e8f5e9"
                                  : "#f5f5f5",
                              color:
                                program.status === "active"
                                  ? "#2e7d32"
                                  : "#666",
                              padding: "4px 10px",
                              borderRadius: 20,
                              fontSize: 12,
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          >
                            {t(`programs.status.${program.status}`, program.status) || t('programs.status.undefined', 'Undefined')}
                          </span>
                          <i
                            className="fas fa-arrow-right"
                            style={{ color: "#0f68bb", fontSize: 16 }}
                          ></i>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 40,
                    gap: 10,
                  }}
                >
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 6,
                      border: "1px solid #ddd",
                      background: currentPage === 1 ? "#f5f5f5" : "#fff",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      color: currentPage === 1 ? "#999" : "#333",
                      fontWeight: 600,
                    }}
                  >
                    {t("common.previous", "Previous")}
                  </button>

                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 6,
                          border: "1px solid #ddd",
                          background:
                            currentPage === pageNumber ? "#0f68bb" : "#fff",
                          cursor: "pointer",
                          color: currentPage === pageNumber ? "#fff" : "#333",
                          fontWeight: 600,
                        }}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 6,
                      border: "1px solid #ddd",
                      background:
                        currentPage === totalPages ? "#f5f5f5" : "#fff",
                      cursor:
                        currentPage === totalPages ? "not-allowed" : "pointer",
                      color: currentPage === totalPages ? "#999" : "#333",
                      fontWeight: 600,
                    }}
                  >
                    {t("common.next", "Next")}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: 40 }}>
              <p style={{ color: "#999", fontSize: 16 }}>
                {t("programs.noProgramsFound", "No programs found")}
              </p>
            </div>
          )}
        </div>

        {/* Navigation to separate pages */}
        <div style={{ marginBottom: 80 }}>
          <h2
            style={{
              margin: "0 0 32px 0",
              fontSize: 32,
              fontWeight: 700,
              color: "#213547",
            }}
          >
            {t("whatWeDo.exploreMore", "Explore More")}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            <div
              onClick={() => navigate("/what-we-do/focus-areas")}
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 30,
                boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #e0e0e0",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 32px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.06)";
              }}
            >
              <h3
                style={{
                  margin: "0 0 16px 0",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#213547",
                }}
              >
                {t("whatWeDo.focusAreas.title", "Focus Areas")}
              </h3>
              <p
                style={{
                  color: "#6b7785",
                  fontSize: 16,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {t(
                  "whatWeDo.focusAreas.cardLead",
                  "Learn about our key focus areas including Education, WASH, Nutrition, Livelihood, GBV Protection, Food Security, and Agriculture."
                )}
              </p>
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  alignItems: "center",
                  color: "#0f68bb",
                  fontWeight: 600,
                }}
              >
                <span>{t("common.learnMore", "Learn more")}</span>
                <i className="fas fa-arrow-right" style={{ marginLeft: 8 }}></i>
              </div>
            </div>

            <div
              onClick={() => navigate("/what-we-do/geographic-coverage")}
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 30,
                boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #e0e0e0",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 32px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.06)";
              }}
            >
              <h3
                style={{
                  margin: "0 0 16px 0",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#213547",
                }}
              >
                {t("whatWeDo.geographicCoverage.title", "Geographic Coverage")}
              </h3>
              <p
                style={{
                  color: "#6b7785",
                  fontSize: 16,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {t(
                  "whatWeDo.geographicCoverage.cardLead",
                  "Discover the provinces across Afghanistan where we implement our humanitarian programs and initiatives."
                )}
              </p>
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  alignItems: "center",
                  color: "#0f68bb",
                  fontWeight: 600,
                }}
              >
                <span>{t("common.learnMore", "Learn more")}</span>
                <i className="fas fa-arrow-right" style={{ marginLeft: 8 }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatWeDoContent;
