import { create } from "zustand";
import DailyContentSource from "../data/dailyContent.json";
import PastExamsSource from "../data/pastExams.json";
import QuestionsSource from "../data/questions.json";
import { CacheService } from "../services/cache";

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  source?: string;
}

export interface QuizSession {
  questions: Question[];
  currentIndex: number;
  answers: number[];
  score: number;
  isActive: boolean;
  examId?: string;
}

export interface DailyRule {
  date: string;
  title: string;
  content: string;
}

// Type assertion for our JSON structure
type DailyContentMap = {
  [dateKey: string]: {
    title: string;
    content: string;
  };
};

interface AppState {
  questions: Question[];
  savedQuestions: string[];
  completedExams: string[];
  quizSession: QuizSession | null;
  dailyRule: DailyRule | null;
  isLoading: boolean;

  // Actions
  initializeApp: () => Promise<void>;
  startQuiz: (customQuestions?: Question[], examId?: string) => void;
  answerQuestion: (optionIndex: number) => void;
  nextQuestion: () => void;
  endQuiz: () => void;
  extendQuiz: () => void;
  toggleSavedQuestion: (questionId: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial values (State when the app first opens)
  questions: [], // All questions
  savedQuestions: [], // Questions saved (favorited) by the user
  completedExams: [], // Previous year exams successfully completed by the user
  quizSession: null, // Information about the currently active test (current question, score, etc.)
  dailyRule: {
    // Default starting value for the daily rule (shown until the app fully loads)
    date: new Date().toISOString().split("T")[0],
    title: "Günün Kuralı",
    content:
      "Kurum, kuruluş, kurul, merkez, bakanlık, üniversite, fakülte, bölüm, kanun, tüzük, yönetmelik ve makam adlarına getirilen ekler kesme işaretiyle ayrılmaz.",
  },
  isLoading: true, // The loading state of the app's data

  // Data loading function to be executed when the app first opens
  initializeApp: async () => {
    set({ isLoading: true });
    try {
      // 1. Get user's saved questions from local storage (Async Storage)
      const saved = await CacheService.getSavedQuestions();

      // 2. Determine today's date for the daily content
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      // Calculate a pseudo-random index based on the date so it changes daily but stays the same all day
      const dayOfYear = Math.floor(
        (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
          1000 /
          60 /
          60 /
          24,
      );

      const contentArray = DailyContentSource as Array<{
        title: string;
        content: string;
      }>;
      const ruleIndex = dayOfYear % contentArray.length;
      const dailyContentData = contentArray[ruleIndex];

      const selectedDailyRule = dailyContentData
        ? {
            date: todayStr,
            title: dailyContentData.title,
            content: dailyContentData.content,
          }
        : get().dailyRule; // fallback to default if not found

      // 3. Get completed exams
      const completedExams = await CacheService.getCompletedExams();

      // 4. Set everything instantly
      set(() => ({
        questions: QuestionsSource as Question[],
        savedQuestions: saved || [],
        completedExams: completedExams || [],
        dailyRule: selectedDailyRule,
        isLoading: false,
      }));
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },

  // Function used to start a new test/quiz
  startQuiz: (customQuestions?: Question[], examId?: string) => {
    const { questions } = get();
    // If specific exam questions are provided (e.g., a past exam), use them.
    // Otherwise, pick the first 10 questions from the general list (like the 'Solve Now' button on the homepage).
    const sessionItems = customQuestions || questions.slice(0, 10);

    // Set up the new values for the quiz session (set score to 0, start from the first question)
    set({
      quizSession: {
        questions: sessionItems, // Questions to be asked in the test
        currentIndex: 0, // Which question we are currently on
        answers: [], // List of given answers
        score: 0, // Total number of correct answers
        isActive: true, // Is the quiz active?
        examId, // The ID of the exam, if any
      },
    });
  },

  // Function triggered when the user clicks on one of the options
  answerQuestion: (optionIndex: number) => {
    const { quizSession } = get();
    if (!quizSession) return;

    // Identify the question currently visible on the screen
    const currentQuestion = quizSession.questions[quizSession.currentIndex];
    // Check if the selected option's index matches the correct answer's index
    const isCorrect = currentQuestion.correctIndex === optionIndex;

    // Update the quiz values
    set({
      quizSession: {
        ...quizSession, // Keep the old values as they are
        answers: [...quizSession.answers, optionIndex], // Add the newly given answer to the list
        // If they answered correctly, increase the score by 1; if wrong, keep the old score
        score: isCorrect ? quizSession.score + 1 : quizSession.score,
      },
    });
  },

  // Function triggered when the 'Next Question' button is pressed
  nextQuestion: () => {
    const { quizSession } = get();
    if (!quizSession) return;

    // Move the question order in the array forward (+1)
    set({
      quizSession: {
        ...quizSession,
        currentIndex: quizSession.currentIndex + 1,
      },
    });
  },

  // Function triggered when the test is completely finished (transitioning to the results screen)
  endQuiz: async () => {
    const { quizSession, completedExams } = get();
    if (!quizSession) return;

    // Update the general statistics (data in the profile) in the phone's storage
    const stats = await CacheService.getStats();
    stats.totalCorrect += quizSession.score; // Add correct answers
    stats.totalIncorrect += quizSession.questions.length - quizSession.score; // Add wrong/blank answers
    await CacheService.saveStats(stats);

    // If this is a 'Past Exam' test and they answered all correctly, mark this exam as completed
    let newCompletedExams = completedExams;
    if (
      quizSession.examId &&
      quizSession.score === quizSession.questions.length &&
      !completedExams.includes(quizSession.examId)
    ) {
      newCompletedExams = [...completedExams, quizSession.examId];
      await CacheService.saveCompletedExams(newCompletedExams); // Save to phone
    }

    // Finish the quiz by setting it to inactive in the state
    set({
      completedExams: newCompletedExams,
      quizSession: {
        ...quizSession,
        isActive: false, // The quiz is over, so it's no longer active
      },
    });
  },

  // Function to extend the current quiz session with new random questions
  extendQuiz: () => {
    const { quizSession } = get();
    if (!quizSession) return;

    // Collect all questions from all past exams
    const allPastQuestions = PastExamsSource.reduce((acc, exam) => {
      return [...acc, ...(exam.questions as Question[])];
    }, [] as Question[]);

    // Filter out questions we've already seen in this session
    const existingIds = new Set(quizSession.questions.map((q) => q.id));
    const availableQuestions = allPastQuestions.filter(
      (q) => !existingIds.has(q.id),
    );

    // Shuffle and pick up to 10 questions
    const shuffled = [...availableQuestions]
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);

    if (shuffled.length === 0) return; // No more questions available

    set({
      quizSession: {
        ...quizSession,
        questions: [...quizSession.questions, ...shuffled],
        currentIndex: quizSession.currentIndex + 1, // Move to the first new question
      },
    });
  },

  // Function used to add a question to favorites / remove it from favorites (Heart icon button)
  toggleSavedQuestion: async (questionId: string) => {
    const { savedQuestions } = get();
    // Check if the question is already in favorites
    const isSaved = savedQuestions.includes(questionId);
    let newSaved;

    // If it exists, remove it from the list (delete); if not, add it to the list
    if (isSaved) {
      newSaved = savedQuestions.filter((id) => id !== questionId);
    } else {
      newSaved = [...savedQuestions, questionId];
    }

    // Sync the list to the phone first, then to the current store data
    await CacheService.setSavedQuestions(newSaved);
    set({ savedQuestions: newSaved });
  },
}));
