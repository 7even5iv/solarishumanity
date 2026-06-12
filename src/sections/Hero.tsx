import React, { useState, useEffect } from 'react';
import { Sun, Heart, Sparkles, Play, Shield, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navigate = useNavigate();

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

  // 🌍 LOGIQUE DU LOGO BILINGUE
  // On détecte si la langue commence par 'en'
  const isEnglish = i18n.language.startsWith('en');
  // On définit le chemin de l'image en fonction de la langue
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
      {/* Éléments décoratifs de fond */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] bg-gradient-to-br from-blue-400/20 via-blue-300/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[300px] sm:w-[450px] md:w-[600px] h-[300px] sm:h-[450px] md:h-[600px] bg-gradient-to-tr from-blue-500/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse-slow animation-delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">

          {/* TEXTE - GAUCHE (Garder ton code tel quel) */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* ... contenu du texte ... */}
            <div className={`transition-all duration-700 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
              <Badge variant="blue" className="mb-6 sm:mb-8 group cursor-pointer hover:scale-105 transition-all shadow-md inline-flex">
                <span className="flex items-center gap-1 sm:gap-2">
                  <Sun size={12} className="sm:w-[14px] sm:h-[14px] animate-spin-slow text-blue-500" />
                  <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase">{t('hero.foundation_date')}</span>
                  <Sparkles size={10} className="sm:w-[12px] sm:h-[12px] text-yellow-500" />
                </span>
              </Badge>
            </div>

            <h1 className={`transition-all duration-700 delay-200 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-gray-800 leading-[1.2] sm:leading-[1.1] block mb-3 sm:mb-4 uppercase">
                {t('hero.title_part1')}
              </span>
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black leading-[1.2] sm:leading-[1.1] block uppercase">
                <span className="bg-gradient-to-r from-blue-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  {t('hero.title_part2')}
                </span>
                <span className="text-gray-800"> »</span>
              </span>
            </h1>

            <p className={`text-gray-600 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed px-4 sm:px-0 transition-all duration-700 delay-400 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
              {t('hero.subtitle')}
            </p>

            {/* Témoignage */}
            <div className={`mb-8 sm:mb-10 p-4 sm:p-5 bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-blue-100 shadow-sm transition-all duration-700 delay-500 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'} mx-4 sm:mx-0`}>
              <div className="flex items-start gap-3 sm:gap-4">
                <Star size={16} className="sm:w-[18px] sm:h-[18px] text-yellow-500 fill-yellow-500 shrink-0 mt-0.5 sm:mt-1" />
                <div className="text-left">
                  <p className="text-gray-600 text-xs sm:text-sm italic leading-relaxed line-clamp-3 sm:line-clamp-none">
                    "{testimonials[activeTestimonial].text}"
                  </p>
                  <p className="text-[9px] sm:text-[10px] font-black text-blue-500 uppercase tracking-widest mt-2">
                    — {testimonials[activeTestimonial].author}
                  </p>
                </div>
              </div>
            </div>

            <div className={`flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 transition-all duration-700 delay-600 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'} px-4 sm:px-0`}>
              <Button size="lg" variant="primary" icon={<Heart className="sm:w-[18px] sm:h-[18px] fill-current" />} onClick={goToDonate} className="w-full sm:w-auto text-sm sm:text-base">
                {t('hero.cta_projects')}
              </Button>
              <Button variant="outline" size="lg" icon={<Play className="sm:w-[18px] sm:h-[18px]" />} onClick={goToMissions} className="w-full sm:w-auto text-sm sm:text-base">
                {t('hero.cta_missions')}
              </Button>
            </div>
          </div>

          {/* IMAGE - DROITE */}
          <div className={`relative order-1 lg:order-2 transition-all duration-1000 delay-300 ${isVisible ? 'animate-fadeInRight' : 'opacity-0'} px-4 sm:px-0`}>
            <div className="relative bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] p-2 sm:p-3 shadow-2xl border border-gray-100 group">
              <div className="aspect-[4/5] rounded-xl sm:rounded-2xl md:rounded-[2.5rem] overflow-hidden relative bg-gray-50">

                {/* 📸 LOGO DYNAMIQUE ICI */}
                <img
                  src={currentLogo}
                  alt="Solaris Humanity Action"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  loading="eager"
                  key={i18n.language} // La clé force React à recharger proprement l'image
                />

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
              </div>

              {/* Badges décoratifs */}
              <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl shadow-lg flex items-center justify-center text-blue-500 animate-float">
                <Sparkles size={18} className="sm:w-[24px] sm:h-[24px]" />
              </div>
              <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gray-800 text-white rounded-lg sm:rounded-xl shadow-lg flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[10px] font-black animate-float animation-delay-500">
                <Shield size={10} className="sm:w-[12px] sm:h-[12px] text-yellow-500" />
                <span>{i18n.language.startsWith('fr') ? 'SÉCURISÉ' : 'SECURE'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;