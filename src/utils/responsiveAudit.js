/**
 * Responsive Design Audit Utility
 * Comprehensive responsive design checking and fixes
 */

export class ResponsiveAudit {
    constructor() {
        this.breakpoints = {
            mobile: 576,
            tablet: 768,
            desktop: 992,
            largeDesktop: 1200
        };
        this.issues = [];
        this.fixes = [];
    }

    // Check if viewport is within breakpoint
    isBreakpoint(breakpoint) {
        const width = window.innerWidth;
        switch (breakpoint) {
            case 'mobile':
                return width <= this.breakpoints.mobile;
            case 'tablet':
                return width > this.breakpoints.mobile && width <= this.breakpoints.tablet;
            case 'desktop':
                return width > this.breakpoints.tablet && width <= this.breakpoints.desktop;
            case 'largeDesktop':
                return width > this.breakpoints.desktop;
            default:
                return false;
        }
    }

    // Check element responsiveness
    checkElementResponsiveness(element, options = {}) {
        const {
            minWidth = 320,
            maxWidth = 1200,
            checkOverflow = true,
            checkFontSize = true,
            checkTouchTargets = true
        } = options;

        const issues = [];
        const computedStyle = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();

        // Check width constraints
        if (rect.width < minWidth) {
            issues.push({
                type: 'width-too-small',
                element: element.tagName,
                actual: rect.width,
                expected: `>= ${minWidth}px`,
                severity: 'high'
            });
        }

        if (rect.width > maxWidth) {
            issues.push({
                type: 'width-too-large',
                element: element.tagName,
                actual: rect.width,
                expected: `<= ${maxWidth}px`,
                severity: 'medium'
            });
        }

        // Check overflow
        if (checkOverflow) {
            if (rect.width < element.scrollWidth || rect.height < element.scrollHeight) {
                issues.push({
                    type: 'overflow',
                    element: element.tagName,
                    actual: `${rect.width}x${rect.height}`,
                    scrollSize: `${element.scrollWidth}x${element.scrollHeight}`,
                    severity: 'high'
                });
            }
        }

        // Check font size
        if (checkFontSize) {
            const fontSize = parseFloat(computedStyle.fontSize);
            if (fontSize < 12) {
                issues.push({
                    type: 'font-size-too-small',
                    element: element.tagName,
                    actual: `${fontSize}px`,
                    expected: '>= 12px',
                    severity: 'medium'
                });
            }
        }

        // Check touch targets
        if (checkTouchTargets && this.isBreakpoint('mobile')) {
            if (rect.width < 44 || rect.height < 44) {
                issues.push({
                    type: 'touch-target-too-small',
                    element: element.tagName,
                    actual: `${rect.width}x${rect.height}`,
                    expected: '>= 44x44px',
                    severity: 'high'
                });
            }
        }

        return issues;
    }

    // Audit entire page
    auditPage() {
        this.issues = [];
        this.fixes = [];

        // Check common responsive issues
        this.checkCommonIssues();
        
        // Check navigation
        this.checkNavigation();
        
        // Check forms
        this.checkForms();
        
        // Check tables
        this.checkTables();
        
        // Check images
        this.checkImages();
        
        // Check typography
        this.checkTypography();

        return {
            issues: this.issues,
            fixes: this.fixes,
            summary: this.generateSummary()
        };
    }

    // Check common responsive issues
    checkCommonIssues() {
        // Check viewport meta tag
        const viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            this.issues.push({
                type: 'missing-viewport',
                severity: 'high',
                description: 'Missing viewport meta tag'
            });
            this.fixes.push({
                type: 'add-viewport',
                code: '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
            });
        }

        // Check for fixed width elements
        const fixedWidthElements = document.querySelectorAll('[style*="width:"]');
        fixedWidthElements.forEach(element => {
            const style = element.getAttribute('style');
            if (style.includes('width:') && !style.includes('%') && !style.includes('vw') && !style.includes('em')) {
                this.issues.push({
                    type: 'fixed-width',
                    element: element.tagName,
                    severity: 'medium',
                    description: 'Element uses fixed width'
                });
            }
        });

