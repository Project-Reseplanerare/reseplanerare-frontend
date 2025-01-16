import './App.css';
// import Header from './components/Header/Header';
// import Footer from './components/Footer/Footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReseWidget from './components/Reseplanerare/ReseWidget';
import Map from './components/Map/Map';

function App() {
  return (
    <Router>
      {/* <Header /> */}
      <main className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              <div className="grid-container">
                <div className="widget-container">
                  <ReseWidget />
                </div>
                <div className="map-container">
                  <Map />
                </div>
              </div>
            }
          />
          <Route path="/about" element={<div>About</div>} />
        </Routes>
      </main>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
