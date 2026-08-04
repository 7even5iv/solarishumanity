import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Mail, MapPin, Heart, ChevronUp, Clock, Sparkles, Send
} from 'lucide-react';

import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { CONTENT } from '../constants/content';

const InstagramIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [isMobile, setIsMobile] = useState(false);

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
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 4000);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative bg-white/80 backdrop-blur-md text-gray-800 pt-10 xs:pt-12 sm:pt-16 md:pt-20 pb-6 xs:pb-8 sm:pb-10 overflow-hidden font-sans border-t border-white/20">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-yellow-400 to-blue-500" />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-5 xs:gap-6 sm:gap-8 md:gap-10 lg:gap-12 mb-8 xs:mb-10 sm:mb-12 md:mb-16 lg:mb-20"
        >
          {/* COLONNE 1 - Logo & Description */}
          <motion.div variants={itemVariants} className="space-y-2.5 xs:space-y-3 sm:space-y-4 md:space-y-5 text-center xs:text-left">
            <Link to="/" onClick={scrollToTop} className="flex flex-col items-center xs:items-start gap-1.5 xs:gap-2 sm:gap-3 group">
              <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg xs:rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-0.5 shadow-lg group-hover:rotate-6 transition-transform">
                  <div className="w-full h-full rounded-lg xs:rounded-xl bg-white/90 flex items-center justify-center overflow-hidden transition-transform group-hover:rotate-6">
                    <img
                      src="/logo-solaris.png"
                      alt="Logo Solaris Humanity"
                      className="w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-xl tracking-tighter uppercase bg-gradient-to-r from-blue-800 to-gray-700 bg-clip-text text-transparent">
                    SOLARIS <span className="text-yellow-500">HUMANITY</span>
                  </span>
                  <span className="text-[6px] xs:text-[7px] sm:text-[8px] font-black text-gray-400 tracking-widest uppercase">
                    {t('footer.international_label')}
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-gray-600 italic text-[10px] xs:text-xs sm:text-sm leading-relaxed border-l-2 border-blue-500 pl-2.5 xs:pl-3 sm:pl-4">
              {t('footer.quote')}
            </p>
            <div className="flex gap-1.5 xs:gap-2 justify-center xs:justify-start flex-wrap">
              <Badge variant="light" className="bg-blue-50/50 backdrop-blur-sm border-blue-200 text-blue-700 text-[7px] xs:text-[8px] sm:text-[9px] font-black uppercase tracking-tighter">
                {t('footer.ong_label')}
              </Badge>
              <Badge variant="light" className="bg-blue-50/50 backdrop-blur-sm border-blue-200 text-blue-700 text-[7px] xs:text-[8px] sm:text-[9px] font-black uppercase tracking-tighter">
                {t('footer.law_label')}
              </Badge>
            </div>
          </motion.div>

          {/* COLONNE 2 - Contact */}
          <motion.div variants={itemVariants} className="space-y-2.5 xs:space-y-3 sm:space-y-4 md:space-y-5">
            <h4 className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] xs:tracking-[0.2em] sm:tracking-[0.3em] text-blue-600 text-center xs:text-left">
              {t('footer.contact_title')}
            </h4>
            <ul className="space-y-1.5 xs:space-y-2 sm:space-y-3 md:space-y-4">
              <li className="flex items-start gap-1.5 xs:gap-2 sm:gap-3 group">
                <MapPin size={isMobile ? 14 : 16} className="text-blue-500 shrink-0 mt-0.5" />
                <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {t('footer.contact_locations')}
                </span>
              </li>
              <li className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 group">
                <Mail size={isMobile ? 14 : 16} className="text-blue-500 shrink-0" />
                <a
                  href="mailto:Contact@solarishumanity.org"
                  className="text-[10px] xs:text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors break-all"
                >
                  Contact@solarishumanity.org
                </a>
              </li>
              <li className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 group">
                <Clock size={isMobile ? 14 : 16} className="text-blue-500 shrink-0" />
                <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 italic">
                  {t('footer.contact_response')}
                </span>
              </li>
            </ul>
          </motion.div>

          {/* COLONNE 3 - Newsletter */}
          <motion.div variants={itemVariants} className="space-y-2.5 xs:space-y-3 sm:space-y-4 md:space-y-5">
            <h4 className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] xs:tracking-[0.2em] sm:tracking-[0.3em] text-blue-600 text-center xs:text-left">
              {t('footer.newsletter_title')}
            </h4>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed text-center xs:text-left">
              {t('footer.newsletter_desc')}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="relative">
              <input
                type="email"
                required
                placeholder={t('footer.newsletter_placeholder') || 'votre@email.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-2.5 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 rounded-lg xs:rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200 focus:border-blue-500 outline-none transition-all text-[10px] xs:text-xs sm:text-sm pr-7 xs:pr-8 sm:pr-10 text-gray-800"
                aria-label="Adresse email newsletter"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="absolute right-1.5 xs:right-2 sm:right-2.5 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700 transition-colors disabled:opacity-50"
                aria-label="S'inscrire à la newsletter"
              >
                {status === 'loading' ? (
                  <div className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send size={isMobile ? 14 : 16} className="sm:w-[18px] sm:h-[18px]" />
                )}
              </button>
              <AnimatePresence>
                {status === 'success' && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[8px] xs:text-[9px] sm:text-[10px] text-green-600 mt-1 xs:mt-1.5 font-black uppercase text-center xs:text-left"
                  >
                    {t('footer.newsletter_success', 'Merci pour votre inscription !')}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* COLONNE 4 - Action */}
          <motion.div variants={itemVariants} className="space-y-2.5 xs:space-y-3 sm:space-y-4 md:space-y-5">
            <div className="bg-gradient-to-br from-blue-50/50 to-white/30 backdrop-blur-sm p-3 xs:p-4 sm:p-5 rounded-xl xs:rounded-2xl sm:rounded-[2rem] border border-white/30 shadow-lg">
              <h4 className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-wider mb-1.5 xs:mb-2 sm:mb-3 flex items-center justify-center xs:justify-start gap-1.5 xs:gap-2">
                <Sparkles size={isMobile ? 10 : 12} className="text-blue-500" />
                <span>{t('footer.action_title')}</span>
              </h4>
              <Button
                variant="primary"
                size="sm"
                className="w-full mb-2 xs:mb-3 sm:mb-4 text-[10px] xs:text-xs sm:text-sm md:text-base py-1.5 xs:py-2 sm:py-2.5"
                onClick={() => navigate('/Donate')}
              >
                <Heart size={isMobile ? 12 : 14} className="mr-1 xs:mr-1.5 sm:mr-2 fill-current" />
                {t('nav.donate')}
              </Button>
              <div className="flex justify-center xs:justify-start items-center pt-1 xs:pt-1.5 sm:pt-2">
                <a
                  href="https://www.instagram.com/solarishumanity?utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 md:w-14 md:h-14" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* BAS DE PAGE - Responsive */}
        <div className="pt-4 xs:pt-5 sm:pt-6 md:pt-8 lg:pt-10 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-2 xs:gap-3 sm:gap-4 text-[8px] xs:text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest">
          <p className="text-gray-500 text-center text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px]">
            © {currentYear} {CONTENT.header?.title || 'SOLARIS HUMANITY'} — {t('footer.rights')}
          </p>
          <div className="flex gap-2 xs:gap-3 sm:gap-4 md:gap-6">
            <Link
              to="/mentions-legales"
              className="text-gray-500 hover:text-blue-500 transition-colors text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px]"
            >
              {t('footer.legal')}
            </Link>
            <Link
              to="/confidentialite"
              className="text-gray-500 hover:text-blue-500 transition-colors text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px]"
            >
              {t('footer.privacy')}
            </Link>
          </div>
        </div>
      </div>

      {/* BOUTON RETOUR EN HAUT - Responsive */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-3 xs:bottom-4 sm:bottom-6 md:bottom-8 right-3 xs:right-4 sm:right-6 md:right-8 z-[99] w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-600/90 backdrop-blur-sm text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-yellow-500 transition-all duration-300"
            aria-label="Retour en haut"
          >
            <ChevronUp size={isMobile ? 14 : 16} className="sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px]" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;