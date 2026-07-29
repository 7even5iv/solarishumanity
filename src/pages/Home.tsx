import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import Hero from '../sections/Hero';
import { SectionTitle } from '../components/SectionTitle';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { client, urlFor } from '../lib/sanity';
import {
  Droplets, HeartPulse, GraduationCap,
  Sparkles, Users, Globe, Shield, TrendingUp, Heart, Camera,
  Calendar, ArrowRight // Nouvel import
} from 'lucide-react';
import { Badge } from '../components/Badge';

// --- COMPOSANT STATISTIQUE ---
const StatDigit = ({ value }: { value: string }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={inView ? { opacity: 1, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8 }}
      className="tabular-nums"
    >
      {value}
    </motion.span>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [latestMedia, setLatestMedia] = useState<any[]>([]);
  const isFr = i18n.language.startsWith('fr');

  useEffect(() => {
    window.scrollTo(0, 0);
    // On récupère les 4 dernières photos pour le teaser
    client.fetch(`*[_type == "gallery"] | order(_createdAt desc) [0...4]`)
      .then(data => setLatestMedia(data));
  }, []);

  // 1. STATS MISES À JOUR (30 vies, 1 pays)
  const keyStats = useMemo(() => [
    { icon: <Calendar />, value: t('stats.since'), label: t('about.tabs.history'), color: "text-blue-500" },
    { icon: <Users />, value: t('stats.impact'), label: t('about.stats.impact'), color: "text-blue-500" },
    { icon: <Globe />, value: t('stats.country'), label: t('about.stats.countries'), color: "text-blue-500" },
    { icon: <Shield />, value: t('stats.transparency'), label: t('about.stats.transparency'), color: "text-blue-500" },
  ], [t]);

  // 2. RÉSUMÉ MISSIONS (Texte long du PDF)
  const missionsTeaser = useMemo(() => [
    { icon: <Droplets size={32} />, title: t('missions.p1.title'), desc: t('missions.p1.desc') },
    { icon: <HeartPulse size={32} />, title: t('missions.p2.title'), desc: t('missions.p2.desc') },
    { icon: <GraduationCap size={32} />, title: t('missions.p3.title'), desc: t('missions.p3.desc') }
  ], [t]);

  return (
    <main className="overflow-hidden bg-white">
      <Hero />

      {/* SECTION STATISTIQUES */}
      <section className="py-20 border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {keyStats.map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="text-center group">
                <Card variant="gradient" className="h-full py-10">
                  <div className="w-14 h-14 mx-auto mb-4 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <p className="text-xl md:text-2xl font-black text-gray-900 mb-1 uppercase tracking-tighter">{stat.value}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION MISSIONS */}
      <section className="py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle subtitle={t('missions.badge')} title={t('missions.title')} description={t('missions.description')} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {missionsTeaser.map((item, i) => (
              <Card key={i} variant="glass" className="text-center flex flex-col h-full border-b-4 border-b-transparent hover:border-b-blue-600 transition-all">
                <div className="w-16 h-16 mx-auto mb-8 bg-white shadow-sm text-blue-500 rounded-2xl flex items-center justify-center">
                  {item.icon}
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tighter">{item.title}</h4>
                <p className="text-gray-500 leading-relaxed mb-10 flex-grow text-sm italic">{item.desc}</p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/Missions')}>
                  {t('missions.btn_support')}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION GALERIE (La preuve de votre impact) */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
              <Badge variant="blue" className="mb-6 uppercase">{t('nav.gallery')}</Badge>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight uppercase tracking-tighter">
                {t('gallery.title')}
              </h2>
              <p className="text-gray-500 text-lg mb-10 leading-relaxed italic">{t('gallery.description')}</p>
              <Button onClick={() => navigate('/Galerie')} icon={<Camera size={20} />}>{t('gallery.section_title')}</Button>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {latestMedia.map((media, index) => (
                <div key={media._id} className="group relative aspect-square bg-gray-100 rounded-[2.5rem] overflow-hidden shadow-lg cursor-pointer" onClick={() => navigate('/Galerie')}>
                  <img src={urlFor(media.image || media.thumbnail).width(400).url()} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Impact" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end text-left">
                    <p className="text-white font-black text-[10px] uppercase tracking-widest">{isFr ? media.captionFr : media.captionEn}</p>
                    <p className="text-yellow-400 text-[8px] font-bold uppercase mt-1">{isFr ? media.locationFr : media.locationEn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION ENGAGEMENT */}
      <section className="py-32 bg-gradient-to-br from-blue-900 to-gray-900 text-white text-center relative overflow-hidden">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-500 rounded-full blur-[120px]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <Badge variant="orange" className="mb-6 uppercase">{t('footer.action_title')}</Badge>
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase">{t('hero.cta_main')}</h2>
          <p className="text-blue-100 text-xl mb-12 max-w-2xl mx-auto italic">{t('footer.quote')}</p>
          <Button size="lg" variant="primary" onClick={() => navigate('/Donate')} className="px-16 shadow-xl">{t('nav.donate')}</Button>
        </div>
      </section>
    </main>
  );
};

export default Home;