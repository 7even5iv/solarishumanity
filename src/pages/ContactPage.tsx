import React, { useEffect } from 'react';
import Contact from '../sections/Contact';

const ContactPage: React.FC = () => {
    useEffect(() => window.scrollTo(0, 0), []);
    return <div className="pt-24 min-h-screen"><Contact /></div>;
};
export default ContactPage;