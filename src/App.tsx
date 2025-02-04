import './App.css';
import Header from './components/Header/Header';
import BreadCrumbs from './components/BreadCrumbs/BreadCrumbs';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TravelPlannerWrapper from './components/TravelPlanner.tsx/TravelPlannerWrapper';
import Map from './components/Map/Map';
import GeneralInformation from './components/GenaralInformation/GeneralInformation';
import SearchInput from './components/SearchInput/SearchInput';
import Footer from './components/Footer/Footer';
import TravelOptions from './components/Dropdown/TravelOptions/TravelOptions';
import DatePickerComponent from './components/Dropdown/DatePickerComponent/DatePickerComponent';
import AttractionList from './components/Dropdown/AttractionList/AttractionList';
import TravelStop from './components/Dropdown/TravelStop/TravelStop';
import RouteOptionsDropdown from './components/RouteOptionsDropdown/RouteOptionsDropdown';

function App() {
  return (
    <Router>
      <main className="app-container min-h-screen grid grid-rows-[auto,1fr,auto] gap-4">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <section className="px-4 sm:px-6 lg:px-8 w-full mx-auto grid gap-6">
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

                {/* Map Component */}
                <div className="relative w-full min-h-[50vh] md:min-h-[40vh] lg:min-h-[40vh] border border-gray-300 rounded-lg overflow-hidden flex">
                  <Map />
                </div>

                {/* Travel Planner Wrapper */}
                <TravelPlannerWrapper />

                {/* Route option dropdown */}
                <RouteOptionsDropdown />

                {/* Travel Options */}
                <TravelOptions />

                {/* Date Picker */}
                <DatePickerComponent />

                {/* Attraction List */}
                <AttractionList />

                {/* Travel Stop */}
                <TravelStop />
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
