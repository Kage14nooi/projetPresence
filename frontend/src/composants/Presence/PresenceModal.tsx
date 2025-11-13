import React from "react";

interface PresenceModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const PresenceModal: React.FC<PresenceModalProps> = ({
  show,
  onClose,
  children,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-4 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

export default PresenceModal;
