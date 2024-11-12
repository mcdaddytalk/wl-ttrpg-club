
import React from 'react';
import { Button } from './ui/button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Do not render if modal is not open

  return (
    <div className="fixed inset-y-50 inset-x-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="dark:bg-white bg-black p-6 rounded shadow-lg">
        <Button onClick={onClose} className="absolute top-2 right-2 text-red-600 hover:text-red-800 dark:text-slate-600 dark:hover:dark:text-slate-800">
          &times;
        </Button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
