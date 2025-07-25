import axios from 'axios';
import { OpenF1Schedule, OpenF1Session } from '../types/openf1';

const OPENF1_BASE_URL = 'https://api.openf1.org/v1';

/**
 * Fetches the race schedule from OpenF1.
 * @param {Object} params - The parameters for the request.
 * @param {number} params.year - Optional year to filter schedule
 * @param {string} params.country_name - Optional country name to filter schedule
 * @param {string} params.session_type - Optional session type to filter schedule (e.g. "Practice", "Qualifying", "Race")
 * @param {string} params.session_name - Optional session name to filter schedule (e.g. "Practice 1", "Practice 2", "Practice 3", "Sprint Qualifying", "Sprint", "Qualifying", "Race")
 */
export async function fetchRaceSchedule({
  year,
  country_name,
  session_type,
  session_name,
}: {
  year?: number;
  country_name?: string;
  session_type?: string;
  session_name?: string;
}): Promise<OpenF1Schedule> {
  const params: Record<string, any> = {};
  if (year) params.year = year;
  if (country_name) params.country_name = country_name;
  if (session_type) params.session_type = session_type;
  if (session_name) params.session_name = session_name;

  const response = await axios.get(`${OPENF1_BASE_URL}/sessions`, { params });
  // The API returns an array of sessions, filter for race sessions if needed
  return {
    sessions: response.data as OpenF1Session[],
  };
}
