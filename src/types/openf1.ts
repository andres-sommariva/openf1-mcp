// TypeScript types/interfaces for OpenF1 data

export interface OpenF1Session {
  session_key: number;
  session_name: string;
  session_type: string;
  session_start_utc: string;
  session_end_utc: string;
  circuit_key: number;
  meeting_key: number;
  year: number;
  location: string;
  country_key: number;
  country_code: string;
  gmt_offset: number;
}

export type OpenF1Schedule = OpenF1Session[];
