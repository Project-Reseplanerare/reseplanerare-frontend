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
import DatePickerComponent from './components/Dropdown/DatePickerComponent/DatePickerComponent';
// import AttractionList from './components/Explore/AttractionsList';
import TravelStop from './components/Dropdown/TravelStop/TravelStop';
import RouteOptionsDropdown from './components/RouteOptionsDropdown/RouteOptionsDropdown';

function App() {
  return (
    <Router>
      <main className="app-container min-h-screen grid grid-rows-layout gap-4">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <section className="px-5 grid grid-cols-1 ">
                {/* Breadcrumbs */}
                <div>
                  <BreadCrumbs
                    crumbs={[
                      { label: 'Visit Värmland', link: '/' },
                      { label: 'Reseplaneraren', link: '/reseplaneraren' },
                    ]}
                  />
                </div>

                {/* General Information */}
                <div>
                  <GeneralInformation />
                </div>

                {/* Search Input */}
                <div>
                  <SearchInput />
                </div>

                {/* Map Component
                <div className="grid grid-cols-1 h-80">
                  <div className="border z-10 border-gray-300 rounded-lg overflow-hidden flex flex-grow">
                    <Map />
                  </div>
                </div> */}

                {/* Travel Planner Wrapper */}
                <div>
                  <TravelPlannerWrapper />
                </div>

                 {/* Route option dropdown */}
                <div>
                  <RouteOptionsDropdown />
                </div>

                {/* Travel Options */}
                <div>
                  <Menu />
                </div>

                {/* Date Picker */}
                <div>
                  <DatePickerComponent />
                </div>

                {/* Attraction List */}
                {/* <div>
                  <AttractionList />
                </div> */}

                {/* Travel Stop */}
                <div>
                  <TravelStop />
                </div>
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