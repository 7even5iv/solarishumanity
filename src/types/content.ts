export interface IGalleryImage {
  id: string;
  url: string;
  caption: string;
  category: 'Cameroun' | 'Congo' | 'Eau' | 'Education' | 'Santé';
}

export interface IBlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  category: string;
}

// Ajout de IContent pour résoudre l'erreur
export interface IContent {
  id: string;
  title: string;
  description: string;
  image?: string;
  date?: string;
  category?: string;
  link?: string;
  type?: 'blog' | 'gallery' | 'event' | 'news';
}

// Interface pour les sections
export interface SectionTitleProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  dark?: boolean;
  className?: string;  // Important pour les erreurs de className
}