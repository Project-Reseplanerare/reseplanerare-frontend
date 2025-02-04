import { useEffect, useState } from 'react';
import { useBusStopStore } from '../../store/useBusStopStore';
import { useSearchBtnStore } from '../../store/useSearchBtnStore';

const apiKey = import.meta.env.VITE_TRAFIKLAB_KEY;

const RouteOptionsDropdown = () => {
  const { fromStopId, toStopId } = useBusStopStore();
  const { isButtonClicked } = useSearchBtnStore();
  const [routeNames, setRouteNames] = useState<string[]>([]);
  const [travelTimes, setTravelTimes] = useState<string[]>([]);
  const [routeStops, setRouteStops] = useState<Record<number, any[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);


  useEffect(() => {
    if (!isButtonClicked || !fromStopId || !toStopId) return;

    const fetchRoutes = async () => {
      try {
        const fromResponse = await fetch(
          `https://api.resrobot.se/v2.1/departureBoard?id=${fromStopId}&format=json&accessId=${apiKey}`
        );
        if (!fromResponse.ok) throw new Error(`Error: ${fromResponse.status}`);

        const fromData = await fromResponse.json();
        if (!fromData.Departure) {
          setRouteNames([]);
          setTravelTimes([]);
          return;
        }

        const toResponse = await fetch(
          `https://api.resrobot.se/v2.1/arrivalBoard?id=${toStopId}&format=json&accessId=${apiKey}`
        );
        if (!toResponse.ok) throw new Error(`Error: ${toResponse.status}`);

        const toData = await toResponse.json();
        if (!toData.Arrival) {
          setRouteNames([]);
          setTravelTimes([]);
          return;
        }

        const validJourneyRefs = new Map();
        toData.Arrival.forEach((arrival: any) => {
          validJourneyRefs.set(arrival.JourneyDetailRef.ref, arrival.time);
        });

        const filteredDepartures = fromData.Departure.filter(
          (departure: any) =>
            validJourneyRefs.has(departure.JourneyDetailRef.ref) &&
            departure.ProductAtStop?.catOut === 'BLT'
        );

        if (filteredDepartures.length === 0) {
          setRouteNames([]);
          setTravelTimes([]);
          return;
        }

        const names = filteredDepartures.map((departure: any) => {
          const departureTime = departure.time;
          const arrivalTime = validJourneyRefs.get(departure.JourneyDetailRef.ref);
          return `${departure.ProductAtStop.name} — ${formatTravelTime(departureTime)} - ${formatTravelTime(arrivalTime)}`;
        });

        const times = filteredDepartures.map((departure: any) => {
          const arrivalTime = validJourneyRefs.get(departure.JourneyDetailRef.ref);
          return calculateTravelDuration(departure.time, arrivalTime);
        });

        setRouteNames(names);
        setTravelTimes(times);
        setRouteStops({}); 
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchRoutes();
  }, [fromStopId, toStopId, isButtonClicked]);

  const fetchRouteStopsForRoute = async (index: number) => {
    try {
      const url = `https://api.resrobot.se/v2.1/trip?format=json&originId=${fromStopId}&destId=${toStopId}&passlist=true&showPassingPoints=true&accessId=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (!data.Trip || data.Trip.length === 0) {
        return;
      }
      const trip = data.Trip[index] || data.Trip[0];
      let stops: any[] = [];
      if (trip.LegList && trip.LegList.Leg) {
        trip.LegList.Leg.forEach((leg: any) => {
          if (leg.Stops && Array.isArray(leg.Stops.Stop)) {
            stops = stops.concat(leg.Stops.Stop);
          }
        });
      }

      const uniqueStops = Array.from(new Map(stops.map((stop) => [stop.extId, stop])).values());
      uniqueStops.sort((a, b) => {
        const timeA = a.depTime || a.arrTime || '';
        const timeB = b.depTime || b.arrTime || '';
        return timeA.localeCompare(timeB);
      });
      setRouteStops((prev) => ({ ...prev, [index]: uniqueStops }));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleRouteClick = (index: number) => {
    if (selectedRouteIndex === index) {
      setSelectedRouteIndex(null);
    } else {
      setSelectedRouteIndex(index);
      fetchRouteStopsForRoute(index);
    }
  };

  const formatTravelTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateTravelDuration = (departureTime: string, arrivalTime: string) => {
    const departureDate = new Date(`${new Date().toDateString()} ${departureTime}`);
    const arrivalDate = new Date(`${new Date().toDateString()} ${arrivalTime}`);
    const duration = (arrivalDate.getTime() - departureDate.getTime()) / (1000 * 60);
    if (duration <= 0) return 'Arrived';
    return `${duration} min`;
  };

  return (
    <div className="grid gap-4 p-4 border bg-gray-100 text-gray-800 rounded-lg">
      <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Ruttalternativ</h2>

      {error && <p className="text-sm text-red-700 bg-red-200 p-2 rounded-md">⚠️ {error}</p>}

      {routeNames.length > 0 ? (
        <div className="grid gap-3">
          {routeNames.map((name, index) => (
            <div key={index} className="grid gap-2">
              <div
                onClick={() => handleRouteClick(index)}
                className="cursor-pointer grid grid-cols-[1fr_auto_auto] items-center p-3 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-200 transition"
              >
                <p className="font-medium text-gray-800 truncate" title={name}>
                  {name}
                </p>
                <div className="bg-gray-200 px-3 py-1 rounded-md text-right">
                  <p className="text-sm text-gray-700">
                    Restid: <span className="font-bold">{travelTimes[index]}</span>
                  </p>
                </div>
                <span
                  className={`text-gray-700 transition-transform ${selectedRouteIndex === index ? 'rotate-180' : 'rotate-0'}`}
                >
                  ▼
                </span>
              </div>
              {selectedRouteIndex === index && routeStops[index] && (
                <div className="mt-2 p-2 border rounded bg-white space-y-1">
                  {routeStops[index].map((stop, sIndex) => (
                    <div key={sIndex} className="flex justify-between text-sm text-gray-700">
                      <span>● {stop.name}</span>
                      <span>{stop.depTime || stop.arrTime || ''}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-4">⏳ Laddar rutter...</p>
      )}
    </div>
  );
};

export default RouteOptionsDropdown;
