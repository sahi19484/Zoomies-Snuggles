import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface BannerProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose?: () => void;
  className?: string;
}

const Banner: React.FC<BannerProps> = ({ type, message, onClose, className = '' }) => {
  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-500'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: AlertCircle,
      iconColor: 'text-red-500'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-500'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertCircle,
      iconColor: 'text-yellow-500'
    }
  };

  const style = styles[type];
  const IconComponent = style.icon;

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <IconComponent className={`h-5 w-5 ${style.iconColor} mt-0.5 mr-3 flex-shrink-0`} />
        <div className="flex-1">
          <p className={`${style.text} text-sm font-medium`}>
            {message}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${style.text} hover:opacity-75 ml-3`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Banner;