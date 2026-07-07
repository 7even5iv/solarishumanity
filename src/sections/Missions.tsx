import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Droplets, HeartPulse, GraduationCap, Users,
  CheckCircle2, Sparkles, ArrowRight, TrendingUp,
  Target, Shield, ArrowLeft, ChevronDown
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

import { SectionTitle } from '../components/SectionTitle';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';

interface IMission {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  solutions: string[];
  gradientFrom: string;
  gradientTo: string;
}

const Missions: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [expandedMission, setExpandedMission] = useState<string | null>(null);

  const missionsData: IMission[] = useMemo(() => [
    {
      id: "01",
      title: t('missions.p1.title'),
      icon: <Droplets size={32} />,
      description: t('missions.p1.desc'),
      solutions: [
        t('collection.method_mobile'),
        "Installation de pompes solaires",
        "Sensibilisation à l'hygiène",
        "Filtration d'eau"
      ],
      gradientFrom: "from-blue-500",
      gradientTo: "to-cyan-600"
    },
    {
      id: "02",
      title: t('missions.p2.title'),
      icon: <HeartPulse size={32} />,
      description: t('missions.p2.desc'),
      solutions: ["Soutien aux dispensaires", "Campagnes de prévention", "Matériel médical", "Énergie solaire santé"],
      gradientFrom: "from-yellow-500",
      gradientTo: "to-orange-500"
    },
    {
      id: "03",
      title: t('missions.p3.title'),
      icon: <GraduationCap size={32} />,
      description: t('missions.p3.desc'),
      solutions: ["Fournitures scolaires", "Création de bibliothèques", "Formations couture/numérique", "Bourses d'études"],
      gradientFrom: "from-blue-500",
      gradientTo: "to-indigo-600"
    },
    {
      id: "04",
      title: t('missions.p4.title'),
      icon: <Users size={32} />,
      description: t('missions.p4.desc'),
      solutions: ["Dons alimentaires", "Équipements maison", "Collecte de jouets", "Marrainage"],
      gradientFrom: "from-yellow-500",
      gradientTo: "to-amber-600"
    }
  ], [t]);

  const statsItems = useMemo(() => [
    { label: t('about.stats.foundation'), value: "2025", icon: <Target size={20} /> },
    { label: t('about.stats.impact'), value: "1000+", icon: <Users size={20} /> },
    { label: t('about.stats.countries'), value: "3", icon: <Shield size={20} /> },
    { label: t('about.stats.transparency'), value: "100%", icon: <TrendingUp size={20} /> },
  ], [t]);

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
    <section id="missions" className="relative py-12 bg-white overflow-hidden min-h-screen">

      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle
          subtitle={t('missions.badge')}
          title={t('missions.title')}
          description={t('missions.description')}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {statsItems.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center hover:bg-blue-50/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4 text-blue-500">
                  {stat.icon}
                </div>
                <p className="text-3xl font-black text-gray-800 tracking-tighter">{stat.value}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {missionsData.map((mission) => (
            <motion.div key={mission.id} variants={itemVariants} layout>
              <Card
                className={`h-full relative overflow-hidden transition-all duration-500 cursor-pointer ${expandedMission === mission.id ? 'ring-2 ring-blue-500 shadow-2xl scale-[1.01]' : 'hover:shadow-xl'}`}
                onClick={() => handleMissionClick(mission.id)}
              >
                <div className="flex justify-between items-start mb-8">
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className={`p-4 rounded-2xl bg-gradient-to-br ${mission.gradientFrom} ${mission.gradientTo} text-white shadow-lg`}
                  >
                    {mission.icon}
                  </motion.div>
                  <Badge variant="blue">Mission {mission.id}</Badge>
                </div>

                <h4 className="text-2xl font-black text-gray-800 mb-4">{mission.title}</h4>
                <p className="text-gray-500 mb-8 leading-relaxed italic">{mission.description}</p>

                <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between p-5 bg-white/50">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles size={12} /> {t('missions.solutions_label')}
                    </p>
                    <motion.div animate={{ rotate: expandedMission === mission.id ? 180 : 0 }}>
                      <ChevronDown size={16} className="text-gray-400" />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {expandedMission === mission.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-6 space-y-3"
                      >
                        {mission.solutions.map((sol, idx) => (
                          <motion.div key={idx} initial={{ x: -10 }} animate={{ x: 0 }} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                            <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                            {sol}
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
                  className="mt-8 w-full py-4 bg-gray-800 text-white rounded-xl font-black text-[10px] tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 uppercase"
                >
                  {t('missions.btn_support')}
                  <ArrowRight size={14} />
                </button>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl -mr-32 -mt-32" />
          <h3 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter italic">
            {t('nav.donate')} <span className="text-yellow-400 underline decoration-wavy underline-offset-8">Solaris</span>
          </h3>
          <p className="text-blue-100 max-w-xl mx-auto mb-10 text-lg leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <Button size="lg" variant="primary" onClick={() => navigate('/Donate')}>
            {t('footer.action_title')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Missions;