import axios from 'axios';
import { OpenF1Schedule, OpenF1Session } from '../types/openf1';

const OPENF1_BASE_URL = 'https://api.openf1.org/v1';

/**
 * Fetches the race schedule from OpenF1.
 * @param year Optional year to filter schedule
 */
export async function fetchRaceSchedule(year?: number): Promise<OpenF1Schedule> {
  const params: Record<string, any> = {};
  if (year) params.year = year;

  const response = await axios.get(`${OPENF1_BASE_URL}/sessions`, { params });
  // The API returns an array of sessions, filter for race sessions if needed
  return {
    sessions: response.data as OpenF1Session[],
  };
}
