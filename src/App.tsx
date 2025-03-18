
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import TicTacToe from "./pages/Games/TicTacToe";
import Snake from "./pages/Games/Snake";
import Sudoku from "./pages/Games/Sudoku";
import Tetris from "./pages/Games/Tetris";
import Crossword from "./pages/Games/Crossword";
import JigsawPuzzle from "./pages/Games/JigsawPuzzle";
import Tango from "./pages/Games/Tango";
import Queens from "./pages/Games/Queens";
import Crossclimb from "./pages/Games/Crossclimb";
import Pinpoint from "./pages/Games/Pinpoint";
import Game2048 from "./pages/Games/Game2048";
import DinoRun from "./pages/Games/DinoRun";
import ComingSoon from "./pages/Games/ComingSoon";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/games/tic-tac-toe" element={<TicTacToe />} />
            <Route path="/games/snake" element={<Snake />} />
            <Route path="/games/sudoku" element={<Sudoku />} />
            <Route path="/games/tetris" element={<Tetris />} />
            <Route path="/games/crossword" element={<Crossword />} />
            <Route path="/games/jigsaw" element={<JigsawPuzzle />} />
            <Route path="/games/tango" element={<Tango />} />
            <Route path="/games/queens" element={<Queens />} />
            <Route path="/games/crossclimb" element={<Crossclimb />} />
            <Route path="/games/pinpoint" element={<Pinpoint />} />
            <Route path="/games/2048" element={<Game2048 />} />
            <Route path="/games/dino-run" element={<DinoRun />} />
            <Route path="/games/coming-soon/:gameName" element={<ComingSoon />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
