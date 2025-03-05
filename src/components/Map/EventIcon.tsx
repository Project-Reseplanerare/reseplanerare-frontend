import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Eventicon for the map
export const EventIcon = L.divIcon({
    className: 'custom-marker',
    html: ReactDOMServer.renderToString(
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30px',
        height: '30px',
        background: 'linear-gradient(135deg, #ff7eb3, #ffcc00)',
        borderRadius: '50%',
        border: '2px solid #d48f00',
        boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
      }}>
        <FontAwesomeIcon 
          icon={faTicket} 
          color="#FFF"  
          style={{ fontSize: '16px', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }} 
        />
      </div>
    ),
    iconSize: [40, 40],
    iconAnchor: [15, 18],
  });