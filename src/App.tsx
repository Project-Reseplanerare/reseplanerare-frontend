import './App.css';
import Header from './components/Header/Header';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReseWidget from './components/Reseplanerare/ReseWidget';
import Map from './components/Map/Map';
import WidgetHeader from './components/Reseplanerare/WidgetHeader';
import SearchInput from './components/Reseplanerare/SearchInput';

function App() {
  return (
    <Router>
      <main className="app-container">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <section className="grid-container px-6">
                <Breadcrumbs
                  crumbs={[
                    { label: 'Visit Värmland', link: '/' },
                    { label: 'Reseplaneraren', link: '/reseplaneraren' },
                  ]}
                />
                <WidgetHeader />
                <SearchInput />
                <div className="h-60 border border-gray-300 rounded-lg overflow-hidden flex flex-grow">
                  <Map />
                </div>
                <ReseWidget />
              </section>
            }
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
