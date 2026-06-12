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
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const statsData = useMemo(() => [
    { value: "2025", label: t('about.stats.foundation'), icon: Calendar, suffix: "" },
    { value: "3", label: t('about.stats.countries'), icon: Globe, suffix: "" },
    { value: "1000", label: t('about.stats.impact'), icon: Users, suffix: "+" },
    { value: "100", label: t('about.stats.transparency'), icon: Shield, suffix: "%" },
  ], [t]);

  return (
    <div className="min-h-screen bg-white pt-24 overflow-hidden font-sans">

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-7xl mx-auto px-4 pt-8"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-3 text-[10px] font-black text-gray-500 hover:text-blue-500 transition-all uppercase tracking-[0.2em] group"
        >
          <div className="p-2.5 bg-gray-100 rounded-full group-hover:bg-blue-50 transition-colors shadow-sm">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="mt-0.5">{t('nav.back')}</span>
        </Link>
      </motion.div>

      <section className="relative py-16 flex items-center justify-center bg-blue-50/50 mt-8">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Badge variant="blue" className="mb-6 animate-pulse uppercase" icon={<Sparkles size={12} />}>
                {t('about.badge')}
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight tracking-tighter uppercase"
            >
              {i18n.language === 'fr' ? 'Apporter la ' : 'Bringing '}
              <span className="text-blue-500">{i18n.language === 'fr' ? 'Lumière' : 'Light'}</span>
              <br />
              {i18n.language === 'fr' ? "là où règne l'obscurité." : "where darkness reigns."}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed"
            >
              {t('about.description')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 -mt-10 relative z-20" ref={statsRef}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
          >
            {statsData.map((stat, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card variant="glass" className="text-center group hover:border-blue-200 transition-colors">
                  <div className="w-12 h-12 mx-auto mb-4 bg-blue-100/50 rounded-xl flex items-center justify-center text-blue-500 group-hover:rotate-12 transition-transform">
                    <stat.icon size={24} />
                  </div>
                  <motion.p
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={statsInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.5 + (i * 0.1), type: "spring", stiffness: 100 }}
                    className="text-3xl font-black text-gray-900"
                  >
                    {stat.value}{stat.suffix}
                  </motion.p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="blue" className="mb-4 uppercase">{t('about.badge_adn') || 'ADN'}</Badge>

              <div className="flex gap-4 mb-8 border-b border-gray-100">
                {(['vision', 'mission', 'histoire'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
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

              <div className="min-h-[350px] relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === 'vision' && (
                      <div className="space-y-6">
                        <h2 className="text-4xl font-black text-gray-900 leading-tight uppercase tracking-tighter">
                          {t('about.vision_title')}
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                          {t('about.vision_text')}
                        </p>
                        <motion.div
                          className="bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-500 shadow-sm"
                        >
                          <Quote className="text-blue-500 mb-3 opacity-50" />
                          <p className="italic text-gray-900 font-medium leading-relaxed">
                            "{t('about.quote')}"
                          </p>
                        </motion.div>
                      </div>
                    )}

                    {activeTab === 'mission' && (
                      <div className="space-y-6">
                        <h2 className="text-4xl font-black text-gray-900 leading-tight uppercase tracking-tighter">
                          {t('missions.title')}
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                          {t('missions.description')}
                        </p>
                        <div className="grid grid-cols-1 gap-4">
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
                              className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 group hover:bg-white hover:shadow-md transition-all"
                            >
                              <Sparkles size={16} className="text-blue-500" />
                              <span className="font-bold text-gray-800 text-sm uppercase tracking-tight">{item}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'histoire' && (
                      <div className="space-y-6 text-gray-600 leading-relaxed">
                        <h2 className="text-4xl font-black text-gray-900 leading-tight uppercase tracking-tighter">
                          {t('about.tabs.histoire')}
                        </h2>
                        <div className="pl-4 border-l-2 border-blue-100 space-y-8">
                          <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm" />
                            <p className="text-blue-500 font-black text-xs uppercase tracking-widest mb-1">2025</p>
                            <p className="font-bold text-gray-900 uppercase text-sm">{i18n.language === 'fr' ? 'Naissance de l\'ONG' : 'Birth of the NGO'}</p>
                          </div>
                          <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-yellow-500 border-4 border-white shadow-sm" />
                            <p className="text-yellow-600 font-black text-xs uppercase tracking-widest mb-1">{t('hero.last_action').split(' ')[0]}</p>
                            <p className="font-bold text-gray-900 uppercase text-sm">{t('hero.location_cameroon')}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-2xl relative group border-8 border-gray-50">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  src="/images/nelly.jpg"
                  alt="Solaris Humanity Founder"
                  className="w-full h-full object-cover transition-all"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/600x750/3B82F6/white?text=Nelly+NDOH+NGUELET';
                  }}
                />
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl max-w-xs border border-white/10"
              >
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">{t('about.founder_label')}</p>
                <p className="text-lg font-black leading-tight uppercase tracking-tighter">Mme Nelly NDOH NGUELET</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 text-center bg-gradient-to-br from-blue-50 via-white to-yellow-50/30">
        <motion.div
          className="max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-yellow-100 rounded-3xl flex items-center justify-center text-blue-500 shadow-inner"
          >
            <Sun size={40} className="text-yellow-500" />
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-10 leading-tight tracking-tighter uppercase">
            {i18n.language === 'fr' ? 'Prêt à faire briller ' : 'Ready to shine '} <br />
            {i18n.language === 'fr' ? 'un ' : 'a '} <span className="text-blue-500">{i18n.language === 'fr' ? 'rayon de soleil' : 'ray of sunshine'}</span> ?
          </h2>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button size="lg" variant="primary" onClick={() => navigate('/Donate')} icon={<HeartIcon size={20} className="fill-current" />}>
              {t('nav.donate')}
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/Contact')}>
              {t('nav.contact')}
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;