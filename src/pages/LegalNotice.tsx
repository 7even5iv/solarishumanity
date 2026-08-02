import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import {
  Shield, Building, Server, Copyright,
  Eye, Lock, Mail, MapPin,
  ArrowLeft
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const LegalNotice: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const legalSections = useMemo(() => [
    {
      icon: Building,
      title: t('footer.ong_label'),
      number: "1",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            {i18n.language.startsWith('fr')
              ? "Le site www.solarishumanity.org est édité par l'association Solaris Humanity, régie par la loi 1901."
              : "The website www.solarishumanity.org is published by the Solaris Humanity association, governed by the 1901 law."}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <MapPin size={16} className="text-blue-500" />
              <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{t('legal.hq')}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <Mail size={16} className="text-blue-500" />
              <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Contact@solarishumanity.org</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Server,
      title: t('legal.article_label') + " 2",
      number: "2",
      content: <p className="text-gray-600 leading-relaxed">{t('legal.hosting_text')}</p>
    },
    {
      icon: Copyright,
      title: t('legal.article_label') + " 3",
      number: "3",
      content: <p className="text-gray-600 leading-relaxed">{t('legal.ip_text')}</p>
    },
    {
      icon: Lock,
      title: t('legal.article_label') + " 4",
      number: "4",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">{t('legal.data_text')}</p>
          <Button variant="outline" size="sm" onClick={() => navigate('/confidentialite')}>
            {t('legal.view_privacy')}
          </Button>
        </div>
      )
    }
  ], [t, i18n.language, navigate]);

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-12">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-16">
          <Badge variant="blue" className="mb-6 uppercase" icon={<Shield size={12} />}>
            {t('footer.legal')}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter uppercase">
            {t('footer.legal')}
          </h1>
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <Eye size={14} /> {t('legal.update_label')} Janvier 2025
          </div>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
          {legalSections.map((section) => (
            <motion.div
              key={section.number}
              variants={fadeInUp}
              className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:border-blue-200 transition-all duration-300 hover:shadow-xl"
            >
              <div className="p-8">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-500 shadow-sm">
                    <section.icon size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{t('legal.article_label')} {section.number}</span>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">{section.title}</h3>
                  </div>
                </div>
                <div className="animate-fadeIn">{section.content}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LegalNotice;