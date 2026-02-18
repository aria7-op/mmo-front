/**
 * Responsive Design Tester Component
 * Visual testing tool for responsive design
 */

import React, { useState, useEffect } from 'react';
import './ResponsiveTester.css';

const ResponsiveTester = ({ enabled = false, onToggle }) => {
    const [viewportSize, setViewportSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const [currentBreakpoint, setCurrentBreakpoint] = useState('');
    const [issues, setIssues] = useState([]);
    const [showGrid, setShowGrid] = useState(false);
    const [showRuler, setShowRuler] = useState(false);

    const breakpoints = [
        { name: 'Mobile', width: 375, height: 667, color: '#ff6b6b' },
        { name: 'Mobile Large', width: 414, height: 896, color: '#4ecdc4' },
        { name: 'Tablet', width: 768, height: 1024, color: '#45b7d1' },
        { name: 'Tablet Large', width: 1024, height: 768, color: '#96ceb4' },
        { name: 'Desktop', width: 1200, height: 800, color: '#dda0dd' },
        { name: 'Large Desktop', width: 1440, height: 900, color: '#f0e68c' }
    ];

    useEffect(() => {
        const handleResize = () => {
            setViewportSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
            updateBreakpoint();
        };

        const updateBreakpoint = () => {
            const width = window.innerWidth;
            let breakpoint = '';
            
            if (width <= 576) breakpoint = 'Mobile';
            else if (width <= 768) breakpoint = 'Tablet';
            else if (width <= 992) breakpoint = 'Desktop';
            else breakpoint = 'Large Desktop';
            
            setCurrentBreakpoint(breakpoint);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleViewportChange = (width, height) => {
        setViewportSize({ width, height });
        
        // Apply viewport size to document for testing
        document.documentElement.style.width = `${width}px`;
        document.documentElement.style.height = `${height}px`;
        document.body.style.width = `${width}px`;
        document.body.style.height = `${height}px`;
        document.body.style.overflow = 'hidden';
        
        updateBreakpoint();
    };

    const resetViewport = () => {
        document.documentElement.style.width = '';
        document.documentElement.style.height = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.overflow = '';
        
        setViewportSize({
            width: window.innerWidth,
            height: window.innerHeight
        });
    };

    const checkResponsiveness = () => {
        const foundIssues = [];
        
        // Check for overflow
        const scrollWidth = document.documentElement.scrollWidth;
        const clientWidth = document.documentElement.clientWidth;
        
        if (scrollWidth > clientWidth) {
            foundIssues.push({
                type: 'overflow',
                message: `Horizontal overflow detected: ${scrollWidth - clientWidth}px`,
                severity: 'high'
            });
        }

        // Check for fixed width elements
        const fixedElements = document.querySelectorAll('[style*="width:"]');
        fixedElements.forEach(element => {
            const style = element.getAttribute('style');
            if (style.includes('width:') && !style.includes('%') && !style.includes('vw')) {
                foundIssues.push({
                    type: 'fixed-width',
                    element: element.tagName,
                    message: 'Element uses fixed width',
                    severity: 'medium'
                });
            }
        });

        // Check touch targets
        if (viewportSize.width <= 768) {
            const touchTargets = document.querySelectorAll('button, a, input, select, textarea');
            touchTargets.forEach(element => {
                const rect = element.getBoundingClientRect();
                if (rect.width < 44 || rect.height < 44) {
                    foundIssues.push({
                        type: 'touch-target',
                        element: element.tagName,
                        message: `Touch target too small: ${Math.round(rect.width)}x${Math.round(rect.height)}`,
                        severity: 'high'
                    });
                }
            });
        }

        setIssues(foundIssues);
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return '#ff6b6b';
            case 'medium': return '#ffd93d';
            case 'low': return '#6bcf7f';
            default: return '#ddd';
        }
    };

    if (!enabled) return null;

    return (
        <div className="responsive-tester">
            {/* Viewport Controls */}
            <div className="viewport-controls">
                <div className="viewport-info">
                    <span className="current-viewport">
                        {viewportSize.width} × {viewportSize.height}px
                    </span>
                    <span className="current-breakpoint">
                        {currentBreakpoint}
                    </span>
                </div>

                <div className="preset-buttons">
                    {breakpoints.map(bp => (
                        <button
                            key={bp.name}
                            className="preset-btn"
                            onClick={() => handleViewportChange(bp.width, bp.height)}
                            style={{ backgroundColor: bp.color }}
                        >
                            {bp.name}
                            <br />
                            <small>{bp.width}×{bp.height}</small>
                        </button>
                    ))}
                </div>

                <div className="control-buttons">
                    <button
                        className={`control-btn ${showGrid ? 'active' : ''}`}
                        onClick={() => setShowGrid(!showGrid)}
                    >
                        Grid
                    </button>
                    <button
                        className={`control-btn ${showRuler ? 'active' : ''}`}
                        onClick={() => setShowRuler(!showRuler)}
                    >
                        Ruler
                    </button>
                    <button
                        className="control-btn"
                        onClick={checkResponsiveness}
                    >
                        Check
                    </button>
                    <button
                        className="control-btn"
                        onClick={resetViewport}
                    >
                        Reset
                    </button>
                    <button
                        className="control-btn close"
                        onClick={() => onToggle && onToggle()}
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Issues Panel */}
            {issues.length > 0 && (
                <div className="issues-panel">
                    <h4>Responsiveness Issues ({issues.length})</h4>
                    <div className="issues-list">
                        {issues.map((issue, index) => (
                            <div
                                key={index}
                                className="issue-item"
                                style={{ borderLeftColor: getSeverityColor(issue.severity) }}
                            >
                                <div className="issue-type">
                                    {issue.type.toUpperCase()}
                                </div>
                                <div className="issue-message">
                                    {issue.message}
                                </div>
                                <div className="issue-severity">
                                    {issue.severity}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Grid Overlay */}
            {showGrid && (
                <div className="grid-overlay">
                    <div className="grid-columns">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="grid-column" />
                        ))}
                    </div>
                    <div className="grid-rows">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="grid-row" />
                        ))}
                    </div>
                </div>
            )}

            {/* Ruler Overlay */}
            {showRuler && (
                <div className="ruler-overlay">
                    <div className="ruler-horizontal">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="ruler-mark-h">
                                <span className="ruler-label">{i * 100}px</span>
                            </div>
                        ))}
                    </div>
                    <div className="ruler-vertical">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="ruler-mark-v">
                                <span className="ruler-label">{i * 100}px</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Viewport Frame */}
            <div className="viewport-frame" style={{ width: viewportSize.width, height: viewportSize.height }}>
                <div className="viewport-label">
                    {viewportSize.width} × {viewportSize.height}
                </div>
            </div>

            {/* Breakpoint Indicators */}
            <div className="breakpoint-indicators">
                <div className={`indicator ${currentBreakpoint === 'Mobile' ? 'active' : ''}`}>
                    <div className="indicator-dot mobile" />
                    <span>≤576px</span>
                </div>
                <div className={`indicator ${currentBreakpoint === 'Tablet' ? 'active' : ''}`}>
                    <div className="indicator-dot tablet" />
                    <span>≤768px</span>
                </div>
                <div className={`indicator ${currentBreakpoint === 'Desktop' ? 'active' : ''}`}>
                    <div className="indicator-dot desktop" />
                    <span>≤992px</span>
                </div>
                <div className={`indicator ${currentBreakpoint === 'Large Desktop' ? 'active' : ''}`}>
                    <div className="indicator-dot large-desktop" />
                    <span>>992px</span>
                </div>
            </div>
        </div>
    );
};

export default ResponsiveTester;
