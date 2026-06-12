import React, { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  loading = false,
  rounded = 'xl',
  shadow = 'md',
  animate = true,
  className = '',
  disabled,
  ...props
}, ref) => {

  // Classes de base
  const baseStyles = `
    inline-flex items-center justify-center gap-2 
    font-black transition-all duration-300 
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
    ${animate ? 'active:scale-95' : ''}
    ${fullWidth ? 'w-full' : ''}
  `;

  // Mapping des variantes
  const variantStyles = {
    primary: `
    bg-gradient-to-r from-blue-500 to-blue-600
    text-white
    hover:from-blue-600 hover:to-blue-700
    border border-blue-600/20
    `,
    secondary: `
      bg-gray-800 text-white 
      hover:bg-gray-900
      border border-gray-700
    `,
    outline: `
      bg-transparent 
      border-2 border-gray-300 
      text-gray-700 
      hover:border-blue-500 hover:text-blue-600
      hover:bg-blue-50/50
    `,
    ghost: `
      bg-transparent 
      text-gray-600 
      hover:text-blue-600 
      hover:bg-blue-50
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600 
      text-white 
      hover:from-red-600 hover:to-red-700
      border border-red-600/20
    `,
    success: `
      bg-gradient-to-r from-green-500 to-green-600 
      text-white 
      hover:from-green-600 hover:to-green-700
      border border-green-600/20
    `,
    warning: `
      bg-gradient-to-r from-yellow-500 to-amber-600 
      text-white 
      hover:from-yellow-600 hover:to-amber-700
      border border-yellow-600/20
    `,
    gradient: `
      bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 
      text-white 
      hover:from-blue-500 hover:via-blue-600 hover:to-blue-700
      bg-[length:200%_auto] hover:bg-[length:200%_auto]
      animate-gradient
    `
  };

  // Mapping des tailles
  const sizeStyles = {
    xs: "px-3 py-1.5 text-[8px] tracking-wider gap-1",
    sm: "px-4 py-2 text-[10px] tracking-widest gap-1.5",
    md: "px-6 py-3 text-xs tracking-widest gap-2",
    lg: "px-8 py-4 text-sm tracking-widest gap-2",
    xl: "px-10 py-5 text-base tracking-widest gap-3"
  };

  // Mapping des arrondis
  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
    full: "rounded-full"
  };

  // Mapping des ombres
  const shadowStyles = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg"
  };

  // Styles supplémentaires pour certaines variantes (CORRIGÉS avec du bleu)
  const getAdditionalStyles = () => {
    if (variant === 'primary') {
      return shadow !== 'none' ? `shadow-${shadow} shadow-blue-500/25` : '';
    }
    if (variant === 'gradient') {
      return shadow !== 'none' ? `shadow-${shadow} shadow-blue-500/30` : '';
    }
    if (shadow !== 'none') {
      return `shadow-${shadow} shadow-gray-200`;
    }
    return '';
  };

  // Animation de chargement
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      ref={ref}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${roundedStyles[rounded]}
        ${shadowStyles[shadow]}
        ${getAdditionalStyles()}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner />
          <span>Chargement...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="shrink-0 transition-transform group-hover:scale-110">
              {icon}
            </span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="shrink-0 transition-transform group-hover:translate-x-0.5">
              {icon}
            </span>
          )}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

// Sous-composant pour les boutons avec icône seulement
interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: React.ReactNode;
  label: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  size = 'md',
  ...props
}) => {
  const sizeMap = {
    xs: 'p-1.5',
    sm: 'p-2',
    md: 'p-2.5',
    lg: 'p-3',
    xl: 'p-4'
  };

  return (
    <Button
      {...props}
      size={size}
      className={`${sizeMap[size]} ${props.className || ''}`}
      aria-label={label}
    >
      {icon}
    </Button>
  );
};

// Sous-composant pour les groupes de boutons
interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  spacing = 'md',
  className = ''
}) => {
  const orientationClasses = {
    horizontal: 'flex flex-row',
    vertical: 'flex flex-col'
  };

  const spacingClasses = {
    sm: orientation === 'horizontal' ? 'space-x-2' : 'space-y-2',
    md: orientation === 'horizontal' ? 'space-x-3' : 'space-y-3',
    lg: orientation === 'horizontal' ? 'space-x-4' : 'space-y-4'
  };

  return (
    <div className={`${orientationClasses[orientation]} ${spacingClasses[spacing]} ${className}`}>
      {React.Children.map(children, (child, index) => (
        <div className={index !== 0 && orientation === 'horizontal' ? '-ml-px' : ''}>
          {child}
        </div>
      ))}
    </div>
  );
};

// Sous-composant pour les boutons de navigation
interface NavButtonProps extends ButtonProps {
  direction: 'next' | 'previous';
}

export const NavButton: React.FC<NavButtonProps> = ({ direction, ...props }) => {
  const ArrowIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {direction === 'next' ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      )}
    </svg>
  );

  return (
    <Button
      variant="outline"
      size="md"
      rounded="full"
      icon={<ArrowIcon />}
      {...props}
    />
  );
};

// Sous-composant pour les boutons de like
interface LikeButtonProps extends Omit<ButtonProps, 'children' | 'icon'> {
  liked?: boolean;
  count?: number;
  onLike?: () => void;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  liked = false,
  count = 0,
  onLike,
  ...props
}) => {
  return (
    <Button
      variant={liked ? 'primary' : 'outline'}
      size="sm"
      rounded="full"
      onClick={onLike}
      icon={
        <svg
          className={`w-4 h-4 ${liked ? 'fill-current' : ''}`}
          fill={liked ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      }
      {...props}
    >
      {count > 0 && <span>{count}</span>}
    </Button>
  );
};

export default Button;