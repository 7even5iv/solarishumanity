import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Droplets, HeartPulse, GraduationCap, Users,
  CheckCircle2, Sparkles, ArrowRight, TrendingUp,
  Target, Shield, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { SectionTitle } from '../components/SectionTitle';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';

// --- IMPORTATIONS DE VOS IMAGES LOCALES ---
import eauImage from '../assets/images/missions/eau.jpeg';
import santeImage from '../assets/images/missions/sante.jpeg';
import educationImage from '../assets/images/missions/education.jpeg';
import communautaireImage from '../assets/images/missions/communautaire.jpeg';

interface IMission {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  solutions: string[];
  gradientFrom: string;
  gradientTo: string;
  image: string;
}

const Missions: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [expandedMission, setExpandedMission] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Détection des écrans
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const missionsData: IMission[] = useMemo(() => [
    {
      id: "01",
      title: t('missions.p1.title'),
      icon: <Droplets size={isMobile ? 24 : 32} />,
      description: t('missions.p1.desc'),
      solutions: [
        t('collection.method_mobile'),
        "Installation de pompes solaires",
        "Sensibilisation à l'hygiène",
        "Filtration d'eau"
      ],
      gradientFrom: "from-blue-500",
      gradientTo: "to-cyan-600",
      image: eauImage,
    },
    {
      id: "02",
      title: t('missions.p2.title'),
      icon: <HeartPulse size={isMobile ? 24 : 32} />,
      description: t('missions.p2.desc'),
      solutions: ["Soutien aux dispensaires", "Campagnes de prévention", "Matériel médical", "Énergie solaire santé"],
      gradientFrom: "from-yellow-500",
      gradientTo: "to-orange-500",
      image: santeImage,
    },
    {
      id: "03",
      title: t('missions.p3.title'),
      icon: <GraduationCap size={isMobile ? 24 : 32} />,
      description: t('missions.p3.desc'),
      solutions: ["Fournitures scolaires", "Création de bibliothèques", "Formations couture/numérique", "Bourses d'études"],
      gradientFrom: "from-blue-500",
      gradientTo: "to-indigo-600",
      image: educationImage,
    },
    {
      id: "04",
      title: t('missions.p4.title'),
      icon: <Users size={isMobile ? 24 : 32} />,
      description: t('missions.p4.desc'),
      solutions: ["Dons alimentaires", "Équipements maison", "Collecte de jouets", "Marrainage"],
      gradientFrom: "from-yellow-500",
      gradientTo: "to-amber-600",
      image: communautaireImage,
    }
  ], [t, isMobile]);

  const statsItems = useMemo(() => [
    { label: t('about.stats.foundation'), value: "2025", icon: <Target size={isMobile ? 16 : 20} /> },
    { label: t('about.stats.impact'), value: "30", icon: <Users size={isMobile ? 16 : 20} /> },
    { label: t('about.stats.countries'), value: "1", icon: <Shield size={isMobile ? 16 : 20} /> },
    { label: t('about.stats.transparency'), value: "100%", icon: <TrendingUp size={isMobile ? 16 : 20} /> },
  ], [t, isMobile]);

  const handleMissionClick = (missionId: string) => {
    setExpandedMission(prev => prev === missionId ? null : missionId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="missions" className="relative py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20 bg-white overflow-hidden min-h-screen">

      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 -right-20 w-48 xs:w-64 sm:w-80 md:w-96 h-48 xs:h-64 sm:h-80 md:h-96 bg-blue-500/10 rounded-full blur-[60px] xs:blur-[80px] sm:blur-[100px] md:blur-[120px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 relative z-10">
        <SectionTitle
          subtitle={t('missions.badge')}
          title={t('missions.title')}
          description={t('missions.description')}
        />

        {/* STATISTIQUES - Responsive */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 mb-10 xs:mb-12 sm:mb-16 md:mb-20"
        >
          {statsItems.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div className="bg-gray-50 rounded-lg xs:rounded-xl sm:rounded-2xl p-2.5 xs:p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-100 text-center hover:bg-blue-50/30 transition-colors">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg xs:rounded-xl bg-white shadow-sm flex items-center justify-center mx-auto mb-1.5 xs:mb-2 sm:mb-3 md:mb-4 text-blue-500">
                  {stat.icon}
                </div>
                <p className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-black text-gray-800 tracking-tighter">{stat.value}</p>
                <p className="text-[6px] xs:text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* MISSIONS GRID - Responsive */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8"
        >
          {missionsData.map((mission) => (
            <motion.div
              key={mission.id}
              variants={itemVariants}
              layout
              style={{
                backgroundImage: `url(${mission.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
              className="rounded-lg xs:rounded-xl sm:rounded-2xl overflow-hidden"
            >
              <Card
                variant="transparent"
                className={`h-full relative overflow-hidden transition-all duration-500 cursor-pointer p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 ${expandedMission === mission.id ? 'ring-2 ring-blue-500 shadow-2xl scale-[1.01]' : 'hover:shadow-xl'
                  }`}
                onClick={() => handleMissionClick(mission.id)}
              >
                {/* Overlay sombre pour la lisibilité du texte */}
                <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] transition-colors hover:bg-black/60" />

                {/* Contenu de la carte */}
                <div className="relative z-10 flex flex-col h-full min-h-[280px] xs:min-h-[300px] sm:min-h-[340px] md:min-h-[380px]">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                    <motion.div
                      whileHover={{ rotate: 10 }}
                      className={`p-2 xs:p-2.5 sm:p-3 md:p-3.5 lg:p-4 rounded-lg xs:rounded-xl sm:rounded-2xl bg-gradient-to-br ${mission.gradientFrom} ${mission.gradientTo} text-white shadow-lg`}
                    >
                      {mission.icon}
                    </motion.div>
                    <Badge variant="blue" className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] bg-black/80 text-white border border-white/20">
                      Mission {mission.id}
                    </Badge>
                  </div>

                  <h4 className="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white mb-1.5 xs:mb-2 sm:mb-3 md:mb-4">
                    {mission.title}
                  </h4>
                  <p className="text-gray-200 text-[10px] xs:text-xs sm:text-sm leading-relaxed mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8 italic flex-grow">
                    {mission.description}
                  </p>

                  <div className="bg-white/10 backdrop-blur-md rounded-lg xs:rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden mt-auto">
                    <div className="flex items-center justify-between p-2.5 xs:p-3 sm:p-4 md:p-5 bg-white/5">
                      <p className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] font-black text-blue-300 uppercase tracking-widest flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                        <Sparkles size={isMobile ? 8 : 10} className="sm:w-[12px] sm:h-[12px]" />
                        {t('missions.solutions_label')}
                      </p>
                      <motion.div animate={{ rotate: expandedMission === mission.id ? 180 : 0 }}>
                        <ChevronDown size={isMobile ? 14 : 16} className="text-gray-300" />
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {expandedMission === mission.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="p-2.5 xs:p-3 sm:p-4 md:p-5 lg:p-6 space-y-1.5 xs:space-y-2 sm:space-y-2.5 md:space-y-3"
                        >
                          {mission.solutions.map((sol, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ x: -10 }}
                              animate={{ x: 0 }}
                              className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3 text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-bold text-white"
                            >
                              <CheckCircle2 size={isMobile ? 12 : 14} className="text-blue-400 shrink-0" />
                              <span className="leading-tight">{sol}</span>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      navigate('/Donate');
                    }}
                    className="mt-3 xs:mt-4 sm:mt-5 md:mt-6 lg:mt-8 w-full py-2 xs:py-2.5 sm:py-3 md:py-3.5 lg:py-4 bg-white text-blue-900 rounded-lg xs:rounded-xl font-black text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 uppercase shadow-lg"
                  >
                    {t('missions.btn_support')}
                    <ArrowRight size={isMobile ? 10 : 12} className="sm:w-[14px] sm:h-[14px] md:w-[16px] md:h-[16px]" />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA BANNER - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 xs:mt-14 sm:mt-16 md:mt-20 lg:mt-24 bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 rounded-xl xs:rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] p-5 xs:p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-32 xs:w-40 sm:w-48 md:w-56 lg:w-64 h-32 xs:h-40 sm:h-48 md:h-56 lg:h-64 bg-yellow-500/20 rounded-full blur-xl sm:blur-2xl md:blur-3xl -mr-12 xs:-mr-16 sm:-mr-20 md:-mr-24 lg:-mr-32 -mt-12 xs:-mt-16 sm:-mt-20 md:-mt-24 lg:-mt-32" />
          <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 xs:mb-3 sm:mb-4 md:mb-5 lg:mb-6 uppercase tracking-tighter italic">
            {t('nav.donate')} <span className="text-yellow-400 underline decoration-wavy underline-offset-8">Solaris</span>
          </h3>
          <p className="text-blue-100 max-w-xl mx-auto mb-4 xs:mb-5 sm:mb-6 md:mb-8 lg:mb-10 text-xs xs:text-sm sm:text-base md:text-lg leading-relaxed px-2 xs:px-4">
            {t('hero.subtitle')}
          </p>
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate('/Donate')}
            className="text-xs xs:text-sm md:text-base px-6 xs:px-8 sm:px-10 md:px-12 py-2.5 xs:py-3 sm:py-3.5 md:py-4"
          >
            {t('footer.action_title')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Missions;