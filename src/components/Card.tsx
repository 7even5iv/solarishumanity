import React, { useState } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  variant?: 'default' | 'outline' | 'glass' | 'gradient' | 'dark';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  elevation?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  onClick?: () => void;
  animateOnHover?: boolean;
  borderColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

// Mapping des paddings
const paddingMap = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10'
};

// Mapping des rounded
const roundedMap = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  '2xl': 'rounded-[2rem]',
  '3xl': 'rounded-[3rem]'
};

// Mapping des elevations
const elevationMap = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl'
};

// Variantes de cartes - Changées en bleu
const variantClasses = {
  default: 'bg-white border border-gray-100',
  outline: 'bg-transparent border-2 border-gray-200 hover:border-blue-300',
  glass: 'bg-white/80 backdrop-blur-md border border-white/20',
  gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-100',
  dark: 'bg-gradient-to-br from-gray-900 to-gray-800 text-white border border-gray-700'
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  variant = 'default',
  padding = 'lg',
  rounded = '2xl',
  elevation = 'sm',
  interactive = false,
  onClick,
  animateOnHover = true,
  borderColor,
  gradientFrom,
  gradientTo
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Classes de hover - Changées en bleu
  const hoverClasses = hoverEffect ? `
    transition-all duration-500 ease-out
    ${animateOnHover ? 'hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-100/50' : ''}
    ${interactive ? 'cursor-pointer active:scale-95' : ''}
  ` : '';

  // Classes de gradient personnalisé
  const gradientClasses = gradientFrom && gradientTo
    ? `bg-gradient-to-br ${gradientFrom} ${gradientTo}`
    : '';

  // Classe de bordure personnalisée
  const borderClass = borderColor ? `border ${borderColor}` : '';

  // Déterminer la classe de variant (priorité au gradient personnalisé)
  const variantClass = gradientClasses || variantClasses[variant];

  return (
    <div
      className={`
        ${variantClass}
        ${paddingMap[padding]}
        ${roundedMap[rounded]}
        ${elevationMap[elevation]}
        ${hoverClasses}
        ${borderClass}
        overflow-hidden
        relative
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={interactive ? onClick : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {/* Effet de brillance au survol */}
      {hoverEffect && animateOnHover && (
        <div className={`
          absolute inset-0 pointer-events-none overflow-hidden
          transition-opacity duration-500
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}>
          <div className="absolute -inset-full w-full h-full bg-gradient-to-r from-transparent via-blue-500/10 to-transparent transform -skew-x-12 animate-shine" />
        </div>
      )}

      {/* Badge décoratif optionnel pour les cartes interactives - Changé en bleu */}
      {interactive && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        </div>
      )}

      {/* Contenu principal */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Effet de bordure au survol - Changé en bleu */}
      {hoverEffect && variant === 'outline' && (
        <div className={`
          absolute inset-0 rounded-[inherit] border-2 border-blue-400
          transition-all duration-500
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `} />
      )}
    </div>
  );
};

// Sous-composant pour les en-têtes de carte - Changé en bleu
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '', icon }) => {
  return (
    <div className={`flex items-start justify-between mb-6 ${className}`}>
      <div className="flex-1">
        {children}
      </div>
      {icon && (
        <div className="ml-4 p-2 bg-blue-50 rounded-xl text-blue-500">
          {icon}
        </div>
      )}
    </div>
  );
};

// Sous-composant pour le contenu de carte
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex-1 ${className}`}>
      {children}
    </div>
  );
};

// Sous-composant pour les pieds de carte
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '', divider = true }) => {
  return (
    <div className={`
      mt-6 pt-6
      ${divider ? 'border-t border-gray-100' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

// Carte avec image
interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  overlay?: boolean;
}

export const CardImage: React.FC<CardImageProps> = ({ src, alt, className = '', overlay = false }) => {
  return (
    <div className="relative -mx-6 -mt-6 mb-6 overflow-hidden">
      <img
        src={src}
        alt={alt}
        className={`w-full h-48 object-cover transition-transform duration-700 hover:scale-110 ${className}`}
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      )}
    </div>
  );
};

// Carte cliquable
interface ClickableCardProps extends CardProps {
  onClick: () => void;
  href?: string;
}

export const ClickableCard: React.FC<ClickableCardProps> = ({
  children,
  onClick,
  href,
  ...props
}) => {
  const handleClick = () => {
    if (href) {
      window.location.href = href;
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <Card
      {...props}
      interactive={true}
      onClick={handleClick}
      className="cursor-pointer group"
    >
      {children}
    </Card>
  );
};

// Carte avec statistiques - Changée en bleu
interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'blue' | 'green' | 'yellow';
}

const statVariantClasses = {
  default: 'bg-white border-gray-100',
  blue: 'bg-gradient-to-br from-blue-50 to-blue-100/30 border-blue-200',
  green: 'bg-gradient-to-br from-green-50 to-green-100/30 border-green-200',
  yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-100/30 border-yellow-200'
};

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  trend,
  variant = 'default'
}) => {
  return (
    <Card
      variant="default"
      className={`text-center ${statVariantClasses[variant]}`}
      padding="lg"
    >
      {icon && (
        <div className="mb-4 inline-flex p-3 bg-white rounded-2xl shadow-sm">
          <div className="text-blue-500">
            {icon}
          </div>
        </div>
      )}
      <p className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
        {value}
      </p>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        {label}
      </p>
      {trend && (
        <div className={`mt-3 text-xs font-bold ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
        </div>
      )}
    </Card>
  );
};

export default Card;