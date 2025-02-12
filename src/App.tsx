import './App.css';
import Header from './components/Header/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TravelPlannerWrapper from './components/TravelPlanner/TravelPlannerWrapper';
import GeneralInformation from './components/GenaralInformation/GeneralInformation';
import SearchInput from './components/SearchInput/SearchInput';
import RouteOptionsDropdown from './components/RouteOptionsDropdown/RouteOptionsDropdown';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Header and Routes */}
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <section className="w-full p-4 lg:w-[800px] grid gap-4 h-auto">
                <GeneralInformation />
                <SearchInput />
                <TravelPlannerWrapper />
                <RouteOptionsDropdown />
              </section>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
