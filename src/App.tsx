import './App.css';
import Header from './components/Header/Header';
import BreadCrumbs from './components/BreadCrumbs/BreadCrumbs';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TravelPlannerWrapper from './components/TravelPlanner.tsx/TravelPlannerWrapper';
import Map from './components/Map/Map';
import GeneralInformation from './components/GenaralInformation/GeneralInformation';
import SearchInput from './components/SearchInput/SearchInput';
import Footer from './components/Footer';
import TravelOptions from './components/TravelOptions/TravelOptions';
import DatePickerComponent from './components/DatePickerComponent/DatePickerComponent';
import AttractionList from './components/Dropdown/Attractionlist';
import TravelStop from './components/TravelStop/TravelStop';

function App() {
  return (
    <Router>
      <main className="app-container min-h-screen">
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
                <TravelOptions/>
                <DatePickerComponent/>
                <AttractionList/>
                <TravelStop/>
                <div className="h-80 border z-10 border-gray-300 rounded-lg overflow-hidden flex flex-grow">
                  <Map />
                </div>
                <TravelPlannerWrapper />
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
