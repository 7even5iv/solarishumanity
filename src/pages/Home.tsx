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
  Calendar, ArrowRight, Mail
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
  const [isMobile, setIsMobile] = useState(false);
  const isFr = i18n.language.startsWith('fr');

  // Détection de la taille d'écran
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
    client.fetch(`*[_type == "gallery"] | order(_createdAt desc) [0...4]`)
      .then(data => setLatestMedia(data));
  }, []);

  const keyStats = useMemo(() => [
    { icon: <Calendar />, value: t('stats.since'), label: t('about.tabs.history'), color: "text-blue-500" },
    { icon: <Users />, value: t('stats.impact'), label: t('about.stats.impact'), color: "text-blue-500" },
    { icon: <Globe />, value: t('stats.country'), label: t('about.stats.countries'), color: "text-blue-500" },
    { icon: <Shield />, value: t('stats.transparency'), label: t('about.stats.transparency'), color: "text-blue-500" },
  ], [t]);

  const missionsTeaser = useMemo(() => [
    { icon: <Droplets size={32} />, title: t('missions.p1.title'), desc: t('missions.p1.desc') },
    { icon: <HeartPulse size={32} />, title: t('missions.p2.title'), desc: t('missions.p2.desc') },
    { icon: <GraduationCap size={32} />, title: t('missions.p3.title'), desc: t('missions.p3.desc') }
  ], [t]);

  return (
    <main className="overflow-hidden bg-white">
      <Hero />

      {/* SECTION STATISTIQUES - Responsive */}
      <section className="py-12 xs:py-16 sm:py-20 border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {keyStats.map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="text-center group">
                <Card variant="gradient" className="h-full py-6 xs:py-8 sm:py-10">
                  <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 mx-auto mb-2 xs:mb-3 sm:mb-4 bg-blue-50 rounded-xl xs:rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-gray-900 mb-0.5 xs:mb-1 uppercase tracking-tighter">
                    {stat.value}
                  </p>
                  <p className="text-[8px] xs:text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">
                    {stat.label}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION MISSIONS - Responsive */}
      <section className="py-16 xs:py-20 sm:py-24 md:py-28 lg:py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6">
          <SectionTitle
            subtitle={t('missions.badge')}
            title={t('missions.title')}
            description={t('missions.description')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8 mt-10 xs:mt-12 sm:mt-14 md:mt-16">
            {missionsTeaser.map((item, i) => (
              <Card key={i} variant="glass" className="text-center flex flex-col h-full border-b-4 border-b-transparent hover:border-b-blue-600 transition-all p-5 xs:p-6 sm:p-7 md:p-8">
                <div className="w-14 h-14 xs:w-15 xs:h-15 sm:w-16 sm:h-16 mx-auto mb-4 xs:mb-5 sm:mb-6 md:mb-8 bg-white shadow-sm text-blue-500 rounded-xl xs:rounded-2xl flex items-center justify-center">
                  {item.icon}
                </div>
                <h4 className="text-base xs:text-lg sm:text-xl font-black text-gray-900 mb-2 xs:mb-3 sm:mb-4 uppercase tracking-tighter">
                  {item.title}
                </h4>
                <p className="text-gray-500 text-xs xs:text-sm leading-relaxed mb-6 xs:mb-8 sm:mb-10 flex-grow italic">
                  {item.desc}
                </p>
                <Button variant="outline" size="sm" className="w-full text-xs xs:text-sm" onClick={() => navigate('/Missions')}>
                  {t('missions.btn_support')}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION GALERIE - Responsive */}
      <section className="py-16 xs:py-20 sm:py-24 md:py-28 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 xs:gap-10 sm:gap-12 md:gap-16 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <Badge variant="blue" className="mb-4 xs:mb-5 sm:mb-6 uppercase text-[10px] xs:text-xs">
                {t('nav.gallery')}
              </Badge>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 xs:mb-5 sm:mb-6 md:mb-8 leading-tight uppercase tracking-tighter">
                {t('gallery.title')}
              </h2>
              <p className="text-gray-500 text-sm xs:text-base sm:text-lg mb-6 xs:mb-8 sm:mb-10 leading-relaxed italic">
                {t('gallery.description')}
              </p>
              <Button onClick={() => navigate('/Galerie')} icon={<Camera size={isMobile ? 16 : 20} />} className="text-sm xs:text-base">
                {t('gallery.section_title')}
              </Button>
            </motion.div>

            <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4 order-1 lg:order-2">
              {latestMedia.map((media, index) => (
                <div
                  key={media._id}
                  className="group relative aspect-square bg-gray-100 rounded-2xl xs:rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-lg cursor-pointer"
                  onClick={() => navigate('/Galerie')}
                >
                  <img
                    src={urlFor(media.image || media.thumbnail).width(400).url()}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="Impact"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 xs:p-4 sm:p-5 md:p-6 flex flex-col justify-end text-left">
                    <p className="text-white font-black text-[8px] xs:text-[9px] sm:text-[10px] uppercase tracking-widest line-clamp-1">
                      {isFr ? media.captionFr : media.captionEn}
                    </p>
                    <p className="text-yellow-400 text-[7px] xs:text-[8px] font-bold uppercase mt-0.5 xs:mt-1 line-clamp-1">
                      {isFr ? media.locationFr : media.locationEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION ENGAGEMENT - Responsive */}
      <section className="py-16 xs:py-20 sm:py-24 md:py-28 lg:py-32 bg-gradient-to-br from-blue-900 to-gray-900 text-white text-center relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-[300px] xs:w-[400px] sm:w-[500px] h-[300px] xs:h-[400px] sm:h-[500px] bg-yellow-500 rounded-full blur-[80px] xs:blur-[100px] sm:blur-[120px]"
        />
        <div className="max-w-4xl mx-auto px-3 xs:px-4 sm:px-6 relative z-10">
          <Badge variant="orange" className="mb-4 xs:mb-5 sm:mb-6 uppercase text-[10px] xs:text-xs">
            {t('footer.action_title')}
          </Badge>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 xs:mb-5 sm:mb-6 md:mb-8 tracking-tighter uppercase leading-tight">
            {t('hero.cta_main')}
          </h2>
          <p className="text-blue-100 text-base xs:text-lg sm:text-xl mb-8 xs:mb-10 sm:mb-12 max-w-2xl mx-auto italic px-2">
            {t('footer.quote')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 xs:gap-4">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/Donate')}
              className="px-12 xs:px-14 sm:px-16 shadow-xl w-full sm:w-auto text-sm xs:text-base py-3 xs:py-3.5 sm:py-4"
            >
              {t('nav.donate')}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/Contact')}
              icon={<Mail size={isMobile ? 16 : 20} />}
              className="px-8 xs:px-10 sm:px-12 w-full sm:w-auto bg-yellow-400 backdrop-blur-sm hover:bg-yellow-500 text-white border-white/30 hover:border-white/50 text-sm xs:text-base py-3 xs:py-3.5 sm:py-4"
            >
              {t('nav.contact')}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;