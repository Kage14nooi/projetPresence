// import React from "react";
// import { AlertTriangle, Trash2, Info } from "lucide-react";

// interface ConfirmationModalProps {
//   isOpen: boolean;
//   title?: string;
//   message: string;
//   confirmText?: string;
//   cancelText?: string;
//   type?: "danger" | "warning" | "info";
//   onConfirm: () => void;
//   onCancel: () => void;
// }

// const typeConfig = {
//   danger: {
//     bgColor: "bg-red-50",
//     iconColor: "text-red-600",
//     buttonColor: "bg-red-600 hover:bg-red-700 text-white",
//     borderColor: "border-red-200",
//     icon: Trash2,
//   },
//   warning: {
//     bgColor: "bg-yellow-50",
//     iconColor: "text-yellow-600",
//     buttonColor: "bg-yellow-500 hover:bg-yellow-600 text-white",
//     borderColor: "border-yellow-200",
//     icon: AlertTriangle,
//   },
//   info: {
//     bgColor: "bg-blue-50",
//     iconColor: "text-blue-600",
//     buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
//     borderColor: "border-blue-200",
//     icon: Info,
//   },
// };

// const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
//   isOpen,
//   title = "Confirmation",
//   message,
//   confirmText = "Confirmer",
//   cancelText = "Annuler",
//   type = "info",
//   onConfirm,
//   onCancel,
// }) => {
//   if (!isOpen) return null;

//   const config = typeConfig[type];
//   const IconComponent = config.icon;

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
//         {/* Header avec icône */}
//         <div
//           className={`${config.bgColor} ${config.borderColor} border-b px-6 py-5 flex items-center gap-4`}
//         >
//           <div
//             className={`${config.iconColor} bg-white p-3 rounded-full shadow-sm`}
//           >
//             <IconComponent size={24} strokeWidth={2.5} />
//           </div>
//           <h2 className="text-xl font-bold text-gray-900">{title}</h2>
//         </div>

//         {/* Contenu */}
//         <div className="px-6 py-6">
//           <p className="text-gray-700 leading-relaxed">{message}</p>
//         </div>

//         {/* Footer avec boutons */}
//         <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
//           <button
//             onClick={onCancel}
//             className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200 hover:shadow-sm"
//           >
//             {cancelText}
//           </button>
//           <button
//             onClick={onConfirm}
//             className={`px-5 py-2.5 rounded-lg ${config.buttonColor} font-medium transition-all duration-200 shadow-sm hover:shadow-md`}
//           >
//             {confirmText}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConfirmationModal;
import React from "react";
import { AlertTriangle, Trash2, Info, CheckCircle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info" | "success"; // ajouté success
  onConfirm: () => void;
  onCancel: () => void;
}

const typeConfig = {
  danger: {
    bgColor: "bg-red-50",
    iconColor: "text-red-600",
    buttonColor: "bg-red-600 hover:bg-red-700 text-white",
    borderColor: "border-red-200",
    icon: Trash2,
  },
  warning: {
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600",
    buttonColor: "bg-yellow-500 hover:bg-yellow-600 text-white",
    borderColor: "border-yellow-200",
    icon: AlertTriangle,
  },
  info: {
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
    borderColor: "border-blue-200",
    icon: Info,
  },
  success: {
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
    buttonColor: "bg-green-600 hover:bg-green-700 text-white",
    borderColor: "border-green-200",
    icon: CheckCircle, // icône de succès
  },
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title = "Confirmation",
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  type = "info",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const config = typeConfig[type];
  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header avec icône */}
        <div
          className={`${config.bgColor} ${config.borderColor} border-b px-6 py-5 flex items-center gap-4`}
        >
          <div
            className={`${config.iconColor} bg-white p-3 rounded-full shadow-sm`}
          >
            <IconComponent size={24} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>

        {/* Contenu */}
        <div className="px-6 py-6">
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>

        {/* Footer avec boutons */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
          {/* Si c’est un modal de succès, on peut cacher le bouton Annuler */}
          {type !== "success" && (
            <button
              onClick={onCancel}
              className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200 hover:shadow-sm"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-lg ${config.buttonColor} font-medium transition-all duration-200 shadow-sm hover:shadow-md`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
