import React, { useState, useEffect } from 'react';
import { Sun, Heart, Sparkles, Play, Shield, Star, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Hero: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setIsVisible(true);

    const updateNavbarHeight = () => {
      const navbar = document.querySelector('nav');
      if (navbar) {
        setNavbarHeight(navbar.offsetHeight);
      }
    };

    updateNavbarHeight();
    window.addEventListener('resize', updateNavbarHeight);
    return () => window.removeEventListener('resize', updateNavbarHeight);
  }, []);

  const isEnglish = i18n.language.startsWith('en');
  const currentLogo = isEnglish ? '/logo-solaris-en.png' : '/logo-solaris.png';

  const testimonials = [
    { text: t('hero.testimonial_1_text'), author: t('hero.testimonial_1_author') },
    { text: t('hero.testimonial_2_text'), author: t('hero.testimonial_2_author') },
    { text: t('hero.testimonial_3_text'), author: t('hero.testimonial_3_author') },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToDonate = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/Donate');
  };

  const goToMissions = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/Missions');
  };

  return (
    <section
      id="accueil"
      className="relative min-h-[100dvh] flex items-center overflow-hidden bg-white"
      style={{ paddingTop: `${navbarHeight}px` }}
    >
      {/* Éléments décoratifs de fond - Responsive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[200px] xs:w-[300px] sm:w-[450px] md:w-[650px] lg:w-[800px] h-[200px] xs:h-[300px] sm:h-[450px] md:h-[650px] lg:h-[800px] bg-gradient-to-br from-blue-400/20 via-blue-300/10 to-transparent rounded-full blur-2xl sm:blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[180px] xs:w-[250px] sm:w-[350px] md:w-[500px] lg:w-[600px] h-[180px] xs:h-[250px] sm:h-[350px] md:h-[500px] lg:h-[600px] bg-gradient-to-tr from-blue-500/10 via-transparent to-transparent rounded-full blur-2xl sm:blur-3xl animate-pulse-slow animation-delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 xs:gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">

          {/* TEXTE - GAUCHE - Responsive */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className={`transition-all duration-700 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
              <Badge variant="blue" className="mb-4 xs:mb-5 sm:mb-6 md:mb-8 group cursor-pointer hover:scale-105 transition-all shadow-md inline-flex">
                <span className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                  <Sun size={isMobile ? 10 : 12} className="sm:w-[14px] sm:h-[14px] animate-spin-slow text-blue-500" />
                  <span className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs font-black tracking-widest uppercase">
                    {t('hero.foundation_date')}
                  </span>
                  <Sparkles size={isMobile ? 8 : 10} className="sm:w-[12px] sm:h-[12px] text-yellow-500" />
                </span>
              </Badge>
            </div>

            <h1 className={`transition-all duration-700 delay-200 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
              <span className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black leading-[1.2] sm:leading-[1.1] block uppercase">
                <span className="bg-gradient-to-r from-blue-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  {t('hero.title_part1')}
                </span>
              </span>
            </h1>

            <p className={`text-gray-600 text-sm xs:text-base sm:text-lg md:text-xl mb-5 xs:mb-6 sm:mb-7 md:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed px-4 sm:px-0 transition-all duration-700 delay-400 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
              {t('hero.title_part2')}
            </p>

             <p className={`text-gray-600 text-sm xs:text-base sm:text-lg md:text-xl mb-5 xs:mb-6 sm:mb-7 md:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed px-4 sm:px-0 transition-all duration-700 delay-400 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
              {t('hero.subtitle')}
            </p>

            <div className={`flex flex-col xs:flex-row items-center justify-center lg:justify-start gap-2 xs:gap-3 sm:gap-4 transition-all duration-700 delay-600 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'} px-4 sm:px-0`}>
              <Button
                size="lg"
                variant="primary"
                icon={<Heart className="sm:w-[18px] sm:h-[18px] fill-current" />}
                onClick={goToDonate}
                className="w-full xs:w-auto text-xs xs:text-sm sm:text-base px-4 xs:px-5 sm:px-6 py-2.5 xs:py-3 sm:py-3.5"
              >
                {t('hero.cta_projects')}
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={<Play className="sm:w-[18px] sm:h-[18px]" />}
                onClick={goToMissions}
                className="w-full xs:w-auto text-xs xs:text-sm sm:text-base px-4 xs:px-5 sm:px-6 py-2.5 xs:py-3 sm:py-3.5"
              >
                {t('hero.cta_missions')}
              </Button>
            </div>
          </div>

          {/* IMAGE - DROITE - Responsive */}
          <div className={`relative order-1 lg:order-2 transition-all duration-1000 delay-300 ${isVisible ? 'animate-fadeInRight' : 'opacity-0'} px-2 xs:px-3 sm:px-4`}>
            <div className="relative bg-white rounded-xl xs:rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] p-1.5 xs:p-2 sm:p-3 shadow-2xl border border-gray-100 group">
              <div className="aspect-[4/5] rounded-lg xs:rounded-xl sm:rounded-2xl md:rounded-[2.5rem] overflow-hidden relative bg-gray-50">

                {/* 📸 LOGO DYNAMIQUE */}
                <img
                  src={currentLogo}
                  alt="Solaris Humanity Action"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  loading="eager"
                  key={i18n.language}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
              </div>

              {/* Badges décoratifs - Responsive */}
              <div className="absolute -top-2 -right-2 xs:-top-2.5 xs:-right-2.5 sm:-top-3 sm:-right-3 md:-top-4 md:-right-4 w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg flex items-center justify-center text-blue-500 animate-float">
                <Sparkles size={isMobile ? 14 : 18} className="sm:w-[22px] sm:h-[22px] md:w-[24px] md:h-[24px]" />
              </div>
              <div className="absolute -bottom-2 -left-2 xs:-bottom-2.5 xs:-left-2.5 sm:-bottom-3 sm:-left-3 md:-bottom-4 md:-left-4 px-1.5 xs:px-2 sm:px-3 md:px-4 py-1 xs:py-1.5 sm:py-2 bg-gray-800 text-white rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg flex items-center gap-1 xs:gap-1.5 sm:gap-2 text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] font-black animate-float animation-delay-500">
                <Shield size={isMobile ? 8 : 10} className="sm:w-[12px] sm:h-[12px] text-yellow-500" />
                <span>{i18n.language.startsWith('fr') ? 'SÉCURISÉ' : 'SECURE'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles globaux - Optimisés */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fadeInRight {
          animation: fadeInRight 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-gradient {
          animation: gradient 4s ease infinite;
          background-size: 200% 200%;
        }

        .animation-delay-1000 {
          animation-delay: 1000ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        /* Support mobile pour les animations */
        @media (max-width: 640px) {
          .animate-fadeInUp {
            animation-duration: 0.6s;
          }
          
          .animate-fadeInRight {
            animation-duration: 0.6s;
          }
        }

        /* Support navigateurs anciens */
        @supports not (backdrop-filter: blur(10px)) {
          .backdrop-blur-sm {
            background-color: rgba(255, 255, 255, 0.9);
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;