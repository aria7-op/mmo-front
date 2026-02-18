import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import SearchWidget from '../others/SearchWidget';
import CausesWidget from '../causes/CausesWidget';
import DonationStatusWidget from '../widgets/DonationStatusWidget';
import DonorWidget from '../donor/DonorWidget';
import WaterWidget from '../widgets/WaterWidget';
import CauseFaq from '../faq/CauseFaq';
import { IMAGE_BASE_URL } from '../../config/api.config';

const CauseDetailsContent = () => {
    return (
        <>
            <div className="recent-causes-sec pt-120 pb-120">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-12">
                            <div className="cause-list-details-thumb">
                                <div className="single-causes">
                                    <div className="causes-thumb">
                                        <img src={`${IMAGE_BASE_URL}/causes/cause-details.jpg`} alt="cause" />
                                        <div className="causes-thumb-overlay">
                                            <div className="fund-progress-bar">
                                                <div className="progress fund-progress">
                                                    <div className="progress-bar fund-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{ width: "75%" }}>
                                                    </div>
                                                </div>
                                                <span className="progres_count">75%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="cause-list-detials-inner">
                                <div className="single-causes-detials">
                                    <div className="causes-fund">
                                        <span className="raised">Raised $75,000</span>
                                        <span className="goal">Goal $95,000</span>
                                    </div>
                                    <h2><Link to="#">we try to give education for  homeless child</Link></h2>
                                    <p>Sollicitudin auctor eget in massa, duis a urna justo ut aliquam fringilla, lacus dis velit felis sed bibendum orci, iaculis justo dui lacus netus. Ornare eu vel, nec consectetuer ut voluptas, non purus, donec urna vulputate a et. Justo sapien viverra. Nulla elit neque at. Lobortis id sed curabitur quis wisi, quis quis augue sed. Sed nisl suscipit gravida magna eu nibh, habitant consequat ultricies ultricies nam dignissim mi, ut diam, vivamus hendrerit vitae lacinia eu nulla. Nulla tincidunt lectus mattis elementum aliquam, quam et in elementum ante lorem ut. Consequat at quis cras, sed quis vivamus tortor dictumst, proin justo vehicula volutpat aliquam vel, nulla metus nec vel accumsan eleifend arcu.</p>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <img src={`${IMAGE_BASE_URL}/causes/cause-details-2.jpg`} alt="causes" />
                                        </div>
                                        <div className="col-md-6">
                                            <p>Lorem ipsum dolor sit amet, amet accumsan velit, magna ligula hendrerit ac nec aenean, mollis adipiscing. Facilisi blandit fusce mattis, massa tellus augue metus, dui convallis pretium. Donec feugiat sem, ipsum suspendisse mauris. Ut malesuada purus ornare, imperdiet non ultricies, elementum aliquam. Dolor id, dolor urna tincidunt in, convallis accumsan, aenean quis odio in. Justo aliquam nibh turpis.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="faq-sec">
                                <CauseFaq />
                            </div>
                        </div>
                        <div className="col-lg-4 col-12">
                            <div className="sidebar">
                                <SearchWidget />
                                <CausesWidget />
                                <DonorWidget />
                                <DonationStatusWidget />
                                <WaterWidget />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CauseDetailsContent;