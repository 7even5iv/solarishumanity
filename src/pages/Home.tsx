import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import Hero from '../sections/Hero';
import { SectionTitle } from '../components/SectionTitle';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { client, urlFor } from '../lib/sanity';
import {
  Droplets, HeartPulse, GraduationCap,
  Sparkles, Users, Globe, Shield, TrendingUp, Heart, Camera,
  Calendar, ArrowRight, Mail, BookOpen, Clock, User, Tag, Eye, AlertCircle,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { Badge } from '../components/Badge';

// --- COMPOSANT STATISTIQUE ---
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// --- COMPOSANT SLIDER BLOG ---
const BlogSlider = ({ posts, isFr, navigate }: { posts: any[], isFr: boolean, navigate: any }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Déterminer le nombre de slides à afficher selon la taille d'écran
  useEffect(() => {
    const updateSlidesToShow = () => {
      const width = window.innerWidth;
      if (width < 640) setSlidesToShow(1);
      else if (width < 1024) setSlidesToShow(2);
      else setSlidesToShow(3);
    };

    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, []);

  const totalSlides = Math.ceil(posts.length / slidesToShow);
  const maxIndex = Math.max(0, totalSlides - 1);

  const nextSlide = () => {
    if (!isAnimating && currentIndex < maxIndex) {
      setIsAnimating(true);
      setCurrentIndex(prev => prev + 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isAnimating && currentIndex > 0) {
      setIsAnimating(true);
      setCurrentIndex(prev => prev - 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const goToSlide = (index: number) => {
    if (!isAnimating && index !== currentIndex) {
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  // Récupérer les posts pour le slide actuel
  const getCurrentPosts = () => {
    const start = currentIndex * slidesToShow;
    const end = start + slidesToShow;
    return posts.slice(start, end);
  };

  const currentPosts = getCurrentPosts();

  // Composant Card Blog (intégré dans le slider)
  const BlogCard = ({ post }: { post: any }) => {
    const [isHovered, setIsHovered] = useState(false);

    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString(isFr ? 'fr-FR' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (error) {
        return dateString;
      }
    };

    const getImageUrl = () => {
      if (!post.mainImage) return null;
      try {
        return urlFor(post.mainImage).width(600).height(400).url();
      } catch (error) {
        return null;
      }
    };

    const imageUrl = getImageUrl();
    const title = isFr ? post.titleFr : post.titleEn;
    const excerpt = isFr ? post.excerptFr : post.excerptEn;
    const slug = post.slug?.current || post.slug;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4 }}
        className="group cursor-pointer h-full px-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => slug && navigate(`/Blog/${slug}`)}
      >
        <Card variant="glass" className="h-full overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col">
          {/* Image de l'article */}
          <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title || 'Article'}
                className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'
                  }`}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                <BookOpen size={64} className="text-blue-300" />
              </div>
            )}

            {/* Overlay gradient */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'
              }`} />

            {/* Badge catégorie */}
            {post.categories && post.categories.length > 0 && (
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {post.categories.slice(0, 2).map((category: string, idx: number) => (
                  <Badge key={idx} variant="blue" className="text-[8px] xs:text-[9px] font-bold shadow-lg backdrop-blur-sm bg-blue-600/90">
                    <Tag size={10} className="inline mr-1" />
                    {category}
                  </Badge>
                ))}
                {post.categories.length > 2 && (
                  <Badge variant="gray" className="text-[8px] xs:text-[9px] font-bold shadow-lg backdrop-blur-sm bg-gray-800/90">
                    +{post.categories.length - 2}
                  </Badge>
                )}
              </div>
            )}

            {/* Temps de lecture sur l'image */}
            {post.readingTime && (
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5">
                <Clock size={12} />
                {post.readingTime} min
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className="p-5 xs:p-6 sm:p-7 flex flex-col flex-grow">
            {/* Métadonnées */}
            <div className="flex items-center justify-between text-gray-400 text-[10px] xs:text-[11px] font-medium mb-3">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-blue-400" />
                {formatDate(post.publishedAt)}
              </span>
              {post.views && (
                <span className="flex items-center gap-1.5">
                  <Eye size={14} className="text-blue-400" />
                  {post.views}
                </span>
              )}
            </div>

            {/* Titre */}
            <h3 className={`text-base xs:text-lg sm:text-xl font-black text-gray-900 mb-3 transition-colors line-clamp-2 uppercase tracking-tighter ${isHovered ? 'text-blue-600' : ''
              }`}>
              {title || 'Sans titre'}
            </h3>

            {/* Extrait */}
            {excerpt && (
              <p className="text-gray-500 text-xs xs:text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                {excerpt}
              </p>
            )}

            {/* Auteur et lien */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
              <div className="flex items-center gap-2.5">
                {post.authorImage ? (
                  <img
                    src={urlFor(post.authorImage).width(40).height(40).url()}
                    alt={post.author || 'Auteur'}
                    className="w-8 h-8 rounded-full object-cover border-2 border-blue-100"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {post.author ? post.author.charAt(0).toUpperCase() : 'S'}
                  </div>
                )}
                <span className="text-gray-600 text-[10px] xs:text-[11px] font-medium">
                  {post.author || 'Équipe Solaris Humanity'}
                </span>
              </div>

              <motion.div
                initial={{ x: 0 }}
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 p-0 hover:bg-transparent group"
                  icon={<ArrowRight size={16} className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''
                    }`} />}
                >
                  <span className="text-[10px] xs:text-[11px] font-bold">
                    {isFr ? 'Lire' : 'Read'}
                  </span>
                </Button>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="relative">
      {/* Conteneur du slider */}
      <div className="overflow-hidden px-4">
        <div
          ref={sliderRef}
          className="transition-all duration-500 ease-in-out"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-7 sm:gap-8">
            {currentPosts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </div>

      {/* Boutons de navigation */}
      {totalSlides > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`p-2 rounded-full transition-all duration-300 ${currentIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110'
              }`}
            aria-label="Précédent"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Indicateurs de pagination */}
          <div className="flex gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${index === currentIndex
                    ? 'w-8 h-2.5 bg-blue-600'
                    : 'w-2 h-2.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                aria-label={`Aller à la slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentIndex === maxIndex}
            className={`p-2 rounded-full transition-all duration-300 ${currentIndex === maxIndex
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110'
              }`}
            aria-label="Suivant"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [latestMedia, setLatestMedia] = useState<any[]>([]);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const isFr = i18n.language.startsWith('fr');

  // Détection de la taille d'écran
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Récupération des médias
    const fetchMedia = async () => {
      try {
        const data = await client.fetch(`*[_type == "gallery"] | order(_createdAt desc) [0...4]`);
        setLatestMedia(data || []);
      } catch (error) {
        console.error('Erreur chargement galerie:', error);
      }
    };

    // Récupération des articles de blog
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Requête GROQ pour récupérer les articles
        const query = `*[_type == "post"] | order(publishedAt desc) {
          _id,
          titleFr,
          titleEn,
          "slug": slug.current,
          excerptFr,
          excerptEn,
          publishedAt,
          author,
          authorImage,
          mainImage,
          categories,
          readingTime,
          views
        }`;

        console.log('🔍 Requête GROQ envoyée:', query);

        const data = await client.fetch(query);
        console.log('📦 Données reçues de Sanity:', data);

        if (data && Array.isArray(data)) {
          if (data.length > 0) {
            setLatestPosts(data);
            console.log(`✅ ${data.length} articles chargés avec succès`);
          } else {
            setError('Aucun article trouvé dans la base de données');
            console.warn('⚠️ La requête a retourné un tableau vide');
          }
        } else {
          setError('Format de données invalide');
          console.error('❌ Données reçues au format incorrect:', data);
        }
      } catch (err) {
        console.error('❌ Erreur détaillée lors du chargement des articles:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };

    // Exécuter les deux requêtes
    Promise.all([fetchMedia(), fetchBlogPosts()]);
  }, []);

  const keyStats = useMemo(() => [
    { icon: <Calendar />, value: t('stats.since'), label: t('about.tabs.histoire'), color: "text-blue-500" },
    { icon: <Users />, value: t('stats.impact'), label: t('about.stats.impact'), color: "text-blue-500" },
    { icon: <Globe />, value: t('stats.country'), label: t('about.stats.countries'), color: "text-blue-500" },
    { icon: <Shield />, value: t('stats.transparency'), label: t('about.stats.transparency'), color: "text-blue-500" },
  ], [t]);

  const missionsTeaser = useMemo(() => [
    { icon: <Droplets size={32} />, title: t('missions.p1.title'), desc: t('missions.p1.desc') },
    { icon: <HeartPulse size={32} />, title: t('missions.p2.title'), desc: t('missions.p2.desc') },
    { icon: <GraduationCap size={32} />, title: t('missions.p3.title'), desc: t('missions.p3.desc') }
  ], [t]);

  return (
    <main className="overflow-hidden bg-white">
      <Hero />

      {/* SECTION STATISTIQUES */}
      <section className="py-12 xs:py-16 sm:py-20 border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {keyStats.map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="text-center group">
                <Card variant="gradient" className="h-full py-6 xs:py-8 sm:py-10">
                  <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 mx-auto mb-2 xs:mb-3 sm:mb-4 bg-blue-50 rounded-xl xs:rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-gray-900 mb-0.5 xs:mb-1 uppercase tracking-tighter">
                    {stat.value}
                  </p>
                  <p className="text-[8px] xs:text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">
                    {stat.label}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION MISSIONS */}
      <section className="py-16 xs:py-20 sm:py-24 md:py-28 lg:py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6">
          <SectionTitle
            subtitle={t('missions.badge')}
            title={t('missions.title')}
            description={t('missions.description')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8 mt-10 xs:mt-12 sm:mt-14 md:mt-16">
            {missionsTeaser.map((item, i) => (
              <Card key={i} variant="glass" className="text-center flex flex-col h-full border-b-4 border-b-transparent hover:border-b-blue-600 transition-all p-5 xs:p-6 sm:p-7 md:p-8">
                <div className="w-14 h-14 xs:w-15 xs:h-15 sm:w-16 sm:h-16 mx-auto mb-4 xs:mb-5 sm:mb-6 md:mb-8 bg-white shadow-sm text-blue-500 rounded-xl xs:rounded-2xl flex items-center justify-center">
                  {item.icon}
                </div>
                <h4 className="text-base xs:text-lg sm:text-xl font-black text-gray-900 mb-2 xs:mb-3 sm:mb-4 uppercase tracking-tighter">
                  {item.title}
                </h4>
                <p className="text-gray-500 text-xs xs:text-sm leading-relaxed mb-6 xs:mb-8 sm:mb-10 flex-grow italic">
                  {item.desc}
                </p>
                <Button variant="outline" size="sm" className="w-full text-xs xs:text-sm" onClick={() => navigate('/Missions')}>
                  {t('missions.btn_support')}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION BLOG - SLIDER DYNAMIQUE AVEC SANITY */}
      <section className="py-16 xs:py-20 sm:py-24 md:py-28 lg:py-32 bg-white border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6">
          <SectionTitle
            subtitle={t('blog.badge', { defaultValue: 'Actualités' })}
            title={t('blog.title', { defaultValue: 'Derniers Articles' })}
            description={t('blog.description', { defaultValue: 'Découvrez nos dernières actualités et histoires inspirantes' })}
          />

          {isLoading ? (
            // État de chargement
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-7 sm:gap-8 mt-10 xs:mt-12 sm:mt-14 md:mt-16">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl h-48"></div>
                  <div className="mt-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            // État d'erreur
            <div className="text-center py-16 bg-red-50 rounded-2xl mt-10">
              <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
              <p className="text-red-600 font-medium mb-2">
                {isFr ? 'Erreur de chargement des articles' : 'Error loading articles'}
              </p>
              <p className="text-red-400 text-sm">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                {isFr ? 'Réessayer' : 'Retry'}
              </Button>
            </div>
          ) : latestPosts.length === 0 ? (
            // Aucun article
            <div className="text-center py-16 bg-gray-50 rounded-2xl mt-10">
              <div className="w-20 h-20 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                <BookOpen size={40} className="text-blue-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                {isFr ? 'Aucun article disponible' : 'No articles available'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {isFr ? 'Revenez bientôt pour découvrir nos actualités' : 'Check back soon for our latest news'}
              </p>
            </div>
          ) : (
            <>
              {/* Slider des articles */}
              <div className="mt-10 xs:mt-12 sm:mt-14 md:mt-16">
                <BlogSlider
                  posts={latestPosts}
                  isFr={isFr}
                  navigate={navigate}
                />
              </div>

              {/* Bouton Voir tous les articles */}
              <div className="text-center mt-12 xs:mt-14 sm:mt-16">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/Blog')}
                  icon={<BookOpen size={isMobile ? 16 : 20} />}
                  className="px-8 xs:px-10 sm:px-12 hover:scale-105 transition-transform"
                >
                  {t('blog.view_all', { defaultValue: 'Voir tous les articles' })}
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* SECTION GALERIE */}
      <section className="py-16 xs:py-20 sm:py-24 md:py-28 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 xs:gap-10 sm:gap-12 md:gap-16 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <Badge variant="blue" className="mb-4 xs:mb-5 sm:mb-6 uppercase text-[10px] xs:text-xs">
                {t('nav.gallery')}
              </Badge>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 xs:mb-5 sm:mb-6 md:mb-8 leading-tight uppercase tracking-tighter">
                {t('gallery.title')}
              </h2>
              <p className="text-gray-500 text-sm xs:text-base sm:text-lg mb-6 xs:mb-8 sm:mb-10 leading-relaxed italic">
                {t('gallery.description')}
              </p>
              <Button onClick={() => navigate('/Galerie')} icon={<Camera size={isMobile ? 16 : 20} />} className="text-sm xs:text-base">
                {t('gallery.section_title')}
              </Button>
            </motion.div>

            <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4 order-1 lg:order-2">
              {latestMedia.map((media, index) => (
                <div
                  key={media._id}
                  className="group relative aspect-square bg-gray-100 rounded-2xl xs:rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-lg cursor-pointer"
                  onClick={() => navigate('/Galerie')}
                >
                  <img
                    src={urlFor(media.image || media.thumbnail).width(400).url()}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="Impact"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 xs:p-4 sm:p-5 md:p-6 flex flex-col justify-end text-left">
                    <p className="text-white font-black text-[8px] xs:text-[9px] sm:text-[10px] uppercase tracking-widest line-clamp-1">
                      {isFr ? media.captionFr : media.captionEn}
                    </p>
                    <p className="text-yellow-400 text-[7px] xs:text-[8px] font-bold uppercase mt-0.5 xs:mt-1 line-clamp-1">
                      {isFr ? media.locationFr : media.locationEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION ENGAGEMENT */}
      <section className="py-16 xs:py-20 sm:py-24 md:py-28 lg:py-32 bg-gradient-to-br from-blue-900 to-gray-900 text-white text-center relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-[300px] xs:w-[400px] sm:w-[500px] h-[300px] xs:h-[400px] sm:h-[500px] bg-yellow-500 rounded-full blur-[80px] xs:blur-[100px] sm:blur-[120px]"
        />
        <div className="max-w-4xl mx-auto px-3 xs:px-4 sm:px-6 relative z-10">
          <Badge variant="orange" className="mb-4 xs:mb-5 sm:mb-6 uppercase text-[10px] xs:text-xs">
            {t('footer.action_title')}
          </Badge>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 xs:mb-5 sm:mb-6 md:mb-8 tracking-tighter uppercase leading-tight">
            {t('hero.cta_main')}
          </h2>
          <p className="text-blue-100 text-base xs:text-lg sm:text-xl mb-8 xs:mb-10 sm:mb-12 max-w-2xl mx-auto italic px-2">
            {t('footer.quote')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 xs:gap-4">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/Donate')}
              className="px-12 xs:px-14 sm:px-16 shadow-xl w-full sm:w-auto text-sm xs:text-base py-3 xs:py-3.5 sm:py-4"
            >
              {t('nav.donate')}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/Contact')}
              icon={<Mail size={isMobile ? 16 : 20} />}
              className="px-8 xs:px-10 sm:px-12 w-full sm:w-auto bg-yellow-400 backdrop-blur-sm hover:bg-yellow-500 text-white border-white/30 hover:border-white/50 text-sm xs:text-base py-3 xs:py-3.5 sm:py-4"
            >
              {t('nav.contact')}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;