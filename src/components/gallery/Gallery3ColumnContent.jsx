import Isotope from 'isotope-layout';
import React, { useEffect, useRef, useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { Gallery } from 'react-photoswipe-gallery';
import GalleryV1Data from '../../jsonData/GalleryV1Data'
import SingleGalleryItem from './SingleGalleryItem';
import imagesLoaded from 'imagesloaded';

const Gallery3ColumnContent = () => {

    const galleryRef = useRef(null);
    const [filter, setFilter] = useState('*')

    useEffect(() => {
        const iso = new Isotope(galleryRef.current, {
            itemSelector: '.gallery-items',
            layoutMode: 'fitRows',
            filter: filter,
        });

        const handleImagesLoaded = () => {
            iso.layout();
        };

        imagesLoaded(galleryRef.current).on('progress', handleImagesLoaded);

        return () => {
            iso.destroy();
        };
    }, [filter]);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    useEffect(() => {
        handleFilterChange('*');
    }, []);

    return (
        <>
            <div className="gallery-sec gallery3-column pt-120 pb-120">
                <div className="container">
                    <div className="blog-gallery">
                        <Gallery>
                            <ul className="simplefilter">
                                <li className={filter === '*' ? 'active' : ''} onClick={() => handleFilterChange('*')} >All</li>
                                <li className={filter === '.causes' ? 'active' : ''} onClick={() => handleFilterChange('.causes')} >Causes</li>
                                <li className={filter === '.event' ? 'active' : ''} onClick={() => handleFilterChange('.event')} >Event</li>
                                <li className={filter === '.donation' ? 'active' : ''} onClick={() => handleFilterChange('.donation')} >Donation</li>
                            </ul>

                            <div className="row" ref={galleryRef}>
                                {GalleryV1Data.map((gallery) => (
                                    <div className={`col-lg-4 col-sm-6 gallery-items ${gallery.category}`} key={gallery.id}>
                                        <SingleGalleryItem gallery={gallery} />
                                    </div>
                                ))}
                            </div>
                        </Gallery>
                    </div>
                    <div className="seemore-button">
                        <Link to="#">see more</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Gallery3ColumnContent;