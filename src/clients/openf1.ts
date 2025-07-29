import axios from 'axios';
import { OpenF1Meeting, OpenF1Meetings, OpenF1Schedule, OpenF1Session, OpenF1SessionResult, OpenF1SessionResults } from '../types/openf1';

const OPENF1_BASE_URL = 'https://api.openf1.org/v1';

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
 * Fetches the race schedule from OpenF1.
 * @param {Object} params - The parameters for the request.
 * @param {number} params.year - Optional year to filter schedule
 * @param {number} params.meeting_key - Optional meeting key to filter schedule
 * @param {string} params.country_name - Optional country name to filter schedule
 * @param {string} params.session_type - Optional session type to filter schedule (e.g. "Practice", "Qualifying", "Race")
 * @param {string} params.session_name - Optional session name to filter schedule (e.g. "Practice 1", "Practice 2", "Practice 3", "Sprint Qualifying", "Sprint", "Qualifying", "Race")
 */
export async function fetchRaceSchedule({
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
}): Promise<OpenF1Schedule> {
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
 * Fetches the race results from OpenF1.
 * @param {Object} params - The parameters for the request.
 * @param {number} params.session_key - The session key to fetch results for
 * @param {number} params.driver_number - Optional driver number to filter results
 */
export async function fetchRaceResults({
  session_key,
  driver_number,
}: {
  session_key: number;
  driver_number?: number;
}): Promise<OpenF1SessionResults> {
  const params: Record<string, any> = {};
  if (session_key) params.session_key = session_key;
  if (driver_number) params.driver_number = driver_number;

  const response = await axios.get(`${OPENF1_BASE_URL}/session_result`, { params });
  // The API returns an array of session results
  return {
    results: response.data as OpenF1SessionResult[],
  };
}
