import { useEffect, useState } from 'react';
import { useBusStopStore } from '../../store/useBusStopStore';
import { useSearchBtnStore } from '../../store/useSearchBtnStore';
import { FaBus } from 'react-icons/fa';

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
  const { fromStopId, toStopId } = useBusStopStore();
  const { isButtonClicked } = useSearchBtnStore();
  const [routeNames, setRouteNames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [travelTimes, setTravelTimes] = useState<string[]>([]);

  useEffect(() => {
    if (!isButtonClicked || !fromStopId || !toStopId) return;

    const fetchRoutes = async () => {
      try {
        const fromResponse = await fetch(
          `https://api.resrobot.se/v2.1/departureBoard?id=${fromStopId}&format=json&accessId=${apiKey}`
        );
        if (!fromResponse.ok) throw new Error(`Error: ${fromResponse.status}`);

        const fromData: ResponseData<Departure> = await fromResponse.json();
        if (!fromData.Departure) {
          setRouteNames([]);
          setTravelTimes([]);
          return;
        }

        const toResponse = await fetch(
          `https://api.resrobot.se/v2.1/arrivalBoard?id=${toStopId}&format=json&accessId=${apiKey}`
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

        const filteredDepartures = fromData.Departure.filter(
          (departure) =>
            validJourneyRefs.has(departure.JourneyDetailRef.ref) &&
            departure.ProductAtStop?.catOut === 'BLT'
        );

        if (filteredDepartures.length === 0) {
          setRouteNames([]);
          setTravelTimes([]);
          return;
        }

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
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchRoutes();
  }, [fromStopId, toStopId, isButtonClicked]);

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
    <div className="grid gap-4 p-4 border bg-gray-100 text-gray-800 rounded-lg">
      <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
        Ruttalternativ
      </h2>
      {error && (
        <p className="text-sm text-red-700 bg-red-200 p-2 rounded-md">
          ⚠️ {error}
        </p>
      )}
      {routeNames.length > 0 ? (
        <div className="grid gap-3">
          {routeNames.map((name, index) => (
            <div
              key={index}
              className="grid grid-cols-[auto_1fr_auto] gap-2 items-center p-3 bg-gray-50 border border-gray-300 rounded-md"
            >
              <div className="flex items-center justify-center p-1 bg-slate-500 text-white px-3 py-1 rounded-md text-sm ">
                <FaBus className="text-white bg-slate-500" />
              </div>
              <p className="font-medium text-gray-800 truncate" title={name}>
                {name}
              </p>
              <div className="bg-gray-200 px-3 py-1 rounded-md text-right">
                <p className="text-sm text-gray-700">
                  Restid:{' '}
                  <span className="font-bold">{travelTimes[index]}</span>
                </p>
              </div>
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
