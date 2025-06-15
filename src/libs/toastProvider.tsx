import {
  Slide,
  ToastContainer,
  type Id,
  type ToastContent,
  type ToastOptions,
  toast,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}

type ToastType = "success" | "error" | "info" | "warning" | "default";

/**
 * Hook para mostrar toasts con el tema actual
 */
export function useToast() {
  return (
    type: ToastType,
    content: ToastContent,
    options: Partial<ToastOptions> = {}
  ): Id => {
    const defaultToastOptions: ToastOptions = {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light", // ✅ Ahora sí toma el tema correctamente
      transition: Slide,
    };

    const optionsToApply = { ...defaultToastOptions, ...options };

    switch (type) {
      case "success":
        return toast.success(content, optionsToApply);
      case "error":
        return toast.error(content, optionsToApply);
      case "info":
        return toast.info(content, optionsToApply);
      case "warning":
        return toast.warn(content, optionsToApply);
      default:
        return toast(content, optionsToApply);
    }
  };
}
