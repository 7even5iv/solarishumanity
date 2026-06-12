import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import Hero from '../sections/Hero';
import { SectionTitle } from '../components/SectionTitle';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import {
  Droplets, HeartPulse, GraduationCap,
  Sparkles, Users, Globe, Shield, TrendingUp
} from 'lucide-react';
import { Badge } from '../components/Badge';

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
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const keyStats = useMemo(() => [
    { icon: Users, value: "1000+", label: t('about.stats.impact'), color: "text-blue-500" },
    { icon: Globe, value: "3", label: t('about.stats.countries'), color: "text-blue-500" },
    { icon: Shield, value: "100%", label: t('about.stats.transparency'), color: "text-blue-500" },
    { icon: TrendingUp, value: "5+", label: t('nav.missions'), color: "text-blue-500" },
  ], [t]);

  const missionsTeaser = useMemo(() => [
    { icon: <Droplets size={32} />, title: t('missions.p1.title'), stats: "5000+ Pers." },
    { icon: <HeartPulse size={32} />, title: t('missions.p2.title'), stats: "10+ Centres" },
    { icon: <GraduationCap size={32} />, title: t('missions.p3.title'), stats: "2000+ Kits" }
  ], [t]);

  const teaserActions = useMemo(() => [
    { id: 1, src: '/images/noel.jpeg', title: t('home_gallery.card1.title'), loc: t('home_gallery.card1.loc') },
    { id: 2, src: '/images/eau.jpeg', title: t('home_gallery.card2.title'), loc: t('home_gallery.card2.loc') },
    { id: 3, src: '/images/school.jpeg', title: t('home_gallery.card3.title'), loc: t('home_gallery.card3.loc') },
    { id: 4, src: '/images/santé.jpeg', title: t('home_gallery.card4.title'), loc: t('home_gallery.card4.loc') }
  ], [t]);

  return (
    <main className="overflow-hidden bg-white">
      <Hero />

      <section className="py-20 relative z-20 border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {keyStats.map((stat, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card variant="gradient" className="text-center group h-full">
                  <div className="w-14 h-14 mx-auto mb-4 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:rotate-6 transition-transform">
                    <stat.icon size={28} />
                  </div>
                  <p className="text-4xl font-black text-gray-900 mb-1"><StatDigit value={stat.value} /></p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle subtitle={t('missions.badge')} title={t('missions.title')} description={t('missions.description')} />
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {missionsTeaser.map((item, i) => (
              <motion.div key={i} variants={itemVariants} whileHover={{ y: -10 }}>
                <Card variant="glass" className="text-center h-full flex flex-col group border-b-4 border-b-transparent hover:border-b-blue-500 transition-all duration-500">
                  <div className="w-16 h-16 mx-auto mb-8 bg-white shadow-sm text-blue-500 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <h4 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter uppercase">{item.title}</h4>
                  <Badge variant="blue" className="mb-6 w-fit mx-auto uppercase">{item.stats}</Badge>
                  <p className="text-gray-500 leading-relaxed mb-8 flex-grow">{t('hero.subtitle')}</p>
                  <Button variant="outline" size="sm" onClick={() => navigate('/Missions')} className="w-full">{t('missions.btn_support')}</Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <Badge variant="blue" className="mb-6 uppercase">{t('nav.gallery')}</Badge>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight uppercase">
                {t('about.title')}
              </h2>
              <p className="text-gray-500 text-lg mb-10 leading-relaxed italic">
                {t('about.vision_text')}
              </p>
              <Button onClick={() => navigate('/Galerie')}>Voir la galerie</Button>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {teaserActions.map((action) => (
                <motion.div
                  key={action.id}
                  whileHover={{ scale: 0.98, rotate: action.id % 2 === 0 ? 1 : -1 }}
                  className="group relative aspect-square bg-gray-100 rounded-[2.5rem] overflow-hidden shadow-lg cursor-pointer"
                  onClick={() => navigate('/Galerie')}
                >
                  <img
                    src={action.src}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    alt={action.title}
                    onError={(e) => { e.currentTarget.src = `https://placehold.co/600x600/003366/white?text=${action.title}` }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <p className="text-white font-black text-xs uppercase tracking-widest leading-tight">{action.title}</p>
                    <p className="text-yellow-400 text-[10px] font-bold uppercase mt-1">{action.loc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-500 rounded-full blur-[120px]"
        />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <div className="mb-10 inline-flex p-5 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20">
              <Sparkles className="text-yellow-400 animate-pulse" size={40} />
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase">{t('footer.action_title')}</h2>
            <p className="text-blue-100 text-xl mb-12 max-w-2xl mx-auto leading-relaxed italic">{t('footer.quote')}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button size="lg" variant="primary" onClick={() => navigate('/Donate')} className="bg-blue-600 text-white hover:bg-yellow-500 hover:text-gray-900 transition-all shadow-xl">{t('nav.donate')}</Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:border-yellow-400 hover:text-yellow-400" onClick={() => navigate('/Contact')}>{t('nav.contact')}</Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Home;