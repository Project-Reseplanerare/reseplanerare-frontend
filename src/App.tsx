import './App.css';
import Header from './components/Header/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TravelPlannerWrapper from './components/TravelPlanner/TravelPlannerWrapper';
import GeneralInformation from './components/GenaralInformation/GeneralInformation';
import SearchInput from './components/SearchInput/SearchInput';
import Menu from './components/Menu/Menu';
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
              <section className="p-8 max-w-[800px] mx-auto grid gap-4 h-auto backdrop-blur-xl rounded-md">
                <GeneralInformation />
                <SearchInput />
                <TravelPlannerWrapper />
                <RouteOptionsDropdown />
                <Menu />
              </section>
            }
          />
        </Routes>
        {/* Footer */}
        {/*<Footer />*/}
      </div>
    </Router>
  );
}

export default App;
