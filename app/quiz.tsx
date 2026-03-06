import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStore } from "../src/store";

export default function QuizScreen() {
  const router = useRouter();
  const {
    quizSession,
    startQuiz,
    extendQuiz,
    nextQuestion,
    answerQuestion,
    endQuiz,
    toggleSavedQuestion,
    savedQuestions,
  } = useStore();
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    // Only call startQuiz if we didn't arrive here with a pre-configured session (like from Past Exams)
    const currentSession = useStore.getState().quizSession;
    if (!currentSession || !currentSession.isActive) {
      startQuiz();
    }
  }, []);

  if (!quizSession || !quizSession.isActive) return null;

  const currentQuestion = quizSession.questions[quizSession.currentIndex];
  const isLastQuestion =
    quizSession.currentIndex === quizSession.questions.length - 1;
  const progress =
    ((quizSession.currentIndex + (showExplanation ? 1 : 0)) /
      quizSession.questions.length) *
    100;

  const hasAnswered = showExplanation;
  const selectedAnswer = quizSession.answers[quizSession.currentIndex];
  const isSaved = savedQuestions.includes(currentQuestion?.id);

  const handleOptionPress = (index: number) => {
    if (hasAnswered) return;
    answerQuestion(index);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      endQuiz();
      router.replace("/result");
    } else {
      setShowExplanation(false);
      nextQuestion();
    }
  };

  if (!currentQuestion) return null;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 ">
        {/* Progress Bar */}
        <Progress value={progress} indicatorClassName="bg-primary" />

        <ScrollView className="flex-1 p-5">
          {/* Header (Back, Question Counter & Save) */}
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 -ml-2"
            >
              <ArrowLeft color="#6B7280" size={28} />
            </TouchableOpacity>

            <Text className="text-text-muted font-medium text-xl">
              Soru {quizSession.currentIndex + 1} /{" "}
              {quizSession.questions.length}
            </Text>

            <TouchableOpacity
              onPress={() => toggleSavedQuestion(currentQuestion.id)}
              className="p-2 -mr-2"
            >
              {isSaved ? (
                <BookmarkCheck color="#3B82F6" size={28} />
              ) : (
                <Bookmark color="#6B7280" size={28} />
              )}
            </TouchableOpacity>
          </View>

          {/* Question Text */}
          <Text className="text-text text-xl font-medium leading-8 mb-8">
            {currentQuestion.text}
          </Text>

          {/* Options */}
          <View className="space-y-4 mb-5">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = currentQuestion.correctIndex === index;

              let bgClass = "bg-surface border-border";
              let textClass = "text-text";

              if (hasAnswered) {
                if (isCorrect) {
                  bgClass = "bg-border-success/20 border-border-success";
                  textClass = "text-border-success";
                } else if (isSelected && !isCorrect) {
                  bgClass = "bg-border-error/20 border-border-error";
                  textClass = "text-border-error";
                }
              } else if (isSelected) {
                // Should not happen as we show explanation immediately, but just in case
                bgClass = "bg-primary/10 border-primary";
              }

              return (
                <TouchableOpacity
                  key={index}
                  disabled={hasAnswered}
                  onPress={() => handleOptionPress(index)}
                  className={`p-4 rounded-xl border mb-3 ${bgClass}`}
                >
                  <Text className={`text-base ${textClass}`}>{option}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Explanation */}
          {showExplanation && (
            <Card className="mt-4 mb-20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Açıklama</CardTitle>
              </CardHeader>
              <CardContent>
                <Text className="text-text leading-6">
                  {currentQuestion.explanation}
                </Text>
              </CardContent>
            </Card>
          )}
        </ScrollView>

        {/* Next Button Footer */}
        {showExplanation && (
          <View className="p-5 bg-surface border-t border-border pb-8 flex-col gap-3">
            {isLastQuestion ? (
              <>
                <Button size="lg" onPress={handleNext}>
                  <Text className="text-white font-bold text-lg mr-2">
                    Sonucu Gör
                  </Text>
                  <ArrowRight color="white" size={20} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onPress={() => {
                    extendQuiz();
                    setShowExplanation(false);
                  }}
                >
                  <Text className="text-text font-bold text-lg">
                    Yeni Sorulara Geç
                  </Text>
                </Button>
              </>
            ) : (
              <Button size="lg" onPress={handleNext}>
                <Text className="text-white font-bold text-lg mr-2">
                  Sıradaki Soru
                </Text>
                <ArrowRight color="white" size={20} />
              </Button>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
