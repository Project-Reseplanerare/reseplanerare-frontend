import { useEffect, useState } from 'react';
import { useRouteStopStore } from '../../store/useRouteStopStore';
import { useSearchBtnStore } from '../../store/useSearchBtnStore';
import { fetchRouteStopsForRoute } from '../../utils/api/fetchRouteStopsForRoute';
import { useTravelOptionsStore } from '../../store/useTravelOptionsStore';

const apiKey = import.meta.env.VITE_TRAFIKLAB_KEY;

type Departure = {
  JourneyDetailRef: { ref: string };
  ProductAtStop?: { catOut: string; name: string };
  time: string;
};

type Arrival = {
  JourneyDetailRef: { ref: string };
  time: string;
};

type ResponseData<T> = {
  Departure?: T[];
  Arrival?: T[];
};

const RouteOptionsDropdown = () => {
  const { fromStopId, toStopId } = useRouteStopStore();
  const { isButtonClicked } = useSearchBtnStore();
  const [routeNames, setRouteNames] = useState<string[]>([]);
  const [travelTimes, setTravelTimes] = useState<string[]>([]);
  const [routeStops, setRouteStops] = useState<Record<number, any[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);
  const { selectedOption } = useTravelOptionsStore();

  useEffect(() => {
    if (!isButtonClicked || !fromStopId || !toStopId) return;

    const fetchRoutes = async () => {
      try {
        // Fetch departures for the 'from' stop
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

        // Fetch arrivals for the 'to' stop
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

        if (selectedOption === 'Buss') {
          filteredDepartures = fromData.Departure.filter(
            (departure) =>
              validJourneyRefs.has(departure.JourneyDetailRef.ref) &&
              departure.ProductAtStop?.catOut === 'BLT'
          );
        } else if (selectedOption === 'Tåg') {
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

        // Format route names and travel times
        const names = filteredDepartures.map((departure) => {
          const departureTime = departure.time;
          const arrivalTime =
            validJourneyRefs.get(departure.JourneyDetailRef.ref) || '';
          return `${
            departure.ProductAtStop?.name || 'N/A'
          } — ${formatTravelTime(departureTime)} - ${formatTravelTime(
            arrivalTime
          )}`;
        });

        const times = filteredDepartures.map((departure) => {
          const arrivalTime =
            validJourneyRefs.get(departure.JourneyDetailRef.ref) || '';
          return calculateTravelDuration(departure.time, arrivalTime);
        });

        setRouteNames(names);
        setTravelTimes(times);

        // Fetch stops for all routes and store them
        filteredDepartures.forEach((departure, index) => {
          fetchRouteStopsForRoute(
            index,
            fromStopId,
            toStopId,
            apiKey,
            selectedOption, 
            setRouteStops,
            setError
          );
        });
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
    }
  };

  const formatTravelTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateTravelDuration = (
    departureTime: string,
    arrivalTime: string
  ) => {
    const departureDate = new Date(
      `${new Date().toDateString()} ${departureTime}`
    );
    const arrivalDate = new Date(`${new Date().toDateString()} ${arrivalTime}`);
    const duration =
      (arrivalDate.getTime() - departureDate.getTime()) / (1000 * 60);
    if (duration <= 0) return 'Arrived';
    return `${duration} min`;
  };

  return (
    <div className="grid gap-4 p-4 border border-darkLight dark:border-lightDark bg-lightDark dark:bg-darkLight text-darkDark dark:text-lightLight rounded-lg">
      <h2 className="text-xl font-bold text-darkDark dark:text-lightLight border-b border-darkLight dark:border-lightDark pb-2">
        Ruttalternativ
      </h2>

      {error && (
        <p className="text-sm text-darkDark dark:text-lightLight bg-lightDark dark:bg-darkLight p-2 border border-darkLight dark:border-lightDark rounded-md">
          ⚠️ {error}
        </p>
      )}

      {routeNames.length > 0 ? (
        <div className="grid gap-3">
          {routeNames.map((name, index) => (
            <div key={index} className="grid gap-2">
              <div
                onClick={() => handleRouteClick(index)}
                className="cursor-pointer grid grid-cols-[1fr_auto_auto] items-center p-3 bg-lightLight dark:bg-darkDark border border-darkLight dark:border-lightDark rounded-md hover:bg-lightDark dark:hover:bg-darkLight transition"
              >
                <p
                  className="font-medium text-darkDark dark:text-lightLight truncate"
                  title={name}
                >
                  {name}
                </p>
                <div className="bg-lightDark dark:bg-darkLight px-3 py-1 rounded-md text-right">
                  <p className="text-sm text-darkDark dark:text-lightLight">
                    Restid:{' '}
                    <span className="font-bold">{travelTimes[index]}</span>
                  </p>
                </div>
                <span
                  className={`text-darkDark dark:text-lightLight transition-transform ${
                    selectedRouteIndex === index ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  ▼
                </span>
              </div>

              {selectedRouteIndex === index && routeStops[index] && (
                <div className="mt-2 p-2 border border-darkLight dark:border-lightDark  rounded bg-lightLight dark:bg-darkDark space-y-1">
                  {routeStops[index].map((stop, sIndex) => (
                    <div
                      key={sIndex}
                      className="flex justify-between text-sm text-darkDark dark:text-lightLight"
                    >
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
        <p className="text-darkDark dark:text-lightLight text-center py-4">
          ⏳ Laddar rutter...
        </p>
      )}
    </div>
  );
};

export default RouteOptionsDropdown;
