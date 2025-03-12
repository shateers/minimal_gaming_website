
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TicTacToe from "./pages/Games/TicTacToe";
import Snake from "./pages/Games/Snake";
import Sudoku from "./pages/Games/Sudoku";
import Tetris from "./pages/Games/Tetris";
import Crossword from "./pages/Games/Crossword";
import JigsawPuzzle from "./pages/Games/JigsawPuzzle";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/games/tic-tac-toe" element={<TicTacToe />} />
          <Route path="/games/snake" element={<Snake />} />
          <Route path="/games/sudoku" element={<Sudoku />} />
          <Route path="/games/tetris" element={<Tetris />} />
          <Route path="/games/crossword" element={<Crossword />} />
          <Route path="/games/jigsaw" element={<JigsawPuzzle />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
