import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { usePrograms } from "../../hooks/usePrograms";
import { formatMultilingualContent, getImageUrlFromObject, getPlaceholderImage, stripHtmlTags } from "../../utils/apiUtils";
import { useNavigate, useLocation } from "react-router-dom";
import programTypes from "../../config/programTypes";
import LoadingSpinner from "../common/LoadingSpinner";

const ProgramListing = ({ programType, showHeader = true }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isRTL = i18n.language === "dr" || i18n.language === "ps";
  const { programs, loading, error } = usePrograms();

  // simple slugify utility (avoid calling hooks inside loops)
  const slugify = (text) => {
    if (!text) return "";
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^a-z0-9\-]/g, "") // Remove invalid chars
      .replace(/-+/g, "-") // Collapse dashes
      .replace(/^-+|-+$/g, ""); // Trim dashes
  };

  // Filter programs by type. Prefer explicit `program.slug` if provided by API,
  // otherwise compare slugified `program.name` or check keywords from `programTypes`.
  const filteredPrograms = programs
    ? programs.filter((program) => {
        // Robust multilingual pick with fallbacks (dr may be 'per')
        const pickText = (obj) => {
          // prefer i18n.language
          const lang = i18n.language;
          const viaFormat = formatMultilingualContent(obj, lang);
          if (viaFormat) return viaFormat;
          if (obj && typeof obj === "object") {
            return (
              obj[lang] ||
              obj.per ||
              obj.ps ||
              obj.en ||
              Object.values(obj).find((v) => typeof v === "string") ||
              ""
            );
          }
          return obj || "";
        };

        const programName = pickText(program.name).trim();
        const programDesc = pickText(program.description).trim();
        const nameLower = programName.toLowerCase();
        const descLower = programDesc.toLowerCase();
        const enName = formatMultilingualContent(program.name, "en") || "";
        const enDesc =
          stripHtmlTags(formatMultilingualContent(program.description, "en") || "");
        const searchLower = (
          nameLower +
          " " +
          descLower +
          " " +
          enName.toLowerCase() +
          " " +
          enDesc.toLowerCase()
        ).trim();

        const apiSlug = program.slug; // if API adds slug later
        const derivedSlug = slugify(apiSlug || programName);

        // 1) match explicit api slug
        if (apiSlug && apiSlug === programType) return true;
        // 2) match derived slug from name
        if (derivedSlug === programType) return true;

        // 3) mapping config: check explicit ids or keywords
        const cfg = programTypes[programType];
        if (cfg) {
          if (
            Array.isArray(cfg.ids) &&
            (cfg.ids.includes(program._id) || cfg.ids.includes(program.id))
          )
            return true;
          if (Array.isArray(cfg.keywords)) {
            for (let kw of cfg.keywords) {
              const k = kw.toLowerCase();
              if (searchLower.includes(k)) return true;
            }
          }
        }

        // 4) fallback legacy checks (extra safety)
        if (programType === "sitc") {
          return (
            nameLower.includes("sitc") ||
            nameLower.includes("supporting individual training") ||
            nameLower.includes("stay in the country") ||
            nameLower.includes("education")
          );
        } else if (programType === "taaban") {
          return (
            nameLower.includes("taaban") ||
            nameLower.includes("community resilience") ||
            nameLower.includes("livelihood")
          );
        } else if (programType === "stay-in-afghanistan") {
          return (
            (nameLower.includes("stay") && nameLower.includes("afghanistan")) ||
            descLower.includes("stay in afghanistan") ||
            descLower.includes("reintegration")
          );
        }

        return false;
      })
    : [];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const programsPerPage = 8; // Show 8 programs per page

  // Filter programs for current page
  const indexOfLastProgram = currentPage * programsPerPage;
  const indexOfFirstProgram = indexOfLastProgram - programsPerPage;
  const currentPrograms = filteredPrograms.slice(
    indexOfFirstProgram,
    indexOfLastProgram
  );
  const totalPages = Math.ceil(filteredPrograms.length / programsPerPage);

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

  if (error) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2>{t("error", "Error")}</h2>
          <p>
            {error?.message ||
              t("programs.errorLoading", "Error loading programs")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`program-listing-page-sec pt-120 pb-100 ${
        isRTL ? "rtl-direction" : ""
      }`}
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
        {showHeader && (
          <div style={{ marginBottom: 60 }}>
            <div style={{ marginBottom: 40 }}>
              <h1
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "clamp(24px, 5vw, 40px)",
                  fontWeight: 700,
                  color: "#213547",
                }}
              >
                {programType === "sitc" && t("programs.sitc.pageTitle")}
                {programType === "taaban" && t("programs.taaban.pageTitle")}
                {programType === "stay-in-afghanistan" &&
                  t("programs.stayInAfghanistan.pageTitle")}
              </h1>
              <p
                style={{
                  color: "#6b7785",
                  fontSize: "clamp(14px, 2.5vw, 16px)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {programType === "sitc" && t("programs.sitc.description")}
                {programType === "taaban" && t("programs.taaban.description")}
                {programType === "stay-in-afghanistan" &&
                  t("programs.stayInAfghanistan.description")}
              </p>
            </div>
          </div>
        )}

        {/* Programs Grid */}
        <div style={{ marginBottom: 80 }}>
          {/* Responsive CSS for program listing */}
          <style>{`
                        @media (max-width: 992px) {
                            .program-listing-page-sec h2 { font-size: 28px !important; }
                        }
                        @media (max-width: 576px) {
                            .program-listing-page-sec h2 { font-size: 24px !important; }
                            .program-listing-page-sec button { font-size: 13px !important; padding: 10px 14px !important; }
                        }
                    `}</style>
          <h2
            style={{
              margin: "0 0 32px 0",
              fontSize: 32,
              fontWeight: 700,
              color: "#213547",
            }}
          >
            {t("programs.listing.title", "Programs")}
          </h2>

          {filteredPrograms.length > 0 ? (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 20,
                  alignItems: "stretch",
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
                  const programSlug = slugify(`${programName}-${program._id}`);
                  const heroImage =
                    getImageUrlFromObject(program.heroImage) ||
                    getPlaceholderImage(400, 250);

                  return (
                    <div
                      key={program._id}
                      style={{
                        background: "#fff",
                        borderRadius: 12,
                        overflow: "hidden",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                        transition: "all 0.3s ease",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Hero Image */}
                      <div
                        style={{
                          height: "clamp(160px, 22vw, 200px)",
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
                            fontSize: "clamp(13px, 2.3vw, 14px)",
                            margin: "0 0 16px 0",
                            flex: 1,
                            lineHeight: 1.6,
                          }}
                        >
                          {programDescription
                            ? programDescription.substring(0, 120) + "..."
                            : t(
                                "programs.noDescription",
                                "No description available"
                              )}
                        </p>

                        {/* Read More Button */}
                        <div style={{ marginTop: "auto", paddingTop: 12 }}>
                          <button
                            onClick={() => {
                              const fromPath = location.pathname;
                              navigate(`/programs/${programSlug}`, {
                                state: { from: fromPath },
                              });
                            }}
                            style={{
                              background: "#0f68bb",
                              color: "#fff",
                              border: "none",
                              padding: "10px 20px",
                              borderRadius: 8,
                              cursor: "pointer",
                              fontWeight: 600,
                              fontSize: 14,
                              width: "100%",
                              transition: "background-color 0.3s",
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.background = "#0d5ba0")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.background = "#0f68bb")
                            }
                          >
                            {t("programs.readMore", "Read More")}
                          </button>
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
                    {t("pagination.previous", "Previous")}
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
                    {t("pagination.next", "Next")}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: 40 }}>
              <p style={{ color: "#999", fontSize: 16 }}>
                {t("programs.noPrograms", "No programs found")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramListing;
