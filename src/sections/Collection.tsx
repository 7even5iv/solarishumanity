import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Truck, CreditCard, Package, Heart, CheckCircle2,
  Shield, Gift, Target, Copy, Check, Sparkles, ArrowLeft,
  Lock, Loader2
} from 'lucide-react';

import { SectionTitle } from '../components/SectionTitle';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

const HELLO_ASSO_URL = "https://www.helloasso.com/associations/solaris-humanity/formulaires/1";

const Collection: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTier, setSelectedTier] = useState<number>(50);
  const [copied, setCopied] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

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

  const handleFinalPayment = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      window.open(HELLO_ASSO_URL, '_blank', 'noopener,noreferrer');
      setIsRedirecting(false);
    }, 800);
  };

  const copyRib = async () => {
    await navigator.clipboard.writeText("FR76 1234 5678 9012 3456 7890 123");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
                {method.items.map((item, idx) => (
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

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="bg-gray-50 rounded-[3rem] p-8 md:p-16 mb-24 border border-blue-100 relative shadow-inner">
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 pt-4 border-t border-gray-100 text-[10px] font-black text-blue-600 uppercase">
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

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} className="bg-blue-900 rounded-[3rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 rounded-full blur-[120px] -mr-48 -mt-48" />
          <SectionTitle dark subtitle={t('collection.iban_label')} title={t('collection.transparency_title')} description={t('collection.transparency_text')} />
          <div className="max-w-2xl mx-auto mt-12 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-md">
            <h4 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3 text-yellow-400"><CreditCard size={18} /> {t('collection.iban_label')}</h4>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <code className="flex-1 p-4 bg-black/40 rounded-xl text-blue-100 font-mono text-sm break-all border border-white/5">FR76 1234 5678 9012 3456 7890 123</code>
              <motion.button whileTap={{ scale: 0.9 }} onClick={copyRib} className={`p-4 rounded-xl transition-all shadow-lg flex items-center justify-center ${copied ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'}`}>
                <AnimatePresence mode="wait">
                  {copied ? <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={24} /></motion.div> : <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }}><Copy size={24} /></motion.div>}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Collection;