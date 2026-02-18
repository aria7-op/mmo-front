import React from 'react';

const EmergencyResponse = () => {
    return (
        <div style={{ padding: '60px 20px', minHeight: '60vh', background: '#f8fbfc' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '30px', color: '#292929' }}>
                    Emergency Response Program
                </h1>
                <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#666', marginBottom: '40px' }}>
                    Rapid Response and Humanitarian Assistance for Communities in Crisis
                </p>
                <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#666', marginBottom: '40px', fontStyle: 'italic' }}>
                    Providing immediate relief and long-term recovery support during emergencies and disasters
                </p>
                
                <div style={{ 
                    background: 'white', 
                    padding: '40px', 
                    borderRadius: '20px', 
                    marginBottom: '40px',
                    border: '1px solid #ddd',
                    textAlign: 'left'
                }}>
                    <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '20px', color: '#292929' }}>
                        Program Overview
                    </h2>
                    <p style={{ fontSize: '18px', lineHeight: '1.7', color: '#666', marginBottom: '20px' }}>
                        The Emergency Response Program is designed to provide rapid, effective, and coordinated humanitarian 
                        assistance to communities affected by natural disasters, conflicts, and other emergencies throughout 
                        Afghanistan. Our program focuses on saving lives, alleviating suffering, and helping communities rebuild 
                        with dignity and resilience.
                    </p>
                    <p style={{ fontSize: '18px', lineHeight: '1.7', color: '#666', marginBottom: '20px' }}>
                        Through a network of trained responders, strategic partnerships, and pre-positioned emergency supplies, 
                        we ensure timely delivery of critical aid and support to those most in need during times of crisis.
                    </p>
                    
                    <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '15px', color: '#292929', marginTop: '30px' }}>
                        Our Vision
                    </h3>
                    <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#666', marginBottom: '20px' }}>
                        To build resilient communities across Afghanistan that are prepared for, can respond to, and recover 
                        quickly from emergencies and disasters, minimizing loss of life and suffering while promoting sustainable 
                        recovery and development.
                    </p>
                    
                    <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '15px', color: '#292929', marginTop: '30px' }}>
                        Our Mission
                    </h3>
                    <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#666', marginBottom: '20px' }}>
                        To provide rapid, life-saving humanitarian assistance and protection to affected populations during 
                        emergencies, while supporting early recovery and building community resilience through coordinated, 
                        principled, and accountable emergency response.
                    </p>
                    
                    <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '15px', color: '#292929', marginTop: '30px' }}>
                        Core Response Areas
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', margin: '20px 0' }}>
                        {[
                            {
                                icon: '🏥',
                                title: 'Health Emergency Response',
                                description: 'Medical assistance, mobile clinics, and emergency healthcare services',
                                color: '#dc3545'
                            },
                            {
                                icon: '🍎',
                                title: 'Food Security & Nutrition',
                                description: 'Emergency food distribution and nutritional support for affected communities',
                                color: '#28a745'
                            },
                            {
                                icon: '💧',
                                title: 'Water, Sanitation & Hygiene',
                                description: 'Clean water access, sanitation facilities, and hygiene promotion',
                                color: '#17a2b8'
                            },
                            {
                                icon: '🏠',
                                title: 'Shelter & Non-Food Items',
                                description: 'Emergency shelter, blankets, and essential household items',
                                color: '#fd7e14'
                            },
                            {
                                icon: '🛡️',
                                title: 'Protection Services',
                                description: 'Protection for vulnerable groups, especially women, children, and elderly',
                                color: '#6f42c1'
                            },
                            {
                                icon: '📡',
                                title: 'Emergency Communication',
                                description: 'Information dissemination and coordination with stakeholders',
                                color: '#20c997'
                            }
                        ].map((area, index) => (
                            <div key={index} style={{ 
                                background: 'linear-gradient(135deg, #f8fbfc 0%, #ffffff 100%)', 
                                padding: '25px', 
                                borderRadius: '15px', 
                                border: `1px solid ${area.color}20`,
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{ 
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: area.color
                                }}></div>
                                <div style={{ fontSize: '48px', marginBottom: '15px', color: area.color }}>{area.icon}</div>
                                <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#292929', marginBottom: '10px' }}>
                                    {area.title}
                                </h4>
                                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5', margin: '0' }}>
                                    {area.description}
                                </p>
                            </div>
                        ))}
                    </div>
                    
                    <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '15px', color: '#292929', marginTop: '30px' }}>
                        Emergency Response Phases
                    </h3>
                    <div style={{ margin: '20px 0' }}>
                        {[
                            { 
                                phase: 'Preparedness', 
                                description: 'Risk assessment, early warning systems, and community training',
                                duration: 'Ongoing',
                                color: '#ffc107'
                            },
                            { 
                                phase: 'Immediate Response', 
                                description: 'Rapid assessment, life-saving assistance, and emergency relief',
                                duration: '0-72 hours',
                                color: '#dc3545'
                            },
                            { 
                                phase: 'Early Recovery', 
                                description: 'Restoration of basic services and livelihood support',
                                duration: '1-3 months',
                                color: '#fd7e14'
                            },
                            { 
                                phase: 'Long-term Recovery', 
                                description: 'Reconstruction, resilience building, and disaster risk reduction',
                                duration: '3-24 months',
                                color: '#28a745'
                            }
                        ].map((phase, index) => (
                            <div key={index} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                marginBottom: '20px',
                                padding: '20px',
                                background: '#f8f9fa',
                                borderRadius: '10px',
                                border: '1px solid #e9ecef'
                            }}>
                                <div style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    background: phase.color, 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    marginRight: '20px',
                                    flexShrink: 0,
                                    fontSize: '18px'
                                }}>
                                    {index + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#292929', marginBottom: '8px', margin: '0' }}>
                                        {phase.phase}
                                    </h4>
                                    <p style={{ fontSize: '14px', color: '#666', margin: '0 0 5px 0' }}>
                                        {phase.description}
                                    </p>
                                    <span style={{ 
                                        background: phase.color, 
                                        color: 'white', 
                                        padding: '3px 8px', 
                                        borderRadius: '10px',
                                        fontSize: '12px',
                                        fontWeight: '600'
                                    }}>
                                        {phase.duration}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '15px', color: '#292929', marginTop: '30px' }}>
                        Target Beneficiaries
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', margin: '20px 0' }}>
                        {[
                            { group: 'Conflict-Affected Communities', priority: 'High', icon: '👥' },
                            { group: 'Natural Disaster Survivors', priority: 'High', icon: '🌪️' },
                            { group: 'Internally Displaced Persons', priority: 'Critical', icon: '🏕️' },
                            { group: 'Women & Children', priority: 'Critical', icon: '👩‍👧‍👦' },
                            { group: 'Elderly & Disabled', priority: 'High', icon: '👴👵' },
                            { group: 'Healthcare Workers', priority: 'Medium', icon: '👨‍⚕️' }
                        ].map((beneficiary, index) => (
                            <div key={index} style={{ 
                                background: '#f8f9fa', 
                                padding: '20px', 
                                borderRadius: '10px', 
                                border: '1px solid #e9ecef',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{beneficiary.icon}</div>
                                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#292929', marginBottom: '8px' }}>
                                    {beneficiary.group}
                                </h4>
                                <span style={{ 
                                    background: beneficiary.priority === 'Critical' ? '#dc3545' : beneficiary.priority === 'High' ? '#fd7e14' : '#28a745',
                                    color: 'white', 
                                    padding: '2px 8px', 
                                    borderRadius: '10px',
                                    fontSize: '11px',
                                    fontWeight: '600'
                                }}>
                                    {beneficiary.priority} Priority
                                </span>
                            </div>
                        ))}
                    </div>
                    
                    <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '15px', color: '#292929', marginTop: '30px' }}>
                        Response Capacity
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', margin: '20px 0' }}>
                        {[
                            { capacity: 'Rapid Response Teams', number: '15+', description: 'Trained emergency response teams', icon: '🚑' },
                            { capacity: 'Emergency Supplies', number: '50,000+', description: 'People supported with essential items', icon: '📦' },
                            { capacity: 'Coverage Area', number: '20+', description: 'Provinces with emergency response capacity', icon: '🗺️' },
                            { capacity: 'Response Time', number: '<24hrs', description: 'Average response time to emergencies', icon: '⏱️' },
                            { capacity: 'Partner Network', number: '100+', description: 'Local and international partners', icon: '🤝' },
                            { capacity: 'Medical Facilities', number: '25+', description: 'Mobile and fixed medical units', icon: '🏥' }
                        ].map((item, index) => (
                            <div key={index} style={{ 
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8fbfc 100%)', 
                                padding: '25px', 
                                borderRadius: '15px', 
                                border: '1px solid #0f68bb20',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '36px', marginBottom: '10px', color: '#0f68bb' }}>{item.icon}</div>
                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f68bb', marginBottom: '8px' }}>
                                    {item.number}
                                </div>
                                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#292929', marginBottom: '5px' }}>
                                    {item.capacity}
                                </h4>
                                <p style={{ fontSize: '12px', color: '#666', margin: '0' }}>
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                    
                    <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '15px', color: '#292929', marginTop: '30px' }}>
                        Key Achievements
                    </h3>
                    <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '10px', border: '1px solid #e9ecef' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            {[
                                'Responded to 15+ emergency situations',
                                'Provided assistance to 100,000+ affected people',
                                'Distributed 500+ metric tons of emergency supplies',
                                'Established 10+ temporary shelters',
                                'Trained 200+ local emergency responders',
                                'Coordinated with 50+ partner organizations'
                            ].map((achievement, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ 
                                        width: '24px', 
                                        height: '24px', 
                                        background: '#28a745', 
                                        borderRadius: '50%', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        marginRight: '12px',
                                        flexShrink: 0
                                    }}>
                                        ✓
                                    </div>
                                    <span style={{ fontSize: '14px', color: '#666' }}>
                                        {achievement}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '15px', color: '#292929', marginTop: '30px' }}>
                        Partnership & Coordination
                    </h3>
                    <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#666', marginBottom: '20px' }}>
                        Our Emergency Response Program operates through strong coordination with government agencies, UN agencies, 
                        international NGOs, local communities, and other humanitarian actors to ensure effective, efficient, 
                        and principled emergency assistance that reaches those most in need.
                    </p>
                </div>

                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <p style={{ fontSize: '18px', fontStyle: 'italic', color: '#666', marginBottom: '20px' }}>
                        "In times of crisis, humanity shines brightest through compassion and action"
                    </p>
                    <a 
                        href="https://emergency.mmo.org.af" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                            background: 'linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)',
                            color: '#fff',
                            padding: '16px 32px',
                            borderRadius: '50px',
                            fontSize: '16px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 10px 25px rgba(220, 53, 69, 0.3)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-3px)';
                            e.target.style.boxShadow = '0 15px 35px rgba(220, 53, 69, 0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 10px 25px rgba(220, 53, 69, 0.3)';
                        }}
                    >
                        <span>Read More</span>
                        <i className="fas fa-arrow-right" style={{ fontSize: '14px' }}></i>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default EmergencyResponse;
