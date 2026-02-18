import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';

const TagsWidget = ({ title = 'keywords', tags = null, active = null, onSelect = null }) => {
    if (Array.isArray(tags) && tags.length > 0) {
        return (
            <div className="widget-card">
                <div className="widget-tag">
                    <h1>{title}</h1>
                    <ul>
                        {tags.map((t) => (
                            <li key={t}>
                                <a href="#" onClick={(e) => { e.preventDefault(); onSelect && onSelect(t); }} className={active === t ? 'active' : ''}>{t}</a>
                            </li>
                        ))}
                        {active && (
                            <li>
                                <a href="#" onClick={(e) => { e.preventDefault(); onSelect && onSelect(null); }}>Clear filter</a>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div className="widget-card">
            <div className="widget-tag">
                <h1>{title}</h1>
                <ul>
                    <li><Link to="#">homeless </Link></li>
                    <li><Link to="#">child</Link></li>
                    <li><Link to="#">citizens</Link></li>
                    <li><Link to="#">help</Link></li>
                    <li><Link to="#">child</Link></li>
                    <li><Link to="#">donation</Link></li>
                    <li><Link to="#">food</Link></li>
                    <li><Link to="#">health</Link></li>
                    <li><Link to="#">animal</Link></li>
                </ul>
            </div>
        </div>
    );
};

export default TagsWidget;