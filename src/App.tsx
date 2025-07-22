import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import Documents from "./pages/Documents";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import MachineIntelligence from "./pages/MachineIntelligence";
import Blog from "./pages/Blog";
import Machines from "./pages/Machines";
import Leads from "./pages/Leads";
import Resumes from "./pages/Resumes";
import Vacancies from "./pages/Vacancies";
import Opportunities from "./pages/Opportunities";
import Directory from "./pages/Directory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/intelligence" element={<MachineIntelligence />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/machines" element={<Machines />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/resumes" element={<Resumes />} />
          <Route path="/vacancies" element={<Vacancies />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/directory" element={<Directory />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
