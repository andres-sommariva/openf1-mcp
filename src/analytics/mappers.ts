import * as math from "mathjs";
import {
  DriverSummary,
  LapAnalytics,
  SessionSummary,
  StintAnalytics,
} from "../types/analytics";
import {
  OpenF1Driver,
  OpenF1Lap,
  OpenF1Laps,
  OpenF1Session,
  OpenF1Stints,
} from "../types/openf1";

/**
 * Gets the best lap from the given laps.
 * @param validDaps The valid laps
 * @returns The best lap
 */
export function getBestLap(validDaps: OpenF1Lap[]): OpenF1Lap | null {
  const bestLap = validDaps.reduce((best: OpenF1Lap | null, lap: OpenF1Lap) => {
    if (!best) return lap;
    if (!lap.lap_duration || !best.lap_duration) return null;
    return lap.lap_duration < best.lap_duration ? lap : best;
  }, null);
  return bestLap;
}

/**
 * Maps OpenF1 lap data to analytics.
 * @param laps The OpenF1 lap data
 * @returns The analytics data
 */
export function mapToLapsAnalytics(laps: OpenF1Lap[]): LapAnalytics[] {
  const validLaps = getValidLaps(laps);
  const validLapsNumbers = validLaps.map((lap) => lap.lap_number);
  const lapOutlierThreshold = calculateOutliersThreshold(validLaps);

  return laps.map((lap) => ({
    lap_number: lap.lap_number,
    lap_duration: lap.lap_duration,
    date_start: lap.date_start,
    duration_sector_1: lap.duration_sector_1,
    duration_sector_2: lap.duration_sector_2,
    duration_sector_3: lap.duration_sector_3,
    is_valid: isValidLap(lap, validLapsNumbers),
    is_outlier: isOutlierLap(lap, lapOutlierThreshold),
    segments_sector_1: mapSegmentSectorsToKey(lap.segments_sector_1),
    segments_sector_2: mapSegmentSectorsToKey(lap.segments_sector_2),
    segments_sector_3: mapSegmentSectorsToKey(lap.segments_sector_3),
  }));
}

/**
 * Filters out invalid laps.
 * @param laps The OpenF1 lap data
 * @returns The valid laps
 */
function getValidLaps(laps: OpenF1Lap[]): OpenF1Lap[] {
  return laps.filter(
    (lap) =>
      lap.lap_duration !== null &&
      lap.is_pit_out_lap === false &&
      lap.duration_sector_1 !== null &&
      lap.duration_sector_2 !== null &&
      lap.duration_sector_3 !== null
  );
}

/**
 * Calculates the outlier threshold for the given valid laps.
 * @param validDaps The valid laps
 * @returns The outlier threshold
 */
function calculateOutliersThreshold(validDaps: OpenF1Lap[]): number {
  // Gat lap times
  const lapsDuration = validDaps.map((lap) => lap.lap_duration!);

  // Sort the array in ascending order
  const sortedArr = lapsDuration.sort((a, b) => a - b);

  const outlierPerMedian = math.median(sortedArr) * 1.05;
  //console.error("outlierPerMedian: ", outlierPerMedian);

  return outlierPerMedian;
}

/**
 * Checks if the given lap is valid.
 * @param lap The OpenF1 lap data
 * @param validLapsNumbers The valid laps numbers
 * @returns True if the lap is valid, false otherwise
 */
function isValidLap(lap: OpenF1Lap, validLapsNumbers: number[]): boolean {
  return validLapsNumbers.includes(lap.lap_number);
}

/**
 * Checks if the given lap is an outlier.
 * @param lap The OpenF1 lap data
 * @param lapOutlierThreshold The outlier threshold
 * @returns True if the lap is an outlier, false otherwise
 */
function isOutlierLap(lap: OpenF1Lap, lapOutlierThreshold: number): boolean {
  return lap.lap_duration !== null && lap.lap_duration > lapOutlierThreshold;
}

/**
 * Maps the segment sectors to a key.
 * @param segments The segment sectors
 * @returns The segment sectors key
 */
function mapSegmentSectorsToKey(segments: number[]): string[] {
  return segments.map((segment) => {
    let segmentKey = "U"; // Unknown
    if (segment == 2048) {
      segmentKey = "Y"; // Yellow
    } else if (segment == 2049) {
      segmentKey = "G"; // Green
    } else if (segment == 2051) {
      segmentKey = "P"; // Purple
    }
    return segmentKey;
  });
}

/**
 * Maps OpenF1 stint data to analytics.
 * @param stintsData The OpenF1 stint data
 * @param lapsData The OpenF1 lap data
 * @returns The stint analytics
 */