        // Check for overflow issues
        const overflowElements = document.querySelectorAll('*');
        overflowElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.width < element.scrollWidth || rect.height < element.scrollHeight) {
                this.issues.push({
                    type: 'overflow',
                    element: element.tagName,
                    className: element.className,
                    severity: 'high'
                });
            }
        });
    }

    // Check navigation responsiveness
    checkNavigation() {
        const navElements = document.querySelectorAll('nav, .navbar, .navigation');
        navElements.forEach(nav => {
            const issues = this.checkElementResponsiveness(nav, {
                checkTouchTargets: true,
                checkOverflow: true
            });
            this.issues.push(...issues);
        });

        // Check mobile menu
        const mobileMenu = document.querySelector('.mobile-menu, .offcanvas, .hamburger');
        if (!mobileMenu && window.innerWidth <= 768) {
            this.issues.push({
                type: 'missing-mobile-menu',
                severity: 'high',
                description: 'No mobile menu found for mobile devices'
            });
        }
    }

    // Check form responsiveness
    checkForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const formElements = form.querySelectorAll('input, select, textarea, button');
            formElements.forEach(element => {
                const issues = this.checkElementResponsiveness(element, {
                    checkTouchTargets: true,
                    checkFontSize: true
                });
                this.issues.push(...issues);
            });
        });
    }

    // Check table responsiveness
    checkTables() {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            const container = table.parentElement;
            const tableWidth = table.scrollWidth;
            const containerWidth = container.clientWidth;

            if (tableWidth > containerWidth) {
                this.issues.push({
                    type: 'table-overflow',
                    element: 'table',
                    severity: 'high',
                    description: 'Table overflows container'
                });
                
                this.fixes.push({
                    type: 'add-table-wrapper',
                    code: '<div class="table-responsive" style="overflow-x: auto;">'
                });
            }
        });
    }

    // Check image responsiveness
    checkImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            const issues = this.checkElementResponsiveness(img, {
                checkOverflow: false,
                checkTouchTargets: false
            });

            // Check for responsive images
            if (!img.hasAttribute('srcset') && !img.hasAttribute('sizes')) {
                this.issues.push({
                    type: 'missing-responsive-image',
                    element: 'img',
                    severity: 'medium',
                    description: 'Image missing srcset/sizes attributes'
                });
            }

            // Check for lazy loading
            if (!img.hasAttribute('loading') || img.getAttribute('loading') !== 'lazy') {
                this.issues.push({
                    type: 'missing-lazy-loading',
                    element: 'img',
                    severity: 'low',
                    description: 'Image not using lazy loading'
                });
            }

            this.issues.push(...issues);
        });
    }

    // Check typography responsiveness
    checkTypography() {
        const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div');
        textElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            const fontSize = parseFloat(computedStyle.fontSize);
            const lineHeight = parseFloat(computedStyle.lineHeight);

            // Check font size scaling
            if (this.isBreakpoint('mobile') && fontSize > 24) {
                this.issues.push({
                    type: 'font-size-too-large-mobile',
                    element: element.tagName,
                    actual: `${fontSize}px`,
                    expected: '<= 24px on mobile',
                    severity: 'medium'
                });
            }

            // Check line height
            if (lineHeight < 1.2) {
                this.issues.push({
                    type: 'line-height-too-small',
                    element: element.tagName,
                    actual: lineHeight,
                    expected: '>= 1.2',
                    severity: 'medium'
                });
            }
        });
    }

    // Generate audit summary
    generateSummary() {
        const severityCount = {
            high: this.issues.filter(i => i.severity === 'high').length,
            medium: this.issues.filter(i => i.severity === 'medium').length,
            low: this.issues.filter(i => i.severity === 'low').length
        };

        return {
            totalIssues: this.issues.length,
            severityBreakdown: severityCount,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                breakpoint: this.getCurrentBreakpoint()
            },
            recommendations: this.getRecommendations()
        };
    }

    // Get current breakpoint
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        if (width <= this.breakpoints.mobile) return 'mobile';
        if (width <= this.breakpoints.tablet) return 'tablet';
        if (width <= this.breakpoints.desktop) return 'desktop';
        return 'largeDesktop';
    }

    // Get recommendations
    getRecommendations() {
        const recommendations = [];
        
        if (this.issues.some(i => i.type === 'missing-viewport')) {
            recommendations.push('Add viewport meta tag for proper mobile rendering');
        }
        
        if (this.issues.some(i => i.type === 'missing-mobile-menu')) {
            recommendations.push('Implement mobile-friendly navigation menu');
        }
        
        if (this.issues.some(i => i.type === 'table-overflow')) {
            recommendations.push('Add responsive table wrapper with horizontal scrolling');
        }
        
        if (this.issues.some(i => i.type === 'touch-target-too-small')) {
            recommendations.push('Increase touch target size to at least 44x44px');
        }
        
        if (this.issues.some(i => i.type === 'font-size-too-small')) {
            recommendations.push('Increase font size to at least 12px for better readability');
        }

        return recommendations;
    }

    // Apply automatic fixes
    applyFixes() {
        this.fixes.forEach(fix => {
            switch (fix.type) {
                case 'add-viewport':
                    this.addViewportMeta(fix.code);
                    break;
                case 'add-table-wrapper':
                    this.wrapTables();
                    break;
                default:
                    console.log('Fix type not implemented:', fix.type);
            }
        });
    }

    // Add viewport meta tag
    addViewportMeta(content) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = content;
        document.head.appendChild(meta);
    }

    // Wrap tables with responsive container
    wrapTables() {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            if (!table.parentElement.classList.contains('table-responsive')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-responsive';
                wrapper.style.overflowX = 'auto';
                wrapper.style.width = '100%';
                
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
        });
    }

    // Generate responsive CSS
    generateResponsiveCSS() {
        return `
/* Responsive fixes generated by audit */
@media (max-width: 576px) {
    .table-responsive {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
    
    img {
        max-width: 100%;
        height: auto;
    }
    
    .btn {
        min-height: 44px;
        min-width: 44px;
    }
    
    input, select, textarea {
        min-height: 44px;
        font-size: 16px; /* Prevent zoom on iOS */
    }
}

@media (max-width: 768px) {
    .hide-mobile {
        display: none !important;
    }
    
    .show-mobile {
        display: block !important;
    }
    
    .text-center-mobile {
        text-align: center !important;
    }
}

@media (max-width: 992px) {
    .hide-tablet {
        display: none !important;
    }
    
    .show-tablet {
        display: block !important;
    }
}
        `;
    }
}

