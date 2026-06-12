import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Heart, ShieldCheck, Zap, ArrowLeft,
  TrendingUp, Users, Lock, FileText, ChevronRight
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

interface DonationOption {
  amount: number;
  label: string;
  impact: string;
  popular?: boolean;
  icon: string;
}

const Donate: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const stateAmount = location.state?.amount;
  const stateMonthly = location.state?.isMonthly;

  const [selectedAmount, setSelectedAmount] = useState<number>(stateAmount || 30);
  const [frequency, setFrequency] = useState<'once' | 'monthly'>(stateMonthly ? 'monthly' : 'once');
  const [customAmount, setCustomAmount] = useState<string>('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const donationOptions: DonationOption[] = useMemo(() => [
    { amount: 15, label: t('donate.tiers.tier1'), impact: t('missions.p3.desc'), icon: "📚" },
    { amount: 30, label: t('donate.tiers.tier2'), impact: t('missions.p2.desc'), popular: true, icon: "🫂" },
    { amount: 50, label: t('donate.tiers.tier3'), impact: t('missions.p1.desc'), icon: "💧" },
    { amount: 100, label: t('donate.tiers.tier4'), impact: t('missions.p4.desc'), icon: "✨" },
  ], [t]);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const finalAmount = useMemo(() => {
    return customAmount ? parseInt(customAmount) || 0 : selectedAmount;
  }, [customAmount, selectedAmount]);

  const taxCredit = Math.floor(finalAmount * 0.66);
  const realCost = finalAmount - taxCredit;

  const handleDonate = () => {
    const baseUrl = "https://www.helloasso.com/associations/solaris-humanity";
    const url = frequency === 'monthly' ? `${baseUrl}/adhesions/soutien` : `${baseUrl}/formulaires/1`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const trustItems = useMemo(() => [
    { icon: <Lock size={18} />, text: t('collection.tax_info').split('•')[1]?.trim() || "SSL Secure" },
    { icon: <FileText size={18} />, text: i18n.language === 'fr' ? "Reçu fiscal envoyé par email." : "Tax receipt sent by email." },
    { icon: <TrendingUp size={18} />, text: t('collection.transparency_title') },
    { icon: <Users size={18} />, text: i18n.language === 'fr' ? "100% reversé aux missions." : "100% donated to missions." }
  ], [t, i18n.language]);

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-12">
          <Link to="/" className="inline-flex items-center gap-3 text-[10px] font-black text-gray-500 hover:text-blue-500 transition-all uppercase tracking-[0.2em] group">
            <div className="p-2.5 bg-gray-100 rounded-full group-hover:bg-blue-50 transition-colors shadow-sm">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="mt-0.5">{t('nav.back')}</span>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">

          <div className="lg:col-span-3 space-y-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge variant="blue" className="mb-4 uppercase">{t('nav.donate')}</Badge>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] tracking-tighter uppercase">
                {t('donate.title')} <span className="text-blue-500">{t('donate.title_accent')}</span>
              </h1>
              <p className="text-gray-500 mt-4 text-lg italic">{t('donate.subtitle')}</p>
            </motion.div>

            <div className="relative flex p-1 bg-gray-100 rounded-2xl w-fit">
              {(['once', 'monthly'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFrequency(type)}
                  className={`relative z-10 px-8 py-3 text-[10px] font-black tracking-widest transition-colors ${frequency === type ? 'text-blue-600' : 'text-gray-400'}`}
                >
                  {type === 'once' ? t('donate.frequency_once') : t('donate.frequency_monthly')}
                </button>
              ))}
              <motion.div
                layoutId="freq-pill-donate"
                className="absolute inset-1 bg-white rounded-xl shadow-sm"
                animate={{ x: frequency === 'once' ? 0 : '100%' }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                style={{ width: 'calc(50% - 4px)' }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {donationOptions.map((opt) => (
                <motion.button
                  key={opt.amount}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAmountSelect(opt.amount)}
                  className={`relative p-6 rounded-[2.5rem] border-2 transition-all duration-300 text-center ${selectedAmount === opt.amount && !customAmount
                    ? 'border-blue-500 bg-blue-50/30 shadow-xl shadow-blue-100'
                    : 'border-gray-100 bg-white hover:border-blue-200'
                    }`}
                >
                  {opt.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="blue" className="text-[8px] px-2 py-0.5 shadow-lg">POPULAIRE</Badge>
                    </div>
                  )}
                  <div className="text-2xl mb-2">{opt.icon}</div>
                  <p className={`text-2xl font-black ${selectedAmount === opt.amount && !customAmount ? 'text-blue-600' : 'text-gray-900'}`}>
                    {opt.amount}€
                  </p>
                </motion.button>
              ))}
            </div>

            <div className="relative">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">{t('donate.custom_label')}</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-black text-blue-500">€</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder={t('donate.custom_placeholder')}
                  className="w-full pl-12 pr-6 py-5 rounded-3xl border-2 border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-black text-lg bg-gray-50/50"
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={finalAmount}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 text-white border-none p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl" />
                  <div className="flex gap-6 items-center relative z-10">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg">
                      <Zap className="text-white" size={28} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.2em] mb-2">{t('donate.impact_label')}</p>
                      <p className="text-lg font-medium text-gray-100">
                        {donationOptions.find(o => o.amount === selectedAmount && !customAmount)?.impact ||
                          t('donate.impact_custom', { amount: finalAmount })}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            <motion.div layout className="bg-blue-50 rounded-[2.5rem] p-8 border border-blue-100/50 shadow-inner">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('donate.tax_real_cost')}</p>
                  <p className="text-4xl font-black text-gray-900">{realCost}€</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-1">{t('donate.tax_saving')}</p>
                  <p className="text-2xl font-black text-yellow-600">-{taxCredit}€</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white/50 rounded-2xl border border-blue-200 shadow-sm">
                <ShieldCheck className="text-blue-500 shrink-0 mt-0.5" size={18} />
                <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase tracking-tight">
                  {t('donate.tax_disclaimer')}
                </p>
              </div>
            </motion.div>

            <Button
              size="lg"
              variant="primary"
              className="w-full py-8 text-lg rounded-[2.5rem] shadow-2xl shadow-blue-500/20 group"
              icon={<Heart className="fill-current" size={24} />}
              onClick={handleDonate}
            >
              {t('donate.btn_validate')}
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-gray-100 shadow-xl"
            >
              <h3 className="font-black text-gray-900 uppercase text-xs tracking-[0.2em] mb-10 border-b border-gray-100 pb-4">
                {t('donate.trust_title')}
              </h3>
              <ul className="space-y-8">
                {trustItems.map((item, i) => (
                  <li key={i} className="flex gap-5 group">
                    <div className="p-3 bg-gray-50 rounded-xl text-blue-500 transition-all duration-300 group-hover:bg-blue-500 group-hover:text-white">
                      {item.icon}
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed font-bold">{item.text}</p>
                  </li>
                ))}
              </ul>
            </motion.div>

            <Card variant="glass" className="bg-blue-50/30 border-blue-100 text-center py-10 rounded-[2.5rem]">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Heart className="text-blue-500 animate-pulse" size={28} />
              </div>
              <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-4">{t('donate.help_title')}</h4>
              <p className="text-xs text-gray-500 mb-6 px-4 leading-relaxed">{t('donate.help_text')}</p>
              <p className="font-black text-blue-600 text-sm tracking-widest uppercase underline decoration-blue-200 underline-offset-8">CONTACT@SOLARISHUMANITY.FR</p>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Donate;