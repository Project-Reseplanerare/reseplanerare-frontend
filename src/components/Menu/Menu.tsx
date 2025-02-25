//default react imports
import { useState } from 'react';
// TravelOptions Component imports
import TravelOptions from '../TravelOptions/TravelOptions';
// ActivityList Component imports
import { ActivityList } from '../ActivityList/ActivityList';
//import map component
import Map from '../Map/Map';
// Dependency: Animation import
import { motion } from 'framer-motion';

export const Menu: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>('resealternativ');
  const [selectedLocations, setSelectedLocations] = useState<any[]>([]);

  const toggleComponent = (component: string) => {
    setActiveComponent(activeComponent === component ? null : component);
  };

  return (
    <section className="rounded-md w-full grid gap-4 text-darkDark dark:text-lightLight">
      <nav className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {['resealternativ', 'besoksmal', 'karta'].map((component) => (
          <motion.button
            key={component}
            onClick={() => toggleComponent(component)}
            className={`py-2 rounded border border-lightlightBorder dark:border-lightlight ${
              activeComponent === component
                ? 'bg-blueLight text-lightLight dark:text-lightLight'
                : 'bg-lightDark/90 dark:bg-darkDark/90 text-darkDark dark:text-lightLight'
            }`}
            whileHover={{
              scale: 1.08,
              transition: { duration: 0.3, ease: 'easeOut' },
            }}
            whileTap={{
              scale: 0.95,
              transition: { duration: 0.2, ease: 'easeInOut' },
            }}
            style={{ display: 'inline-block', transformOrigin: 'center' }}
          >
            <span className="inline-block">
              {component === 'resealternativ'
                ? 'Resealternativ'
                : component === 'besoksmal'
                ? 'Se och göra'
                : 'Karta'}
            </span>
          </motion.button>
        ))}
      </nav>

      <div className="grid grid-cols-1">
        {activeComponent === 'resealternativ' && <TravelOptions />}
        {activeComponent === 'besoksmal' && (
          <div className="grid grid-cols-1">
            <ActivityList
              setSelectedCategory={(places) => {
                console.log('Platser som skickas till kartan:', places);
                setSelectedLocations(places);
              }}
            />
          </div>
        )}
        {activeComponent === 'karta' && (
          <div className="rounded-md grid grid-cols-1 h-80">
            <Map places={selectedLocations} events={[]} />
          </div>
        )}
      </div>
    </section>
  );
};
