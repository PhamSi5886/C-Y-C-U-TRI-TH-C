import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import Login from './components/Login';
import Game from './components/Game';
import Admin from './components/Admin';

const GameContainer = () => {
  const { state } = useGame();
  
  if (!state.player) {
    return <Login />;
  }
  
  return <Game />;
};

export default function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<GameContainer />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}
