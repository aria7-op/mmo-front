import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMenuConfig } from "../../config/menu.config";
import { useFocusAreas } from "../../hooks/useFocusAreas";
import SlugGenerator from "../common/SlugGenerator";
import { formatMultilingualContent, stripHtmlTags } from '../../utils/apiUtils';
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../common/LanguageSwitcher";
import RegistrationModal from "../RegistrationModal";
import CertificateSearch from "./CertificateSearch";
import formConfigService from "../../services/formConfig.service";

// Responsive styles
const responsiveStyles = `
  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 2px 8px rgba(245, 181, 30, 0.4);
    }
    50% {
      transform: scale(1.02);
      box-shadow: 0 4px 12px rgba(245, 181, 30, 0.6);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 2px 8px rgba(245, 181, 30, 0.4);
    }
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-3px);
    }
    60% {
      transform: translateY(-1px);
    }
  }

  @media (max-width: 1199px) {
    .desktop-nav {
      gap: 10px !important;
    }
    .nav-link {
      font-size: 13px !important;
    }
    .dropdown-menu {
      padding: 20px 25px !important;
      gap: 15px !important;
    }
    .dropdown-section {
      min-width: 120px !important;
      flex: 1 1 120px !important;
    }
    .dropdown-image {
      width: 140px !important;
    }
  }
  
  @media (max-width: 1099px) {
    .dropdown-menu {
      padding: 18px 22px !important;
      gap: 12px !important;
    }
    .dropdown-section {
      min-width: 110px !important;
      flex: 1 1 110px !important;
    }
    .dropdown-image {
      width: 120px !important;
    }
  }
  
  @media (max-width: 992px) {
    .desktop-nav {
      gap: 8px !important;
    }
    .nav-link {
      font-size: 12px !important;
    }
    .dropdown-menu {
      padding: 15px 20px !important;
      gap: 10px !important;
    }
    .dropdown-section {
      min-width: 100px !important;
      flex: 1 1 100px !important;
    }
    .dropdown-image {
      width: 90px !important;
    }
  }
  
  @media (max-width: 991px) {
    .desktop-nav {
      display: none !important;
    }
    .mobile-nav {
      display: flex !important;
    }
    .navbar-right {
      gap: 8px !important;
      position: absolute !important;
      right: 15px !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
    .dropdown-menu {
      padding: 15px 20px !important;
      gap: 12px !important;
      max-width: 90vw !important;
      left: 5vw !important;
      right: 5vw !important;
      flex-wrap: wrap !important;
    }
    .dropdown-section {
      min-width: 90px !important;
      flex: 1 1 90px !important;
    }
    .dropdown-image {
      width: 100px !important;
    }
  }

  @media (max-width: 768px) {
    .dropdown-menu {
      padding: 15px 20px !important;
      gap: 12px !important;
      max-width: 95vw !important;
      left: 2.5vw !important;
      right: 2.5vw !important;
      flex-direction: column !important;
      align-items: stretch !important;
    }
    .dropdown-section {
      min-width: 100% !important;
      margin-bottom: 12px !important;
      flex: 1 1 auto !important;
    }
    .dropdown-image {
      width: 80px !important;
    }
  }

  @media (max-width: 576px) {
    .dropdown-menu {
      padding: 12px 15px !important;
      gap: 10px !important;
      left: 1vw !important;
      right: 1vw !important;
      width: 98vw !important;
    }
    .dropdown-section {
      min-width: 100% !important;
      margin-bottom: 8px !important;
    }
    .dropdown-image {
      width: 60px !important;
    }
  }
  
  [dir="rtl"] .navbar-right {
    right: auto !important;
    left: 15px !important;
  }
  
  [dir="rtl"] .dropdown-menu {
    text-align: right !important;
    direction: rtl !important;
  }
  
  @media (min-width: 992px) {
    .desktop-nav {
      display: flex !important;
    }
    .mobile-nav {
      display: none !important;
    }
  }
`;

