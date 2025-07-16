import React from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'warning' | 'danger' | 'info';
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      confirmBg: 'bg-yellow-500 hover:bg-yellow-600'
    },
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      confirmBg: 'bg-red-500 hover:bg-red-600'
    },
    info: {
      icon: CheckCircle,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      confirmBg: 'bg-blue-500 hover:bg-blue-600'
    }
  };

  const style = typeStyles[type];
  const IconComponent = style.icon;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className={`${style.bgColor} ${style.borderColor} border-b px-6 py-4 rounded-t-xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <IconComponent className={`h-6 w-6 ${style.iconColor}`} />
              <h2 className="font-heading font-bold text-lg text-primary-800">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-primary-500 hover:text-primary-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-primary-700 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-primary-50 rounded-b-xl flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-primary-200 text-primary-700 font-semibold py-3 rounded-lg hover:bg-primary-300 transition-colors duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 ${style.confirmBg} text-white font-semibold py-3 rounded-lg transition-colors duration-200`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;