import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { BookmarkMinus } from "lucide-react-native";
import React, { useMemo } from "react";
import { FlatList, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import PastExamsSource from "../../src/data/pastExams.json";
import { useStore } from "../../src/store";

export default function SavedScreen() {
  const { savedQuestions, questions, toggleSavedQuestion } = useStore();

  const allQuestions = useMemo(() => {
    const examQuestions = PastExamsSource.flatMap((exam) => exam.questions);
    return [...questions, ...examQuestions];
  }, [questions]);

  const savedList = allQuestions.filter((q) => savedQuestions.includes(q.id));

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-background"
    >
      <FlatList
        data={savedList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          savedList.length === 0 ? { flex: 1 } : { padding: 16 }
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-8">
            <View className="w-24 h-24 bg-surface rounded-full items-center justify-center border border-border shadow-sm mb-6">
              <BookmarkMinus color={Colors.dark.icon} size={42} />
            </View>
            <Text className="text-text font-black text-2xl mb-2 text-center">
              Liste Boş
            </Text>
            <Text className="text-text-muted text-base text-center leading-6">
              Henüz kaydedilmiş bir soru bulunmuyor. Testleri çözerken sağ
              üstteki simgeye tıklayarak soruları buraya ekleyebilirsin.
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
            <Card className="mb-4">
              <CardHeader className="flex-row justify-between items-start pb-2">
                <CardTitle className="text-text text-base flex-1 mr-4 leading-6">
                  {item.text}
                </CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  onPress={() => toggleSavedQuestion(item.id)}
                  className="bg-red-50 hover:bg-red-100"
                >
                  <BookmarkMinus color="#ff8011" size={20} />
                </Button>
              </CardHeader>
              <CardContent>
                <View className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                  <Text className="text-text font-medium mb-1">
                    Doğru Cevap: {item.options[item.correctIndex]}
                  </Text>
                  <Text className="text-text-muted text-sm mt-2">
                    {item.explanation}
                  </Text>
                </View>
              </CardContent>
            </Card>
          </Animated.View>
        )}
      />
    </SafeAreaView>
  );
}
