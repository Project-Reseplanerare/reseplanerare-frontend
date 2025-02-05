import './App.css';
import Header from './components/Header/Header';
import BreadCrumbs from './components/BreadCrumbs/BreadCrumbs';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TravelPlannerWrapper from './components/TravelPlanner/TravelPlannerWrapper';
// import Map from './components/Map/Map';
import GeneralInformation from './components/GenaralInformation/GeneralInformation';
import SearchInput from './components/SearchInput/SearchInput';
import Footer from './components/Footer/Footer';
import Menu from './components/Menu/Menu';
import RouteOptionsDropdown from './components/RouteOptionsDropdown/RouteOptionsDropdown';

function App() {
  return (
    <Router>
      <main className="app-container h-full grid grid-rows-[auto,1fr,auto] gap-4 bg-lightLight dark:bg-darkDark text-darkDark dark:text-lightLight">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <section className="px-4 sm:px-6 lg:px-8 w-[800px] mx-auto grid gap-6">
                {/* Breadcrumbs */}
                <BreadCrumbs
                  crumbs={[
                    { label: 'Visit Värmland', link: '/' },
                    { label: 'Reseplaneraren', link: '/reseplaneraren' },
                  ]}
                />

                {/* General Information */}
                <GeneralInformation />

                {/* Search Input */}
                <SearchInput />

                {/* Travel Planner Wrapper */}
                <TravelPlannerWrapper />

                {/* Route option dropdown */}
                <RouteOptionsDropdown />

                {/* Travel Options */}
                <Menu />
              </section>
            }
          />
        </Routes>
        <Footer />
      </main>
    </Router>
  );
}

export default App;
