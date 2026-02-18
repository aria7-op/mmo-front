import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
    IMAGE_BASE_URL,
    API_BASE_URL,
    API_ENDPOINTS,
} from "../../config/api.config";
import { getMenuConfig } from "../../config/menu.config";

// Custom Link component that closes offcanvas on click
const OffCanvasLink = ({ to, children, style, onMouseEnter, onMouseLeave, isActive }) => {
    const handleClick = (e) => {
        // Prevent navigation if there's no valid path
        if (!to || to === "#") {
            e.preventDefault();
            return;
        }
        
        // Close offcanvas after a small delay to allow React Router to process navigation
        setTimeout(() => {
            const offcanvasElement = document.getElementById('offcanvasRight');
            if (offcanvasElement) {
                const offcanvas = window.bootstrap?.Offcanvas?.getInstance(offcanvasElement);
                if (offcanvas) {
                    offcanvas.hide();
                }
            }
        }, 0);
    };

    return (
        <Link
            to={to || "#"}
            onClick={handleClick}
            style={style}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {children}
        </Link>
    );
};

// Recursive Menu Renderer Component
const RenderMenuItems = ({
    items,
    isRTL,
    expandedMenus,
    toggleMenu,
    isActivePath,
    depth = 0,
}) => {
    return (
        <ul
            style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                backgroundColor: depth === 0 ? "#fff" : "#f8f9fa",
            }}
        >
            {items.map((item, idx) => {
                const itemKey = `${item.label}-${idx}`;
                const hasChildren = item.children && item.children.length > 0;
                const isActive = isActivePath(item.path);
                const isExpanded = expandedMenus[itemKey];
                const isCategory = item.isCategory || !item.path;

                return (
                    <li
                        key={itemKey}
                        style={{
                            borderBottom: "1px solid #e9ecef",
                        }}
                    >
                        {hasChildren ? (
                            <>
                                {/* If item has both path and children, show clickable link with expand button */}
                                {item.path && !isCategory ? (
                                    <div style={{ display: "flex", alignItems: "stretch" }}>
                                        <OffCanvasLink
                                            to={item.path}
                                            isActive={isActive}
                                            style={{
                                                flex: 1,
                                                display: "block",
                                                padding: `${depth === 0 ? "14px" : "12px"} ${depth === 0 ? "16px" : `${16 + depth * 12}px`}`,
                                                color: isActive ? "#0A4F9D" : "#2d3436",
                                                textDecoration: "none",
                                                fontSize: depth === 0 ? "15px" : "14px",
                                                fontWeight: isActive ? "600" : "500",
                                                transition: "all 0.3s ease",
                                                backgroundColor: isActive ? "#f0f8ff" : "transparent",
                                                textAlign: isRTL ? "right" : "left",
                                                borderLeft: isRTL
                                                    ? "none"
                                                    : isActive
                                                        ? "4px solid #0A4F9D"
                                                        : "4px solid transparent",
                                                borderRight: isRTL
                                                    ? isActive
                                                        ? "4px solid #0A4F9D"
                                                        : "4px solid transparent"
                                                    : "none",
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.backgroundColor = "#f5f6f7";
                                                    e.currentTarget.style.color = "#0A4F9D";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.backgroundColor = "transparent";
                                                    e.currentTarget.style.color = "#2d3436";
                                                }
                                            }}
                                        >
                                            {item.label}
                                        </OffCanvasLink>
                                        <button
                                            onClick={() => toggleMenu(itemKey)}
                                            style={{
                                                width: "44px",
                                                border: "none",
                                                background: "none",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#2d3436",
                                                transition: "all 0.3s ease",
                                                borderLeft: isRTL ? "none" : "1px solid #e9ecef",
                                                borderRight: isRTL ? "1px solid #e9ecef" : "none",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = "#f5f6f7";
                                                e.currentTarget.style.color = "#0A4F9D";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = "transparent";
                                                e.currentTarget.style.color = "#2d3436";
                                            }}
                                        >
                                            <i
                                                className={`fas fa-chevron-${isExpanded ? "up" : "down"}`}
                                                style={{
                                                    fontSize: "12px",
                                                    transition: "transform 0.3s ease",
                                                }}
                                            />
                                        </button>
                                    </div>
                                ) : (
                                    /* Category or item without path - just expandable button */
                                    <button
                                        onClick={() => toggleMenu(itemKey)}
                                        style={{
                                            width: "100%",
                                            padding: `${depth === 0 ? "14px" : "12px"} ${depth === 0 ? "16px" : `${16 + depth * 12}px`}`,
                                            border: "none",
                                            background: "none",
                                            textAlign: isRTL ? "right" : "left",
                                            cursor: "pointer",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            color: isCategory ? "#0A4F9D" : "#2d3436",
                                            fontSize: depth === 0 ? "15px" : "14px",
                                            fontWeight: isCategory ? "600" : "500",
                                            transition: "all 0.3s ease",
                                            backgroundColor: "transparent",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isCategory) {
                                                e.currentTarget.style.backgroundColor = "#f5f6f7";
                                                e.currentTarget.style.color = "#0A4F9D";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isCategory) {
                                                e.currentTarget.style.backgroundColor = "transparent";
                                                e.currentTarget.style.color = "#2d3436";
                                            }
                                        }}
                                    >
                                        <span>{item.label}</span>
                                        <i
                                            className={`fas fa-chevron-${isExpanded ? "up" : "down"}`}
                                            style={{
                                                fontSize: "12px",
                                                transition: "transform 0.3s ease",
                                                marginLeft: isRTL ? "auto" : "8px",
                                                marginRight: isRTL ? "8px" : "auto",
                                            }}
                                        />
                                    </button>
                                )}
                                {isExpanded && (
                                    <RenderMenuItems
                                        items={item.children}
                                        isRTL={isRTL}
                                        expandedMenus={expandedMenus}
                                        toggleMenu={toggleMenu}
                                        isActivePath={isActivePath}
                                        depth={depth + 1}
                                    />
                                )}
                            </>
                        ) : (
                            <OffCanvasLink
                                to={item.path || "#"}
                                isActive={isActive}
                                style={{
                                    display: "block",
                                    width: "100%",
                                    padding: `${depth === 0 ? "14px" : "12px"} ${depth === 0 ? "16px" : `${16 + depth * 12}px`}`,
                                    color: isActive ? "#0A4F9D" : "#2d3436",
                                    textDecoration: "none",
                                    fontSize: depth === 0 ? "15px" : "14px",
                                    fontWeight: isActive ? "600" : "500",
                                    transition: "all 0.3s ease",
                                    backgroundColor: isActive ? "#f0f8ff" : "transparent",
                                    textAlign: isRTL ? "right" : "left",
                                    borderLeft: isRTL
                                        ? "none"
                                        : isActive
                                            ? "4px solid #0A4F9D"
                                            : "4px solid transparent",
                                    borderRight: isRTL
                                        ? isActive
                                            ? "4px solid #0A4F9D"
                                            : "4px solid transparent"
                                        : "none",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = "#f5f6f7";
                                        e.currentTarget.style.color = "#0A4F9D";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = "transparent";
                                        e.currentTarget.style.color = "#2d3436";
                                    }
                                }}
                            >
                                {item.label}
                            </OffCanvasLink>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

const OffCanvasMenu = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === "dr" || i18n.language === "ps";
    const location = useLocation();
    const offcanvasRef = useRef(null);

    // Build the same menu used on desktop
    const menu = getMenuConfig(t);

    // Track which menus are expanded (use path as key for better stability)
    const [expandedMenus, setExpandedMenus] = useState({});
    const toggleMenu = (key) => {
        setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const isActivePath = (path) => location.pathname === path;

    // Close offcanvas when location changes
    useEffect(() => {
        if (offcanvasRef.current) {
            const offcanvasElement = window.bootstrap?.Offcanvas?.getInstance(offcanvasRef.current);
            if (offcanvasElement) {
                offcanvasElement.hide();
            }
        }
    }, [location]);

    return (
        <>
            <Link
                className="offcanvas-btn"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasRight"
                aria-controls="offcanvasRight"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "44px",
                    height: "44px",
                    backgroundColor: "#0A4F9D",
                    border: "none",
                    borderRadius: "8px",
                    color: "#ffffff",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(10, 79, 157, 0.3)",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#0864d4";
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(10, 79, 157, 0.4)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#0A4F9D";
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(10, 79, 157, 0.3)";
                }}
            >
                <i className="fa-solid fa-bars" style={{ fontSize: "16px" }}></i>
            </Link>

            <div
                ref={offcanvasRef}
                className={`offcanvas offcanvas-end ${isRTL ? "rtl-direction" : ""}`}
                tabIndex="-1"
                id="offcanvasRight"
                aria-labelledby="offcanvasRightLabel"
                style={{ direction: isRTL ? "rtl" : "ltr" }}
            >
                <div
                    className="offcanvas-header"
                    style={{
                        borderBottom: "1px solid #e9ecef",
                        padding: "15px 20px",
                        backgroundColor: "#fff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <OffCanvasLink
                        to="/"
                        style={{
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flex: 1,
                        }}
                    >
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flex: 1,
                        }}
                    >
                        <div style={{
                            textDecoration: 'none',
                            fontSize: '20px',
                            fontWeight: '700',
                            color: '#0f68bb',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '6px',
                                background: 'linear-gradient(135deg, #0f68bb 0%, #4a90e2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: '600'
                            }}>
                                MMO
                            </div>
                            <span style={{ color: '#2c3e50' }}>Mission Mind Organization</span>
                        </div>
                    </div>
                    <div
                            style={{
                                fontSize: "14px",
                                color: "#0A4F9D",
                                fontWeight: "600",
                                lineHeight: "1.2",
                                display: "none", // Hide the MMO title
                            }}
                        >
                            {t("header.organizationName", "MMO")}
                        </div>
                    </OffCanvasLink>
                    <button
                        type="button"
                        className="offcanvasClose"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                        style={{
                            background: "#0A4F9D",
                            border: "none",
                            borderRadius: "50%",
                            width: "36px",
                            height: "36px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            flexShrink: 0,
                            marginLeft: "auto",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#0864d4";
                            e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#0A4F9D";
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                    >
                        <i
                            className="fa-solid fa-xmark"
                            style={{ color: "#fff", fontSize: "14px" }}
                        ></i>
                    </button>
                </div>
                <div
                    className="offcanvas-body"
                    style={{
                        padding: "0",
                        backgroundColor: "#f8f9fa",
                        overflowY: "auto",
                    }}
                >
                    {/* Recursive Menu Renderer */}
                    <RenderMenuItems
                        items={menu}
                        isRTL={isRTL}
                        expandedMenus={expandedMenus}
                        toggleMenu={toggleMenu}
                        isActivePath={isActivePath}
                        depth={0}
                    />

                    {/* Mobile Menu Footer */}
                    <div
                        style={{
                            padding: "20px",
                            borderTop: "1px solid #e9ecef",
                            backgroundColor: "#fff",
                            marginTop: "auto",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "15px",
                            }}
                        >
                            {/* Contact Info */}
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "15px",
                                    backgroundColor: "#f8f9fa",
                                    borderRadius: "8px",
                                }}
                            >
                                <h6
                                    style={{
                                        margin: "0 0 10px 0",
                                        color: "#0A4F9D",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                    }}
                                >
                                    {t("common.contactInfo", "Contact Info")}
                                </h6>
                                <OffCanvasLink
                                    to="/contact"
                                    style={{
                                        display: "inline-block",
                                        padding: "8px 16px",
                                        backgroundColor: "#0A4F9D",
                                        color: "#fff",
                                        textDecoration: "none",
                                        borderRadius: "6px",
                                        fontSize: "13px",
                                        fontWeight: "500",
                                        transition: "all 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "#0864d4";
                                        e.currentTarget.style.transform = "translateY(-1px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "#0A4F9D";
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                >
                                    {t("navigation.contact", "Contact")}
                                </OffCanvasLink>
                            </div>

                            {/* Contact */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "15px",
                                    flexWrap: "wrap",
                                }}
                            >
                                <OffCanvasLink
                                    to="/donation"
                                    style={{
                                        padding: "6px 12px",
                                        backgroundColor: "#f5b51e",
                                        color: "#fff",
                                        textDecoration: "none",
                                        borderRadius: "4px",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        transition: "all 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "#f5a500";
                                        e.currentTarget.style.transform = "translateY(-1px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "#f5b51e";
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                >
                                    {t("header.donate", "Donate")}
                                </OffCanvasLink>
                                <OffCanvasLink
                                    to="/volunteer"
                                    style={{
                                        padding: "6px 12px",
                                        backgroundColor: "#28a745",
                                        color: "#fff",
                                        textDecoration: "none",
                                        borderRadius: "4px",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        transition: "all 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "#218838";
                                        e.currentTarget.style.transform = "translateY(-1px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "#28a745";
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                >
                                    {t("header.volunteer", "Volunteer")}
                                </OffCanvasLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

RenderMenuItems.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    isRTL: PropTypes.bool.isRequired,
    expandedMenus: PropTypes.object.isRequired,
    toggleMenu: PropTypes.func.isRequired,
    isActivePath: PropTypes.func.isRequired,
    depth: PropTypes.number,
};

RenderMenuItems.defaultProps = {
    depth: 0,
};

export default OffCanvasMenu;
