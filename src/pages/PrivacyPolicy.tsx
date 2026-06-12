import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import {
  Shield, Database, Eye, Target, Clock, UserCheck,
  Mail, Lock, ArrowLeft
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

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const privacySections = [
    {
      icon: Database,
      title: "Collecte des données personnelles",
      number: "1",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Nous collectons uniquement les informations nécessaires pour traiter vos demandes et vos dons.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {["Identité", "Email", "Téléphone", "Historique de dons"].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <span className="text-xs font-bold text-gray-700 uppercase">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      icon: Target,
      title: "Finalité du traitement",
      number: "2",
      content: (
        <ul className="space-y-3">
          {[
            "Gestion de vos dons via HelloAsso",
            "Envoi des rapports d'impact trimestriels",
            "Réponse aux formulaires de contact"
          ].map((text, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 rounded-full bg-yellow-500" /> {text}
            </li>
          ))}
        </ul>
      )
    },
    {
      icon: Clock,
      title: "Conservation",
      number: "3",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-xl space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
              <span>Données contact</span>
              <span>3 ans</span>
            </div>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              className="h-1 bg-blue-500 rounded-full"
            />
          </div>
        </div>
      )
    },
    {
      icon: UserCheck,
      title: "Vos droits (RGPD)",
      number: "4",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.</p>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700">Contact DPO : contact@solarishumanity.fr</span>
            <Mail size={16} className="text-blue-500" />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 overflow-hidden">

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-4xl mx-auto px-4 pt-8"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-3 text-[10px] font-black text-gray-500 hover:text-blue-500 transition-all uppercase tracking-[0.2em] group"
        >
          <div className="p-2.5 bg-gray-100 rounded-full group-hover:bg-blue-50 transition-colors shadow-sm">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          Retour au site
        </Link>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-12">

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-16"
        >
          <Badge variant="blue" className="mb-6" icon={<Lock size={12} />}>
            PROTECTION DES DONNÉES
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter">
            Politique de <span className="text-blue-500">Confidentialité</span>
          </h1>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <Eye size={14} /> Mise à jour : Mai 2025
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 p-8 bg-gradient-to-br from-blue-50 to-white rounded-[2.5rem] border border-blue-100"
        >
          <div className="flex gap-6 items-start">
            <div className="p-4 bg-white rounded-2xl shadow-sm text-blue-500">
              <Shield size={32} />
            </div>
            <p className="text-gray-600 leading-relaxed font-medium">
              Chez <strong className="text-gray-900">Solaris Humanity</strong>, la protection de votre vie privée est une priorité.
              Cette politique détaille comment nous veillons sur les informations que vous nous confiez.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {privacySections.map((section) => (
            <motion.div
              key={section.number}
              variants={fadeInUp}
              className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:border-blue-200 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5"
            >
              <div className="p-8">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gray-900 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors duration-500">
                    <section.icon size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Article {section.number}</span>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{section.title}</h3>
                  </div>
                </div>
                <div>{section.content}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-10 bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 rounded-[3rem] text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl -ml-24 -mb-24" />
          <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Besoin de plus d'infos ?</h3>
          <p className="text-blue-100 mb-8 max-w-md mx-auto">Notre responsable des données (DPO) est à votre disposition.</p>
          <Button variant="primary" onClick={() => window.location.href = 'mailto:contact@solarishumanity.fr'}>CONTACTER LE DPO</Button>
        </motion.div>

        <div className="mt-8 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Solaris Humanity © {new Date().getFullYear()} — Tous droits réservés
        </div>
      </div>

      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
};

export default PrivacyPolicy;