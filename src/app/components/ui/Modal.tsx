import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const sizeClass = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

export function Modal({ open, onClose, title, children, footer, size = 'lg' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Dialog */}
      <div className={`relative w-full ${sizeClass[size]} bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0 bg-gray-50 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Reusable Form Field ────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}
export function FormField({ label, required, children }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Shared Input Styles ────────────────────────────────────────────────────
export const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
export const selectCls = inputCls;

// ─── Detail Row ─────────────────────────────────────────────────────────────
interface DetailRowProps { label: string; value: React.ReactNode; }
export function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex items-start py-2 border-b border-gray-100 last:border-0">
      <span className="w-40 text-sm text-gray-500 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-900 font-medium">{value}</span>
    </div>
  );
}

// ─── Modal Buttons ──────────────────────────────────────────────────────────
interface BtnProps { onClick?: () => void; type?: 'button' | 'submit'; variant?: 'primary' | 'secondary' | 'danger'; children: React.ReactNode; disabled?: boolean; }
export function ModalBtn({ onClick, type = 'button', variant = 'secondary', children, disabled }: BtnProps) {
  const cls = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }[variant];
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${cls}`}>
      {children}
    </button>
  );
}
