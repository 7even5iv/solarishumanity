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

    // Detect current language
    const isFr = i18n.language.startsWith('fr');

    // Fetch post data when slug changes
    useEffect(() => {
        if (!slug) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        // Query retrieves ALL bilingual fields
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

    // Re-fetch or update when language changes
    useEffect(() => {
        // If we have a post, just re-render with new language selection
        // The useMemo hooks will handle content selection automatically
        if (post) {
            setIsLoading(false);
        }
    }, [i18n.language, post]);

    // Content selection logic with fallback to French if English is empty
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

    // Loading state
    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-black text-blue-500 uppercase tracking-widest text-[10px]">{t('contact.sending')}</p>
            </div>
        </div>
    );

    // No post found
    if (!post) return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <p className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tighter">{t('blog.no_results')}</p>
            <Link to="/Blog">
                <Button variant="primary">{t('nav.blog')}</Button>
            </Link>
        </div>
    );

    return (
        <main className="pt-32 pb-20 bg-white">
            <div className="max-w-4xl mx-auto px-4">
                {/* HEADER */}
                <header className="mb-12">
                    <Badge variant="blue" className="mb-6 uppercase">
                        {post.category || t('blog.default_category') || "Action"}
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-8 tracking-tighter uppercase">
                        {displayTitle}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 py-6 border-y border-gray-100 text-gray-500 text-[11px] font-black uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-blue-500" />
                            {new Date(post.publishedAt).toLocaleDateString(isFr ? 'fr-FR' : 'en-US', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={16} className="text-blue-500" />
                            {post.authorName || t('blog.author_label')}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-blue-500" />
                            {t('blog.read_time', { count: 5 })}
                        </div>
                    </div>
                </header>

                {/* IMAGE */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mb-16 aspect-video bg-gray-100 border border-gray-100"
                >
                    {post.mainImage && (
                        <img
                            src={urlFor(post.mainImage).width(1200).url()}
                            alt={displayTitle}
                            className="w-full h-full object-cover"
                        />
                    )}
                </motion.div>

                {/* DYNAMIC CONTENT (PortableText) */}
                <article className="prose prose-lg prose-blue max-w-none text-gray-600 leading-relaxed font-medium">
                    {displayBody && <PortableText value={displayBody} />}
                </article>

                {/* ARTICLE FOOTER */}
                <footer className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-2">
                            {t('blog.support_title')}
                        </h4>
                        <p className="text-gray-500 text-sm italic">{t('footer.quote')}</p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            icon={<Share2 size={16} />}
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: displayTitle,
                                        url: window.location.href
                                    });
                                } else {
                                    // Fallback: copy to clipboard
                                    navigator.clipboard?.writeText(window.location.href);
                                }
                            }}
                        >
                            {t('blog.share')}
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            icon={<Heart size={16} className="fill-current" />}
                            onClick={() => navigate('/Donate')}
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