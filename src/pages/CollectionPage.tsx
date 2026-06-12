import React, { useEffect } from 'react';
import Collection from '../sections/Collection';

const CollectionPage: React.FC = () => {
    useEffect(() => window.scrollTo(0, 0), []);
    return <div className="pt-24 min-h-screen bg-gray-50"><Collection /></div>;
};
export default CollectionPage;