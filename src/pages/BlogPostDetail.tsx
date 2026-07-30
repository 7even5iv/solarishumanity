import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { client, urlFor } from '../lib/sanity';
import { PortableText } from '@portabletext/react';
import { Calendar, User, ArrowLeft, Clock, Share2, Heart } from 'lucide-react';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';

const BlogPostDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [post, setPost] = useState<any>(null);
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
        if (!slug) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const query = `*[_type == "post" && slug.current == $slug][0]{
            titleFr, 
            titleEn,
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

    const displayTitle = useMemo(() => {
        if (!post) return "";
        if (isFr) return post.titleFr;
        return post.titleEn || post.titleFr;
    }, [post, isFr]);

    const displayBody = useMemo(() => {
        if (!post) return null;
        if (isFr) return post.bodyFr;
        return post.bodyEn || post.bodyFr;
    }, [post, isFr]);

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
        <main className="pt-20 xs:pt-24 sm:pt-28 md:pt-32 pb-12 xs:pb-16 sm:pb-20 bg-white">
            <div className="max-w-4xl mx-auto px-3 xs:px-4 sm:px-6">

                {/* HEADER - Responsive */}
                <header className="mb-8 xs:mb-10 sm:mb-12">
                    <Badge variant="blue" className="mb-4 xs:mb-5 sm:mb-6 uppercase text-[8px] xs:text-[10px] sm:text-xs">
                        {post.category || t('blog.default_category') || "Action"}
                    </Badge>
                    <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-4 xs:mb-6 sm:mb-8 tracking-tighter uppercase">
                        {displayTitle}
                    </h1>

                    {/* Métadonnées - Responsive */}
                    <div className="flex flex-wrap items-center gap-3 xs:gap-4 sm:gap-6 py-4 xs:py-5 sm:py-6 border-y border-gray-100 text-gray-500 text-[9px] xs:text-[10px] sm:text-[11px] font-black uppercase tracking-widest">
                        <div className="flex items-center gap-1.5 xs:gap-2">
                            <Calendar size={isMobile ? 14 : 16} className="text-blue-500" />
                            {new Date(post.publishedAt).toLocaleDateString(isFr ? 'fr-FR' : 'en-US', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
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

                {/* IMAGE - Responsive */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-2xl xs:rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl mb-10 xs:mb-12 sm:mb-14 md:mb-16 aspect-video bg-gray-100 border border-gray-100"
                >
                    {post.mainImage && (
                        <img
                            src={urlFor(post.mainImage).width(1200).url()}
                            alt={displayTitle}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    )}
                </motion.div>

                {/* DYNAMIC CONTENT - Responsive */}
                <article className="prose prose-base xs:prose-lg prose-blue max-w-none text-gray-600 leading-relaxed font-medium">
                    {displayBody && <PortableText value={displayBody} />}
                </article>

                {/* ARTICLE FOOTER - Responsive */}
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
            </div>
        </main>
    );
};

export default BlogPostDetail;