import React, { useEffect } from 'react';

// Déclaration pour TypeScript
declare global {
    interface Window {
        paypal: any;
    }
}

const PayPalButton: React.FC = () => {
    // L'ID du bouton extrait de ton PDF
    const hostedButtonId = "4LGH7ACK2HQNE";

    useEffect(() => {
        // On attend que le script soit chargé et on affiche le bouton
        if (window.paypal && window.paypal.HostedButtons) {
            window.paypal.HostedButtons({
                hostedButtonId: hostedButtonId,
            }).render(`#paypal-container-${hostedButtonId}`);
        }
    }, []);

    return (
        <div className="w-full flex justify-center py-6">
            {/* Conteneur du bouton PayPal */}
            <div
                id={`paypal-container-${hostedButtonId}`}
                className="w-full max-w-[420px]"
            ></div>
        </div>
    );
};

export default PayPalButton;