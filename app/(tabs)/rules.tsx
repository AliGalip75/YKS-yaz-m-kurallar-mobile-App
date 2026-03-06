import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { FileText, Search } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { FlatList, TextInput, TouchableOpacity, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import SpellingRulesSource from "../../src/data/spellingRules.json";

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

export default function RulesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRules = useMemo(() => {
    if (!searchQuery) return SpellingRulesSource;
    const normalizedQuery = normalizeString(searchQuery);
    return SpellingRulesSource.filter((rule) =>
      normalizeString(rule.title).includes(normalizedQuery),
    );
  }, [searchQuery]);

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
            placeholder="Kural ara..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <FlatList
          data={filteredRules}
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
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push(`/rules/${item.id}` as any)}
                className="mb-3"
              >
                <Card className="flex-row items-center p-5 rounded-2xl border border-border">
                  <View className="p-3 rounded-xl mr-4">
                    <FileText color="#ff8011" size={24} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text font-bold text-lg mb-1">
                      {item.title}
                    </Text>
                    <Text
                      className="text-text-muted text-sm"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.content}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            </Animated.View>
          )}
          ListEmptyComponent={
            <View className="py-10 items-center justify-center">
              <Text className="text-text-muted text-center">
                Aramanıza uygun kural bulunamadı.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