const styles = {
  navbar: {
    backgroundColor: "#0A4F9D",
    borderBottom: "1px solid #3b82f6",
    position: "sticky",
    top: 0,
    zIndex: 100,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  navbarContainer: {
    width: "100%",
    margin: "0 auto",
    padding: "0 15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "70px",
    position: "relative",
    "@media (max-width: 768px)": {
      minHeight: "60px",
      padding: "0 12px",
    },
  },
  navbarLogo: {
    margin: 0,
    padding: 0,
  },
  logoText: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#ffffff",
    textDecoration: "none",
    letterSpacing: "0.5px",
    transition: "color 0.3s ease",
  },
  navMenu: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
    gap: "30px",
    flex: "1",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "nowrap",
    minWidth: "0",
  },
  navItem: {
    position: "relative",
  },
  navLink: {
    textDecoration: "none",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: "15px",
    letterSpacing: "0.3px",
    padding: "8px 0",
    border: "none",
    background: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    position: "relative",
  },
  dropdownMenu: (isRTL) => ({
    position: "absolute",
    top: "100%",
    left: "0",
    right: "0",
    width: "100%",
    backgroundColor: "#ffffff",
    borderBottom: "2px solid #0f68bb",
    padding: "25px 35px",
    marginTop: "0",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
    opacity: 0,
    visibility: "hidden",
    pointerEvents: "none",
    transition: "all 0.3s ease",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: "13px",
    zIndex: 9999,
    textAlign: isRTL ? "right" : "left",
    direction: isRTL ? "rtl" : "ltr",
  }),
  dropdownMenuVisible: {
    opacity: 1,
    visibility: "visible",
    pointerEvents: "auto",
  },
  dropdownSection: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    minWidth: "150px",
    fontSize: "clamp(12px, 1.2vw, 14px)",
    marginBottom: "0",
    padding: "0",
    flex: "1 1 150px",
  },
  dropdownImage: {
    width: "160px",
    height: "auto",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: "0",
    flex: "0 0 auto",
  },
  dropdownImageImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  dropdownTitle: {
    margin: "0 0 12px 0",
    fontSize: "clamp(13px, 1.4vw, 16px)",
    fontWeight: "700",
    color: "#0f68bb",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    borderBottom: "2px solid #0f68bb",
    paddingBottom: "8px",
    display: "block",
    width: "100%",
  },
  dropdownDesc: {
    margin: "0 0 16px 0",
    fontSize: "12px",
    color: "#6b7280",
    lineHeight: 1.5,
    fontWeight: "400",
    width: "100%",
  },
  dropdownLink: (isRTL) => ({
    display: "block",
    padding: isRTL ? "8px 12px 8px 20px" : "8px 20px 8px 12px",
    color: "#374151",
    textDecoration: "none",
    fontSize: "clamp(11px, 1.1vw, 14px)",
    lineHeight: "1.5",
    borderRadius: "4px",
    transition: "all 0.2s ease",
    border: "1px solid transparent",
    marginBottom: "1px",
    textAlign: isRTL ? "right" : "left",
  }),
  navbarRight: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginLeft: "30px",
  },
  socialLinks: {
    display: "flex",
    gap: "12px",
  },
  socialIcon: {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "13px",
    transition: "all 0.3s ease",
    border: "1px solid #ffffff",
  },
  donateBtn: {
    backgroundColor: "transparent",
    color: "#ffffff",
    border: "2px solid #ffffff",
    padding: "10px 24px",
    borderRadius: "40px",
    fontWeight: 700,
    fontSize: "12px",
    letterSpacing: "0.5px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
  },
};

