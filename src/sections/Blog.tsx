import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { client, urlFor } from '../lib/sanity';
import { SectionTitle } from '../components/SectionTitle';
import { Card } from '../components/Card';
import {
  Calendar, Share2, Search, ArrowLeft, User
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Blog: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const isFr = i18n.language.startsWith('fr');

  useEffect(() => {
    const query = `*[_type == "post"] | order(publishedAt desc) {
      _id,
      titleFr,
      titleEn,
      slug,
      mainImage,
      publishedAt,
      excerptFr,
      excerptEn,
      category,
      "authorName": author->name
    }`;

    client.fetch(query)
      .then((data) => {
        setPosts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Erreur Sanity:", err);
        setIsLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const rawCats = ['Tous', ...new Set(posts.map(post => post.category).filter(Boolean))];
    return rawCats.map(c => ({
      id: c,
      label: c === 'Tous' ? t('gallery.all') : c.toUpperCase()
    }));
  }, [posts, t]);

  const filteredPosts = useMemo(() => {
    let filtered = selectedCategory === 'Tous'
      ? posts
      : posts.filter(post => post.category === selectedCategory);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.titleFr?.toLowerCase().includes(query) ||
        post.titleEn?.toLowerCase().includes(query) ||
        post.excerptFr?.toLowerCase().includes(query) ||
        post.excerptEn?.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [selectedCategory, searchQuery, posts]);

  const handleShare = async (post: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const title = isFr ? post.titleFr : (post.titleEn || post.titleFr);
    if (navigator.share) {
      try {
        await navigator.share({ title, url: window.location.href });
      } catch (err) { console.log(err); }
    }
  };

  if (isLoading) return (
    <div className="py-40 text-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="font-black text-blue-500 uppercase tracking-widest text-xs">{t('contact.sending')}</p>
    </div>
  );

  return (
    <section id="blog" className="relative py-12 bg-white overflow-hidden min-h-screen">

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-7xl mx-auto px-4 mb-12 relative z-10"
      >
        <Link to="/" className="inline-flex items-center gap-3 text-[10px] font-black text-gray-500 hover:text-blue-500 transition-all uppercase tracking-[0.2em] group">
          <div className="p-2.5 bg-gray-100 rounded-full group-hover:bg-blue-50 transition-colors shadow-sm">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          {t('nav.back')}
        </Link>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle
          subtitle={t('nav.blog')}
          title={t('blog.title')}
          description={t('blog.description')}
        />

        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-16 animate-fadeInUp">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={t('blog.search_placeholder')}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest transition-all ${selectedCategory === cat.id ? 'text-white' : 'text-gray-500 bg-gray-50 hover:bg-gray-100'
                  }`}
              >
                <span className="relative z-10 uppercase">{cat.label}</span>
                {selectedCategory === cat.id && (
                  <motion.div
                    layoutId="activeBlogCat"
                    className="absolute inset-0 bg-blue-600 rounded-full shadow-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode='popLayout'>
            {filteredPosts.map((post, index) => {
              const title = isFr ? post.titleFr : (post.titleEn || post.titleFr);
              const excerpt = isFr ? post.excerptFr : (post.excerptEn || post.excerptFr);

              return (
                <motion.div
                  key={post._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => navigate(`/blog/${post.slug.current}`)}
                  className="group cursor-pointer"
                >
                  <Card className="p-0 overflow-hidden h-full flex flex-col border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem]">
                    <div className="relative h-56 overflow-hidden">
                      {post.mainImage && (
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          src={urlFor(post.mainImage).width(600).url()}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex items-center gap-4 text-[10px] font-black text-blue-600 mb-4 tracking-widest uppercase">
                        <span>{post.category || "Actualité"}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-gray-400 flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(post.publishedAt).toLocaleDateString(isFr ? 'fr-FR' : 'en-US')}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-gray-900 mb-4 leading-tight group-hover:text-blue-500 transition-colors">
                        {title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 italic">
                        {excerpt}
                      </p>

                      <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                            <User size={14} />
                          </div>
                          <span className="text-[11px] font-bold text-gray-700">{post.authorName || "Solaris"}</span>
                        </div>
                        <button
                          onClick={(e) => handleShare(post, e)}
                          className="p-2 hover:bg-blue-50 rounded-full text-gray-400 hover:text-blue-500 transition-all"
                        >
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20 text-gray-400 uppercase font-black tracking-widest text-sm">
            {t('blog.no_results')}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;