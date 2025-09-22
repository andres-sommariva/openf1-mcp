import {
  fetchDrivers,
  fetchLaps,
  fetchSessions,
  fetchStints,
} from "../clients/openf1";
import {
  DriverSessionAnalytics,
  LapAnalytics,
  SessionSummary,
  StintAnalytics,
} from "../types/analytics";
import { OpenF1Lap, OpenF1Laps, OpenF1Stints } from "../types/openf1";
import {
  getBestLap,
  mapToDriverSummary,
  mapToLapsAnalytics,
  mapToSessionSummary,
  mapToStintsAnalytics,
} from "./mappers";

/**
 * Calculate driver analytics from a session.
 * @param {Object} params - The parameters for the request.
 * @param {number} params.session_key - The session key to calculate analytics for
 * @param {number} params.driver_number - The driver number to calculate analytics for
 * @returns {Promise<DriverSessionAnalytics>} The driver analytics
 */
export async function fetchDriverSessionAnalytics({
  year,
  meeting_key,
  country_name,
  session_type,
  session_name,
  session_key,
  driver_number,
}: {
  year: number;
  meeting_key?: number;
  country_name?: string;
  session_type?: string;
  session_name?: string;
  session_key?: number;
  driver_number: number;
}): Promise<DriverSessionAnalytics> {
  const sessionsData = await fetchSessions({
    year,
    meeting_key,
    country_name,
    session_type,
    session_name,
  });
  const session = sessionsData.sessions.find(
    (s) => s.session_key === session_key || s.session_name === session_name
  );

  if (!session) {
    throw new Error(`Session ${session_key} not found`);
  }

  // just in case
  session_key = session.session_key;

  const driversData = await fetchDrivers({ session_key, driver_number });
  if (driversData.drivers.length === 0) {
    throw new Error(
      `Driver #${driver_number} did not participate on session ${session_key}`
    );
  }

  const sessionSummary = mapToSessionSummary(session);
  const driverSummary = mapToDriverSummary(driversData.drivers[0]);

  const lapsData = await fetchLaps({ session_key, driver_number });
  const bestLap = getBestLap(lapsData.laps);
  const lapsAnalytics = mapToLapsAnalytics(lapsData.laps);

  const stintsData = await fetchStints({ session_key, driver_number });
  const stintsAnalytics = mapToStintsAnalytics(stintsData, lapsData);

  const data: DriverSessionAnalytics = {
    session: sessionSummary,
    driver: driverSummary,
    laps: lapsAnalytics,
    best_lap:
      lapsAnalytics.find((lap) => lap.lap_number === bestLap?.lap_number) ||
      ({} as LapAnalytics),
    stints: stintsAnalytics,
    pit_stops: [],
  };

  return data;
}
