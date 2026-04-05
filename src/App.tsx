import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import KoachezHome from "./pages/KoachezHome";
import SignUp from "./pages/signup"; // ✅ New (Lowercase 's' in signup)
import Login from "./pages/Login";
import Coaches from "./pages/Coaches";
import Onboarding from "./pages/Onboarding";
import CoachProfile from "./pages/CoachProfile";
import Booking from "./pages/Booking";
import NotFound from "./pages/NotFound";
import CoachDashboard from "./pages/coach/Dashboard";
import ProtectedCoachRoute from "./components/ProtectedCoachRoute";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<KoachezHome />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/coaches" element={<Coaches />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/coach/:subdomain" element={<CoachProfile />} />
            <Route path="/booking/:subdomain" element={<Booking />} />
            <Route 
              path="/dashboard/coach" 
              element={
                <ProtectedCoachRoute>
                  <CoachDashboard />
                </ProtectedCoachRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
