import './App.css';
import Header from './components/Header/Header';
import BreadCrumbs from './components/Breadcrumbs/Breadcrumbs';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TravelPlannerWrapper from './components/TravelPlanner.tsx/TravelPlannerWrapper';
import Map from './components/Map/Map';
import GeneralInformation from './components/GenaralInformation/GeneralInformation';
import SearchInput from './components/SearchInput/SearchInput';

function App() {
  return (
    <Router>
      <main className="app-container">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <section className="content-wrapper container px-5">
                <BreadCrumbs
                  crumbs={[
                    { label: 'Visit Värmland', link: '/' },
                    { label: 'Reseplaneraren', link: '/reseplaneraren' },
                  ]}
                />
                <GeneralInformation />
                <SearchInput />
                <div className="h-80 border z-10 border-gray-300 rounded-lg overflow-hidden flex flex-grow">
                  <Map />
                </div>
                <TravelPlannerWrapper />
              </section>
            }
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
