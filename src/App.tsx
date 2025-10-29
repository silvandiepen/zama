import { useState } from "react";
// removed old imports
import "@/styles/global.scss";
import "@/styles/App.scss";
//
import { DevPanel } from "@/components/DevTools/DevPanel";
import { Modal } from "@/components/Modal/Modal";
import { Button } from "@/components/Button";
import { Colors, Size } from "@/types";
import { ThemeProvider } from "@/store/theme";
import { FeatureFlagsProvider } from "@/store/featureFlags";
import { KeysProvider } from "@/store/keys";
import { ToastProvider } from "@/store/toast";
import { Toaster } from "@/components/Toast/Toaster";
//
import { LocaleProvider } from "@/store/locale";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RouteTransition } from "@/components/PageTransition";
import { KeyDetail } from "@/components/KeyDetail/KeyDetail";
import { Header } from "@/components/Header/Header";
import { About } from "@/pages/about/About";
import { Dashboard } from "@/pages/dashboard/Dashboard";
import { ApiKeysPage } from "@/pages/api-keys/ApiKeysPage";
import { Usage } from "@/pages/usage/Usage";
import { SignIn } from "@/pages/SignIn";
import { AuthProvider, useAuth } from "@/store/auth";
import { Navigate } from "react-router-dom";
import { Settings } from "@/pages/Settings";
import { Docs } from "@/pages/Docs";
import { useTranslation } from "react-i18next";
import { Footer } from "@/components/Footer";

// Layout components for authenticated pages

/**
 * Renders a shell layout for authenticated pages with header and footer.
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to render
 * @param {(fn: () => void) => void} props.onOpenSettings - Callback to open settings modal
 * @returns {JSX.Element} The rendered main shell component.
 */
function MainShell({ children, onOpenSettings }: { 
  children: React.ReactNode; 
  onOpenSettings: () => void;
}) {
  return (
    <div className="app">
      <Header onOpenSettings={onOpenSettings} />
      <main className="app__main">
        <div className="container">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

/**
 * Renders a shell layout for the key detail page with header and footer.
 * @returns {JSX.Element} The rendered detail shell component.
 */
function DetailShell() {
  return (
    <div className="app">
      <Header onOpenSettings={() => {}} />
      <main className="app__main">
        <div className="container">
          <RouteTransition type="scale" duration={200}>
            <KeyDetail />
          </RouteTransition>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/**
 * Authentication wrapper component that redirects to sign-in page if user is not authenticated.
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {JSX.Element} Either the children if authenticated or a Navigate component to redirect
 */
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/signin" replace />;
  return <>{children}</>;
};

/**
 * Main application component that sets up routing, providers, and app layout.
 * @returns {JSX.Element} The rendered application with all providers and routing.
 */
function App() {
  const [showDev, setShowDev] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { t } = useTranslation();
  return (
    <ThemeProvider>
      <FeatureFlagsProvider>
        <ToastProvider>
          <LocaleProvider>
            <AuthProvider>
              <KeysProvider>
                <BrowserRouter>
                  <Routes>
                    <Route
                      path="/"
                      element={<Navigate to="/signin" replace />}
                    />
                    <Route
                      path="/signin"
                      element={
                        <div className="app">
                          <main className="app__main">
                            <RouteTransition type="slide-up" duration={300}>
                              <SignIn />
                            </RouteTransition>
                          </main>
                        </div>
                      }
                    />
                    <Route
                      path="/register"
                      element={
                        <div className="app">
                          <main className="app__main">
                            <RouteTransition type="slide-up" duration={300}>
                              <SignIn />
                            </RouteTransition>
                          </main>
                        </div>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <RequireAuth>
                          <MainShell onOpenSettings={() => setShowSettings(true)}>
                            <RouteTransition type="fade" duration={250}>
                              <Dashboard />
                            </RouteTransition>
                          </MainShell>
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/keys"
                      element={
                        <RequireAuth>
                          <MainShell onOpenSettings={() => setShowSettings(true)}>
                            <RouteTransition type="slide-left" duration={280}>
                              <ApiKeysPage />
                            </RouteTransition>
                          </MainShell>
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/keys/:id"
                      element={
                        <RequireAuth>
                          <DetailShell />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/usage"
                      element={
                        <RequireAuth>
                          <MainShell onOpenSettings={() => setShowSettings(true)}>
                            <RouteTransition type="slide-right" duration={300}>
                              <Usage />
                            </RouteTransition>
                          </MainShell>
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <RequireAuth>
                          <div className="app">
                            <Header onOpenSettings={() => setShowSettings(true)} />
                            <main className="app__main">
                              <RouteTransition type="flip" duration={400}>
                                <Settings />
                              </RouteTransition>
                            </main>
                          </div>
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/docs"
                      element={
                        <MainShell onOpenSettings={() => setShowSettings(true)}>
                          <RouteTransition type="slide-up" duration={350}>
                            <Docs />
                          </RouteTransition>
                        </MainShell>
                      }
                    />
                    <Route
                      path="/about"
                      element={
                        <MainShell onOpenSettings={() => setShowSettings(true)}>
                          <RouteTransition type="fade" duration={280}>
                            <About />
                          </RouteTransition>
                        </MainShell>
                      }
                    />
                  </Routes>
                  <Modal open={showDev} onClose={() => setShowDev(false)} title={t("dev.title")}>
                    <DevPanel onClose={() => setShowDev(false)} />
                  </Modal>
                  <div className="dev-fab">
                    <Button
                      size={Size.LARGE}
                      color={Colors.TERTIARY}
                      iconOnly
                      icon="code"
                      onClick={() => setShowDev(true)}
                      tooltip={t(showDev ? 'btn.hideDev' : 'btn.showDev')}
                      style={{ ['--button-icon-size' as any]: '60px' }}
                    />
                  </div>
                  <Modal open={showSettings} onClose={() => setShowSettings(false)} title={t("settings.title", { defaultValue: "Settings" })}>
                    <Settings />
                  </Modal>
                  <Toaster />
                </BrowserRouter>
              </KeysProvider>
            </AuthProvider>
          </LocaleProvider>
        </ToastProvider>
      </FeatureFlagsProvider>
    </ThemeProvider>
  );
}

export default App;
