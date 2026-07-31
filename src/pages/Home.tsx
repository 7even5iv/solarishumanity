import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
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
  ChevronLeft, ChevronRight, Play, Image, Grid, LayoutGrid, Maximize2,
  X, ZoomIn, ZoomOut, Download, Share2, MapPin, FolderOpen, Pause, Volume2, VolumeX
} from 'lucide-react';
import { Badge } from '../components/Badge';

// ============================================
// IMPORTS DES IMAGES DES MISSIONS
// ============================================
// Remplace ces chemins par tes propres images
import eauImage from '../assets/images/missions/eau.jpeg';
import santeImage from '../assets/images/missions/sante.jpeg';
import educationImage from '../assets/images/missions/education.jpeg';

// Si tu utilises des images WebP (optimisées)
// import eauImage from '../assets/images/missions/eau.webp';
// import santeImage from '../assets/images/missions/sante.webp';
// import educationImage from '../assets/images/missions/education.webp';

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

// ============================================
// COMPOSANT GALERIE PRO AVEC SUPPORT VIDÉO - DESIGN BLEU-BLANC-JAUNE
// ============================================
const GalleryPro: React.FC<{
  media: any[];
  isFr: boolean;
  navigate: any;
  t: any;
}> = ({ media, isFr, navigate, t }) => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [filter, setFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'masonry' | 'grid'>('masonry');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fonction pour récupérer l'URL de la vidéo depuis Sanity
  const getVideoUrl = (item: any) => {
    if (item.videoUrl) return item.videoUrl;
    if (item.videoFile?.asset?._ref) {
      let fileId = item.videoFile.asset._ref;
      fileId = fileId.replace('file-', '');
      fileId = fileId.replace(/-(mp4|mov|avi|webm|mkv)$/, '');
      const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'ton_project_id';
      const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
      return `https://cdn.sanity.io/files/${projectId}/${dataset}/${fileId}.mp4`;
    }
    if (item.url) return item.url;
    return null;
  };

  const getThumbnailUrl = (item: any) => {
    if (item.thumbnail) {
      return urlFor(item.thumbnail).width(800).height(600).fit('crop').auto('format').quality(80).url();
    }
    if (item.image) {
      return urlFor(item.image).width(800).height(600).fit('crop').auto('format').quality(80).url();
    }
    return null;
  };

  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
      if (videoRef.current) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    };
  }, [isLightboxOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowUp') handleZoomIn();
      if (e.key === 'ArrowDown') handleZoomOut();
      if (e.key === ' ' && selectedImage?.type === 'video') {
        e.preventDefault();
        toggleVideoPlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, lightboxIndex, selectedImage]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    media.forEach(item => {
      if (item.category) cats.add(item.category);
    });
    return ['all', ...Array.from(cats)];
  }, [media]);

  const filteredMedia = useMemo(() => {
    if (filter === 'all') return media;
    return media.filter(item => item.category === filter);
  }, [media, filter]);

  const getMasonryColumns = useCallback(() => {
    const columns: any[][] = [[], [], []];
    filteredMedia.forEach((item, index) => {
      const colIndex = index % 3;
      columns[colIndex].push(item);
    });
    return columns;
  }, [filteredMedia]);

  const masonryColumns = getMasonryColumns();

  const openLightbox = (item: any, index: number) => {
    setSelectedImage(item);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    setZoomLevel(1);
    setIsVideoPlaying(false);
    setIsVideoMuted(true);
    setVideoProgress(0);
    setVideoDuration(0);
    setVideoCurrentTime(0);
    setVideoError(false);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
    setZoomLevel(1);
    if (videoRef.current) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const nextImage = () => {
    const nextIndex = (lightboxIndex + 1) % filteredMedia.length;
    setLightboxIndex(nextIndex);
    setSelectedImage(filteredMedia[nextIndex]);
    setZoomLevel(1);
    setIsVideoPlaying(false);
    setIsVideoMuted(true);
    setVideoProgress(0);
    setVideoDuration(0);
    setVideoCurrentTime(0);
    setVideoError(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const prevImage = () => {
    const prevIndex = (lightboxIndex - 1 + filteredMedia.length) % filteredMedia.length;
    setLightboxIndex(prevIndex);
    setSelectedImage(filteredMedia[prevIndex]);
    setZoomLevel(1);
    setIsVideoPlaying(false);
    setIsVideoMuted(true);
    setVideoProgress(0);
    setVideoDuration(0);
    setVideoCurrentTime(0);
    setVideoError(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  const toggleVideoPlay = () => {
    if (!videoRef.current || videoError) return;
    if (isVideoPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(error => {
        console.error('Erreur lecture vidéo:', error);
        setVideoError(true);
      });
    }
    setIsVideoPlaying(!isVideoPlaying);
  };

  const toggleVideoMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isVideoMuted;
    setIsVideoMuted(!isVideoMuted);
  };

  const handleVideoTimeUpdate = () => {
    if (!videoRef.current) return;
    const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setVideoProgress(progress);
    setVideoCurrentTime(videoRef.current.currentTime);
  };

  const handleVideoLoadedMetadata = () => {
    if (!videoRef.current) return;
    setVideoDuration(videoRef.current.duration);
    setVideoError(false);
  };

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
    setVideoProgress(0);
    setVideoCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error('Erreur de chargement vidéo:', e);
    setVideoError(true);
    if (selectedImage) {
      const altUrl = getVideoUrl(selectedImage);
      if (altUrl && videoRef.current) {
        videoRef.current.src = altUrl;
        videoRef.current.load();
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ==========================================
  // MEDIA CARD - AVEC BADGES BLANCS
  // ==========================================
  const MediaCard = ({ item, index }: { item: any; index: number }) => {
    const isHovered = hoveredId === item._id;
    const isVideo = item.type === 'video';
    const imageUrl = getThumbnailUrl(item) || '/placeholder-image.jpg';
    const sizeVariants = ['h-56 xs:h-64', 'h-64 xs:h-72', 'h-72 xs:h-80', 'h-64 xs:h-72', 'h-80 xs:h-88'];
    const randomSize = sizeVariants[index % sizeVariants.length];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="relative group cursor-pointer"
        onMouseEnter={() => setHoveredId(item._id)}
        onMouseLeave={() => setHoveredId(null)}
        onClick={() => {
          const globalIndex = filteredMedia.findIndex(m => m._id === item._id);
          openLightbox(item, globalIndex);
        }}
      >
        <div className={`relative rounded-xl xs:rounded-2xl overflow-hidden shadow-lg bg-gray-100 border-2 border-transparent transition-all duration-300 ${isHovered ? 'border-yellow-400 shadow-xl' : ''
          } ${viewMode === 'masonry' ? randomSize : 'aspect-square'}`}>
          <img
            src={imageUrl}
            alt={isFr ? item.captionFr : item.captionEn}
            className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.jpg';
            }}
          />

          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
            <div className="absolute inset-0 p-3 xs:p-4 sm:p-5 md:p-6 flex flex-col justify-end">
              {/* BADGE DE CATÉGORIE - FOND BLANC */}
              {item.category && (
                <Badge
                  variant="blue"
                  className="mb-1.5 xs:mb-2 text-[7px] xs:text-[8px] sm:text-[9px] self-start bg-white text-blue-600 backdrop-blur-sm border border-yellow-400/30 shadow-sm font-bold"
                >
                  {item.category}
                </Badge>
              )}
              <h4 className="text-white font-black text-xs xs:text-sm sm:text-base md:text-lg uppercase tracking-tighter line-clamp-2">
                {isFr ? item.captionFr : item.captionEn}
              </h4>
              {(item.locationFr || item.locationEn) && (
                <p className="text-yellow-400 text-[7px] xs:text-[8px] sm:text-[9px] font-bold uppercase tracking-widest mt-0.5 xs:mt-1 flex items-center gap-1">
                  <MapPin size={isMobile ? 10 : 12} />
                  {isFr ? item.locationFr : item.locationEn}
                </p>
              )}
              <div className="flex items-center gap-3 xs:gap-4 mt-1.5 xs:mt-2 text-white/60 text-[7px] xs:text-[8px] sm:text-[9px] font-medium uppercase tracking-wider">
                {item.date && (
                  <span className="flex items-center gap-1">
                    <Calendar size={isMobile ? 10 : 12} />
                    {new Date(item.date).getFullYear()}
                  </span>
                )}
              </div>
              <div className="absolute top-3 xs:top-4 right-3 xs:right-4 bg-black/50 backdrop-blur-sm rounded-full p-1.5 xs:p-2 transition-transform group-hover:scale-110 border border-yellow-400/30">
                <Maximize2 size={isMobile ? 12 : 16} className="text-white" />
              </div>
            </div>
          </div>

          {isVideo && (
            <>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-blue-600/80 backdrop-blur-sm rounded-full p-3 xs:p-4 sm:p-5 md:p-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-yellow-400 pointer-events-auto">
                  <Play size={isMobile ? 20 : 32} className="text-white fill-white ml-0.5 xs:ml-1" />
                </div>
              </div>
              {/* BADGE VIDÉO - FOND BLANC */}
              <div className="absolute top-3 xs:top-4 left-3 xs:left-4 bg-white backdrop-blur-sm rounded-full px-2 xs:px-3 py-1 text-blue-600 text-[7px] xs:text-[8px] font-black uppercase tracking-wider flex items-center gap-1 border border-yellow-400/30 shadow-sm">
                <Play size={isMobile ? 8 : 10} className="fill-blue-600" />
                Vidéo
              </div>
            </>
          )}
        </div>
      </motion.div>
    );
  };

  // ==========================================
  // RENDU PRINCIPAL DE LA GALERIE - RESPONSIVE
  // ==========================================
  return (
    <>
      <div className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 xs:gap-4">
          <div>
            <Badge variant="blue" className="mb-1.5 xs:mb-2 uppercase text-[8px] xs:text-[9px] sm:text-[10px] border border-yellow-400/30 bg-white text-blue-600">
              {t('gallery.badge') || 'Notre Galerie'}
            </Badge>
            <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">
              {isFr ? 'Nos Réalisations' : 'Our Work'}
            </h3>
            <p className="text-gray-400 text-[10px] xs:text-xs sm:text-sm mt-0.5 xs:mt-1">
              {filteredMedia.length} {isFr ? 'médias' : 'media'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 xs:gap-2 sm:gap-3">
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-2 xs:px-2.5 sm:px-3 py-1 xs:py-1.5 rounded-full text-[7px] xs:text-[8px] sm:text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${filter === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-yellow-400/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {cat === 'all' ? (isFr ? 'Tous' : 'All') : cat}
                </button>
              ))}
            </div>
            <div className="flex gap-1 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setViewMode('masonry')}
                className={`p-1 xs:p-1.5 rounded-full transition-all duration-300 ${viewMode === 'masonry'
                  ? 'bg-white shadow-md text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                <LayoutGrid size={isMobile ? 14 : 16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 xs:p-1.5 rounded-full transition-all duration-300 ${viewMode === 'grid'
                  ? 'bg-white shadow-md text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                <Grid size={isMobile ? 14 : 16} />
              </button>
            </div>
          </div>
        </div>

        <div ref={galleryRef}>
          {viewMode === 'masonry' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 xs:gap-3 sm:gap-4 md:gap-5">
              {masonryColumns.map((column, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-2.5 xs:gap-3 sm:gap-4 md:gap-5">
                  {column.map((item, index) => (
                    <MediaCard
                      key={item._id}
                      item={item}
                      index={index + colIndex * column.length}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 xs:gap-3 sm:gap-4 md:gap-5">
              {filteredMedia.map((item, index) => (
                <MediaCard key={item._id} item={item} index={index} />
              ))}
            </div>
          )}
        </div>

        <div className="text-center pt-3 xs:pt-4 sm:pt-6 md:pt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/Galerie')}
            icon={<FolderOpen size={isMobile ? 16 : 20} />}
            className="px-6 xs:px-8 sm:px-10 md:px-12 hover:scale-105 transition-transform border-blue-600 text-blue-600 hover:bg-blue-50 text-xs xs:text-sm"
          >
            {isFr ? 'Voir toute la galerie' : 'View Full Gallery'}
          </Button>
        </div>
      </div>

      {/* ==========================================
          LIGHTBOX PRO AVEC SUPPORT VIDÉO - RESPONSIVE
          ========================================== */}
      <AnimatePresence>
        {isLightboxOpen && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full flex items-center justify-center p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8">
                {selectedImage.type === 'video' ? (
                  <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl xs:rounded-2xl overflow-hidden border-2 border-yellow-400/20">
                    {videoError ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white/60 p-6 xs:p-8 text-center">
                        <AlertCircle size={isMobile ? 32 : 48} className="text-yellow-400 mb-3 xs:mb-4" />
                        <p className="text-xs xs:text-sm font-medium">Erreur de chargement de la vidéo</p>
                        <p className="text-[10px] xs:text-xs text-white/40 mt-1 xs:mt-2">Veuillez réessayer ou contacter l'administrateur</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setVideoError(false);
                            if (videoRef.current) {
                              const url = getVideoUrl(selectedImage);
                              if (url) {
                                videoRef.current.src = url;
                                videoRef.current.load();
                              }
                            }
                          }}
                          className="mt-3 xs:mt-4 px-3 xs:px-4 py-1.5 xs:py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white text-[10px] xs:text-xs font-bold transition-colors border border-yellow-400/30"
                        >
                          Réessayer
                        </button>
                      </div>
                    ) : (
                      <>
                        <video
                          ref={videoRef}
                          src={getVideoUrl(selectedImage) || undefined}
                          poster={getThumbnailUrl(selectedImage) || undefined}
                          className="w-full h-full object-contain"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleVideoPlay();
                          }}
                          onTimeUpdate={handleVideoTimeUpdate}
                          onLoadedMetadata={handleVideoLoadedMetadata}
                          onEnded={handleVideoEnded}
                          onPlay={() => setIsVideoPlaying(true)}
                          onPause={() => setIsVideoPlaying(false)}
                          onError={handleVideoError}
                          playsInline
                          muted={isVideoMuted}
                          controls={false}
                          preload="metadata"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVideoPlay();
                            }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-auto group"
                          >
                            <div className={`bg-blue-600/70 backdrop-blur-sm rounded-full p-3 xs:p-4 sm:p-5 md:p-6 transition-all duration-300 border-2 border-yellow-400/30 ${!isVideoPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-80 group-hover:scale-100'
                              }`}>
                              {isVideoPlaying ? (
                                <Pause size={isMobile ? 32 : 48} className="text-white" />
                              ) : (
                                <Play size={isMobile ? 32 : 48} className="text-white fill-white ml-0.5 xs:ml-1" />
                              )}
                            </div>
                          </button>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-2 xs:p-3 sm:p-4 bg-gradient-to-t from-black/90 to-transparent pointer-events-auto">
                          <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleVideoPlay();
                              }}
                              className="text-white hover:text-yellow-400 transition-colors"
                            >
                              {isVideoPlaying ? <Pause size={isMobile ? 16 : 20} /> : <Play size={isMobile ? 16 : 20} className="fill-white" />}
                            </button>

                            <div className="flex-1 h-1 bg-white/30 rounded-full cursor-pointer group/progress">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-yellow-400 rounded-full transition-all duration-200"
                                style={{ width: `${videoProgress}%` }}
                              />
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleVideoMute();
                              }}
                              className="text-white hover:text-yellow-400 transition-colors"
                            >
                              {isVideoMuted ? <VolumeX size={isMobile ? 16 : 20} /> : <Volume2 size={isMobile ? 16 : 20} />}
                            </button>

                            <span className="text-white/80 text-[8px] xs:text-[9px] sm:text-[10px] font-mono min-w-[60px] xs:min-w-[70px] sm:min-w-[80px]">
                              {formatTime(videoCurrentTime)} / {formatTime(videoDuration)}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <img
                    src={urlFor(selectedImage.image)
                      .width(2000)
                      .height(1500)
                      .fit('crop')
                      .auto('format')
                      .quality(90)
                      .url()}
                    alt={isFr ? selectedImage.captionFr : selectedImage.captionEn}
                    className={`max-w-full max-h-[85vh] xs:max-h-[88vh] sm:max-h-[90vh] object-contain transition-transform duration-300 select-none rounded-xl xs:rounded-2xl`}
                    style={{ transform: `scale(${zoomLevel})` }}
                    draggable={false}
                    onClick={(e) => e.stopPropagation()}
                    onDoubleClick={() => {
                      if (zoomLevel > 1) handleResetZoom();
                      else handleZoomIn();
                    }}
                  />
                )}

                {selectedImage.type !== 'video' && (
                  <div className="absolute bottom-3 xs:bottom-4 sm:bottom-5 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 xs:gap-1.5 sm:gap-2 bg-black/60 backdrop-blur-md rounded-full px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1.5 sm:py-2 border border-yellow-400/20">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                      className="p-1 xs:p-1.5 sm:p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white disabled:opacity-30"
                      disabled={zoomLevel <= 0.5}
                    >
                      <ZoomOut size={isMobile ? 14 : 18} />
                    </button>

                    <span className="text-white/80 text-[8px] xs:text-[9px] sm:text-[10px] font-mono font-bold min-w-[25px] xs:min-w-[30px] sm:min-w-[35px] text-center">
                      {Math.round(zoomLevel * 100)}%
                    </span>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                      className="p-1 xs:p-1.5 sm:p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white disabled:opacity-30"
                      disabled={zoomLevel >= 3}
                    >
                      <ZoomIn size={isMobile ? 14 : 18} />
                    </button>

                    <div className="w-px h-4 xs:h-5 bg-white/10 mx-0.5 xs:mx-1" />

                    <button
                      onClick={(e) => { e.stopPropagation(); handleResetZoom(); }}
                      className="px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white text-[7px] xs:text-[8px] sm:text-[10px] font-bold uppercase tracking-wider"
                    >
                      Reset
                    </button>
                  </div>
                )}

                <button
                  onClick={closeLightbox}
                  className="absolute top-2 xs:top-3 sm:top-4 md:top-6 right-2 xs:right-3 sm:right-4 md:right-6 p-1.5 xs:p-2 rounded-full bg-black/60 hover:bg-black/80 transition-colors text-white/70 hover:text-white border border-yellow-400/20 z-10"
                >
                  <X size={isMobile ? 20 : 24} />
                </button>

                {filteredMedia.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-1 xs:left-2 sm:left-3 md:left-4 p-1.5 xs:p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/60 transition-colors text-white/60 hover:text-white backdrop-blur-sm border border-yellow-400/20 z-10"
                    >
                      <ChevronLeft size={isMobile ? 20 : 24} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-1 xs:right-2 sm:right-3 md:right-4 p-1.5 xs:p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/60 transition-colors text-white/60 hover:text-white backdrop-blur-sm border border-yellow-400/20 z-10"
                    >
                      <ChevronRight size={isMobile ? 20 : 24} />
                    </button>

                    <div className="absolute top-2 xs:top-3 sm:top-4 md:top-6 left-2 xs:left-3 sm:left-4 md:left-6 text-white/60 text-[8px] xs:text-[9px] sm:text-[10px] font-mono font-bold z-10">
                      {lightboxIndex + 1} / {filteredMedia.length}
                    </div>
                  </>
                )}

                <div className="absolute bottom-14 xs:bottom-16 sm:bottom-18 md:bottom-20 left-3 right-3 xs:left-4 xs:right-4 sm:left-6 sm:right-6 text-center max-w-2xl mx-auto z-10">
                  <h3 className="text-white font-black text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl uppercase tracking-tighter mb-0.5 xs:mb-1">
                    {isFr ? selectedImage.captionFr : selectedImage.captionEn}
                  </h3>
                  {(selectedImage.locationFr || selectedImage.locationEn) && (
                    <p className="text-yellow-400 text-[8px] xs:text-[9px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1 xs:gap-1.5">
                      <MapPin size={isMobile ? 12 : 14} />
                      {isFr ? selectedImage.locationFr : selectedImage.locationEn}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center justify-center gap-2 xs:gap-3 sm:gap-4 mt-1 xs:mt-2 text-white/40 text-[7px] xs:text-[8px] sm:text-[9px] font-medium uppercase tracking-wider">
                    {selectedImage.date && (
                      <span className="flex items-center gap-1">
                        <Calendar size={isMobile ? 10 : 12} />
                        {new Date(selectedImage.date).toLocaleDateString(isFr ? 'fr-FR' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    )}
                    {selectedImage.category && (
                      <span className="flex items-center gap-1">
                        <Tag size={isMobile ? 10 : 12} />
                        {selectedImage.category}
                      </span>
                    )}
                    {selectedImage.type === 'video' && (
                      <span className="flex items-center gap-1 text-yellow-400">
                        <Play size={isMobile ? 10 : 12} className="fill-yellow-400" />
                        Vidéo
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (navigator.share) {
                      navigator.share({
                        title: isFr ? selectedImage.captionFr : selectedImage.captionEn,
                        text: isFr ? selectedImage.captionFr : selectedImage.captionEn,
                        url: window.location.href
                      });
                    }
                  }}
                  className="absolute top-2 xs:top-3 sm:top-4 md:top-6 right-12 xs:right-14 sm:right-16 md:right-20 p-1.5 xs:p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors text-white/60 hover:text-white backdrop-blur-sm border border-yellow-400/20 z-10"
                >
                  <Share2 size={isMobile ? 16 : 20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ============================================
// COMPOSANT SLIDER BLOG - DESIGN BLEU-BLANC-JAUNE RESPONSIVE
// ============================================
const BlogSlider = ({ posts, isFr, navigate }: { posts: any[], isFr: boolean, navigate: any }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const getCurrentPosts = () => {
    const start = currentIndex * slidesToShow;
    const end = start + slidesToShow;
    return posts.slice(start, end);
  };

  const currentPosts = getCurrentPosts();

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
        className="group cursor-pointer h-full px-1 xs:px-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => slug && navigate(`/Blog/${slug}`)}
      >
        <Card variant="glass" className="h-full overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col border-t-4 border-t-transparent hover:border-t-yellow-400 rounded-xl xs:rounded-2xl">
          <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title || 'Article'}
                className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                <BookOpen size={isMobile ? 48 : 64} className="text-blue-300" />
              </div>
            )}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
            {post.categories && post.categories.length > 0 && (
              <div className="absolute top-2 xs:top-3 sm:top-4 left-2 xs:left-3 sm:left-4 flex flex-wrap gap-1 xs:gap-2">
                {post.categories.slice(0, 2).map((category: string, idx: number) => (
                  <Badge key={idx} variant="blue" className="text-[7px] xs:text-[8px] sm:text-[9px] font-bold shadow-lg backdrop-blur-sm bg-white text-blue-600 border border-yellow-400/30">
                    <Tag size={isMobile ? 8 : 10} className="inline mr-0.5 xs:mr-1" />
                    {category}
                  </Badge>
                ))}
                {post.categories.length > 2 && (
                  <Badge variant="gray" className="text-[7px] xs:text-[8px] sm:text-[9px] font-bold shadow-lg backdrop-blur-sm bg-gray-800/90 text-white">
                    +{post.categories.length - 2}
                  </Badge>
                )}
              </div>
            )}
            {post.readingTime && (
              <div className="absolute bottom-2 xs:bottom-3 sm:bottom-4 right-2 xs:right-3 sm:right-4 bg-black/70 backdrop-blur-sm text-white px-2 xs:px-3 py-1 rounded-full text-[8px] xs:text-[9px] sm:text-[10px] font-bold flex items-center gap-1">
                <Clock size={isMobile ? 10 : 12} />
                {post.readingTime} min
              </div>
            )}
          </div>
          <div className="p-4 xs:p-5 sm:p-6 md:p-7 flex flex-col flex-grow">
            <div className="flex items-center justify-between text-gray-400 text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px] font-medium mb-2 xs:mb-3">
              <span className="flex items-center gap-1 xs:gap-1.5">
                <Calendar size={isMobile ? 12 : 14} className="text-blue-400" />
                {formatDate(post.publishedAt)}
              </span>
              {post.views && (
                <span className="flex items-center gap-1 xs:gap-1.5">
                  <Eye size={isMobile ? 12 : 14} className="text-blue-400" />
                  {post.views}
                </span>
              )}
            </div>
            <h3 className={`text-sm xs:text-base sm:text-lg md:text-xl font-black text-gray-900 mb-2 xs:mb-3 transition-colors line-clamp-2 uppercase tracking-tighter ${isHovered ? 'text-blue-600' : ''}`}>
              {title || 'Sans titre'}
            </h3>
            {excerpt && (
              <p className="text-gray-500 text-[10px] xs:text-xs sm:text-sm leading-relaxed mb-3 xs:mb-4 line-clamp-3 flex-grow">
                {excerpt}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-between border-t border-gray-100 pt-3 xs:pt-4 mt-auto">
              <div className="flex items-center gap-1.5 xs:gap-2.5">
                {post.authorImage ? (
                  <img
                    src={urlFor(post.authorImage).width(40).height(40).url()}
                    alt={post.author || 'Auteur'}
                    className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-yellow-400"
                  />
                ) : (
                  <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-[10px] xs:text-xs sm:text-sm">
                    {post.author ? post.author.charAt(0).toUpperCase() : 'S'}
                  </div>
                )}
                <span className="text-gray-600 text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px] font-medium truncate max-w-[80px] xs:max-w-[120px] sm:max-w-none">
                  {post.author || 'Équipe Solaris Humanity'}
                </span>
              </div>
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: isHovered ? 3 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 p-0 hover:bg-transparent group"
                  icon={<ArrowRight size={isMobile ? 14 : 16} className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />}
                >
                  <span className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px] font-bold">
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
      <div className="overflow-hidden px-1 xs:px-2 sm:px-4">
        <div ref={sliderRef} className="transition-all duration-500 ease-in-out">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-7 lg:gap-8">
            {currentPosts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </div>
      {totalSlides > 1 && (
        <div className="flex items-center justify-center gap-2 xs:gap-3 sm:gap-4 mt-6 xs:mt-7 sm:mt-8">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`p-1.5 xs:p-2 rounded-full transition-all duration-300 ${currentIndex === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110'
              }`}
            aria-label="Précédent"
          >
            <ChevronLeft size={isMobile ? 20 : 24} />
          </button>
          <div className="flex gap-1.5 xs:gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${index === currentIndex
                  ? 'w-6 xs:w-7 sm:w-8 h-1.5 xs:h-2 sm:h-2.5 bg-blue-600'
                  : 'w-1.5 xs:w-2 h-1.5 xs:h-2 sm:h-2.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                aria-label={`Aller à la slide ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            disabled={currentIndex === maxIndex}
            className={`p-1.5 xs:p-2 rounded-full transition-all duration-300 ${currentIndex === maxIndex
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110'
              }`}
            aria-label="Suivant"
          >
            <ChevronRight size={isMobile ? 20 : 24} />
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================
// PAGE HOME PRINCIPALE - DESIGN BLEU-BLANC-JAUNE RESPONSIVE
// ============================================
const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [latestMedia, setLatestMedia] = useState<any[]>([]);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const isFr = i18n.language.startsWith('fr');

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

    const fetchMedia = async () => {
      try {
        const data = await client.fetch(`*[_type == "gallery"] | order(_createdAt desc) [0...8]`);
        setLatestMedia(data || []);
      } catch (error) {
        console.error('Erreur chargement galerie:', error);
      }
    };

    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
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
        const data = await client.fetch(query);
        if (data && Array.isArray(data)) {
          if (data.length > 0) {
            setLatestPosts(data);
          } else {
            setError('Aucun article trouvé dans la base de données');
          }
        } else {
          setError('Format de données invalide');
        }
      } catch (err) {
        console.error('Erreur détaillée lors du chargement des articles:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };

    Promise.all([fetchMedia(), fetchBlogPosts()]);
  }, []);

  const keyStats = useMemo(() => [
    { icon: <Calendar />, value: t('stats.since'), label: t('about.tabs.histoire'), color: "text-blue-500" },
    { icon: <Users />, value: t('stats.impact'), label: t('about.stats.impact'), color: "text-blue-500" },
    { icon: <Globe />, value: t('stats.country'), label: t('about.stats.countries'), color: "text-blue-500" },
    { icon: <Shield />, value: t('stats.transparency'), label: t('about.stats.transparency'), color: "text-blue-500" },
  ], [t]);

  const missionsTeaser = useMemo(() => [
    {
      icon: <Droplets size={isMobile ? 28 : 36} />,
      title: t('missions.p1.title'),
      desc: t('missions.p1.desc'),
      bgImage: eauImage
    },
    {
      icon: <HeartPulse size={isMobile ? 28 : 36} />,
      title: t('missions.p2.title'),
      desc: t('missions.p2.desc'),
      bgImage: santeImage
    },
    {
      icon: <GraduationCap size={isMobile ? 28 : 36} />,
      title: t('missions.p3.title'),
      desc: t('missions.p3.desc'),
      bgImage: educationImage
    }
  ], [t, isMobile]);

  return (
    <main className="overflow-hidden bg-white">
      <Hero />

      {/* SECTION STATISTIQUES */}
      <section className="py-10 xs:py-12 sm:py-16 md:py-20 border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-2.5 xs:gap-3 sm:gap-4 md:gap-6 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {keyStats.map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="text-center group">
                <Card variant="gradient" className="h-full py-4 xs:py-5 sm:py-6 md:py-8 lg:py-10 border-b-4 border-b-transparent hover:border-b-yellow-400 transition-all">
                  <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-1.5 xs:mb-2 sm:mb-3 md:mb-4 bg-blue-50 rounded-lg xs:rounded-xl sm:rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform group-hover:bg-yellow-400 group-hover:text-white">
                    {stat.icon}
                  </div>
                  <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-black text-gray-900 mb-0.5 xs:mb-1 uppercase tracking-tighter">
                    {stat.value}
                  </p>
                  <p className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">
                    {stat.label}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          SECTION MISSIONS - IMAGES EN PLEIN ÉCRAN
          ========================================== */}
      <section className="py-14 xs:py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6">
          <SectionTitle
            subtitle={t('missions.badge')}
            title={t('missions.title')}
            description={t('missions.description')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8 mt-8 xs:mt-10 sm:mt-12 md:mt-14 lg:mt-16">
            {missionsTeaser.map((item, i) => (
              <Card
                key={i}
                variant="glass"
                className="relative text-center flex flex-col h-full border-b-4 border-b-transparent hover:border-b-yellow-400 transition-all p-6 xs:p-7 sm:p-8 md:p-10 group overflow-hidden min-h-[400px] xs:min-h-[420px] sm:min-h-[440px] md:min-h-[480px] rounded-2xl shadow-xl"
              >
                {/* Image de fond en plein écran */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${item.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                />

                {/* Overlay sombre pour lisibilité */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/40 group-hover:from-black/75 group-hover:via-black/45 group-hover:to-black/35 transition-all duration-500" />

                {/* Contenu au-dessus de l'image */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  <div className="w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 xs:mb-5 sm:mb-6 bg-white/20 backdrop-blur-sm text-white rounded-2xl flex items-center justify-center group-hover:bg-yellow-400 group-hover:text-white group-hover:shadow-2xl transition-all border-2 border-white/30 group-hover:border-yellow-400">
                    {item.icon}
                  </div>
                  <h4 className="text-white text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-black mb-2 xs:mb-3 sm:mb-4 uppercase tracking-tighter">
                    {item.title}
                  </h4>
                  <p className="text-white/90 text-xs xs:text-sm sm:text-base leading-relaxed mb-5 xs:mb-6 sm:mb-8 max-w-xs mx-auto flex-grow italic">
                    {item.desc}
                  </p>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full max-w-[220px] text-xs xs:text-sm sm:text-base border-white/50 text-white hover:bg-white/20 hover:border-white bg-white/10 backdrop-blur-sm font-bold uppercase tracking-wider py-3"
                    onClick={() => navigate('/Missions')}
                  >
                    {t('missions.btn_support')}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION BLOG */}
      <section className="py-14 xs:py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-white border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6">
          <SectionTitle
            subtitle={t('blog.badge', { defaultValue: 'Actualités' })}
            title={t('blog.title', { defaultValue: 'Derniers Articles' })}
            description={t('blog.description', { defaultValue: 'Découvrez nos dernières actualités et histoires inspirantes' })}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-7 lg:gap-8 mt-8 xs:mt-10 sm:mt-12 md:mt-14 lg:mt-16">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-xl xs:rounded-2xl h-40 xs:h-44 sm:h-48"></div>
                  <div className="mt-3 xs:mt-4 space-y-2 xs:space-y-3">
                    <div className="h-3 xs:h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 xs:h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 xs:h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 xs:py-14 sm:py-16 bg-red-50 rounded-xl xs:rounded-2xl mt-8 xs:mt-10 sm:mt-12 md:mt-14">
              <AlertCircle size={isMobile ? 32 : 48} className="text-red-400 mx-auto mb-3 xs:mb-4" />
              <p className="text-red-600 font-medium text-sm xs:text-base mb-1 xs:mb-2">
                {isFr ? 'Erreur de chargement des articles' : 'Error loading articles'}
              </p>
              <p className="text-red-400 text-[10px] xs:text-xs sm:text-sm">{error}</p>
              <Button variant="outline" size="sm" className="mt-3 xs:mt-4" onClick={() => window.location.reload()}>
                {isFr ? 'Réessayer' : 'Retry'}
              </Button>
            </div>
          ) : latestPosts.length === 0 ? (
            <div className="text-center py-12 xs:py-14 sm:py-16 bg-gray-50 rounded-xl xs:rounded-2xl mt-8 xs:mt-10 sm:mt-12 md:mt-14">
              <div className="w-16 xs:w-18 sm:w-20 h-16 xs:h-18 sm:h-20 mx-auto mb-3 xs:mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                <BookOpen size={isMobile ? 32 : 40} className="text-blue-400" />
              </div>
              <p className="text-gray-500 text-base xs:text-lg font-medium">
                {isFr ? 'Aucun article disponible' : 'No articles available'}
              </p>
              <p className="text-gray-400 text-xs xs:text-sm mt-1 xs:mt-2">
                {isFr ? 'Revenez bientôt pour découvrir nos actualités' : 'Check back soon for our latest news'}
              </p>
            </div>
          ) : (
            <>
              <div className="mt-8 xs:mt-10 sm:mt-12 md:mt-14 lg:mt-16">
                <BlogSlider posts={latestPosts} isFr={isFr} navigate={navigate} />
              </div>
              <div className="text-center mt-10 xs:mt-12 sm:mt-14 md:mt-16">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/Blog')}
                  icon={<BookOpen size={isMobile ? 16 : 20} />}
                  className="px-6 xs:px-8 sm:px-10 md:px-12 hover:scale-105 transition-transform border-blue-600 text-blue-600 hover:bg-blue-50 text-xs xs:text-sm"
                >
                  {t('blog.view_all', { defaultValue: 'Voir tous les articles' })}
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* SECTION GALERIE */}
      <section className="py-14 xs:py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-gradient-to-b from-gray-50/30 to-white">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6">
          <SectionTitle
            subtitle={t('gallery.badge') || 'Nos Réalisations'}
            title={t('gallery.title')}
            description={t('gallery.description')}
          />

          <div className="mt-8 xs:mt-10 sm:mt-12 md:mt-14 lg:mt-16">
            {latestMedia.length > 0 ? (
              <GalleryPro
                media={latestMedia}
                isFr={isFr}
                navigate={navigate}
                t={t}
              />
            ) : (
              <div className="text-center py-12 xs:py-14 sm:py-16 bg-gray-50 rounded-xl xs:rounded-2xl">
                <Camera size={isMobile ? 32 : 48} className="text-gray-300 mx-auto mb-3 xs:mb-4" />
                <p className="text-gray-400 font-medium text-sm xs:text-base">
                  {isFr ? 'Aucun média disponible' : 'No media available'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION ENGAGEMENT */}
      <section className="py-14 xs:py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 text-white text-center relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-[250px] xs:w-[350px] sm:w-[450px] md:w-[550px] lg:w-[600px] h-[250px] xs:h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px] bg-yellow-500 rounded-full blur-[60px] xs:blur-[80px] sm:blur-[100px] md:blur-[120px]"
        />
        <div className="max-w-4xl mx-auto px-3 xs:px-4 sm:px-6 relative z-10">
          <Badge variant="orange" className="mb-3 xs:mb-4 sm:mb-5 md:mb-6 uppercase text-[8px] xs:text-[9px] sm:text-[10px] border border-yellow-400/50 bg-yellow-400/10 text-yellow-300">
            {t('footer.action_title')}
          </Badge>
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8 tracking-tighter uppercase leading-tight">
            {t('hero.cta_main')}
          </h2>
          <p className="text-blue-100 text-sm xs:text-base sm:text-lg md:text-xl mb-6 xs:mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto italic px-2 xs:px-4 border-l-4 border-yellow-400 pl-3 xs:pl-4">
            {t('footer.quote')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 xs:gap-3 sm:gap-4">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/Donate')}
              className="px-10 xs:px-12 sm:px-14 md:px-16 shadow-xl w-full sm:w-auto text-xs xs:text-sm md:text-base py-2.5 xs:py-3 sm:py-3.5 md:py-4 bg-blue-600 hover:bg-blue-700 border border-yellow-400/30 hover:border-yellow-400/60"
            >
              {t('nav.donate')}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/Contact')}
              icon={<Mail size={isMobile ? 16 : 20} />}
              className="px-6 xs:px-8 sm:px-10 md:px-12 w-full sm:w-auto bg-yellow-400/10 backdrop-blur-sm hover:bg-yellow-400/20 text-white border border-yellow-400/30 hover:border-yellow-400/60 text-xs xs:text-sm md:text-base py-2.5 xs:py-3 sm:py-3.5 md:py-4"
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