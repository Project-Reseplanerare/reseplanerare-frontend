import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLandmark, faUtensils, faBed, faShoppingBag, faRunning } from '@fortawesome/free-solid-svg-icons';
import { eventIcon } from './eventIcon';

const categoryIcons = {
  'Kultur & historia': { icon: faLandmark, colors: ['#8E44AD', '#D2B4DE'], border: '#6C3483' },
  'Mat & dryck': { icon: faUtensils, colors: ['#E67E22', '#F5B041'], border: '#D35400' },
  'Boende': { icon: faBed, colors: ['#3498DB', '#85C1E9'], border: '#2E86C1' },
  'Design & shopping': { icon: faShoppingBag, colors: ['#27AE60', '#7DCEA0'], border: '#1E8449' },
  'Aktiviteter': { icon: faRunning, colors: ['#E74C3C', '#F1948A'], border: '#C0392B' },
  'Evenemang': { icon: faLandmark, colors: ['#8E44AD', '#D2B4DE'], border: '#6C3483' },
};

export const subcategoryToMainCategory: Record<string, string> = {
  'Vandra': 'Aktiviteter',
  'Cykla': 'Aktiviteter',
  'Paddla': 'Aktiviteter',
  'Skidor': 'Aktiviteter',
  'Golfa': 'Aktiviteter',
  'Fiska': 'Aktiviteter',
  'Skidåkning': 'Aktiviteter',
  'Bada': 'Aktiviteter',
  'Nöjesaktiviteter': 'Aktiviteter',
  'Motor': 'Aktiviteter',

  'Lunch': 'Mat & dryck',
  'Restaurang': 'Mat & dryck',
  'Gårdsbutiker': 'Mat & dryck',
  'Utkörning': 'Mat & dryck',
  'Snabbmat': 'Mat & dryck',

  'Camping': 'Boende',
  'Herrgård': 'Boende',
  'Stugor': 'Boende',
  'Vandrarhem': 'Boende',
  'Lägerplatser': 'Boende',
  'Ställplatser': 'Boende',
  'Gästhamnar': 'Boende',

  'Museum': 'Kultur & historia',
  'Slott': 'Kultur & historia',
  'Konst': 'Kultur & historia',
  'Kyrka': 'Kultur & historia',
  'Natursevärdhet': 'Kultur & historia',
  'Hembygdsgårdar': 'Kultur & historia',

  'Mode': 'Design & shopping',
  'Inredning': 'Design & shopping',
  'Hantverk': 'Design & shopping',
  'Gårdsbutik': 'Design & shopping',
  'Köpcentrum': 'Design & shopping',
  'Loppis': 'Design & shopping',
  'Secondhand': 'Design & shopping',
  'Shopping': 'Design & shopping',
};

// Cache för att spara ikoner och förbättra prestanda
const iconCache: Record<string, L.DivIcon> = {};

// Funktion för att hämta rätt ikon
export const getPlaceIcon = (category: string): L.DivIcon => {

 // Om kategorin är "Evenemang", använd eventIcon
  if (category === 'Evenemang') {
    return eventIcon;
  }

  // Om det är en subkategori → hämta huvudkategori
  const mainCategory = subcategoryToMainCategory[category] || category;

  // Återanvänd ikonen om den redan finns i cachen
  if (iconCache[mainCategory]) {
    return iconCache[mainCategory];
  }

  // Hitta ikonen för huvudkategorin
  const categoryData = categoryIcons[mainCategory];

  if (!categoryData) {
    return eventIcon;
  }

  const { icon, colors, border } = categoryData;

  // Skapa och spara ikonen i cachen
  const categoryIcon = L.divIcon({
    className: 'custom-marker',
    html: ReactDOMServer.renderToString(
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30px',
        height: '30px',
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
        borderRadius: '50%',
        border: `2px solid ${border}`,
        boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
      }}>
        <FontAwesomeIcon 
          icon={icon} 
          color="#FFF"  
          style={{ fontSize: '16px', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }} 
        />
      </div>
    ),
    iconSize: [40, 40],
    iconAnchor: [15, 18],
  });

  // Spara i cache och returnera
  iconCache[mainCategory] = categoryIcon;
  return categoryIcon;
};
