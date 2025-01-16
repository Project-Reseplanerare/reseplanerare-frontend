import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReseWidget from './components/Reseplanerare/ReseWidget';
import Map from './components/Map/Map';

function App() {
  return (
    <Router>
      <Header />
      <main className="h-auto p-10 flex flex-col gap-4 items-center">
        <ReseWidget />
        <Map/>

        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/Reseplanerare" element={<div>Reseplanerare</div>} />
          <Route path="/services" element={<div>Services Page</div>} />
          <Route path="/contact" element={<div>Contact Page</div>} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
