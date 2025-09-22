import {
  OpenF1Driver,
  OpenF1Meeting,
  OpenF1Session,
  OpenF1Lap,
} from "./openf1";

export type SessionSummary = Pick<
  OpenF1Session,
  | "year"
  | "meeting_key"
  | "session_key"
  | "session_type"
  | "session_name"
  | "country_name"
  | "location"
  | "circuit_short_name"
>;

export type DriverSummary = Pick<
  OpenF1Driver, 
  | "driver_number" 
  | "broadcast_name"
  | "full_name"
  | "name_acronym"
  | "team_name"
  | "first_name"
  | "last_name"
  >;

export interface DriverMeetingAnalytics {
  meeting: OpenF1Meeting;
  driver: OpenF1Driver;
  sessions: DriverSessionAnalytics[];
}

export interface DriverSessionAnalytics {
  session: SessionSummary;
  driver: DriverSummary;
  laps: LapAnalytics[];
  best_lap: LapAnalytics;
  stints: StintAnalytics[];
  pit_stops: PitStopAnalytics[];
}

export interface StintAnalytics {
  stint_number: number;
  compound: string;
  tyre_age_at_start: number;
  lap_start: number;
  lap_end: number;
  lap_count: number;
  best_lap_duration: number | null;
  avg_lap_duration: number | null;
  tyre_lap_degradation: number | null;
  consistency: number | null;
}

export interface PitStopAnalytics {
  duration: number;
}

export type LapAnalytics = Pick<
OpenF1Lap, 
| "lap_number" 
| "lap_duration"
| "date_start"
| "duration_sector_1"
| "duration_sector_2"
| "duration_sector_3"
> & {
  is_valid: boolean;
  is_outlier: boolean;
  segments_sector_1: string[];
  segments_sector_2: string[];
  segments_sector_3: string[];
};
