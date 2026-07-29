import React, { useState, useEffect, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Globe, ChevronRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/Button';

// --- TYPES ---
interface NavLink {
  name: string;
  href: string;
}

// --- HOOKS UTILITAIRES ---
const useActiveLink = (href: string) => {
  const location = useLocation();
  return location.pathname === href || (href !== '/' && location.pathname.startsWith(href));
};

const Navbar: React.FC = memo(() => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Vérifier si on est sur la page d'accueil
  const isHomePage = location.pathname === '/';

  // Calculer et partager la hauteur de la navbar
  useEffect(() => {
    const updateNavbarHeight = () => {
      const navbarElement = document.querySelector('nav');
      if (navbarElement) {
        const height = navbarElement.offsetHeight;
        setNavbarHeight(height);
        document.documentElement.style.setProperty('--navbar-height', `${height}px`);
      }
    };

    updateNavbarHeight();
    window.addEventListener('resize', updateNavbarHeight);
    window.addEventListener('scroll', updateNavbarHeight);

    return () => {
      window.removeEventListener('resize', updateNavbarHeight);
      window.removeEventListener('scroll', updateNavbarHeight);
      document.documentElement.style.removeProperty('--navbar-height');
    };
  }, [scrolled]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Empêcher le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'auto';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'auto';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/A-Propos' },
    { name: t('nav.missions'), href: '/Missions' },
    { name: t('nav.gallery'), href: '/Galerie' },
    { name: t('nav.blog'), href: '/Blog' },
    { name: t('nav.collection'), href: '/Collection' },
    { name: t('nav.contact'), href: '/Contact' },
  ];

  const toggleLang = () => {
    const newLang = i18n.language.startsWith('fr') ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  const handleDonateClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/Donate');
    setIsMenuOpen(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      {/* Spacer pour compenser la navbar fixe */}
      <div style={{ height: `${navbarHeight}px` }} className="w-full" />

      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled
            ? 'bg-white/60 backdrop-blur-2xl shadow-2xl py-2 border-b border-white/30'
            : 'bg-white/40 backdrop-blur-xl shadow-lg py-3 md:py-4 border-b border-white/30'
          }`}
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="flex justify-between items-center">
            {/* LOGO - Avec flèche retour sur les pages internes */}
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              {!isHomePage && (
                <button
                  onClick={handleGoBack}
                  className="p-2 rounded-lg hover:bg-white/40 text-gray-600 hover:text-blue-600 transition-all backdrop-blur-sm group border border-white/20"
                  aria-label="Retour"
                  title="Retour"
                >
                  <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
              )}
              <Link to="/" className="flex items-center gap-2 md:gap-3 group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-0.5 shadow-lg group-hover:rotate-6 transition-transform">
                  <div className="w-full h-full bg-white backdrop-blur-sm rounded-[10px] flex items-center justify-center overflow-hidden">
                    <img
                      src="/logo-solaris.png"
                      alt="Solaris Logo"
                      className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-xs sm:text-sm md:text-base lg:text-xl tracking-tighter uppercase bg-gradient-to-r from-blue-800 to-gray-700 bg-clip-text text-transparent">
                    SOLARIS <span className="text-yellow-500">HUMANITY</span>
                  </span>
                </div>
              </Link>
            </div>

            {/* DESKTOP NAV - Uniquement visible sur desktop (lg et plus) */}
            <div className="hidden lg:flex items-center space-x-0 xl:space-x-1">
              {navLinks.map((link) => (
                <NavLinkItem key={link.href} link={link} />
              ))}

              <button
                onClick={toggleLang}
                className="ml-2 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/30 text-gray-600 hover:text-blue-600 transition-all font-black text-[10px] lg:text-xs tracking-widest border-l border-white/30 backdrop-blur-sm"
                aria-label="Changer de langue"
              >
                <Globe size={14} />
                {i18n.language === 'fr' ? 'EN' : 'FR'}
              </button>

              <div className="ml-4">
                <Button size="sm" onClick={handleDonateClick} icon={<Heart size={14} className="fill-current" />}>
                  {t('nav.donate')}
                </Button>
              </div>
            </div>

            {/* BOUTON MENU HAMBURGER - Visible uniquement sur mobile et tablette */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors z-50 relative bg-white/30 backdrop-blur-md rounded-lg border border-white/30 shadow-lg hover:bg-white/50"
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MENU MOBILE & TABLETTE - Glassmorphism amélioré */}
        {isMenuOpen && (
          <>
            {/* Overlay avec blur */}
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-md z-40 lg:hidden animate-fadeIn"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Panel Menu */}
            <div className="lg:hidden fixed top-[calc(var(--navbar-height,72px)+0.5rem)] left-4 right-4 bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl z-50 animate-slideInUp border border-white/30 overflow-hidden">
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
                {/* Language selector */}
                <button
                  onClick={toggleLang}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-md rounded-xl text-blue-600 font-bold hover:from-blue-500/30 hover:to-indigo-500/30 transition-all border border-white/40 shadow-lg"
                >
                  <span className="flex items-center gap-2">
                    <Globe size={18} />
                    <span>{i18n.language === 'fr' ? 'Français' : 'English'}</span>
                  </span>
                  <span className="text-sm bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-white/30">
                    {i18n.language === 'fr' ? '🇬🇧 ENGLISH' : '🇫🇷 FRANÇAIS'}
                  </span>
                </button>

                {/* Navigation Links */}
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="flex items-center justify-between p-4 text-base font-bold text-gray-800 hover:text-blue-600 hover:bg-blue-500/20 rounded-xl transition-all group backdrop-blur-sm border border-transparent hover:border-white/30"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>{link.name}</span>
                      <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                    </Link>
                  ))}
                </div>

                {/* Bouton Don */}
                <Button
                  className="w-full py-4 mt-2 text-base font-bold shadow-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 backdrop-blur-sm"
                  onClick={handleDonateClick}
                  icon={<Heart size={18} className="fill-current" />}
                >
                  {t('nav.donate')}
                </Button>
              </div>
            </div>
          </>
        )}
      </nav>
    </>
  );
});

// --- NAV LINK ITEM ---
const NavLinkItem: React.FC<{ link: NavLink }> = memo(({ link }) => {
  const isActive = useActiveLink(link.href);
  return (
    <Link
      to={link.href}
      className={`relative px-2 xl:px-3 py-2 text-[10px] xl:text-[11px] font-black tracking-widest transition-all duration-300 rounded-lg whitespace-nowrap backdrop-blur-sm ${isActive
          ? 'text-blue-600 bg-blue-500/30 shadow-lg border border-blue-300/50'
          : 'text-gray-600 hover:text-blue-600 hover:bg-white/30 hover:shadow-md border border-transparent hover:border-white/30'
        }`}
    >
      {link.name.toUpperCase()}
      {isActive && (
        <div className="absolute bottom-0 left-2 xl:left-3 right-2 xl:right-3 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-sm" />
      )}
    </Link>
  );
});

// ✅ Injection des styles globaux corrigée
if (typeof document !== 'undefined') {
  const styleId = 'navbar-styles';
  if (!document.getElementById(styleId)) {
    const globalStyles = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
      }

      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
      }

      .animate-slideInUp {
        animation: slideInUp 0.3s ease-out;
      }

      .animate-float {
        animation: float 3s ease-in-out infinite;
      }

      /* Support mobile */
      @media (max-width: 1023px) {
        .backdrop-blur-xl {
          backdrop-filter: blur(16px);
        }
      }

      /* Support navigateurs anciens */
      @supports not (backdrop-filter: blur(10px)) {
        .backdrop-blur-sm, .backdrop-blur-md, .backdrop-blur-xl {
          background-color: rgba(255, 255, 255, 0.95);
        }
      }

      /* Scroll smooth sur mobile */
      @media (max-width: 768px) {
        .overflow-y-auto {
          -webkit-overflow-scrolling: touch;
        }
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.id = styleId;
    styleSheet.textContent = globalStyles;
    document.head.appendChild(styleSheet);
  }
}

export default Navbar;