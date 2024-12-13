import { BrowserRouter, Routes, Route } from 'react-router-dom';

// pages & components
import Home from './pages/Home';
import Teams from './pages/Teams';
import EditTeam from './pages/EditTeam';
import EditMonstie from './pages/EditMonstie'
import Navbar from './components/Title';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route 
              path="/" 
              element={<Home />} 
            />
            <Route 
              path="/Teams/:username" 
              element={<Teams />} 
            />
            <Route 
              path="/Teams/:username/:teamName" 
              element={<EditTeam />} 
            />
            <Route
              path="/Teams/:username/:teamName/:monstieName"
              element={<EditMonstie />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
