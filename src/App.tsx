import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { MainLayout } from "./components/MainLayout";
import { KeyboardShortcuts } from "./components/KeyboardShortcuts";
import { OfflineIndicator } from "./components/OfflineIndicator";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Tenants from "./pages/Tenants";
import Organizations from "./pages/Organizations";
import Roles from "./pages/Roles";
import Privileges from "./pages/Privileges";
import LegalEntities from "./pages/LegalEntities";
import NotFound from "./pages/NotFound";
import TenantSettings from "./pages/TenantSettings";
import OrganizationProfile from "./pages/OrganizationProfile";
import UserRoles from "./pages/UserRoles";
import MyProfile from "./pages/MyProfile";
import Reports from "./pages/Reports";
import AuditLogs from "./pages/AuditLogs";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Register Service Worker for PWA
const registerSW = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered: ', registration);
    } catch (registrationError) {
      console.log('SW registration failed: ', registrationError);
    }
  }
};

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// App Routes component
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="tenants" element={<Tenants />} />
        <Route path="tenant-settings" element={<TenantSettings />} />
        <Route path="organizations" element={<Organizations />} />
        <Route path="org-profile" element={<OrganizationProfile />} />
        <Route path="user-roles" element={<UserRoles />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="roles" element={<Roles />} />
        <Route path="privileges" element={<Privileges />} />
        <Route path="legal-entities" element={<LegalEntities />} />
        <Route path="reports" element={<Reports />} />
        <Route path="audit-logs" element={<AuditLogs />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  useEffect(() => {
    registerSW();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
              <KeyboardShortcuts />
              <OfflineIndicator />
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
