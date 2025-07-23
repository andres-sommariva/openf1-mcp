import { defineTool } from '@modelcontextprotocol/sdk';
import { fetchRaceSchedule } from '../clients/openf1';
import { OpenF1Schedule } from '../types/openf1';

export const getRaceSchedule = defineTool({
  name: 'getRaceSchedule',
  description: 'Retrieve the F1 race schedule (sessions) for a given year, or all available years if not specified.',
  inputSchema: {
    type: 'object',
    properties: {
      year: {
        type: 'number',
        description: 'Year of the F1 season (optional)'
      }
    },
    required: [],
    additionalProperties: false
  },
  outputSchema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        session_key: { type: 'number' },
        session_name: { type: 'string' },
        session_type: { type: 'string' },
        session_start_utc: { type: 'string' },
        session_end_utc: { type: 'string' },
        circuit_key: { type: 'number' },
        meeting_key: { type: 'number' },
        year: { type: 'number' },
        location: { type: 'string' },
        country_key: { type: 'number' },
        country_code: { type: 'string' },
        gmt_offset: { type: 'number' }
      },
      required: [
        'session_key','session_name','session_type','session_start_utc','session_end_utc','circuit_key','meeting_key','year','location','country_key','country_code','gmt_offset'
      ],
      additionalProperties: false
    }
  },
  execute: async (input: { year?: number }): Promise<OpenF1Schedule> => {
    return await fetchRaceSchedule(input.year);
  }
});
