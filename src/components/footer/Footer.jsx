import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SocialShare from "../others/SocialShare";
import { useTranslation } from "react-i18next";
import { subscribeNewsletter } from "../../services/newsletter.service";
import { getEncryptedRoute } from "../../utils/urlEncryption";
import {
  IMAGE_BASE_URL,
  API_BASE_URL,
  API_ENDPOINTS,
} from "../../config/api.config";
import CertificateSearch from "../header/CertificateSearch";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "dr" || i18n.language === "ps";
  const [submitting, setSubmitting] = useState(false);
  const [logoUrl, setLogoUrl] = useState(
    `/img/logo/footer_logo.png`,
  );
  const [loading, setLoading] = useState(true);
  const [showCertificateSearch, setShowCertificateSearch] = useState(false);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ABOUT}`);
        const data = await response.json();

        if (data.success && data.data?.logoUrl) {
          setLogoUrl(data.data.logoUrl);
        }
      } catch (error) {
        console.error("Error fetching footer logo:", error);
        // Keep default logo on error
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, []);

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get("email");

    if (!email) {
      return;
    }

    setSubmitting(true);
    try {
      await subscribeNewsletter({
        email,
        preferences: {
          events: true,
          news: true,
          programs: true,
        },
      });
      event.target.reset();
    } catch (error) {
      // Error is already handled in service with toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <footer
        className={isRTL ? "rtl-direction" : ""}
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <div className="footer-overlay"></div>
        <div className="footer-sec" style={{ padding: "60px 20px 40px 20px" }}>
          <div
            className="container"
            style={{ maxWidth: "1800px", margin: "0 auto", padding: "0 20px" }}
          >
            {/* Five Columns Row */}
            <div className="row g-4">
              {/* Column 1: Logo and Tagline */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-2-5">
                <div className="footer-wedget-one">
                  <Link to="/">
                    <img
                      src={logoUrl}
                      alt={t("footer.logoAlt")}
                      style={{
                        maxHeight: "60px",
                        width: "auto",
                        objectFit: "contain",
                        transition: "opacity 0.3s ease",
                        marginBottom: "15px",
                      }}
                      onError={(e) => {
                        // Fallback to default footer logo if API logo fails
                        e.target.src = `/img/logo/footer_logo.png`;
                      }}
                    />
                  </Link>
                  <h3
                    style={{
                      color: "#fff",
                      fontSize: "18px",
                      fontWeight: "600",
                      marginBottom: "15px",
                      fontStyle: "italic",
                    }}
                  >
                    {t("footer.tagline")}
                  </h3>
                  <p>{t("footer.description")}</p>
                  <div className="footer-social-profile">
                    <SocialShare />
                  </div>
                </div>
              </div>

              {/* Column 2: About MMO */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-2-5">
                <div className="footer-widget-menu">
                  <h2>{t("footer.aboutMMO")}</h2>
                  <ul>
                    <li>
                      <Link to="/about/organization-profile">
                        {t("footer.organizationProfile")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact">{t("footer.mmoOffices")}</Link>
                    </li>
                    <li>
                      <Link to="/what-we-do">
                        {t("footer.ourCoreCompetencies")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/resources/annual-reports">
                        {t("footer.mmoAnnualReports")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/resources/jobs">
                        {t("footer.careersAtMMO")}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Column 3: Quick Links */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-2-5">
                <div className="footer-widget-menu">
                  <h2>{t("footer.quickLinks")}</h2>
                  <ul>
                    <li>
                      <Link to="/what-we-do">{t("footer.whatWeDo")}</Link>
                    </li>
                    <li>
                      <Link to="/programs">{t("footer.ourPrograms")}</Link>
                    </li>
                    <li>
                      <Link to="/resources">{t("footer.resources")}</Link>
                    </li>
                    <li>
                      <Link to="/donation">{t("footer.donate")}</Link>
                    </li>
                    <li>
                      <Link to="/volunteer">{t("footer.volunteer")}</Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Column 4: Complaints & Feedback */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-2-5">
                <div className="footer-widget-menu complaints-section">
                  <h2>{t("footer.complaintsAndFeedback")}</h2>
                  <ul>
                    <li>
                      <Link to="/complaints-feedback">
                        {t("footer.submitFeedback")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/complaints-feedback">
                        {t("footer.fileAComplaint")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/complaints-feedback">
                        {t("footer.reportMisconduct")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/ethics-compliance">
                        {t("footer.ethicsAndCompliance")}
                      </Link>
                    </li>
                  </ul>
                  
                  {/* Certificate Search */}
                  <div style={{ marginTop: "20px", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "15px" }}>
                    <h4 style={{ 
                      color: "white", 
                      fontSize: "14px", 
                      fontWeight: "600", 
                      marginBottom: "10px" 
                    }}>
                      Search Certificate
                    </h4>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="text"
                        placeholder="Enter name..."
                        style={{
                          flex: 1,
                          padding: "6px 10px",
                          border: "1px solid rgba(255,255,255,0.3)",
                          borderRadius: "4px",
                          backgroundColor: "rgba(255,255,255,0.1)",
                          color: "white",
                          fontSize: "12px",
                          outline: "none"
                        }}
                        id="footer-complaints-certificate-search"
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById('footer-complaints-certificate-search');
                          if (input.value.trim()) {
                            window.certificateSearchName = input.value.trim();
                            setShowCertificateSearch(true);
                            input.value = '';
                          }
                        }}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "rgba(255,255,255,0.2)",
                          color: "white",
                          border: "1px solid rgba(255,255,255,0.3)",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "background-color 0.2s ease"
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.3)"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.2)"}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 5: Contact Info */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-2-5">
                <div className="footer-widget-menu contact-info-section">
                  <h2>{t("footer.contactInfo")}</h2>
                  <ul>
                    <li>
                      <Link to="/contact">{t("footer.needHelp")}</Link>
                    </li>
                    <li>
                      <a
                        href="https://wa.me/93779752121"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <i
                          className="fab fa-whatsapp"
                          style={{ color: "#25D366", fontSize: "14px" }}
                        ></i>
                        {t("footer.whatsappBusiness")}
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://m.me/MissionMindOrg"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <i
                          className="fab fa-facebook-messenger"
                          style={{ color: "#0084FF", fontSize: "14px" }}
                        ></i>
                        {t("footer.facebookMessenger")}
                      </a>
                    </li>
                    <li>
                      <a
                        href="mailto:info.missionmind@gmail.com"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <i
                          className="fas fa-envelope"
                          style={{ color: "#EA4335", fontSize: "14px" }}
                        ></i>
                        info.missionmind@gmail.com
                      </a>
                    </li>
                    <li>
                      <a
                        href="tel:+93779752121"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <i
                          className="fas fa-phone"
                          style={{ color: "#34A853", fontSize: "14px" }}
                        ></i>
                        +93 77 975 2121
                      </a>
                    </li>
                    <li>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          color: "#fff",
                          textDecoration: "none",
                          marginLeft: "18px",
                        }}
                      >
                        <i
                          className="fas fa-map-marker-alt"
                          style={{ color: "#EA4335", fontSize: "14px" }}
                        ></i>
                        <span>
                          {t("footer.address")}
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom-sec" style={{ padding: "20px 20px" }}>
          <div
            className="container"
            style={{ maxWidth: "98%", margin: "0 auto", padding: "0 20px" }}
          >
            <div className="row">
              <div className="col-md-12">
                <div className="copy-right">
                  <p>
                    &copy; {new Date().getFullYear()}{" "}
                    <span>
                      <Link to="/">Mission Mind Organization (MMO),</Link>
                    </span>{" "}
                    {t("footer.rightsReserved")} {t("footer.poweredBy")}:{" "}
                    <Link
                      to={t("footer.ariaDeltaConsultingGroupLink")}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("footer.ariaDeltaConsultingGroup")}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ color: "white", textAlign: "center", fontSize: "12px" }}>
            <Link to="/terms-of-use" style={{ color: "white", textDecoration: "none", marginRight: "10px" }}>Terms of Use</Link>
            |
            <Link to="/privacy" style={{ color: "white", textDecoration: "none", margin: "0 10px" }}>Privacy</Link>
            |
            <Link to="/cookies" style={{ color: "white", textDecoration: "none", margin: "0 10px" }}>Cookies</Link>
            |
            <Link to="/sitemap" style={{ color: "white", textDecoration: "none", margin: "0 10px" }}>Sitemap</Link>
            |
            <Link to="/faq" style={{ color: "white", textDecoration: "none", marginLeft: "10px" }}>FAQ</Link>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;
