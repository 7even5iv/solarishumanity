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

    client.fetch(query).then((data) => {
      setMediaItems(data);
      setIsLoading(false);
    }).catch(err => {
      console.error("Erreur Sanity:", err);
      setIsLoading(false);
    });
  }, []);

  const categories = useMemo(() =>
    ['Tous', ...new Set(mediaItems.map(m => m.category))],
    [mediaItems]);

  const filteredPhotos = useMemo(() =>
    mediaItems.filter(m => m.type === 'image' && (filter === 'Tous' || m.category === filter)),
    [filter, mediaItems]);

  const filteredVideos = useMemo(() =>
    mediaItems.filter(m => m.type === 'video' && (filter === 'Tous' || m.category === filter)),
    [filter, mediaItems]);

  const closeModal = () => {
    setSelectedMedia(null);
    document.body.style.overflow = 'unset';
  };

  if (isLoading) return (
    <div className="py-40 text-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="font-black text-blue-500 uppercase tracking-widest text-xs">Chargement de la médiathèque...</p>
    </div>
  );

  return (
    <section id="galerie" className="relative py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/" className="inline-flex items-center gap-3 text-[10px] font-black text-gray-500 hover:text-blue-500 transition-all uppercase mb-12 group">
            <div className="p-2 bg-gray-100 rounded-full group-hover:bg-blue-50 transition-colors shadow-sm">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            {t('nav.back')}
          </Link>
        </motion.div>

        <SectionTitle
          subtitle={t('nav.gallery')}
          title={t('gallery.title')}
          description={t('gallery.description')}
        />

        <div className="flex flex-wrap justify-center gap-3 mb-20">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`relative px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest transition-all ${filter === cat ? 'text-white' : 'text-gray-500 bg-gray-100 hover:bg-gray-200'}`}
            >
              <span className="relative z-10">{cat === 'Tous' ? t('gallery.all') : cat.toUpperCase()}</span>
              {filter === cat && (
                <motion.div layoutId="activeFilter" className="absolute inset-0 bg-blue-600 rounded-full shadow-lg" />
              )}
            </button>
          ))}
        </div>

        {filteredPhotos.length > 0 && (
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shadow-sm"><Camera size={24} /></div>
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">
                {isFr ? 'Galerie Photos' : 'Photo Gallery'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredPhotos.map((img) => (
                  <motion.div
                    key={img._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => { setSelectedMedia(img); document.body.style.overflow = 'hidden'; }}
                    className="group relative rounded-[2.5rem] overflow-hidden bg-gray-50 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
                  >
                    <img src={urlFor(img.image).width(800).url()} alt="Impact" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end text-left text-white">
                      <Badge variant="blue" className="w-fit mb-2 uppercase">{t(`gallery.categories.${img.category.toLowerCase()}`)}</Badge>
                      <p className="font-bold">{isFr ? img.captionFr : img.captionEn}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {filteredVideos.length > 0 && (
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-4">
              <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600 shadow-sm"><VideoIcon size={24} /></div>
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">
                {isFr ? 'Rapports Vidéos' : 'Video Reports'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredVideos.map((vid) => (
                  <motion.div
                    key={vid._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => { setSelectedMedia(vid); document.body.style.overflow = 'hidden'; }}
                    className="group relative rounded-[2.5rem] overflow-hidden bg-gray-900 cursor-pointer shadow-lg"
                  >
                    <img src={urlFor(vid.thumbnail).width(800).url()} alt="Cover" className="aspect-video w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-yellow-500 p-5 rounded-full text-white shadow-2xl group-hover:scale-110 transition-transform">
                        <Play size={32} className="fill-current" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-left text-white">
                      <p className="font-bold text-lg">{isFr ? vid.captionFr : vid.captionEn}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-gray-950/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.button whileHover={{ rotate: 90 }} className="absolute top-10 right-10 text-white/50 hover:text-blue-500 transition-colors">
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
                  <img src={urlFor(selectedMedia.image).url()} className="w-full h-full object-contain mx-auto" alt="Impact" />
                ) : (
                  <video
                    src={selectedMedia.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full"
                    controlsList="nodownload"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              <div className="text-center text-white">
                <Badge variant="blue" className="mb-4 uppercase">{t(`gallery.categories.${selectedMedia.category.toLowerCase()}`)}</Badge>
                <h3 className="text-2xl md:text-3xl font-black mb-2">{isFr ? selectedMedia.captionFr : selectedMedia.captionEn}</h3>
                <div className="flex items-center justify-center gap-6 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <span className="flex items-center gap-2"><MapPin size={16} className="text-blue-400" /> {isFr ? selectedMedia.locationFr : selectedMedia.locationEn}</span>
                  <span className="flex items-center gap-2"><Calendar size={16} className="text-yellow-400" /> {selectedMedia.date}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
};

export default Gallery;