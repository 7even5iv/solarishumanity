import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { client, urlFor } from '../lib/sanity';
import { SectionTitle } from '../components/SectionTitle';
import { Badge } from '../components/Badge';
import {
  MapPin, X, ArrowLeft, Camera, Calendar, Play, Video as VideoIcon,
  Pause, Volume2, VolumeX, Maximize2, Minimize2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Gallery: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('Tous');
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isFr = i18n.language.startsWith('fr');

  useEffect(() => {
    const query = `*[_type == "gallery"] | order(date desc) {
      _id,
      type,
      category,
      captionFr,
      captionEn,
      locationFr,
      locationEn,
      date,
      image,
      thumbnail,
      videoFile {
        asset-> {
          url,
          _id
        }
      }
    }`;

    client.fetch(query)
      .then((data) => {
        // Traiter les données pour extraire l'URL de la vidéo correctement
        const processedData = data.map((item: any) => {
          let videoUrl = null;
          if (item.videoFile?.asset?.url) {
            videoUrl = item.videoFile.asset.url;
          }
          return {
            ...item,
            videoUrl: videoUrl
          };
        });
        setMediaItems(processedData);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Erreur Sanity:", err);
        setIsLoading(false);
      });
  }, []);

  const categories = useMemo(() =>
    ['Tous', ...new Set(mediaItems.map(m => m.category).filter(Boolean))],
    [mediaItems]
  );

  const filteredPhotos = useMemo(() =>
    mediaItems.filter(m => m.type === 'image' && (filter === 'Tous' || m.category === filter)),
    [filter, mediaItems]
  );

  const filteredVideos = useMemo(() =>
    mediaItems.filter(m => m.type === 'video' && (filter === 'Tous' || m.category === filter)),
    [filter, mediaItems]
  );

  const getDisplayText = (item: any, fieldFr: string, fieldEn: string) => {
    if (!item) return '';
    return isFr ? item[fieldFr] : (item[fieldEn] || item[fieldFr]);
  };

  const closeModal = () => {
    setSelectedMedia(null);
    document.body.style.overflow = 'unset';
    if (videoRef.current) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => { });
    }
    setIsFullscreen(false);
  };

  // Contrôles vidéo
  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (isVideoPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(error => {
        console.error('Erreur lecture vidéo:', error);
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
  };

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
    setVideoProgress(0);
    setVideoCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setVideoProgress(percentage * 100);
  };

  const toggleFullscreen = () => {
    if (!modalRef.current) return;
    if (!document.fullscreenElement) {
      modalRef.current.requestFullscreen().catch(() => { });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => { });
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Gestion clavier pour la vidéo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedMedia) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === ' ' && selectedMedia.type === 'video') {
        e.preventDefault();
        toggleVideoPlay();
      }
      if (e.key === 'm' && selectedMedia.type === 'video') {
        toggleVideoMute();
      }
      if (e.key === 'f' && selectedMedia.type === 'video') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMedia, isVideoPlaying, isVideoMuted]);

  if (isLoading) return (
    <div className="py-20 xs:py-30 sm:py-40 text-center px-4">
      <div className="w-10 xs:w-12 h-10 xs:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3 xs:mb-4"></div>
      <p className="font-black text-blue-500 uppercase tracking-widest text-[8px] xs:text-[10px] sm:text-xs">
        {t('gallery.loading') || t('contact.sending') || 'Loading media library...'}
      </p>
    </div>
  );

  return (
    <section id="galerie" className="relative py-10 xs:py-12 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle={t('nav.gallery')}
          title={t('gallery.title')}
          description={t('gallery.description')}
        />

        {/* FILTERS */}
        <div className="flex flex-wrap justify-center gap-1.5 xs:gap-2 sm:gap-3 mb-12 xs:mb-16 sm:mb-20">
          {categories.map((cat) => {
            let categoryLabel = cat;
            if (cat === 'Tous') {
              categoryLabel = t('gallery.all');
            } else {
              const translationKey = `gallery.categories.${cat.toLowerCase()}`;
              categoryLabel = t(translationKey, { defaultValue: cat.toUpperCase() });
            }

            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`relative px-3 xs:px-4 sm:px-5 md:px-6 py-1.5 xs:py-2 sm:py-2.5 rounded-full text-[8px] xs:text-[9px] sm:text-[10px] font-black tracking-widest transition-all ${filter === cat ? 'text-white' : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
                  }`}
              >
                <span className="relative z-10">{categoryLabel}</span>
                {filter === cat && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-blue-600 rounded-full shadow-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* SECTION PHOTOS */}
        {filteredPhotos.length > 0 && (
          <div className="mb-16 xs:mb-18 sm:mb-20 md:mb-24">
            <div className="flex flex-wrap items-center gap-2 xs:gap-3 sm:gap-4 mb-6 xs:mb-8 sm:mb-10 border-b border-gray-100 pb-3 xs:pb-4">
              <div className="p-2 xs:p-2.5 sm:p-3 bg-blue-50 rounded-lg xs:rounded-xl text-blue-600 shadow-sm">
                <Camera size={isMobile ? 18 : 24} />
              </div>
              <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter italic">
                {t('gallery.photo_title')}
              </h3>
              <Badge variant="blue" className="ml-auto text-[8px] xs:text-[10px]">
                {filteredPhotos.length} {isFr ? 'photos' : 'photos'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8">
              <AnimatePresence mode="popLayout">
                {filteredPhotos.map((img) => {
                  const caption = getDisplayText(img, 'captionFr', 'captionEn');
                  const location = getDisplayText(img, 'locationFr', 'locationEn');
                  const categoryLabel = t(`gallery.categories.${img.category?.toLowerCase() || ''}`, {
                    defaultValue: img.category?.toUpperCase() || ''
                  });

                  return (
                    <motion.div
                      key={img._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => {
                        setSelectedMedia(img);
                        document.body.style.overflow = 'hidden';
                      }}
                      className="group relative rounded-2xl xs:rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-gray-50 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
                    >
                      <img
                        src={urlFor(img.image).width(800).url()}
                        alt={caption || 'Gallery image'}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col justify-end text-left text-white">
                        {img.category && (
                          <Badge variant="blue" className="w-fit mb-1.5 xs:mb-2 uppercase text-[8px] xs:text-[10px]">
                            {categoryLabel}
                          </Badge>
                        )}
                        <p className="font-bold text-sm xs:text-base sm:text-lg">{caption}</p>
                        {location && (
                          <p className="text-xs xs:text-sm text-gray-300 flex items-center gap-1 mt-0.5 xs:mt-1">
                            <MapPin size={isMobile ? 12 : 14} /> {location}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* SECTION VIDEOS */}
        {filteredVideos.length > 0 && (
          <div className="mb-16 xs:mb-18 sm:mb-20 md:mb-24">
            <div className="flex flex-wrap items-center gap-2 xs:gap-3 sm:gap-4 mb-6 xs:mb-8 sm:mb-10 border-b border-gray-100 pb-3 xs:pb-4">
              <div className="p-2 xs:p-2.5 sm:p-3 bg-yellow-50 rounded-lg xs:rounded-xl text-yellow-600 shadow-sm">
                <VideoIcon size={isMobile ? 18 : 24} />
              </div>
              <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter italic">
                {t('gallery.video_title')}
              </h3>
              <Badge variant="yellow" className="ml-auto text-[8px] xs:text-[10px]">
                {filteredVideos.length} {isFr ? 'vidéos' : 'videos'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8">
              <AnimatePresence mode="popLayout">
                {filteredVideos.map((vid) => {
                  const caption = getDisplayText(vid, 'captionFr', 'captionEn');
                  const location = getDisplayText(vid, 'locationFr', 'locationEn');
                  const thumbnailUrl = vid.thumbnail ? urlFor(vid.thumbnail).width(800).url() : null;

                  return (
                    <motion.div
                      key={vid._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => {
                        setSelectedMedia(vid);
                        document.body.style.overflow = 'hidden';
                      }}
                      className="group relative rounded-2xl xs:rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-gray-900 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
                    >
                      {thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt={caption || 'Video thumbnail'}
                          className="aspect-video w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="aspect-video w-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <VideoIcon size={48} className="text-gray-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-yellow-500 p-3 xs:p-4 sm:p-5 rounded-full text-white shadow-2xl group-hover:scale-110 transition-transform">
                          <Play size={isMobile ? 24 : 32} className="fill-current ml-0.5 xs:ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 xs:p-4 sm:p-5 md:p-6 text-left text-white bg-gradient-to-t from-black/80 via-transparent">
                        <p className="font-bold text-sm xs:text-base sm:text-lg">{caption}</p>
                        {location && (
                          <p className="text-xs xs:text-sm text-gray-300 flex items-center gap-1">
                            <MapPin size={isMobile ? 12 : 14} /> {location}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredPhotos.length === 0 && filteredVideos.length === 0 && (
          <div className="text-center py-12 xs:py-16 sm:py-20">
            <p className="text-gray-400 uppercase font-black tracking-widest text-xs xs:text-sm">
              {t('gallery.no_results') || 'No media found for this category'}
            </p>
          </div>
        )}
      </div>

      {/* ==========================================
          MODAL AVEC SUPPORT VIDÉO AMÉLIORÉ
          ========================================== */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-gray-950/95 backdrop-blur-xl flex items-center justify-center p-2 xs:p-3 sm:p-4"
            onClick={closeModal}
          >
            <motion.button
              whileHover={{ rotate: 90 }}
              className="absolute top-4 xs:top-6 sm:top-8 md:top-10 right-4 xs:right-6 sm:right-8 md:right-10 text-white/50 hover:text-blue-500 transition-colors z-20"
              onClick={closeModal}
            >
              <X size={isMobile ? 28 : 40} />
            </motion.button>

            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-5xl w-full relative"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative rounded-2xl xs:rounded-3xl overflow-hidden shadow-2xl bg-black aspect-video border border-white/10">
                {selectedMedia.type === 'image' ? (
                  // ========== AFFICHAGE IMAGE ==========
                  <img
                    src={urlFor(selectedMedia.image).width(1920).url()}
                    className="w-full h-full object-contain mx-auto"
                    alt={getDisplayText(selectedMedia, 'captionFr', 'captionEn')}
                    loading="lazy"
                  />
                ) : (
                  // ========== LECTEUR VIDÉO AMÉLIORÉ ==========
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      src={selectedMedia.videoUrl}
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
                      playsInline
                      muted={isVideoMuted}
                      controls={false}
                      preload="metadata"
                      poster={selectedMedia.thumbnail ? urlFor(selectedMedia.thumbnail).width(1200).url() : undefined}
                    />

                    {/* Overlay de contrôle - s'affiche au survol ou quand la vidéo est en pause */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 transition-opacity duration-300 ${!isVideoPlaying ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                      }`}>
                      {/* Bouton Play/Pause central */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleVideoPlay();
                        }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className={`bg-black/50 backdrop-blur-sm rounded-full p-4 xs:p-6 transition-all duration-300 ${!isVideoPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                          } hover:opacity-100 hover:scale-100`}>
                          {isVideoPlaying ? (
                            <Pause size={isMobile ? 36 : 56} className="text-white" />
                          ) : (
                            <Play size={isMobile ? 36 : 56} className="text-white fill-white ml-1" />
                          )}
                        </div>
                      </button>

                      {/* Contrôles en bas */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 xs:p-4 bg-gradient-to-t from-black/90 to-transparent">
                        <div className="flex items-center gap-3 xs:gap-4">
                          {/* Play/Pause */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVideoPlay();
                            }}
                            className="text-white hover:text-blue-400 transition-colors"
                          >
                            {isVideoPlaying ? <Pause size={isMobile ? 18 : 24} /> : <Play size={isMobile ? 18 : 24} className="fill-white" />}
                          </button>

                          {/* Barre de progression */}
                          <div
                            className="flex-1 h-1 xs:h-1.5 bg-white/30 rounded-full cursor-pointer group/progress"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSeek(e);
                            }}
                          >
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all duration-200 group-hover/progress:bg-blue-400"
                              style={{ width: `${videoProgress}%` }}
                            />
                          </div>

                          {/* Durée */}
                          <span className="text-white/80 text-[9px] xs:text-[10px] sm:text-xs font-mono min-w-[80px] xs:min-w-[100px]">
                            {formatTime(videoCurrentTime)} / {formatTime(videoDuration)}
                          </span>

                          {/* Mute */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVideoMute();
                            }}
                            className="text-white hover:text-blue-400 transition-colors"
                          >
                            {isVideoMuted ? <VolumeX size={isMobile ? 16 : 20} /> : <Volume2 size={isMobile ? 16 : 20} />}
                          </button>

                          {/* Plein écran */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFullscreen();
                            }}
                            className="text-white hover:text-blue-400 transition-colors"
                          >
                            {isFullscreen ? <Minimize2 size={isMobile ? 16 : 20} /> : <Maximize2 size={isMobile ? 16 : 20} />}
                          </button>
                        </div>
                      </div>

                      {/* Raccourcis clavier */}
                      <div className="absolute bottom-16 xs:bottom-20 left-1/2 -translate-x-1/2 text-white/30 text-[8px] xs:text-[9px] font-medium tracking-wider uppercase pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                        {isMobile ? 'Tap pour Play/Pause' : 'Espace: Play/Pause · M: Muet · F: Plein écran'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Informations du média */}
              <div className="text-center text-white px-2 xs:px-4 mt-4 xs:mt-6">
                {selectedMedia.category && (
                  <Badge variant="blue" className="mb-2 xs:mb-3 sm:mb-4 uppercase text-[8px] xs:text-[10px]">
                    {t(`gallery.categories.${selectedMedia.category.toLowerCase()}`, {
                      defaultValue: selectedMedia.category.toUpperCase()
                    })}
                  </Badge>
                )}
                <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-black mb-1.5 xs:mb-2">
                  {getDisplayText(selectedMedia, 'captionFr', 'captionEn')}
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-3 xs:gap-4 sm:gap-6 text-gray-400 text-[8px] xs:text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                  {getDisplayText(selectedMedia, 'locationFr', 'locationEn') && (
                    <span className="flex items-center gap-1.5 xs:gap-2">
                      <MapPin size={isMobile ? 12 : 16} className="text-blue-400" />
                      {getDisplayText(selectedMedia, 'locationFr', 'locationEn')}
                    </span>
                  )}
                  {selectedMedia.date && (
                    <span className="flex items-center gap-1.5 xs:gap-2">
                      <Calendar size={isMobile ? 12 : 16} className="text-yellow-400" />
                      {selectedMedia.date}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 xs:gap-2">
                    {selectedMedia.type === 'image' ? (
                      <Camera size={isMobile ? 12 : 16} className="text-blue-400" />
                    ) : (
                      <VideoIcon size={isMobile ? 12 : 16} className="text-yellow-400" />
                    )}
                    {selectedMedia.type === 'image'
                      ? (isFr ? 'Photo' : 'Photo')
                      : (isFr ? 'Vidéo' : 'Video')
                    }
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-48 xs:w-64 sm:w-80 md:w-96 h-48 xs:h-64 sm:h-80 md:h-96 bg-blue-500/5 rounded-full blur-[80px] xs:blur-[100px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 xs:w-64 sm:w-80 md:w-96 h-48 xs:h-64 sm:h-80 md:h-96 bg-yellow-500/5 rounded-full blur-[80px] xs:blur-[100px] sm:blur-[120px] pointer-events-none" />
    </section>
  );
};

export default Gallery;