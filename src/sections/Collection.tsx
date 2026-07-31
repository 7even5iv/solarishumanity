import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Truck, CreditCard, Package, Heart, CheckCircle2,
  Shield, Gift, Target, Copy, Check, Sparkles, ArrowLeft,
  Lock, Loader2, Eye, EyeOff, Send, QrCode
} from 'lucide-react';

import { SectionTitle } from '../components/SectionTitle';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

const HELLO_ASSO_URL = "https://www.helloasso.com/associations/solaris-humanity/formulaires/1";

const Collection: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTier, setSelectedTier] = useState<number>(50);
  const [copiedIban, setCopiedIban] = useState<boolean>(false);
  const [copiedPaypal, setCopiedPaypal] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const [showIban, setShowIban] = useState<boolean>(false);
  const [showPaypal, setShowPaypal] = useState<boolean>(false);

  // Références pour les timers (pour éviter les fuites mémoire)
  const ibanTimerRef = useRef<NodeJS.Timeout | null>(null);
  const paypalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);

  // L'IBAN complet
  const IBAN_FULL = "FR76 1234 5678 9012 3456 7890 123";
  // IBAN masqué
  const IBAN_MASKED = "FR76 **** **** **** **** 7890 123";

  // Adresse PayPal
  const PAYPAL_EMAIL = "contact@solaris-humanity.org";
  // PayPal masqué
  const PAYPAL_MASKED = "c****t@solaris-humanity.org";

  // Fonction pour copier l'IBAN
  const copyIban = useCallback(async () => {
    // Nettoyer le timer précédent s'il existe
    if (ibanTimerRef.current) clearTimeout(ibanTimerRef.current);

    try {
      await navigator.clipboard.writeText(IBAN_FULL);
      setCopiedIban(true);
      ibanTimerRef.current = setTimeout(() => setCopiedIban(false), 2000);
    } catch (error) {
      console.error('Erreur de copie IBAN:', error);
    }
  }, []);

  // Fonction pour copier l'adresse PayPal
  const copyPaypal = useCallback(async () => {
    // Nettoyer le timer précédent s'il existe
    if (paypalTimerRef.current) clearTimeout(paypalTimerRef.current);

    try {
      await navigator.clipboard.writeText(PAYPAL_EMAIL);
      setCopiedPaypal(true);
      paypalTimerRef.current = setTimeout(() => setCopiedPaypal(false), 2000);
    } catch (error) {
      console.error('Erreur de copie PayPal:', error);
    }
  }, []);

  // Fonction pour basculer l'affichage de l'IBAN
  const toggleIbanVisibility = useCallback(() => {
    setShowIban((prev) => !prev);
  }, []);

  // Fonction pour basculer l'affichage de PayPal
  const togglePaypalVisibility = useCallback(() => {
    setShowPaypal((prev) => !prev);
  }, []);

  // Gestionnaire de clic/clavier pour l'IBAN (Accessibilité)
  const handleIbanClick = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    // Si c'est un événement clavier, vérifier que c'est Entrée ou Espace
    if ('key' in e && e.key !== 'Enter' && e.key !== ' ') return;

    // Empêcher le comportement par défaut pour la touche Entrée (évite le scroll)
    if ('key' in e && e.key === 'Enter') e.preventDefault();

    copyIban();
  }, [copyIban]);

  // Gestionnaire de clic/clavier pour PayPal (Accessibilité)
  const handlePaypalClick = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ' ') return;
    if ('key' in e && e.key === 'Enter') e.preventDefault();

    copyPaypal();
  }, [copyPaypal]);

  const collectionMethods = useMemo(() => [
    {
      title: t('collection.method_mobile'),
      icon: <Truck size={28} />,
      description: t('collection.mobile_desc'),
      items: t('collection.mobile_items', { returnObjects: true }) as string[],
      color: "from-blue-500 to-blue-600",
      gradient: "from-blue-50 to-white"
    },
    {
      title: t('collection.method_financial'),
      icon: <CreditCard size={28} />,
      description: t('collection.financial_desc'),
      items: t('collection.financial_items', { returnObjects: true }) as string[],
      color: "from-yellow-500 to-yellow-600",
      gradient: "from-yellow-50 to-white"
    },
    {
      title: t('collection.method_material'),
      icon: <Package size={28} />,
      description: t('collection.material_desc'),
      items: t('collection.material_items', { returnObjects: true }) as string[],
      color: "from-blue-500 to-indigo-600",
      gradient: "from-blue-50 to-white"
    }
  ], [t]);

  const donationTiers = useMemo(() => [
    { amount: 25, title: t('donate.tiers.tier1'), impact: t('missions.p4.desc'), icon: <Heart size={20} /> },
    { amount: 50, title: t('donate.tiers.tier2'), impact: t('missions.p3.desc'), icon: <Gift size={20} /> },
    { amount: 100, title: t('donate.tiers.tier3'), impact: t('missions.p2.desc'), icon: <Sparkles size={20} /> },
    { amount: 250, title: t('donate.tiers.tier4'), impact: t('missions.p1.desc'), icon: <Target size={20} /> }
  ], [t]);

  // Nettoyage du timer de redirection
  const handleFinalPayment = useCallback(() => {
    if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);

    setIsRedirecting(true);
    redirectTimerRef.current = setTimeout(() => {
      window.open(HELLO_ASSO_URL, '_blank', 'noopener,noreferrer');
      setIsRedirecting(false);
    }, 800);
  }, []);

  // Nettoyage des timers au démontage du composant
  useEffect(() => {
    return () => {
      if (ibanTimerRef.current) clearTimeout(ibanTimerRef.current);
      if (paypalTimerRef.current) clearTimeout(paypalTimerRef.current);
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  return (
    <section id="collecte" className="relative py-12 bg-white overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle
          subtitle={t('collection.badge')}
          title={t('collection.title')}
          description={t('hero.subtitle')}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {collectionMethods.map((method, i) => (
            <Card key={i} className={`text-center h-full bg-gradient-to-br ${method.gradient} border-gray-100 shadow-sm`}>
              <motion.div whileHover={{ scale: 1.1 }} className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br ${method.color} shadow-lg flex items-center justify-center text-white mb-6`}>
                {method.icon}
              </motion.div>
              <h4 className="text-xl font-black text-gray-900 mb-3 uppercase tracking-tighter">{method.title}</h4>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed italic">{method.description}</p>
              <ul className="space-y-4 mb-8 text-left w-full">
                {method.items && method.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="sm" className="w-full" onClick={handleFinalPayment}>
                {t('collection.btn_participate')}
              </Button>
            </Card>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-[3rem] p-8 md:p-16 mb-24 border border-blue-100 relative shadow-inner"
        >
          <div className="text-center mb-12">
            <div className="flex justify-center gap-2 mb-4">
              <Lock size={14} className="text-blue-500" />
              <Badge variant="blue">{t('collection.tax_info').split('•')[1]?.trim() || "SECURE"}</Badge>
            </div>
            <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">{t('collection.express_title')}</h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {donationTiers.map((tier) => (
              <motion.div
                key={tier.amount}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTier(tier.amount)}
                className={`relative cursor-pointer p-6 rounded-3xl border-2 transition-all duration-300 ${selectedTier === tier.amount ? 'border-blue-500 bg-white shadow-xl' : 'border-transparent bg-white/50'}`}
              >
                <div className="text-center">
                  <div className={`mb-3 flex justify-center ${selectedTier === tier.amount ? 'text-blue-500' : 'text-gray-400'}`}>
                    {tier.icon}
                  </div>
                  <p className="text-3xl font-black text-gray-900">{tier.amount}€</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{tier.title}</p>
                  {selectedTier === tier.amount && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 pt-4 border-t border-gray-100 text-[10px] font-black text-blue-600 uppercase"
                    >
                      {tier.impact}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center space-y-6">
            <Button size="lg" disabled={isRedirecting} className="px-16 py-8 text-xl rounded-full shadow-2xl shadow-blue-200" onClick={handleFinalPayment}>
              {isRedirecting ? <span className="flex items-center gap-3"><Loader2 className="animate-spin" /> {t('contact.sending')}</span> : t('collection.btn_donate', { amount: selectedTier })}
            </Button>
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-4 items-center opacity-60">
                <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/visa.svg" alt="Visa" className="h-4" />
                <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mastercard.svg" alt="Mastercard" className="h-6" />
                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase"><Shield size={12} /> SECURE SSL</div>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('collection.tax_info')}</p>
            </div>
          </div>
        </motion.div>

        {/* ==========================================
            SECTION IBAN + PAYPAL - DOUBLE LIGNE DE DONS
            ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

          {/* ==========================================
              CARTE IBAN
              ========================================== */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-blue-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full blur-[100px] -mr-32 -mt-32"
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-500/20 rounded-xl">
                  <CreditCard size={24} className="text-yellow-400" />
                </div>
                <Badge variant="orange" className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                  {t('collection.iban_label') || 'IBAN'}
                </Badge>
              </div>
              <h4 className="text-2xl font-black uppercase tracking-tighter mb-2">
                {t('collection.transfer_title') || 'Virement bancaire'}
              </h4>
              <p className="text-blue-200 text-sm mb-6">
                {t('collection.transfer_desc') || 'Effectuez un virement directement sur notre compte bancaire.'}
              </p>

              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
                    {t('collection.iban') || 'IBAN'}
                  </span>
                  <button
                    onClick={toggleIbanVisibility}
                    className="text-white/40 hover:text-white transition-colors text-xs flex items-center gap-1.5"
                    type="button"
                  >
                    {showIban ? (
                      <>
                        <EyeOff size={14} /> {t('collection.hide') || 'Masquer'}
                      </>
                    ) : (
                      <>
                        <Eye size={14} /> {t('collection.show') || 'Afficher'}
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* Le conteneur est maintenant un bouton pour l'accessibilité */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleIbanClick}
                    onKeyDown={handleIbanClick}
                    type="button"
                    className="flex-1 w-full p-3 bg-black/40 rounded-xl font-mono text-sm border border-white/5 cursor-pointer hover:bg-black/60 transition-all group relative text-left"
                  >
                    <code className="text-blue-100 break-all text-xs sm:text-sm">
                      {showIban ? IBAN_FULL : IBAN_MASKED}
                    </code>
                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[9px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {t('collection.click_to_copy') || 'Cliquer pour copier'}
                    </span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={copyIban}
                    type="button"
                    className={`p-3 rounded-xl transition-all shadow-lg flex items-center justify-center min-w-[48px] ${copiedIban ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'}`}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {copiedIban ? (
                        <motion.div
                          key="check-iban"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Check size={20} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy-iban"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Copy size={20} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                <AnimatePresence>
                  {copiedIban && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="mt-3 text-center text-green-400 text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <Check size={14} />
                      {t('collection.copied') || 'IBAN copié !'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-white/20 text-[8px] uppercase tracking-widest font-bold">
                <Lock size={10} />
                {t('collection.secure_iban') || 'Données bancaires sécurisées'}
              </div>
            </div>
          </motion.div>

          {/* ==========================================
              CARTE PAYPAL
              ========================================== */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#003087] to-[#009cde] rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute bottom-0 left-0 w-64 h-64 bg-[#ffc439] rounded-full blur-[100px] -ml-32 -mb-32"
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#ffc439]/20 rounded-xl">
                  <Send size={24} className="text-[#ffc439]" />
                </div>
                <Badge variant="orange" className="bg-[#ffc439]/20 text-[#ffc439] border-[#ffc439]/30">
                  PayPal
                </Badge>
              </div>
              <h4 className="text-2xl font-black uppercase tracking-tighter mb-2">
                {t('collection.paypal_title') || 'PayPal'}
              </h4>
              <p className="text-blue-200 text-sm mb-6">
                {t('collection.paypal_desc') || 'Envoyez votre don via PayPal, rapide et sécurisé.'}
              </p>

              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
                    {t('collection.paypal_email') || 'Adresse PayPal'}
                  </span>
                  <button
                    onClick={togglePaypalVisibility}
                    className="text-white/40 hover:text-white transition-colors text-xs flex items-center gap-1.5"
                    type="button"
                  >
                    {showPaypal ? (
                      <>
                        <EyeOff size={14} /> {t('collection.hide') || 'Masquer'}
                      </>
                    ) : (
                      <>
                        <Eye size={14} /> {t('collection.show') || 'Afficher'}
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePaypalClick}
                    onKeyDown={handlePaypalClick}
                    type="button"
                    className="flex-1 w-full p-3 bg-black/40 rounded-xl font-mono text-sm border border-white/5 cursor-pointer hover:bg-black/60 transition-all group relative text-left"
                  >
                    <code className="text-blue-100 break-all text-xs sm:text-sm">
                      {showPaypal ? PAYPAL_EMAIL : PAYPAL_MASKED}
                    </code>
                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[9px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {t('collection.click_to_copy') || 'Cliquer pour copier'}
                    </span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={copyPaypal}
                    type="button"
                    className={`p-3 rounded-xl transition-all shadow-lg flex items-center justify-center min-w-[48px] ${copiedPaypal ? 'bg-green-500' : 'bg-[#ffc439] hover:bg-[#ffd966] text-[#003087]'}`}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {copiedPaypal ? (
                        <motion.div
                          key="check-paypal"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Check size={20} className="text-white" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy-paypal"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Copy size={20} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                <AnimatePresence>
                  {copiedPaypal && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="mt-3 text-center text-[#ffc439] text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <Check size={14} />
                      {t('collection.copied_paypal') || 'Adresse PayPal copiée !'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-white/20 text-[8px] uppercase tracking-widest font-bold">
                <Shield size={10} />
                {t('collection.secure_paypal') || 'Paiement sécurisé PayPal'}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ==========================================
            QR CODE - OPTIONNEL
            ========================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <QrCode size={14} />
            {t('collection.qr_info') || 'Scannez notre QR code pour un don rapide'}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Collection;