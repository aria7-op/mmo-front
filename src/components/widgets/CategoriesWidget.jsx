import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';

const CategoriesWidget = ({ title = 'news categories', categories = null, active = null, onSelect = null }) => {
    // If dynamic categories provided, render interactive list; else fallback to static
    if (Array.isArray(categories) && categories.length > 0) {
        return (
            <div className="widget-card" >
            <div className="widget-archive">
                <h1>{title}</h1>
                <ul>
                    {categories.map((c) => (
                        <li key={c.name}>
                            <a href="#" onClick={(e) => { e.preventDefault(); onSelect && onSelect(c.name); }} className={active === c.name ? 'active' : ''}>
                                {c.name}<span>{typeof c.count === 'number' ? c.count : ''}</span>
                            </a>
                        </li>
                    ))}
                    {active && (
                        <li>
                            <a href="#" onClick={(e) => { e.preventDefault(); onSelect && onSelect(null); }}>
                                Clear filter
                            </a>
                        </li>
                    )}
                </ul>
            </div>
            </div>
        );
    }

    return (
        <div className="widget-card">
            <div className="widget-archive">
                <h1>{title}</h1>
                <ul>
                    <li><Link to="#">homeless child<span>21</span></Link></li>
                    <li><Link to="#">clean water<span>31</span></Link></li>
                    <li><Link to="#">education help<span>41</span></Link></li>
                    <li><Link to="#">senior citizens<span>15</span></Link></li>
                    <li><Link to="#">back to school <span>20</span></Link></li>
                </ul>
            </div>
        </div>
    );
};

export default CategoriesWidget;