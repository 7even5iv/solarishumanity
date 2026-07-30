import React, { useEffect } from 'react';
import Blog from '../sections/Blog';

const BlogPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="pt-24 min-h-screen bg-solaris-light animate-fadeIn">
            <Blog />
        </div>
    );
};

export default BlogPage;