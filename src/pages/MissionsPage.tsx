import React, { useEffect } from 'react';
import Missions from '../sections/Missions';

const MissionsPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    return (
        <main className="pt-20"> {/* Espace pour la Navbar fixe */}
            <Missions />
        </main>
    );
};

export default MissionsPage;