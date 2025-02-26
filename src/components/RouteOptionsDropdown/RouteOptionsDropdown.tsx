// react imports
import { useEffect, useState } from 'react';
// store imports
import { useRouteStopStore } from '../../store/useRouteStopStore';
import { useSearchBtnStore } from '../../store/useSearchBtnStore';
import { useTravelOptionsStore } from '../../store/useTravelOptionsStore';
//import utility function to map out stops for a route
import { fetchRouteStopsForRoute } from '../../utils/api/fetchRouteStopsForRoute';

//import ts types for routeoptionsdropdown
import {
  Departure,
  Arrival,
  ResponseData,
} from '../../types/routeoptionsTypes/routeOptionsDropdown_types';

//trafiklab key from .env
const apiKey = import.meta.env.VITE_TRAFIKLAB_KEY;

export const RouteOptionsDropdown = () => {
  const { fromStopId, toStopId } = useRouteStopStore();
  const { isButtonClicked } = useSearchBtnStore();
  const [routeNames, setRouteNames] = useState<string[]>([]);
  const [travelTimes, setTravelTimes] = useState<string[]>([]);
  const [routeStops, setRouteStops] = useState<Record<number, any[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(
    null
  );
  const { selectedOption } = useTravelOptionsStore();

    useEffect(() => {
      if (!isButtonClicked || !fromStopId || !toStopId) return;
    
      const fetchRoutes = async () => {
        try {
          const fromResponse = await fetch(
            `https://api.resrobot.se/v2.1/departureBoard?id=${fromStopId}&format=json&accessId=${apiKey}&maxJourneys=300&duration=300`
          );
          if (!fromResponse.ok) throw new Error(`Error: ${fromResponse.status}`);
    
          const fromData: ResponseData<Departure> = await fromResponse.json();
          if (!fromData.Departure) {
            setRouteNames([]);
            setTravelTimes([]);
            return;
          }
    
          const toResponse = await fetch(
            `https://api.resrobot.se/v2.1/arrivalBoard?id=${toStopId}&format=json&accessId=${apiKey}&maxJourneys=300&duration=300`
          );
          if (!toResponse.ok) throw new Error(`Error: ${toResponse.status}`);
    
          const toData: ResponseData<Arrival> = await toResponse.json();
          if (!toData.Arrival) {
            setRouteNames([]);
            setTravelTimes([]);
            return;
          }
    
          const validJourneyRefs = new Map<string, string>();
          toData.Arrival.forEach((arrival) => {
            validJourneyRefs.set(arrival.JourneyDetailRef.ref, arrival.time);
          });
    
          let filteredDepartures: Departure[] = [];
    
          if (selectedOption === 'buss') {
            filteredDepartures = fromData.Departure.filter(
              (departure) =>
                validJourneyRefs.has(departure.JourneyDetailRef.ref) &&
                departure.ProductAtStop?.catOut === 'BLT'
            );
          } else if (selectedOption === 'tåg') {
            filteredDepartures = fromData.Departure.filter(
              (departure) =>
                validJourneyRefs.has(departure.JourneyDetailRef.ref) &&
                departure.ProductAtStop?.catOut === 'JLT'
            );
          }
    
          if (filteredDepartures.length === 0) {
            setRouteNames([]);
            setTravelTimes([]);
            return;
          }
    
          const limitedDepartures = filteredDepartures.slice(0, 8);
    
          const names = limitedDepartures.map((departure) => {
            const departureTime = departure.time;
            const arrivalTime =
              validJourneyRefs.get(departure.JourneyDetailRef.ref) || '';
            return `${
              departure.ProductAtStop?.name || 'N/A'
            } — ${formatTravelTime(departureTime)} - ${formatTravelTime(
              arrivalTime
            )}`;
          });
    
          const times = limitedDepartures.map((departure) => {
            const arrivalTime =
              validJourneyRefs.get(departure.JourneyDetailRef.ref) || '';
            return calculateTravelDuration(departure.time, arrivalTime);
          });
    
          setRouteNames(names);
          setTravelTimes(times);
        } catch (err) {
          setError((err as Error).message);
        }
      };
    
      fetchRoutes();
    }, [fromStopId, toStopId, isButtonClicked, selectedOption]);
    
    const handleRouteClick = (index: number) => {
      if (selectedRouteIndex === index) {
        setSelectedRouteIndex(null);
      } else {
        setSelectedRouteIndex(index);
        
        const selectedRoute = routeNames[index];
        const departureTime = selectedRoute.split(' — ')[1]?.split(' - ')[0] || '';
        const arrivalTime = selectedRoute.split(' — ')[1]?.split(' - ')[1] || '';
        
        fetchRouteStopsForRoute(
          index,
          fromStopId,
          toStopId,
          apiKey,
          selectedOption,
          setRouteStops,
          setError,
          departureTime,
          arrivalTime
        );
      }
    };

  const formatTravelTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateTravelDuration = (departureTime, arrivalTime) => {
    const today = new Date().toDateString();
    const departureDate = new Date(`${today} ${departureTime}`).getTime();
    const arrivalDate = new Date(`${today} ${arrivalTime}`).getTime();

    const duration = (arrivalDate - departureDate) / 60000;
    return duration <= 0 ? 'Arrived' : `${duration} min`;
  };

  return (
    isButtonClicked &&
    (selectedOption === 'buss' || selectedOption === 'tåg') && (
      <div
        className="grid gap-4 p-8 border border-lightlightBorder dark:border-[#444] bg-opacity-100 dark:bg-opacity-100  rounded-md backdrop-blur-md bg-lightDark/90 dark:bg-darkDark/90 text-darkDark dark:text-lightLight
      
      "
      >
        <h2 className="text-xl font-bold">Resealternativ</h2>

        <hr className="h-0.5 bg-blueLight" />

        {error && (
          <p className="bg-white dark:bg-[#1E1E1E] p-2 border border-lightlightBorder dark:border-[#444] rounded-md">
            ⚠️ {error}
          </p>
        )}

        {routeNames.length > 0 ? (
          <div className="grid gap-3">
            {routeNames.map((name, index) => (
              <div key={index} className="grid gap-2">
                <div
                  onClick={() => handleRouteClick(index)}
                  className="cursor-pointer grid grid-cols-[1fr_auto_auto] items-center p-3 bg-white dark:bg-[#1E1E1E] border border-lightlightBorder dark:border-[#444] rounded-md hover:bg-[#D3D3D3] dark:hover:bg-darkLight transition gap-2"
                >
                  <p className="font-medium truncate" title={name}>
                    {name}
                  </p>
                  <div className="bg-lightLight dark:bg-darkDark px-3 py-1 rounded-md text-right">
                    <p className="text-sm">
                      Restid:{' '}
                      <span className="font-bold">{travelTimes[index]}</span>
                    </p>
                  </div>
                  <span
                    className={`transition-transform ${
                      selectedRouteIndex === index ? 'rotate-180' : 'rotate-0'
                    }`}
                  >
                    ▼
                  </span>
                </div>

                {selectedRouteIndex === index && routeStops[index] && (
                  <div className="grid gap-2 p-2">
                    {routeStops[index].map((stop, sIndex) => (
                      <div key={sIndex} className="relative mb-6">
                        {sIndex < routeStops[index].length - 1 && (
                          <div className="absolute left-5 top-16 space-y-2">
                            <span className="block h-1 w-1 bg-gray-400 rounded-full mx-auto"></span>
                            <span className="block h-1 w-1 bg-gray-400 rounded-full mx-auto"></span>
                          </div>
                        )}

                        <div className="grid grid-cols-2 text-sm border rounded-lg p-4 transition border-lightlightBorder dark:border-[#444] bg-white bg-opacity-100 text-darkDark dark:bg-[#1E1E1E] dark:bg-opacity-100 dark:text-lightDark items-center">
                          <span className="flex items-center gap-2">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                sIndex === 0
                                  ? 'bg-blueLight'
                                  : sIndex === routeStops[index].length - 1
                                  ? 'bg-red-500'
                                  : 'bg-gray-600'
                              }`}
                            ></span>{' '}
                            {stop.name}
                          </span>
                          <span className="text-right">
                            {formatTravelTime(
                              stop.depTime || stop.arrTime || ''
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4">⏳ Laddar rutter...</p>
        )}
      </div>
    )
  );
};
