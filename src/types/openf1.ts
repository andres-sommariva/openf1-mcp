// TypeScript types/interfaces for OpenF1 data

export interface OpenF1Session {
  year: number;
  meeting_key: number;
  session_key: number;
  session_type: string;
  session_name: string;
  country_key: number;
  country_code: string;
  country_name: string;
  location: string;
  circuit_key: number;
  circuit_short_name: string;
  date_start: string;
  date_end: string;
  gmt_offset: string;
}

export type OpenF1Schedule = {
  sessions: OpenF1Session[];
};
