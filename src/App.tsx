import './App.css';
import Header from './components/Header/Header';
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
      <main
        className="app-container grid grid-rows-[auto_1fr_auto] text-darkDark dark:text-lightLight"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('https://images.pexels.com/photos/6772037/pexels-photo-6772037.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <section className="p-8 max-w-[800px] mx-auto grid gap-4 h-full backdrop-blur-md">
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
