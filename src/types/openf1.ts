// TypeScript types/interfaces for OpenF1 data

export interface OpenF1Meeting {
  circuit_key: number;
  circuit_short_name: string;
  country_code: string;
  country_key: number;
  country_name: string;
  date_start: string;
  gmt_offset: string;
  location: string;
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  year: number;
}

export type OpenF1Meetings = {
  meetings: OpenF1Meeting[];
};

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

export type OpenF1Sessions = {
  sessions: OpenF1Session[];
};

export interface OpenF1SessionResult {
  dnf: boolean;
  dns: boolean;
  dsq: boolean;
  driver_number: number;
  duration: number | number[] | null;
  gap_to_leader: number | number[] | string | null;
  number_of_laps: number | null;
  meeting_key: number;
  position: number | null;
  points?: number;
  session_key: number;
}

export type OpenF1SessionResults = {
  results: OpenF1SessionResult[];
};

export interface OpenF1Lap {
  meeting_key: number;
  session_key: number;
  driver_number: number;
  i1_speed: number | null;
  i2_speed: number | null;
  st_speed: number | null;
  date_start: string | null;
  lap_number: number;
  lap_duration: number | null;
  is_pit_out_lap: boolean;
  duration_sector_1: number | null;
  duration_sector_2: number | null;
  duration_sector_3: number | null;
  segments_sector_1: number[];
  segments_sector_2: number[];
  segments_sector_3: number[];
}

export type OpenF1Laps = {
  laps: OpenF1Lap[];
};
