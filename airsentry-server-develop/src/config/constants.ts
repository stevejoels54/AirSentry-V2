const constants = Object.freeze({
  socketEvents: {
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    READINGS: "readings",
    ERROR: "error",
    NEW_READING: "new_reading",
  },
  sensorGroupings: {
    AIR: "air",
    WATER: "water",
    SOIL: "soil",
    ATMOSPHERE: "atmosphere",
  },
  deviceStatus: {
    ACTIVE: "active",
    INACTIVE: "inactive",
  },
  trendPeriods: {
    DAY: "day",
    WEEK: "week",
    MONTH: "month",
  },
  chatGptModels: {
    gpt35turbo: "gpt-3.5-turbo",
    "text-davinci-003": "text-davinci-003",
  },
  chatGPTRoles: {
    user: "user",
  },
  dayPeriodGrouping: {
    earlyMorning: {
      start: "00:00",
      end: "05:59",
      period: "Early Morning",
    },
    morning: {
      start: "06:00",
      end: "11:59",
      period: "Morning",
    },
    afternoon: {
      start: "12:00",
      end: "17:59",
      period: "Afternoon",
    },
    evening: {
      start: "18:00",
      end: "20:59",
      period: "Evening",
    },
    night: {
      start: "21:00",
      end: "23:59",
      period: "Night",
    },
  },
  chatInsightQuestions: {
    generalInsights: (
      sensorsWithValues: string,
      sensors: string,
      location: string,
      period: string
    ): string => {
      return `What can you tell me about the weather and considerations for an average ${sensorsWithValues} in ${location}, specifically ${period}? I'm interested in general 4 word description, health tips, understanding the comfort level, typical climate for ${location}, seasonal factors, time of day variations, outdoor activities, and dressing suggestions base on ${sensors}. Return a response like this: Create a list of insights as those in the question that I am interested in.  Provide a JSON response  following this format without deviation. [{ "insight_title": "insight title","insight": "insight text",}] `;
    },
  },
});

export default constants;
