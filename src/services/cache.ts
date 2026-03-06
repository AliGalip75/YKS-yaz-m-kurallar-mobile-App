import AsyncStorage from "@react-native-async-storage/async-storage";

const SAVED_QUESTIONS_KEY = "saved_questions";
const STATS_KEY = "quiz_stats";
const COMPLETED_EXAMS_KEY = "completed_exams";

export const CacheService = {
  async getSavedQuestions() {
    try {
      const saved = await AsyncStorage.getItem(SAVED_QUESTIONS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  },

  async setSavedQuestions(saved: string[]) {
    try {
      await AsyncStorage.setItem(SAVED_QUESTIONS_KEY, JSON.stringify(saved));
    } catch (e) {
      console.error("Error saving questions:", e);
    }
  },

  async getStats() {
    try {
      const stats = await AsyncStorage.getItem(STATS_KEY);
      return stats ? JSON.parse(stats) : { totalCorrect: 0, totalIncorrect: 0 };
    } catch (e) {
      return { totalCorrect: 0, totalIncorrect: 0 };
    }
  },

  async saveStats(stats: { totalCorrect: number; totalIncorrect: number }) {
    try {
      await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error("Error saving stats:", e);
    }
  },

  async getCompletedExams(): Promise<string[]> {
    try {
      const exams = await AsyncStorage.getItem(COMPLETED_EXAMS_KEY);
      return exams ? JSON.parse(exams) : [];
    } catch {
      return [];
    }
  },

  async saveCompletedExams(exams: string[]) {
    try {
      await AsyncStorage.setItem(COMPLETED_EXAMS_KEY, JSON.stringify(exams));
    } catch (e) {
      console.error("Error saving completed exams:", e);
    }
  },
};
