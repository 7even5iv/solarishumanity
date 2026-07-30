import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { client, urlFor } from '../lib/sanity';
import { SectionTitle } from '../components/SectionTitle';
import { Badge } from '../components/Badge';
import { MapPin, X, ArrowLeft, Camera, Calendar, Play, Video as VideoIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Gallery: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('Tous');
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
      "videoUrl": videoFile.asset->url
    }`;

    client.fetch(query)
      .then((data) => {
        setMediaItems(data);
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
  };

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

        {/* FILTERS - Responsive */}
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

        {/* SECTION PHOTOS - Responsive */}
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
                  const categoryLabel = t(`gallery.categories.${img.category.toLowerCase()}`, {
                    defaultValue: img.category.toUpperCase()
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
                        <Badge variant="blue" className="w-fit mb-1.5 xs:mb-2 uppercase text-[8px] xs:text-[10px]">
                          {categoryLabel}
                        </Badge>
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

        {/* SECTION VIDEOS - Responsive */}
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
                      <img
                        src={urlFor(vid.thumbnail).width(800).url()}
                        alt={caption || 'Video thumbnail'}
                        className="aspect-video w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
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

      {/* MODAL - Responsive */}
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
              className="absolute top-4 xs:top-6 sm:top-8 md:top-10 right-4 xs:right-6 sm:right-8 md:right-10 text-white/50 hover:text-blue-500 transition-colors z-10"
              onClick={closeModal}
            >
              <X size={isMobile ? 28 : 40} />
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-5xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative rounded-2xl xs:rounded-3xl overflow-hidden shadow-2xl bg-black aspect-video mb-4 xs:mb-6 sm:mb-8 border border-white/10">
                {selectedMedia.type === 'image' ? (
                  <img
                    src={urlFor(selectedMedia.image).url()}
                    className="w-full h-full object-contain mx-auto"
                    alt={getDisplayText(selectedMedia, 'captionFr', 'captionEn')}
                    loading="lazy"
                  />
                ) : (
                  <video
                    src={selectedMedia.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full"
                    controlsList="nodownload"
                  >
                    {isFr ? 'Votre navigateur ne supporte pas la vidéo.' : 'Your browser does not support the video tag.'}
                  </video>
                )}
              </div>

              <div className="text-center text-white px-2 xs:px-4">
                <Badge variant="blue" className="mb-2 xs:mb-3 sm:mb-4 uppercase text-[8px] xs:text-[10px]">
                  {t(`gallery.categories.${selectedMedia.category.toLowerCase()}`, {
                    defaultValue: selectedMedia.category.toUpperCase()
                  })}
                </Badge>
                <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-black mb-1.5 xs:mb-2">
                  {getDisplayText(selectedMedia, 'captionFr', 'captionEn')}
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-3 xs:gap-4 sm:gap-6 text-gray-400 text-[8px] xs:text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                  <span className="flex items-center gap-1.5 xs:gap-2">
                    <MapPin size={isMobile ? 12 : 16} className="text-blue-400" />
                    {getDisplayText(selectedMedia, 'locationFr', 'locationEn')}
                  </span>
                  <span className="flex items-center gap-1.5 xs:gap-2">
                    <Calendar size={isMobile ? 12 : 16} className="text-yellow-400" />
                    {selectedMedia.date}
                  </span>
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

      {/* Background decorations - Responsive */}
      <div className="absolute top-0 right-0 w-48 xs:w-64 sm:w-80 md:w-96 h-48 xs:h-64 sm:h-80 md:h-96 bg-blue-500/5 rounded-full blur-[80px] xs:blur-[100px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 xs:w-64 sm:w-80 md:w-96 h-48 xs:h-64 sm:h-80 md:h-96 bg-yellow-500/5 rounded-full blur-[80px] xs:blur-[100px] sm:blur-[120px] pointer-events-none" />
    </section>
  );
};

export default Gallery;