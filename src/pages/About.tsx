import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import {
  Users, Globe, Calendar, Shield, Sparkles, Sun,
  Quote, Heart as HeartIcon, ArrowLeft
} from 'lucide-react';

import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const About: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'vision' | 'mission' | 'histoire'>('vision');
  const [isMobile, setIsMobile] = useState(false);
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const statsData = useMemo(() => [
    { value: "2025", label: t('about.stats.foundation'), icon: Calendar, suffix: "" },
    { value: "1", label: t('about.stats.countries'), icon: Globe, suffix: "" },
    { value: "30", label: t('about.stats.impact'), icon: Users, suffix: "" },
    { value: "100", label: t('about.stats.transparency'), icon: Shield, suffix: "%" },
  ], [t]);

  return (
    <div className="min-h-screen bg-white pt-16 xs:pt-20 sm:pt-24 overflow-hidden font-sans">

      {/* HERO SECTION - Responsive */}
      <section className="relative py-10 xs:py-12 sm:py-16 flex items-center justify-center bg-blue-50/50 mt-6 xs:mt-8">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Badge variant="blue" className="mb-4 xs:mb-5 sm:mb-6 animate-pulse uppercase text-[8px] xs:text-[10px] sm:text-xs" icon={<Sparkles size={isMobile ? 10 : 12} />}>
                {t('about.badge')}
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 mb-4 xs:mb-6 sm:mb-8 leading-tight tracking-tighter uppercase"
            >
              <span className="text-gray-900">
                {t('about.title')}
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-gray-600 text-sm xs:text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-2 xs:px-4"
            >
              {t('about.description')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* STATISTIQUES - Responsive */}
      <section className="py-10 xs:py-12 sm:py-16 -mt-4 xs:-mt-6 sm:-mt-8 relative z-20" ref={statsRef}>
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
          >
            {statsData.map((stat, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card variant="glass" className="text-center group hover:border-blue-200 transition-colors p-3 xs:p-4 sm:p-5 md:p-6">
                  <div className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 mx-auto mb-2 xs:mb-3 sm:mb-4 bg-blue-100/50 rounded-lg xs:rounded-xl flex items-center justify-center text-blue-500 group-hover:rotate-12 transition-transform">
                    <stat.icon size={isMobile ? 18 : 24} />
                  </div>
                  <motion.p
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={statsInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.5 + (i * 0.1), type: "spring", stiffness: 100 }}
                    className="text-xl xs:text-2xl sm:text-3xl font-black text-gray-900"
                  >
                    {stat.value}{stat.suffix}
                  </motion.p>
                  <p className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {stat.label}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CONTENU PRINCIPAL - Responsive */}
      <section className="py-16 xs:py-18 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 xs:gap-12 sm:gap-14 md:gap-16 items-center">
            {/* TEXTE - Responsive */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <Badge variant="blue" className="mb-3 xs:mb-4 uppercase text-[8px] xs:text-[10px] sm:text-xs">
                {t('about.badge_adn') || 'ADN'}
              </Badge>

              {/* Tabs - Responsive */}
              <div className="flex gap-2 xs:gap-3 sm:gap-4 mb-5 xs:mb-6 sm:mb-8 border-b border-gray-100 overflow-x-auto pb-0.5">
                {(['vision', 'mission', 'histoire'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 xs:pb-3.5 sm:pb-4 text-[9px] xs:text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'
                      }`}
                  >
                    <span className="relative z-10">{t(`about.tabs.${tab}`)}</span>
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTabAbout"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Contenu des tabs - Responsive */}
              <div className="min-h-[280px] xs:min-h-[300px] sm:min-h-[320px] md:min-h-[350px] relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === 'vision' && (
                      <div className="space-y-4 xs:space-y-5 sm:space-y-6">
                        <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-gray-900 leading-tight uppercase tracking-tighter">
                          {t('about.vision_title')}
                        </h2>
                        <p className="text-gray-600 text-sm xs:text-base sm:text-lg leading-relaxed">
                          {t('about.vision_text')}
                        </p>
                        <motion.div
                          className="bg-blue-50 p-4 xs:p-5 sm:p-6 rounded-xl xs:rounded-2xl border-l-4 border-blue-500 shadow-sm"
                        >
                          <Quote className="text-blue-500 mb-2 xs:mb-3 opacity-50" size={isMobile ? 20 : 24} />
                          <p className="italic text-gray-900 font-medium leading-relaxed text-sm xs:text-base">
                            "{t('about.quote')}"
                          </p>
                        </motion.div>
                      </div>
                    )}

                    {activeTab === 'mission' && (
                      <div className="space-y-4 xs:space-y-5 sm:space-y-6">
                        <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-gray-900 leading-tight uppercase tracking-tighter">
                          {t('missions.title')}
                        </h2>
                        <p className="text-gray-600 text-sm xs:text-base sm:text-lg leading-relaxed">
                          {t('missions.description')}
                        </p>
                        <div className="grid grid-cols-1 gap-2 xs:gap-3">
                          {[
                            t('missions.p1.title'),
                            t('missions.p2.title'),
                            t('missions.p3.title'),
                            t('missions.p4.title')
                          ].map((item, idx) => (
                            <motion.div
                              key={item}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-center gap-2 xs:gap-3 p-3 xs:p-4 bg-gray-50 rounded-lg xs:rounded-xl border border-gray-100 group hover:bg-white hover:shadow-md transition-all"
                            >
                              <Sparkles size={isMobile ? 14 : 16} className="text-blue-500 flex-shrink-0" />
                              <span className="font-bold text-gray-800 text-[10px] xs:text-xs sm:text-sm uppercase tracking-tight">
                                {item}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'histoire' && (
                      <div className="space-y-4 xs:space-y-5 sm:space-y-6 text-gray-600 leading-relaxed">
                        <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-gray-900 leading-tight uppercase tracking-tighter">
                          {t('about.tabs.histoire')}
                        </h2>
                        <div className="pl-4 border-l-2 border-blue-100 space-y-6 xs:space-y-8">
                          <div className="relative">
                            <div className="absolute -left-[17px] xs:-left-[19px] sm:-left-[21px] top-1 w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm" />
                            <p className="text-blue-500 font-black text-[8px] xs:text-[10px] uppercase tracking-widest mb-0.5 xs:mb-1">2025</p>
                            <p className="font-bold text-gray-900 uppercase text-[10px] xs:text-xs sm:text-sm">
                              {i18n.language === 'fr' ? 'Naissance de l\'ONG' : 'Birth of the NGO'}
                            </p>
                          </div>
                          <div className="relative">
                            <div className="absolute -left-[17px] xs:-left-[19px] sm:-left-[21px] top-1 w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 rounded-full bg-yellow-500 border-4 border-white shadow-sm" />
                            <p className="text-yellow-600 font-black text-[8px] xs:text-[10px] uppercase tracking-widest mb-0.5 xs:mb-1">
                              {t('hero.last_action').split(' ')[0]}
                            </p>
                            <p className="font-bold text-gray-900 uppercase text-[10px] xs:text-xs sm:text-sm">
                              {t('hero.location_cameroon')}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* IMAGE - Responsive */}
            <motion.div
              className="relative order-1 lg:order-2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div className="aspect-[4/5] rounded-3xl xs:rounded-[2.5rem] sm:rounded-[3rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl relative group border-4 xs:border-6 sm:border-8 border-gray-50">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  src="/images/nelly.jpeg"
                  alt="Solaris Humanity Founder"
                  className="w-full h-full object-cover transition-all"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/600x750/3B82F6/white?text=Nelly+NDOH+NGUELET';
                  }}
                />
              </div>

              {/* Badge flottant - Responsive */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-3 xs:-bottom-4 sm:-bottom-5 md:-bottom-6 -left-3 xs:-left-4 sm:-left-5 md:-left-6 bg-gray-900 text-white p-4 xs:p-5 sm:p-6 md:p-8 rounded-2xl xs:rounded-3xl sm:rounded-[2.5rem] shadow-2xl max-w-[180px] xs:max-w-[200px] sm:max-w-[220px] md:max-w-xs border border-white/10"
              >
                <p className="text-[8px] xs:text-[9px] sm:text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 xs:mb-2">
                  {t('about.founder_label')}
                </p>
                <p className="text-sm xs:text-base sm:text-lg font-black leading-tight uppercase tracking-tighter">
                  Nelly NDOH NGUELET
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA SECTION - Responsive */}
      <section className="py-16 xs:py-18 sm:py-20 md:py-24 text-center bg-gradient-to-br from-blue-50 via-white to-yellow-50/30">
        <motion.div
          className="max-w-4xl mx-auto px-3 xs:px-4 sm:px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 mx-auto mb-4 xs:mb-6 sm:mb-8 bg-gradient-to-br from-blue-100 to-yellow-100 rounded-2xl xs:rounded-3xl flex items-center justify-center text-blue-500 shadow-inner"
          >
            <Sun size={isMobile ? 30 : 40} className="text-yellow-500" />
          </motion.div>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 xs:mb-8 sm:mb-10 leading-tight tracking-tighter uppercase">
            <span className="text-gray-900">
              {t('about.section_title')}
            </span>
          </h2>

          <div className="flex flex-col xs:flex-row justify-center gap-3 xs:gap-4 sm:gap-6">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/Donate')}
              icon={<HeartIcon size={isMobile ? 16 : 20} className="fill-current" />}
              className="w-full xs:w-auto text-sm xs:text-base"
            >
              {t('nav.donate')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/Contact')}
              className="w-full xs:w-auto text-sm xs:text-base"
            >
              {t('nav.contact')}
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;