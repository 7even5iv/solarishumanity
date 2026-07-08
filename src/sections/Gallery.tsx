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

  // Get unique categories for filter
  const categories = useMemo(() =>
    ['Tous', ...new Set(mediaItems.map(m => m.category).filter(Boolean))],
    [mediaItems]
  );

  // Filter photos based on selected category
  const filteredPhotos = useMemo(() =>
    mediaItems.filter(m => m.type === 'image' && (filter === 'Tous' || m.category === filter)),
    [filter, mediaItems]
  );

  // Filter videos based on selected category
  const filteredVideos = useMemo(() =>
    mediaItems.filter(m => m.type === 'video' && (filter === 'Tous' || m.category === filter)),
    [filter, mediaItems]
  );

  // Get display text based on language
  const getDisplayText = (item: any, fieldFr: string, fieldEn: string) => {
    if (!item) return '';
    return isFr ? item[fieldFr] : (item[fieldEn] || item[fieldFr]);
  };

  // Close modal and restore scroll
  const closeModal = () => {
    setSelectedMedia(null);
    document.body.style.overflow = 'unset';
  };

  if (isLoading) return (
    <div className="py-40 text-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="font-black text-blue-500 uppercase tracking-widest text-xs">
        {t('gallery.loading') || t('contact.sending') || 'Loading media library...'}
      </p>
    </div>
  );

  return (
    <section id="galerie" className="relative py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle={t('nav.gallery')}
          title={t('gallery.title')}
          description={t('gallery.description')}
        />

        {/* FILTERS with translation support */}
        <div className="flex flex-wrap justify-center gap-3 mb-20">
          {categories.map((cat) => {
            // Get translated category name
            let categoryLabel = cat;
            if (cat === 'Tous') {
              categoryLabel = t('gallery.all');
            } else {
              // Try to get translation, fallback to uppercase category
              const translationKey = `gallery.categories.${cat.toLowerCase()}`;
              categoryLabel = t(translationKey, { defaultValue: cat.toUpperCase() });
            }

            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`relative px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest transition-all ${filter === cat ? 'text-white' : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
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

        {/* --- SECTION 1 : PHOTOS --- */}
        {filteredPhotos.length > 0 && (
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shadow-sm">
                <Camera size={24} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">
                {t('gallery.photo_title')}
              </h3>
              <Badge variant="blue" className="ml-auto">
                {filteredPhotos.length} {isFr ? 'photos' : 'photos'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                      className="group relative rounded-[2.5rem] overflow-hidden bg-gray-50 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
                    >
                      <img
                        src={urlFor(img.image).width(800).url()}
                        alt={caption || 'Gallery image'}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end text-left text-white">
                        <Badge variant="blue" className="w-fit mb-2 uppercase">
                          {categoryLabel}
                        </Badge>
                        <p className="font-bold text-lg">{caption}</p>
                        {location && (
                          <p className="text-sm text-gray-300 flex items-center gap-1 mt-1">
                            <MapPin size={14} /> {location}
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

        {/* --- SECTION 2 : VIDEOS --- */}
        {filteredVideos.length > 0 && (
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-4">
              <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600 shadow-sm">
                <VideoIcon size={24} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">
                {t('gallery.video_title')}
              </h3>
              <Badge variant="yellow" className="ml-auto">
                {filteredVideos.length} {isFr ? 'vidéos' : 'videos'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                      className="group relative rounded-[2.5rem] overflow-hidden bg-gray-900 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
                    >
                      <img
                        src={urlFor(vid.thumbnail).width(800).url()}
                        alt={caption || 'Video thumbnail'}
                        className="aspect-video w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-yellow-500 p-5 rounded-full text-white shadow-2xl group-hover:scale-110 transition-transform">
                          <Play size={32} className="fill-current ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-left text-white bg-gradient-to-t from-black/80 via-transparent">
                        <p className="font-bold text-lg">{caption}</p>
                        {location && (
                          <p className="text-sm text-gray-300 flex items-center gap-1">
                            <MapPin size={14} /> {location}
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
          <div className="text-center py-20">
            <p className="text-gray-400 uppercase font-black tracking-widest text-sm">
              {t('gallery.no_results') || 'No media found for this category'}
            </p>
          </div>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-gray-950/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.button
              whileHover={{ rotate: 90 }}
              className="absolute top-10 right-10 text-white/50 hover:text-blue-500 transition-colors z-10"
              onClick={closeModal}
            >
              <X size={40} />
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-5xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black aspect-video mb-8 border border-white/10">
                {selectedMedia.type === 'image' ? (
                  <img
                    src={urlFor(selectedMedia.image).url()}
                    className="w-full h-full object-contain mx-auto"
                    alt={getDisplayText(selectedMedia, 'captionFr', 'captionEn')}
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

              <div className="text-center text-white">
                <Badge variant="blue" className="mb-4 uppercase">
                  {t(`gallery.categories.${selectedMedia.category.toLowerCase()}`, {
                    defaultValue: selectedMedia.category.toUpperCase()
                  })}
                </Badge>
                <h3 className="text-2xl md:text-3xl font-black mb-2">
                  {getDisplayText(selectedMedia, 'captionFr', 'captionEn')}
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-400" />
                    {getDisplayText(selectedMedia, 'locationFr', 'locationEn')}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar size={16} className="text-yellow-400" />
                    {selectedMedia.date}
                  </span>
                  <span className="flex items-center gap-2">
                    {selectedMedia.type === 'image' ? (
                      <Camera size={16} className="text-blue-400" />
                    ) : (
                      <VideoIcon size={16} className="text-yellow-400" />
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
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
};

export default Gallery;