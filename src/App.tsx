import ToastProvider from "./libs/toastProvider";
import AppRouter from "./router/AppRouter";

function App() {
  return (
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  );
}

export default App;
