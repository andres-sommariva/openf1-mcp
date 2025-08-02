import axios from "axios";
import {
  OpenF1Lap,
  OpenF1Laps,
  OpenF1Meeting,
  OpenF1Meetings,
  OpenF1Session,
  OpenF1Sessions,
  OpenF1SessionResult,
  OpenF1SessionResults,
} from "../types/openf1";

const OPENF1_BASE_URL = "https://api.openf1.org/v1";

/**
 * Fetches meetings (Grand Prix or testing weekends) from OpenF1.
 * @param {Object} params - The parameters for the request.
 * @param {number} params.year - Optional year to filter meetings
 * @param {string} params.country_name - Optional country name to filter meetings
 * @param {string} params.circuit_short_name - Optional circuit short name to filter meetings (e.g. "Sakhir", "Melbourne", "Suzuka", "Imola", "Miami")
 */
export async function fetchMeetings({
  year,
  country_name,
  circuit_short_name,
}: {
  year?: number;
  country_name?: string;
  circuit_short_name?: string;
}): Promise<OpenF1Meetings> {
  const params: Record<string, any> = {};
  if (year) params.year = year;
  if (country_name) params.country_name = country_name;
  if (circuit_short_name) params.circuit_short_name = circuit_short_name;
  const response = await axios.get(`${OPENF1_BASE_URL}/meetings`, { params });
  // The API returns an array of meetings
  return {
    meetings: response.data as OpenF1Meeting[],
  };
}

/**
 * Fetches sessions (Practice, Qualifying, Race, etc.) from OpenF1.
 * @param {Object} params - The parameters for the request.
 * @param {number} params.year - Optional year to filter schedule
 * @param {number} params.meeting_key - Optional meeting key to filter sessions
 * @param {string} params.country_name - Optional country name to filter sessions
 * @param {string} params.session_type - Optional session type to filter sessions (e.g. "Practice", "Qualifying", "Race")
 * @param {string} params.session_name - Optional session name to filter sessions (e.g. "Practice 1", "Practice 2", "Practice 3", "Sprint Qualifying", "Sprint", "Qualifying", "Race")
 */
export async function fetchSessions({
  year,
  meeting_key,
  country_name,
  session_type,
  session_name,
}: {
  year?: number;
  meeting_key?: number;
  country_name?: string;
  session_type?: string;
  session_name?: string;
}): Promise<OpenF1Sessions> {
  const params: Record<string, any> = {};
  if (year) params.year = year;
  if (meeting_key) params.meeting_key = meeting_key;
  if (country_name) params.country_name = country_name;
  if (session_type) params.session_type = session_type;
  if (session_name) params.session_name = session_name;

  const response = await axios.get(`${OPENF1_BASE_URL}/sessions`, { params });
  // The API returns an array of sessions
  return {
    sessions: response.data as OpenF1Session[],
  };
}

/**
 * Fetches the session results from OpenF1.
 * @param {Object} params - The parameters for the request.
 * @param {number} params.session_key - The session key to fetch results for
 * @param {number} params.driver_number - Optional driver number to filter results
 */
export async function fetchSessionResults({
  session_key,
  driver_number,
}: {
  session_key: number;
  driver_number?: number;
}): Promise<OpenF1SessionResults> {
  const params: Record<string, any> = { session_key };
  if (driver_number) params.driver_number = driver_number;

  const response = await axios.get(`${OPENF1_BASE_URL}/session_result`, { params });
  // The API returns an array of session results
  return {
    results: response.data as OpenF1SessionResult[],
  };
}

/**
 * Fetches lap data from OpenF1.
 * @param {Object} params - The parameters for the request.
 * @param {number} params.session_key - The session key to fetch laps for (required)
 * @param {number} [params.driver_number] - Optional driver number to filter laps
 * @param {number} [params.lap_number] - Optional lap number to filter specific lap
 * @returns {Promise<OpenF1Laps>} The lap data
 */
export async function fetchLaps({
  session_key,
  driver_number,
  lap_number,
}: {
  session_key: number;
  driver_number?: number;
  lap_number?: number;
}): Promise<OpenF1Laps> {
  const params: Record<string, any> = { session_key };
  if (driver_number) params.driver_number = driver_number;
  if (lap_number) params.lap_number = lap_number;

  const response = await axios.get(`${OPENF1_BASE_URL}/laps`, { params });
  // The API returns an array of laps
  return {
    laps: response.data as OpenF1Lap[],
  };
}
