import React, { useEffect } from 'react';
import Gallery from '../sections/Gallery';

const GalleryPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    return (
        <main className="pt-20 bg-white min-h-screen">
            <Gallery />
        </main>
    );
};

export default GalleryPage;