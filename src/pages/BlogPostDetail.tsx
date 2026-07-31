import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { client, urlFor } from '../lib/sanity';
import { PortableText } from '@portabletext/react';
import {
    Calendar, User, ArrowLeft, Clock, Share2, Heart,
    Image as ImageIcon, X, Maximize2, ZoomIn, ZoomOut,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';

interface BlogPost {
    titleFr: string;
    titleEn: string;
    excerptFr?: string;
    excerptEn?: string;
    bodyFr: any;
    bodyEn: any;
    mainImage?: any;
    publishedAt: string;
    category?: string;
    authorName?: string;
}

const BlogPostDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // États pour la lightbox
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxZoom, setLightboxZoom] = useState(1);
    const [isZoomed, setIsZoomed] = useState(false);
    const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
    const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

    // Détection mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Bloquer le scroll quand la lightbox est ouverte
    useEffect(() => {
        if (isLightboxOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.position = 'unset';
            document.body.style.width = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.position = 'unset';
            document.body.style.width = 'unset';
        };
    }, [isLightboxOpen]);

    const isFr = i18n.language.startsWith('fr');

    // Récupération du post
    useEffect(() => {
        if (!slug) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const query = `*[_type == "post" && slug.current == $slug][0]{
            titleFr, 
            titleEn,
            excerptFr,
            excerptEn,
            bodyFr, 
            bodyEn,
            mainImage,
            publishedAt,
            category,
            "authorName": author->name
        }`;

        client.fetch(query, { slug })
            .then((data) => {
                setPost(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching post:', error);
                setIsLoading(false);
            });

        window.scrollTo(0, 0);
    }, [slug]);

    useEffect(() => {
        if (post) {
            setIsLoading(false);
        }
    }, [i18n.language, post]);

    // Mémorisation des données affichées
    const displayTitle = useMemo(() => {
        if (!post) return "";
        if (isFr) return post.titleFr;
        return post.titleEn || post.titleFr;
    }, [post, isFr]);

    const displayExcerpt = useMemo(() => {
        if (!post) return "";
        if (isFr) return post.excerptFr;
        return post.excerptEn || post.excerptFr || "";
    }, [post, isFr]);

    const displayBody = useMemo(() => {
        if (!post) return null;
        if (isFr) return post.bodyFr;
        return post.bodyEn || post.bodyFr;
    }, [post, isFr]);

    // Gestion du clavier pour la lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isLightboxOpen) {
                setIsLightboxOpen(false);
                setLightboxZoom(1);
                setIsZoomed(false);
            }
            if (e.key === 'Escape' && isLightboxOpen) {
                setIsLightboxOpen(false);
                setLightboxZoom(1);
                setIsZoomed(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen]);

    // Gestion du zoom
    const handleZoomIn = useCallback(() => {
        if (lightboxZoom < 3) {
            setLightboxZoom(prev => prev + 0.5);
            setIsZoomed(true);
        }
    }, [lightboxZoom]);

    const handleZoomOut = useCallback(() => {
        if (lightboxZoom > 0.5) {
            setLightboxZoom(prev => prev - 0.5);
            if (lightboxZoom <= 1) {
                setIsZoomed(false);
            }
        }
    }, [lightboxZoom]);

    const handleResetZoom = useCallback(() => {
        setLightboxZoom(1);
        setIsZoomed(false);
    }, []);

    // Gestion du double-clic pour zoom
    const handleDoubleClick = useCallback(() => {
        if (isZoomed) {
            handleResetZoom();
        } else {
            handleZoomIn();
        }
    }, [isZoomed, handleResetZoom, handleZoomIn]);

    // Gestion du scroll pour zoom (roulette)
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            handleZoomIn();
        } else {
            handleZoomOut();
        }
    }, [handleZoomIn, handleZoomOut]);

    // Gestion du swipe sur mobile
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];
        setTouchStart({ x: touch.clientX, y: touch.clientY });
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (!touchStart) return;
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStart.x;
        const deltaY = touch.clientY - touchStart.y;

        // Si le zoom est activé, on ne ferme pas avec le swipe
        if (isZoomed) return;

        // Swipe vers le bas pour fermer
        if (Math.abs(deltaY) > 100 && deltaY > 0) {
            setIsLightboxOpen(false);
            setLightboxZoom(1);
            setIsZoomed(false);
        }
    }, [touchStart, isZoomed]);

    const imageUrl = useMemo(() => {
        if (!post?.mainImage) return null;
        return urlFor(post.mainImage)
            .width(1200)
            .height(675)
            .fit('crop')
            .auto('format')
            .quality(85)
            .url();
    }, [post]);

    const lightboxImageUrl = useMemo(() => {
        if (!post?.mainImage) return null;
        return urlFor(post.mainImage)
            .width(2000)
            .height(1125)
            .fit('crop')
            .auto('format')
            .quality(90)
            .url();
    }, [post]);

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 xs:w-12 h-10 xs:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-black text-blue-500 uppercase tracking-widest text-[8px] xs:text-[10px]">{t('contact.sending')}</p>
            </div>
        </div>
    );

    if (!post) return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <p className="text-lg xs:text-xl font-black text-gray-900 mb-4 xs:mb-6 uppercase tracking-tighter text-center">
                {t('blog.no_results')}
            </p>
            <Link to="/Blog">
                <Button variant="primary" className="text-sm xs:text-base">
                    {t('nav.blog')}
                </Button>
            </Link>
        </div>
    );

    return (
        <>
            <main className="pt-20 xs:pt-24 sm:pt-28 md:pt-32 pb-12 xs:pb-16 sm:pb-20 bg-white">
                <article className="max-w-4xl mx-auto px-3 xs:px-4 sm:px-6">
                    {/* BREADCRUMB - Navigation */}
                    <nav className="mb-6 xs:mb-8 sm:mb-10">
                        <Link
                            to="/Blog"
                            className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-[10px] xs:text-xs font-black uppercase tracking-widest"
                        >
                            <ArrowLeft size={isMobile ? 14 : 16} />
                            {t('blog.back_to_blog') || 'Retour au blog'}
                        </Link>
                    </nav>

                    {/* HEADER */}
                    <header className="mb-8 xs:mb-10 sm:mb-12">
                        <Badge variant="blue" className="mb-4 xs:mb-5 sm:mb-6 uppercase text-[8px] xs:text-[10px] sm:text-xs">
                            {post.category || t('blog.default_category') || "Action"}
                        </Badge>

                        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] mb-4 xs:mb-6 tracking-tighter uppercase">
                            {displayTitle}
                        </h1>

                        {/* RÉSUMÉ */}
                        {displayExcerpt && (
                            <div className="mb-6 xs:mb-8 sm:mb-10">
                                <p className="text-base xs:text-lg sm:text-xl text-gray-600 font-medium leading-relaxed border-l-4 border-blue-500 pl-4 xs:pl-6 py-2 bg-gray-50/50 rounded-r-lg">
                                    {displayExcerpt}
                                </p>
                            </div>
                        )}

                        {/* Métadonnées */}
                        <div className="flex flex-wrap items-center gap-3 xs:gap-4 sm:gap-6 py-4 xs:py-5 sm:py-6 border-y border-gray-100 text-gray-500 text-[9px] xs:text-[10px] sm:text-[11px] font-black uppercase tracking-widest">
                            <div className="flex items-center gap-1.5 xs:gap-2">
                                <Calendar size={isMobile ? 14 : 16} className="text-blue-500" />
                                <time dateTime={post.publishedAt}>
                                    {new Date(post.publishedAt).toLocaleDateString(isFr ? 'fr-FR' : 'en-US', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </time>
                            </div>
                            <div className="flex items-center gap-1.5 xs:gap-2">
                                <User size={isMobile ? 14 : 16} className="text-blue-500" />
                                {post.authorName || t('blog.author_label')}
                            </div>
                            <div className="flex items-center gap-1.5 xs:gap-2">
                                <Clock size={isMobile ? 14 : 16} className="text-blue-500" />
                                {t('blog.read_time', { count: 5 })}
                            </div>
                        </div>
                    </header>

                    {/* IMAGE - Cliquable pour ouvrir la lightbox */}
                    <motion.figure
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative rounded-2xl xs:rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl mb-10 xs:mb-12 sm:mb-14 md:mb-16 bg-gray-100 border border-gray-100 cursor-pointer group"
                        onClick={() => setIsLightboxOpen(true)}
                    >
                        {post.mainImage ? (
                            <div className="relative aspect-video">
                                <img
                                    src={imageUrl || ''}
                                    alt={displayTitle}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    loading="eager"
                                    decoding="async"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        target.parentElement?.querySelector('.image-fallback')?.classList.remove('hidden');
                                    }}
                                />

                                {/* Overlay avec icône d'agrandissement */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="bg-black/60 backdrop-blur-sm rounded-full p-3 xs:p-4">
                                        <Maximize2 size={isMobile ? 20 : 24} className="text-white" />
                                    </div>
                                </div>

                                {/* Fallback */}
                                <div className="image-fallback hidden absolute inset-0 flex items-center justify-center bg-gray-200">
                                    <div className="text-center text-gray-400">
                                        <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                                        <p className="text-sm font-medium">Image non disponible</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                <div className="text-center text-gray-400">
                                    <ImageIcon size={48} className="mx-auto mb-3 opacity-50" />
                                    <p className="text-sm font-medium">Aucune image</p>
                                </div>
                            </div>
                        )}
                    </motion.figure>

                    {/* CORPS DE L'ARTICLE */}
                    <div className="prose prose-base xs:prose-lg sm:prose-xl prose-blue max-w-none text-gray-700 leading-relaxed">
                        {displayBody ? (
                            <PortableText value={displayBody} />
                        ) : (
                            <p className="text-gray-400 italic">{t('blog.no_content')}</p>
                        )}
                    </div>

                    {/* FOOTER */}
                    <footer className="mt-14 xs:mt-16 sm:mt-18 md:mt-20 pt-6 xs:pt-8 sm:pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 xs:gap-6 sm:gap-8">
                        <div className="text-center md:text-left">
                            <h4 className="font-black text-gray-900 uppercase text-[10px] xs:text-xs tracking-widest mb-1 xs:mb-2">
                                {t('blog.support_title')}
                            </h4>
                            <p className="text-gray-500 text-xs xs:text-sm italic max-w-[200px] xs:max-w-[250px] sm:max-w-none">
                                {t('footer.quote')}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4 justify-center">
                            <Button
                                variant="outline"
                                size="sm"
                                icon={<Share2 size={isMobile ? 14 : 16} />}
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: displayTitle,
                                            text: displayExcerpt || displayTitle,
                                            url: window.location.href
                                        });
                                    } else {
                                        navigator.clipboard?.writeText(window.location.href);
                                    }
                                }}
                                className="text-xs xs:text-sm px-3 xs:px-4 py-1.5 xs:py-2"
                            >
                                {t('blog.share')}
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                icon={<Heart size={isMobile ? 14 : 16} className="fill-current" />}
                                onClick={() => navigate('/Donate')}
                                className="text-xs xs:text-sm px-3 xs:px-4 py-1.5 xs:py-2"
                            >
                                {t('nav.donate')}
                            </Button>
                        </div>
                    </footer>
                </article>
            </main>

            {/* LIGHTBOX - Page d'aperçu de l'image */}
            <AnimatePresence>
                {isLightboxOpen && post.mainImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 xs:p-4"
                        onClick={() => {
                            setIsLightboxOpen(false);
                            handleResetZoom();
                        }}
                    >
                        {/* Conteneur de l'image avec gestion du zoom */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-6xl h-full max-h-[90vh] flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                            onWheel={handleWheel}
                            onDoubleClick={handleDoubleClick}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            <img
                                src={lightboxImageUrl || ''}
                                alt={`${displayTitle} - Vue agrandie`}
                                className="max-w-full max-h-full object-contain transition-transform duration-300 select-none"
                                style={{ transform: `scale(${lightboxZoom})` }}
                                draggable={false}
                            />

                            {/* Contrôles - Barre d'outils */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-md rounded-full px-3 py-2 xs:px-4 xs:py-2.5 border border-white/10">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleZoomOut();
                                    }}
                                    className="p-1.5 xs:p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                                    disabled={lightboxZoom <= 0.5}
                                >
                                    <ZoomOut size={isMobile ? 16 : 20} />
                                </button>

                                <span className="text-white/80 text-[10px] xs:text-xs font-mono font-bold min-w-[40px] text-center">
                                    {Math.round(lightboxZoom * 100)}%
                                </span>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleZoomIn();
                                    }}
                                    className="p-1.5 xs:p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                                    disabled={lightboxZoom >= 3}
                                >
                                    <ZoomIn size={isMobile ? 16 : 20} />
                                </button>

                                <div className="w-px h-6 bg-white/10 mx-1" />

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleResetZoom();
                                    }}
                                    className="px-2 py-1 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white text-[10px] xs:text-xs font-bold uppercase tracking-wider"
                                >
                                    Reset
                                </button>
                            </div>

                            {/* Bouton fermer */}
                            <button
                                onClick={() => {
                                    setIsLightboxOpen(false);
                                    handleResetZoom();
                                }}
                                className="absolute top-4 right-4 xs:top-6 xs:right-6 p-2 rounded-full bg-black/60 hover:bg-black/80 transition-colors text-white/70 hover:text-white border border-white/10"
                            >
                                <X size={isMobile ? 20 : 28} />
                            </button>

                            {/* Informations */}
                            <div className="absolute top-4 left-4 xs:top-6 xs:left-6 text-white/80 max-w-[70%]">
                                <p className="text-xs xs:text-sm font-bold uppercase tracking-wider line-clamp-1">
                                    {displayTitle}
                                </p>
                                {post.category && (
                                    <span className="text-[8px] xs:text-[10px] font-black uppercase tracking-widest text-blue-400">
                                        {post.category}
                                    </span>
                                )}
                            </div>

                            {/* Indicateur de zoom et swipe */}
                            <div className="absolute bottom-20 xs:bottom-24 text-white/30 text-[8px] xs:text-[10px] font-medium tracking-wider uppercase pointer-events-none">
                                {isMobile ? 'Double-tap pour zoomer' : 'Scroll pour zoomer · Double-clic pour reset'}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default BlogPostDetail;