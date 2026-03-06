import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { Check, Search } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { FlatList, TextInput, TouchableOpacity, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/theme";
import PastExamsSource from "../../src/data/pastExams.json";
import { Question, useStore } from "../../src/store";

const normalizeString = (str: string) => {
  return str
    .replace(/İ/g, "I")
    .replace(/ı/g, "i")
    .replace(/Ö/g, "O")
    .replace(/ö/g, "o")
    .replace(/Ü/g, "U")
    .replace(/ü/g, "u")
    .replace(/Ş/g, "S")
    .replace(/ş/g, "s")
    .replace(/Ğ/g, "G")
    .replace(/ğ/g, "g")
    .replace(/Ç/g, "C")
    .replace(/ç/g, "c")
    .toLowerCase();
};

const adUnitId = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-1203756903499434/7836421398";

export default function ExamsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const completedExams = useStore((state) => state.completedExams);

  const filteredExams = useMemo(() => {
    if (!searchQuery) return PastExamsSource;
    const normalizedQuery = normalizeString(searchQuery);
    return PastExamsSource.filter(
      (exam) =>
        normalizeString(exam.name).includes(normalizedQuery) ||
        exam.year.toString().includes(searchQuery),
    );
  }, [searchQuery]);

  const handleStartExam = (exam: (typeof PastExamsSource)[0]) => {
    // Start quiz with these specific questions
    const { startQuiz } = useStore.getState();
    // We pass the questions structure, maybe extending the store to accept specific questions
    startQuiz(exam.questions as Question[], exam.id);
    router.push("/quiz");
  };

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-background"
    >
      <View className="flex-1 bg-background pt-4 px-4">
        <View className="bg-surface flex-row items-center px-4 py-2 rounded-xl border border-border mb-4">
          <Search color="#9CA3AF" size={20} className="mr-2" />
          <TextInput
            className="text-text flex-1 py-2 font-medium"
            placeholder="Soru Ara..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <FlatList
          data={filteredExams}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="items-center mb-4">
              <BannerAd
                unitId={adUnitId}
                size={BannerAdSize.BANNER}
                requestOptions={{
                  requestNonPersonalizedAdsOnly: true,
                }}
              />
            </View>
          }
          renderItem={({ item, index }) => {
            const isCompleted = completedExams.includes(item.id);

            return (
              <Animated.View
                entering={FadeInDown.delay(index * 100).springify()}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleStartExam(item)}
                  className="mb-3"
                >
                  <Card
                    className={`flex-row justify-between items-center p-5 rounded-2xl h-24 ${isCompleted ? "border-2 border-border-success bg-border/50" : ""}`}
                  >
                    <View className="flex-1">
                      <Text className="text-text font-bold text-lg mb-1">
                        {item.name}
                      </Text>
                      <Text className="text-text-muted text-sm font-medium">
                        Yazım Kuralları ({item.questions.length} Soru)
                      </Text>
                    </View>
                    <View
                      className={`px-4 py-2 rounded-full ${isCompleted ? "bg-green-500/20" : "bg-primary/10"}`}
                    >
                      <Text
                        className={`font-bold text-sm ${isCompleted ? "text-green-600" : "text-primary"}`}
                      >
                        {isCompleted ? (
                          <Check color={Colors.dark.success} size={20} />
                        ) : (
                          "Çöz"
                        )}
                      </Text>
                    </View>
                  </Card>
                </TouchableOpacity>
              </Animated.View>
            );
          }}
          ListEmptyComponent={
            <View className="py-10 items-center justify-center">
              <Text className="text-text-muted text-center">
                Aramanıza uygun sınav bulunamadı.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
