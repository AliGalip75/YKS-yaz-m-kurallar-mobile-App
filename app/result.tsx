import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { Bookmark, ClipboardPen, RotateCcw } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStore } from "../src/store";

export default function ResultScreen() {
  const router = useRouter();
  const { quizSession } = useStore();

  if (!quizSession) return null;

  const totalQuestions = quizSession.questions.length;
  const correctCount = quizSession.score;
  const incorrectCount = totalQuestions - correctCount;
  const percentage = Math.round((correctCount / totalQuestions) * 100) || 0;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 bg-background justify-center items-center p-6">
        <Card className="w-full p-8 rounded-3xl bg-surface items-center shadow-lg mb-8">
          <View className="p-4 mb-4">
            <ClipboardPen color={Colors.dark.text} size={48} />
          </View>
          <Text className="text-3xl font-bold text-text">Test Tamamlandı!</Text>
          <Text className="text-text-muted text-lg mb-6">İşte Sonucun</Text>

          <View className="flex-row justify-between w-full">
            <View className="items-center bg-border-success/10 p-4 rounded-2xl flex-1 mr-2 border-2 border-border-success/20">
              <Text className="text-3xl font-bold text-border-success mb-1">
                {correctCount}
              </Text>
              <Text className="text-border-success font-medium">Doğru</Text>
            </View>
            <View className="items-center bg-border-error/10 p-4 rounded-2xl flex-1 ml-2 border-2 border-border-error/20">
              <Text className="text-3xl font-bold text-border-error mb-1">
                {incorrectCount}
              </Text>
              <Text className="text-border-error font-medium">Yanlış</Text>
            </View>
          </View>

          <View className="items-center border-2 border-border-gold/20 bg-border-gold/10 w-full p-4 rounded-2xl">
            <Text className="text-4xl font-black text-border-gold mb-1">
              %{percentage}
            </Text>
            <Text className="text-border-gold font-medium">Başarı Oranı</Text>
          </View>
        </Card>

        <Button
          variant="outline"
          size="lg"
          onPress={() => router.replace("/(tabs)/exams")}
          className="w-full mb-4"
        >
          <RotateCcw color={Colors.dark.icon} size={24} className="mr-3" />
          <Text className="text-text font-bold text-lg">
            Çıkmış Sorulara Dön
          </Text>
        </Button>

        <Button
          size="lg"
          onPress={() => router.replace("/saved")}
          className="w-full"
        >
          <Bookmark color="white" size={25} className="mr-3" />
          <Text className="text-white font-bold text-lg">
            Kaydedilenlere Git
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
