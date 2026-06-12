import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import {
  FileText, Download, Eye, BarChart3, Camera,
  Shield, ArrowLeft, FileCheck, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface IReport {
  id: string;
  title: string;
  date: string;
  type: 'Trimestriel' | 'Mensuel' | 'Spécial';
  description: string;
  size: string;
  views: number;
  pdfUrl?: string;
}

const reports: IReport[] = [
  { id: '1', title: "Rapport d'Impact - Noël 2024", date: "Janvier 2025", type: 'Spécial', description: "Bilan complet de l'action au village Nkolafamba (Cameroun).", size: "4.2 MB", views: 1247 },
  { id: '2', title: "Bilan d'Activités Q1 2025", date: "Avril 2025", type: 'Trimestriel', description: "État d'avancement des projets d'accès à l'eau en Côte d'Ivoire.", size: "2.8 MB", views: 856 },
  { id: '3', title: "Registre de Collecte - Mars", date: "Mars 2025", type: 'Mensuel', description: "Transparence totale sur les dons financiers et matériels reçus.", size: "1.5 MB", views: 423 },
  { id: '4', title: "Projet Solaire - Avancement", date: "Février 2025", type: 'Spécial', description: "Installation des panneaux solaires dans 3 villages isolés.", size: "3.5 MB", views: 2156 }
];

const Reports: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter(r =>
      (selectedType === 'Tous' || r.type === selectedType) &&
      r.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedType, searchQuery]);

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-12">
          <Link to="/" className="inline-flex items-center gap-3 text-[10px] font-black text-gray-500 hover:text-blue-500 transition-all uppercase tracking-widest group">
            <div className="p-2 bg-gray-100 rounded-full group-hover:bg-blue-50 transition-colors">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            Retour au site
          </Link>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="blue" className="mb-4">TRANSPARENCE</Badge>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">
              Documents d'<span className="text-blue-500">Impact</span>
            </h1>
          </motion.div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Chercher un document..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { icon: <BarChart3 />, val: "100%", label: "Dons tracés" },
            { icon: <Camera />, val: "500+", label: "Photos" },
            { icon: <Eye />, val: "4.6k", label: "Lectures" },
            { icon: <FileCheck />, val: "2025", label: "Certifié" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 text-white p-6 rounded-[2rem] flex flex-col items-center text-center border border-white/5"
            >
              <div className="text-yellow-400 mb-3">{s.icon}</div>
              <p className="text-2xl font-black">{s.val}</p>
              <p className="text-[9px] font-bold text-blue-300 uppercase tracking-widest">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {['Tous', 'Trimestriel', 'Mensuel', 'Spécial'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`relative px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest transition-all ${selectedType === type ? 'text-white' : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
                }`}
            >
              <span className="relative z-10">{type.toUpperCase()}</span>
              {selectedType === type && (
                <motion.div
                  layoutId="activeReportType"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg shadow-blue-500/30"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 gap-4">
          <AnimatePresence mode='popLayout'>
            {filteredReports.map((report) => (
              <motion.div
                key={report.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ x: 10 }}
                className="group bg-white rounded-3xl p-6 md:p-8 border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row md:items-center gap-6"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <FileText size={28} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant={report.type === 'Spécial' ? 'blue' : 'dark'} className="text-[8px]">{report.type}</Badge>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{report.date}</span>
                  </div>
                  <h4 className="text-xl font-black text-gray-900 group-hover:text-blue-500 transition-colors">{report.title}</h4>
                  <p className="text-gray-500 text-sm mt-1">{report.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right mr-4 hidden md:block">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Taille</p>
                    <p className="text-xs font-bold text-gray-500">{report.size}</p>
                  </div>
                  <Button variant="outline" size="sm" icon={<Eye size={14} />}>LIRE</Button>
                  <Button size="sm" variant="primary" icon={<Download size={14} />}>PDF</Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-10 bg-blue-50 rounded-[3rem] border border-blue-100 flex flex-col md:flex-row items-center gap-8"
        >
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-lg shrink-0">
            <Shield size={40} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Engagement de traçabilité</h3>
            <p className="text-gray-600 leading-relaxed">
              Nous croyons que la confiance se mérite. Chaque donateur peut demander un accès détaillé
              aux rapports financiers complets de Solaris Humanity par simple demande.
            </p>
            <Link to="/Contact" className="inline-block mt-4 text-blue-600 font-black text-xs uppercase tracking-widest border-b-2 border-blue-200 hover:border-blue-500 transition-all">
              Poser une question comptable
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
};

export default Reports;