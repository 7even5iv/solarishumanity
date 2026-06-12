import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'dark' | 'light' | 'success' | 'warning' | 'info' | 'purple' | 'gradient' | 'yellow';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  closable?: boolean;
  onClose?: () => void;
  animated?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'sm',
  rounded = 'full',
  icon,
  iconPosition = 'left',
  closable = false,
  onClose,
  animated = true,
  className = ''
}) => {
  // Mapping des variantes - Changé 'orange' en 'blue' et ajouté 'yellow'
  const variants = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    dark: "bg-gray-800 text-white border-gray-700",
    light: "bg-white text-gray-600 border-gray-200",
    success: "bg-green-50 text-green-600 border-green-200",
    warning: "bg-yellow-50 text-yellow-600 border-yellow-200",
    info: "bg-blue-50 text-blue-600 border-blue-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    gradient: "bg-gradient-to-r from-blue-500 via-yellow-400 to-blue-500 text-white border-transparent shadow-sm",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200"
  };

  // Mapping des tailles
  const sizeClasses = {
    xs: "px-2 py-0.5 text-[8px] gap-1",
    sm: "px-2.5 py-1 text-[10px] gap-1.5",
    md: "px-3 py-1.5 text-xs gap-2",
    lg: "px-4 py-2 text-sm gap-2"
  };

  // Mapping des arrondis
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full"
  };

  // Classes d'animation
  const animationClasses = animated ? `
    transition-all duration-300 ease-out
    hover:scale-105 hover:shadow-md
  ` : '';

  // Styles supplémentaires pour les badges avec icône
  const iconSpacing = icon ? (iconPosition === 'left' ? 'pl-2' : 'pr-2') : '';

  return (
    <div className="inline-block">
      <span
        className={`
          inline-flex items-center justify-center
          font-black uppercase tracking-[0.15em] 
          border
          ${variants[variant as keyof typeof variants]}
          ${sizeClasses[size]}
          ${roundedClasses[rounded]}
          ${animationClasses}
          ${iconSpacing}
          ${closable ? 'pr-1' : ''}
          ${className}
        `}
      >
        {icon && iconPosition === 'left' && (
          <span className="shrink-0">
            {icon}
          </span>
        )}

        <span className="whitespace-nowrap">{children}</span>

        {icon && iconPosition === 'right' && !closable && (
          <span className="shrink-0">
            {icon}
          </span>
        )}

        {closable && (
          <button
            onClick={onClose}
            className="ml-1 -mr-1 p-0.5 hover:bg-black/10 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </span>
    </div>
  );
};

// Sous-composant pour les badges de statut
interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showDot = true }) => {
  const statusConfig = {
    active: { variant: 'success', label: 'Actif', dotColor: 'bg-green-500' },
    inactive: { variant: 'dark', label: 'Inactif', dotColor: 'bg-gray-500' },
    pending: { variant: 'warning', label: 'En attente', dotColor: 'bg-yellow-500' },
    completed: { variant: 'success', label: 'Terminé', dotColor: 'bg-green-500' },
    cancelled: { variant: 'warning', label: 'Annulé', dotColor: 'bg-red-500' }
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant as any} size="sm">
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} mr-1`} />
      )}
      {config.label}
    </Badge>
  );
};

// Sous-composant pour les badges de compteur - Changé variant par défaut en 'blue'
interface CounterBadgeProps {
  count: number;
  max?: number;
  variant?: BadgeProps['variant'];
  size?: BadgeProps['size'];
}

export const CounterBadge: React.FC<CounterBadgeProps> = ({
  count,
  max = 99,
  variant = 'blue',
  size = 'xs'
}) => {
  const displayCount = count > max ? `${max}+` : count;

  if (count === 0) return null;

  return (
    <Badge variant={variant} size={size} rounded="full" className="min-w-[20px] justify-center">
      {displayCount}
    </Badge>
  );
};

// Sous-composant pour les badges de notification - Changé variant en 'blue'
interface NotificationBadgeProps {
  hasNotification?: boolean;
  count?: number;
  variant?: 'dot' | 'count';
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  hasNotification = true,
  count = 0,
  variant = 'dot'
}) => {
  if (!hasNotification && count === 0) return null;

  if (variant === 'dot') {
    return (
      <span className="relative inline-flex">
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
      </span>
    );
  }

  return (
    <span className="relative inline-flex">
      <CounterBadge count={count} variant="blue" size="xs" />
    </span>
  );
};

// Sous-composant pour les badges de prix - Changé variant par défaut en 'blue'
interface PriceBadgeProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  variant?: BadgeProps['variant'];
}

export const PriceBadge: React.FC<PriceBadgeProps> = ({
  price,
  originalPrice,
  currency = '€',
  variant = 'blue'
}) => {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className="flex items-center gap-2">
      <Badge variant={variant} size="md">
        {price}{currency}
      </Badge>
      {originalPrice && (
        <>
          <span className="text-sm text-gray-400 line-through">
            {originalPrice}{currency}
          </span>
          <Badge variant="success" size="xs">
            -{discount}%
          </Badge>
        </>
      )}
    </div>
  );
};

// Sous-composant pour les badges de catégorie - Changé la couleur du compteur en bleu
interface CategoryBadgeProps {
  category: string;
  count?: number;
  variant?: BadgeProps['variant'];
  clickable?: boolean;
  onClick?: () => void;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  count,
  variant = 'light',
  clickable = false,
  onClick
}) => {
  const badge = (
    <Badge
      variant={variant}
      size="sm"
      className={clickable ? 'cursor-pointer hover:scale-105 transition-transform' : ''}
    >
      <span className="uppercase">{category}</span>
      {count !== undefined && (
        <span className="ml-1 text-blue-500 font-bold">({count})</span>
      )}
    </Badge>
  );

  if (clickable && onClick) {
    return <button onClick={onClick}>{badge}</button>;
  }

  return badge;
};

// Sous-composant pour les tags
interface TagBadgeProps {
  tags: string[];
  max?: number;
  variant?: BadgeProps['variant'];
  onRemove?: (tag: string) => void;
}

export const TagBadge: React.FC<TagBadgeProps> = ({
  tags,
  max = 5,
  variant = 'light',
  onRemove
}) => {
  const displayTags = tags.slice(0, max);
  const remaining = tags.length - max;

  return (
    <div className="flex flex-wrap gap-2">
      {displayTags.map((tag) => (
        <Badge
          key={tag}
          variant={variant}
          size="sm"
          closable={!!onRemove}
          onClose={() => onRemove?.(tag)}
        >
          #{tag}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge variant="light" size="sm">
          +{remaining}
        </Badge>
      )}
    </div>
  );
};

export default Badge;