export function Navbar() {
  const { t, i18n } = useTranslation();
  const { focusAreas } = useFocusAreas();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const timeoutRef = useRef(null);
  const isRTL = i18n.language === "dr" || i18n.language === "ps";
  const [donateText, setDonateText] = useState("Donate Now");
  const [callIndex, setCallIndex] = useState(0);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [isFormActive, setIsFormActive] = useState(true);
  const [showCertificateSearch, setShowCertificateSearch] = useState(false);

  const callToActionTexts = [
    "Donate Now",
    "Help Us 🤝",
    "Make a Difference ❤️",
    "Support Our Cause 🌟",
    "Give Hope 🙏",
    "Change Lives ✨",
    "Donate Now"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCallIndex((prev) => (prev + 1) % callToActionTexts.length);
      setDonateText(callToActionTexts[(callIndex + 1) % callToActionTexts.length]);
    }, 2000);

    return () => clearInterval(interval);
  }, [callIndex]);

  // Check form configuration status
  useEffect(() => {
    const checkFormStatus = async () => {
      try {
        const response = await formConfigService.getActiveConfig();
        
        if (response && response.success && response.data) {
          setIsFormActive(response.data.isActive);
        } else {
          // If no active config, hide the button
          setIsFormActive(false);
        }
      } catch (error) {
        // For the form-config API, any error typically means no active form configuration
        // This is because the API returns 404 when no active form exists
        setIsFormActive(false);
      }
    };

    // Use setTimeout to lazy load the form status check
    const timeoutId = setTimeout(checkFormStatus, 1000);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const handleDonateClick = () => {
    navigate("/donation");
  };

  const handleRegistrationClick = () => {
    setShowRegistrationModal(true);
  };

  const handleRegistrationSuccess = (data) => {
    console.log('Registration submitted successfully:', data);
  };

  const baseItems = getMenuConfig(t);

  // Build focus area links dynamically for the What We Do dropdown
  const faPriority = [
    "education",
    "wash",
    "nutrition",
    "livelihood",
    "gbv-protection",
    "food-security",
    "agriculture",
  ];
  const faPriorityMap = faPriority.reduce((acc, s, idx) => {
    acc[s] = idx;
    return acc;
  }, {});
  const faLinks = (focusAreas || [])
    .map((fa) => {
      const lang = i18n.language;
      const name = formatMultilingualContent(fa?.name, lang) || "Focus Area";
      const slug =
        (fa?.slug && fa.slug.trim()) ||
        SlugGenerator({ text: fa?.name?.en || name });
      return {
        label: name,
        path: `/what-we-do/focus-areas/${slug}`,
        _slug: slug,
      };
    })
    .sort((a, b) => {
      const ap = faPriorityMap[a._slug] ?? 999;
      const bp = faPriorityMap[b._slug] ?? 999;
      if (ap !== bp) return ap - bp;
      return a.label.localeCompare(b.label);
    });

  const navItems = baseItems.map((item) => {
    let children = item.children || [];

    if (item.path === "/what-we-do") {
      // For What We Do menu, dynamically populate FOCUS AREAS with focus areas + geographic coverage
      const updatedChildren = [];
      children.forEach((child) => {
        if (child.isCategory && child.label === "FOCUS AREAS") {
          // Add focus areas dynamically
          const focusAreaChildren = faLinks.map((fa) => ({
            label: fa.label,
            path: fa.path,
          }));
          // Add geographic coverage
          focusAreaChildren.push({
            label: t("navigation.submenu.workIn15Provinces"),
            path: "/what-we-do/geographic-coverage",
          });

          updatedChildren.push({
            label: child.label,
            path: child.path,
            isCategory: child.isCategory,
            children: focusAreaChildren,
          });
        } else {
          updatedChildren.push(child);
        }
      });
      children = updatedChildren;
    }

    // Flatten nested structure for dropdown rendering
    const flattenedChildren = [];
    if (children && children.length) {
      children.forEach((child) => {
        if (child.isCategory && child.children) {
          // Add category as a section title
          flattenedChildren.push({
            label: child.label,
            href: null,
            isCategory: true,
          });
          // Add category children
          child.children.forEach((subChild) => {
            if (subChild.isCustomComponent) {
              // Add custom component
              flattenedChildren.push({
                label: subChild.label,
                href: null,
                isCustomComponent: subChild.isCustomComponent,
              });
            } else {
              flattenedChildren.push({
                label: subChild.label,
                href: subChild.path,
              });
            }
          });
        } else {
          // Add regular menu item
          flattenedChildren.push({
            label: child.label,
            href: child.path,
          });
        }
      });
    }

    const sections = [];
    if (flattenedChildren && flattenedChildren.length) {
      // Group by categories and create separate sections
      const categories = [];
      let currentCategory = null;

      flattenedChildren.forEach((child) => {
        if (child.isCategory) {
          if (currentCategory) {
            categories.push(currentCategory);
          }
          currentCategory = {
            title: child.label,
            links: [],
          };
        } else if (currentCategory) {
          currentCategory.links.push(child);
        } else {
          // If no category yet, add to default section
          if (!categories[0]) {
            categories[0] = { title: null, links: [] };
          }
          categories[0].links.push(child);
        }
      });

      if (currentCategory) {
        categories.push(currentCategory);
      }

      // Create sections for each category
      categories.forEach((category) => {
        sections.push({
          title: category.title,
          links: category.links,
        });
      });
    }

    // Create a language-independent ID for dropdown using the path
    const dropdownId = item.path ? item.path.replace(/\//g, "-").replace(/^-/, "") : item.label
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const result = {
      label: item.label,
      href: item.path,
      dropdown:
        children && children.length
          ? {
              id: dropdownId,
              sections: sections,
              image: item.image,
              description:
                item.path === "/about"
                  ? ''
                  : item.description,
              customComponent: item.customComponent,
            }
          : undefined,
    };

    return result;
  });

  /* const navItems = [
        {
            label: t('navigation.about'),
            href: '/about',
            dropdown: {
                id: 'about',
                sections: [
                    {
                        title: null,
                        links: [
                            { label: t('navigation.submenu.aboutMMO'), href: '/about' },
                            { label: t('navigation.submenu.missionVisionStory'), href: '/about/mission-vision' },
                            { label: t('navigation.submenu.organizationProfile'), href: '/about/organization-profile' },
                        ],
                    },
                    {
                        title: null,
                        links: [
                            { label: t('navigation.submenu.strategicUnits'), href: '/about/strategic-units' },
                            { label: t('navigation.submenu.boardDirectorsExecutiveTeam'), href: '/about/board-directors' },
                            { label: t('navigation.submenu.organizationalStructure'), href: '/about/organizational-structure' },
                        ],
                    },
                ],
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE7U6wRG44ggphkUBKSCv9FW33JOAe15R1rw&s',
            },
        },
        {
            label: t('navigation.whatWeDo'),
            href: '/what-we-do',
            dropdown: {
                id: 'what-we-do',
                sections: [
                    {
                        title: null,
                        links: [
                            { label: t('navigation.submenu.focusAreas'), href: '/what-we-do/focus-areas' },
                            { label: t('navigation.submenu.workIn15Provinces'), href: '/what-we-do/geographic-coverage' },
                        ],
                    },
                ],
                image: 'https://www.unicefusa.org/sites/default/files/styles/large/public/UN0694154_0.jpg.webp?itok=jE416piJ',
            },
        },
        {
            label: t('navigation.programs'),
            href: '/programs/sitc',
            dropdown: {
                id: 'programs',
                sections: [
                    {
                        title: null,
                        links: [
                            { label: t('navigation.submenu.sitc'), href: '/programs/sitc' },
                            { label: t('navigation.submenu.taaban'), href: '/programs/taaban' },
                            { label: t('navigation.submenu.stayInAfghanistan'), href: '/programs/stay-in-afghanistan' },
                        ],
                    },
                ],
                image: 'https://en.radiozamaneh.com/wp-content/uploads/2025/09/shutterstock_1779012608-1000x570.jpg',
            },
        },
        {
            label: t('navigation.resources'),
            href: '/resources',
            dropdown: {
                id: 'resources',
                sections: [
                    {
                        title: null,
                        links: [
                            { label: t('navigation.submenu.newsEvents'), href: '/resources/news-events' },
                            { label: t('navigation.submenu.reportsPublications'), href: '/resources/reports' },
                            { label: t('navigation.submenu.policies'), href: '/resources/policies' },
                        ],
                    },
                    {
                        title: null,
                        links: [
                            { label: t('navigation.submenu.rfq'), href: '/resources/rfq' },
                            { label: t('navigation.submenu.jobs', 'Jobs'), href: '/resources/jobs' },
                            { label: t('navigation.submenu.gallery'), href: '/gallery-full' },
                        ],
                    },
                    {
                        title: null,
                        links: [
                            { label: t('navigation.submenu.annualReports'), href: '/resources/annual-reports' },
                            { label: t('navigation.submenu.successStories'), href: '/resources/success-stories' },
                            { label: t('navigation.submenu.caseStudies'), href: '/resources/case-studies' },
                        ],
                    },
                    {
                        title: null,
                        links: [
                            { label: t('navigation.submenu.volunteerSection'), href: '/volunteer' },
                        ],
                    },
                ],
                image: 'https://en.radiozamaneh.com/wp-content/uploads/2025/09/shutterstock_1779012608-1000x570.jpg',
            },
        },
        {
            label: t('navigation.additionalSections'),
            href: '/complaints-feedback',
            dropdown: {
                id: 'additional',
                sections: [
                    {
                        title: null,
                        links: [
                            { label: t('navigation.submenu.complaintsFeedback'), href: '/complaints-feedback' },
                            { label: t('navigation.submenu.ethicsCompliance'), href: '/ethics-compliance' },
                            { label: t('navigation.submenu.termsOfUse'), href: '/terms-of-use' },
                        ],
                    },
                    {
                        title: null,
                        links: [
                            { label: t('navigation.submenu.privacyPolicy'), href: '/privacy-policy' },
                            { label: t('navigation.submenu.cookiesSettings'), href: '/cookies-settings' },
                        ],
                    },
                ],
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE7U6wRG44ggphkUBKSCv9FW33JOAe15R1rw&s',
            },
        },
        {
            label: t('navigation.contact'),
            href: '/contact',
        },
    ]; */

  const handleDropdownMouseEnter = (dropdownId) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(dropdownId);
  };

  const handleDropdownMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300); // Increased delay to prevent accidental closing
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest("nav") && activeDropdown) {
        setActiveDropdown(null);
      }
    };

    // Add scroll event listener to hide dropdown on scroll
    const handleScroll = () => {
      if (activeDropdown) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [activeDropdown]);

  return (
    <>
      <style>{responsiveStyles}</style>
      <nav style={styles.navbar} dir={isRTL ? "rtl" : "ltr"}>
        <div style={styles.navbarContainer}>
          {/* Single centered container with all elements */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "30px",
              justifyContent: "center",
            }}
          >
            {/* Logo */}
            <div style={{ flex: "0 0 auto" }}>
              <Link
                to="/"
                style={{
                  ...styles.navbarLogo,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#ffffff",
                    letterSpacing: "0.5px",
                  }}
                ></span>
              </Link>
            </div>

            {/* Navigation Menu */}
            <ul
              className="desktop-nav"
              style={{
                ...styles.navMenu,
                flex: "0 0 auto",
                justifyContent: "center",
              }}
            >
              {/* Home Icon - First Menu Item */}
              <li style={styles.navItem}>
                <Link to="/" style={styles.navLink}>
                  <i
                    className="fas fa-home"
                    style={{
                      fontSize: "16px",
                    }}
                  ></i>
                </Link>
              </li>
              {navItems.map((item) => (
                <li
                  key={item.label}
                  style={styles.navItem}
                  onMouseEnter={() =>
                    item.dropdown && handleDropdownMouseEnter(item.dropdown.id)
                  }
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  {item.dropdown ? (
                    <button
                      style={{
                        ...styles.navLink,
                        cursor: "pointer",
                        background: "none",
                        border: "none",
                      }}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link to={item.href} style={styles.navLink}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Right side - Donate & Language */}
            <div
              className="navbar-right"
              style={{
                ...styles.navbarRight,
                gap: "12px",
                flex: "0 0 auto",
                [isRTL ? "marginRight" : "marginLeft"]: "30px",
              }}
            >
              <button
                onClick={handleDonateClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background:
                    "linear-gradient(135deg, #f5b51e 0%, #f5a500 100%)",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "700",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(245, 181, 30, 0.4)",
                  letterSpacing: "0.5px",
                  animation: "pulse 2s infinite",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #f5a500 0%, #f59000 100%)";
                  e.currentTarget.style.transform = "translateY(-1px) scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(245, 181, 30, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #f5b51e 0%, #f5a500 100%)";
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(245, 181, 30, 0.4)";
                }}
              >
                <i
                  className="fas fa-hand-holding-heart"
                  style={{
                    fontSize: "12px",
                    animation: "bounce 1.5s infinite",
                  }}
                ></i>
                <span>{donateText}</span>
              </button>
              {isFormActive && (
                <button
                  onClick={handleRegistrationClick}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 20px",
                    borderRadius: "25px",
                    fontWeight: "600",
                    fontSize: "14px",
                    textDecoration: "none",
                    background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                    color: "#ffffff",
                    border: "2px solid #ffffff",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    marginLeft: "10px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #218838 0%, #1ea085 100%)";
                    e.currentTarget.style.transform = "translateY(-1px) scale(1.05)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 15px rgba(40, 167, 69, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #28a745 0%, #20c997 100%)";
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(40, 167, 69, 0.4)";
                  }}
                >
                  <i
                    className="fas fa-user-plus"
                    style={{
                      fontSize: "12px"
                    }}
                  ></i>
                  <span>Register</span>
                </button>
              )}
              <LanguageSwitcher />
            </div>
          </div>

          {/* Dropdown positioned relative to navbar container */}
          {activeDropdown &&
            (() => {
              const activeItem = navItems.find(
                (item) => item.dropdown?.id === activeDropdown,
              );
              return activeItem?.dropdown ? (
                <div
                   className="dropdown-menu"
                   style={{
                     ...styles.dropdownMenu(isRTL),
                     ...styles.dropdownMenuVisible,
                    pointerEvents: "auto",
                   }}
                   onMouseEnter={() => handleDropdownMouseEnter(activeDropdown)}
                   onMouseLeave={handleDropdownMouseLeave}
                 >
                  {activeItem.dropdown.description && (
                    <div
                      style={{
                        width: "400px",
                        [isRTL ? "paddingLeft" : "paddingRight"]: "40px",
                        [isRTL ? "borderLeft" : "borderRight"]:
                          "1px solid #e5e7eb",
                        [isRTL ? "marginLeft" : "marginRight"]: "40px",
                        flexShrink: "0",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 20px 0",
                          fontSize: "14px",
                          color: "#374151",
                          lineHeight: 1.6,
                          fontStyle: "italic",
                        }}
                      >
                        {formatMultilingualContent(
                          activeItem.dropdown.description,
                          i18n.language,
                        )}
                      </p>
                      
                      {/* Render custom component in description area */}
                      {activeItem.dropdown.customComponent === 'certificateSearch' && (
                        <div style={{ marginTop: "20px" }}>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input
                              type="text"
                              placeholder="Enter your name to search certificate..."
                              style={{
                                flex: 1,
                                padding: "6px 10px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                fontSize: "13px",
                                height: "32px"
                              }}
                              id="certificate-search-input"
                            />
                            <button
                              onClick={() => {
                                const input = document.getElementById('certificate-search-input');
                                if (input.value.trim()) {
                                  // Open certificate search modal with the name
                                  window.certificateSearchName = input.value.trim();
                                  setShowCertificateSearch(true);
                                  input.value = '';
                                }
                              }}
                              className="certificate-search-btn"
                              style={{
                                padding: "6px 12px",
                                backgroundColor: "#0f68bb",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "13px",
                                fontWeight: "500",
                                cursor: "pointer",
                                transition: "background-color 0.2s",
                                height: "32px",
                                whiteSpace: "nowrap"
                              }}
                              onMouseOver={(e) => e.target.style.backgroundColor = "#0a4d8a"}
                              onMouseOut={(e) => e.target.style.backgroundColor = "#0f68bb"}
                            >
                              Search
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {activeItem.dropdown.sections.map((section, idx) => (
                    <div key={idx} style={styles.dropdownSection}>
                      {section.title && (
                        <div
                          style={{
                            padding: isRTL
                              ? "8px 0 4px 12px"
                              : "8px 12px 4px 0",
                            fontWeight: "700",
                            color: "#0f68bb",
                            fontSize: "14px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            borderBottom: "1px solid #e5e7eb",
                            marginBottom: "4px",
                            cursor: "default",
                            textAlign: isRTL ? "right" : "left",
                          }}
                        >
                          {section.title}
                        </div>
                      )}
                      {section.description && (
                        <p style={styles.dropdownDesc}>
                          {stripHtmlTags(formatMultilingualContent(section.description))}
                        </p>
                      )}
                      {section.links &&
                        section.links.map((link) => {
                          if (link.isCategory) {
                            return (
                              <div
                                key={link.label}
                                style={{
                                  padding: isRTL
                                    ? "8px 0 4px 12px"
                                    : "8px 12px 4px 0",
                                  fontWeight: "700",
                                  color: "#0f68bb",
                                  fontSize: "14px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                  borderBottom: "1px solid #e5e7eb",
                                  marginBottom: "4px",
                                  cursor: "default",
                                  textAlign: isRTL ? "right" : "left",
                                }}
                              >
                                {link.label}
                              </div>
                            );
                          } else if (link.isCustomComponent) {
                            // Handle custom components
                            if (link.isCustomComponent === 'certificateSearch') {
                              return (
                                <button
                                  key={link.label}
                                  onClick={() => setShowCertificateSearch(true)}
                                  style={{
                                    ...styles.dropdownLink(isRTL),
                                    display: "block",
                                    marginBottom: "1px",
                                    width: "100%",
                                    textAlign: "left",
                                    backgroundColor: "#0f68bb",
                                    color: "white",
                                    border: "1px solid #0f68bb",
                                    borderRadius: "4px",
                                    padding: "8px 12px",
                                    cursor: "pointer",
                                    fontWeight: "500"
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = "#0a4d8a";
                                    e.target.style.transform = isRTL
                                      ? "translateX(-2px)"
                                      : "translateX(2px)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = "#0f68bb";
                                    e.target.style.transform = "translateX(0)";
                                  }}
                                >
                                  <i
                                    className="fas fa-search"
                                    style={{
                                      fontSize: "10px",
                                      marginRight: isRTL ? "0" : "8px",
                                      marginLeft: isRTL ? "8px" : "0",
                                    }}
                                  ></i>
                                  {link.label}
                                </button>
                              );
                            }
                            return null;
                          } else {
                            return (
                              <Link
                                key={link.href}
                                to={link.href}
                                style={{
                                  ...styles.dropdownLink(isRTL),
                                  display: "block",
                                  marginBottom: "1px",
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = "#f0f9ff";
                                  e.target.style.borderColor = "#0f68bb";
                                  e.target.style.transform = isRTL
                                    ? "translateX(-4px)"
                                    : "translateX(4px)";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor =
                                    "transparent";
                                  e.target.style.borderColor = "transparent";
                                  e.target.style.transform = "translateX(0)";
                                }}
                              >
                                <i
                                  className="fas fa-chevron-right"
                                  style={{
                                    fontSize: "10px",
                                    marginRight: isRTL ? "0" : "8px",
                                    marginLeft: isRTL ? "8px" : "0",
                                    color: "#0f68bb",
                                  }}
                                ></i>
                                {link.label}
                              </Link>
                            );
                          }
                        })}
                    </div>
                  ))}
                  {activeItem.dropdown.image && (
                    <div style={styles.dropdownImage}>
                      <img
                        src={activeItem.dropdown.image}
                        alt={activeItem.label}
                        style={styles.dropdownImageImg}
                      />
                      <div
                        style={{
                          marginTop: "12px",
                          padding: "8px",
                          textAlign: "center",
                          fontSize: "12px",
                          color: "#6b7280",
                          fontStyle: "italic",
                          lineHeight: "1.4",
                        }}
                      >
                        Providing schools, learning materials, and literacy
                        programs to children and families to ensure every child
                        has the opportunity to learn.
                      </div>
                    </div>
                  )}
                </div>
              ) : null;
            })()}
        </div>
      </nav>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSubmitSuccess={handleRegistrationSuccess}
      />

      {/* Certificate Search Modal */}
      {showCertificateSearch && (
        <CertificateSearch
          onClose={() => setShowCertificateSearch(false)}
        />
      )}
    </>
  );
}