// Responsive design utilities
export const responsiveUtils = {
    // Check if element is visible on current viewport
    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Get responsive value based on breakpoint
    getResponsiveValue(values) {
        const width = window.innerWidth;
        
        if (width <= 576 && values.mobile) return values.mobile;
        if (width <= 768 && values.tablet) return values.tablet;
        if (width <= 992 && values.desktop) return values.desktop;
        if (values.largeDesktop) return values.largeDesktop;
        
        return values.desktop || values.tablet || values.mobile;
    },

    // Add responsive class based on breakpoint
    addResponsiveClass(element, classes) {
        const width = window.innerWidth;
        
        // Remove existing responsive classes
        element.classList.remove('mobile-only', 'tablet-only', 'desktop-only', 'large-desktop-only');
        
        // Add current breakpoint class
        if (width <= 576) {
            element.classList.add('mobile-only');
        } else if (width <= 768) {
            element.classList.add('tablet-only');
        } else if (width <= 992) {
            element.classList.add('desktop-only');
        } else {
            element.classList.add('large-desktop-only');
        }
    },

    // Create responsive font size using clamp
    responsiveFontSize(min, preferred, max) {
        return `clamp(${min}px, ${preferred}, ${max}px)`;
    },

    // Create responsive spacing
    responsiveSpacing(min, max, unit = 'px') {
        return `calc(${min}px + (${max} - ${min}) * ((100vw - 320px) / (1200 - 320)))`;
    }
};

export default ResponsiveAudit;
