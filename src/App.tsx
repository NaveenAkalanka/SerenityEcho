import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Mixer from './pages/Mixer';
import SoundLibrary from './pages/SoundLibrary';
import About from './pages/About';
import Header from './components/Header/Header';
import { ToastProvider } from './components/Toast/ToastContext';

const App: React.FC = () => {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-navy-dark text-white font-body selection:bg-accent/30 selection:text-white">
          <Header />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/mixer" element={<Mixer />} />
            <Route path="/library" element={<SoundLibrary />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
};

export default App;