export function mapToStintsAnalytics(
  stintsData: OpenF1Stints,
  lapsData: OpenF1Laps
): StintAnalytics[] {
  const stintAnalyticsList: StintAnalytics[] = [];

  const stints = stintsData.stints;
  const validLaps = getValidLaps(lapsData.laps);

  for (const stint of stints) {
    // Get valid laps for this stint
    const validLapsPerStint = validLaps.filter(
      (lap) =>
        lap.lap_number >= stint.lap_start && lap.lap_number <= stint.lap_end
    );

    // Calculate best lap for this stint
    const bestLap = getBestLap(validLapsPerStint);

    // Calculate average lap duration for this stint
    const avgLapDuration = calculateAverageLapDuration(validLapsPerStint);

    // Calculate consistency for this stint
    const consistency = calculateConsistency(validLapsPerStint);

    // Calculate tyre lap degradation for this stint
    const tyreLapDegradation = calculateTyreLapDegradation(validLapsPerStint);

    // Calculate pit stops for this stint
    //const pitStops = calculatePitStops(...);

    // Build response
    const stintAnalytics: StintAnalytics = {
      stint_number: stint.stint_number,
      compound: stint.compound,
      tyre_age_at_start: stint.tyre_age_at_start,
      lap_start: stint.lap_start,
      lap_end: stint.lap_end,
      lap_count: stint.lap_end - stint.lap_start + 1,
      best_lap_duration: bestLap && bestLap.lap_duration,
      avg_lap_duration: avgLapDuration,
      tyre_lap_degradation: tyreLapDegradation,
      consistency: consistency,
    };
    stintAnalyticsList.push(stintAnalytics);
  }
  return stintAnalyticsList.sort((a, b) => a.stint_number - b.stint_number);
}

/**
 * Calculates the average lap duration from the given laps.
 * @param validDaps The valid laps
 * @returns The average lap duration
 */
function calculateAverageLapDuration(validDaps: OpenF1Lap[]): number {
  const averageLapDuration =
    validDaps.reduce(
      (sum: number, lap: OpenF1Lap) => sum + lap.lap_duration!,
      0
    ) / validDaps.length;
  return Number(averageLapDuration.toFixed(3));
}

/**
 * Calculates the laps consistency based on the Standard Deviation of lap times within the stint.
 * Lower is more consistent.
 * @param validDaps The valid laps
 * @returns The laps consistency
 */
function calculateConsistency(validDaps: OpenF1Lap[]): number | null {
  const validLapDurations = validDaps.map((lap) => lap.lap_duration!);

  if (!validLapDurations || validLapDurations.length < 2) return null;

  const mean =
    validLapDurations.reduce((acc, val) => acc + val, 0) /
    validLapDurations.length;

  const variance =
    validLapDurations.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
    validLapDurations.length;

  const consistency = Math.sqrt(variance);

  return Number(consistency.toFixed(3));
}

/**
 * Estimated change in lap time per lap (slope of linear regression)
 * across green-flag laps.
 * Positive means degradation.
 * @param validDaps The valid laps
 * @returns The tyre lap degradation
 */
function calculateTyreLapDegradation(validDaps: OpenF1Lap[]): number | null {
  // Need at least 2 points for linear regression
  if (validDaps.length < 2) {
    return null;
  }

  const n = validDaps.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  validDaps.forEach((lap) => {
    const x = lap.lap_number; // Use absolute lap number
    const y = lap.lap_duration!; // Lap time
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  });

  const denominator = n * sumX2 - sumX * sumX;

  // Avoid division by zero if all lap numbers are the same (highly unlikely but possible)
  if (denominator === 0) {
    return 0; // No change in lap number, slope is effectively zero
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;

  // Return the slope, which represents the change in lap time per lap
  return Number(slope.toFixed(3));
}

export function mapToSessionSummary(session: OpenF1Session): SessionSummary {
  return {
    year: session.year,
    meeting_key: session.meeting_key,
    session_key: session.session_key,
    session_name: session.session_name,
    session_type: session.session_type,
    country_name: session.country_name,
    location: session.location,
    circuit_short_name: session.circuit_short_name,
  };
}

export function mapToDriverSummary(driver: OpenF1Driver): DriverSummary {
  return {
    driver_number: driver.driver_number,
    broadcast_name: driver.broadcast_name,
    full_name: driver.full_name,
    first_name: driver.first_name,
    last_name: driver.last_name,
    name_acronym: driver.name_acronym,
    team_name: driver.team_name,
  };
}
