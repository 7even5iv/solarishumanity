import React from 'react';

interface SectionTitleProps {
  subtitle: string;
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  dark?: boolean;
  variant?: 'default' | 'gradient' | 'with-icon';
  icon?: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  subtitle,
  title,
  description,
  align = 'center',
  dark = false,
  variant = 'default',
  icon,
  className = ''
}) => {
  // Classes d'alignement
  const alignClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto'
  };

  // Classes pour le titre - Changées en bleu
  const titleClasses = {
    default: dark ? 'text-white' : 'text-gray-900',
    gradient: 'bg-gradient-to-r from-blue-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent',
    'with-icon': dark ? 'text-white' : 'text-gray-900'
  };

  // Classes pour la description
  const descriptionClasses = dark ? 'text-gray-400' : 'text-gray-600';

  // Classes pour la barre décorative
  const barAlignClasses = {
    left: 'mx-0',
    center: 'mx-auto',
    right: 'mx-0 ml-auto'
  };

  return (
    <div className={`max-w-3xl mb-16 ${alignClasses[align]} ${className}`}>
      {/* Badge subtitle avec effet amélioré - Changé en bleu */}
      <div className="inline-flex items-center gap-2 mb-4 group">
        {icon && (
          <span className="text-blue-500 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </span>
        )}
        <span className={`
          text-[10px] font-black uppercase tracking-[0.25em] 
          ${dark ? 'text-blue-400' : 'text-blue-500'}
          group-hover:tracking-[0.3em] transition-all duration-300
        `}>
          {subtitle}
        </span>
        {variant === 'with-icon' && !icon && (
          <div className="w-8 h-px bg-gradient-to-r from-blue-500 to-transparent" />
        )}
      </div>

      {/* Titre principal */}
      <h2 className={`
        text-3xl md:text-4xl lg:text-5xl xl:text-6xl 
        font-black mb-6 leading-[1.2] tracking-tight
        ${titleClasses[variant]}
        ${variant === 'gradient' ? 'animate-gradient' : ''}
      `}>
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p className={`
          text-base md:text-lg leading-relaxed max-w-2xl
          ${align === 'center' ? 'mx-auto' : ''}
          ${descriptionClasses}
        `}>
          {description}
        </p>
      )}

      {/* Barre décorative animée - Changée en bleu */}
      <div className={`mt-6 ${barAlignClasses[align]}`}>
        <div className="relative">
          {/* Barre principale */}
          <div className={`
            h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-blue-500
            transition-all duration-500 hover:w-24
          `} />

          {/* Barre secondaire décorative */}
          <div className={`
            absolute -bottom-2 left-0 h-0.5 w-8 rounded-full 
            bg-blue-300/50 opacity-0 transition-all duration-500
            group-hover:opacity-100 group-hover:w-12
          `} />
        </div>

        {/* Points décoratifs optionnels - Changés en bleu */}
        <div className="flex gap-1 mt-2">
          <div className="w-1 h-1 rounded-full bg-blue-400/60" />
          <div className="w-1 h-1 rounded-full bg-yellow-400/40" />
          <div className="w-1 h-1 rounded-full bg-blue-400/20" />
        </div>
      </div>
    </div>
  );
};

// Sous-composant pour les titres avec animation
export const AnimatedSectionTitle: React.FC<SectionTitleProps> = (props) => {
  return (
    <div className="animate-fadeInUp">
      <SectionTitle {...props} />
    </div>
  );
};

// Sous-composant pour les titres avec effet de révélation - Changé en bleu
export const RevealSectionTitle: React.FC<SectionTitleProps> = ({ title, ...props }) => {
  const words = title.split(' ');

  return (
    <div className={`max-w-3xl mb-16 ${props.align === 'center' ? 'mx-auto text-center' : 'text-left'}`}>
      <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">
        {props.subtitle}
      </span>

      <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight text-gray-900">
        {words.map((word, index) => (
          <span
            key={index}
            className="inline-block animate-wordReveal"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {word}{' '}
          </span>
        ))}
      </h2>

      {props.description && (
        <p className={`text-lg ${props.dark ? 'text-gray-400' : 'text-gray-600'}`}>
          {props.description}
        </p>
      )}

      <div className={`h-1 w-20 bg-gradient-to-r from-blue-500 via-yellow-400 to-blue-500 rounded-full mt-6 ${props.align === 'center' ? 'mx-auto' : ''}`} />
    </div>
  );
};

export default SectionTitle;