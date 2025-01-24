import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Playlists from './pages/Playlists';
import MediaLibrary from './pages/MediaLibrary';
import Templates from './pages/Templates';
import Screens from './pages/Screens';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/media" element={<MediaLibrary />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/screens" element={<Screens />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;