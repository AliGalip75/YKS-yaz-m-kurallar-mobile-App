import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { Brain } from "lucide-react-native";
import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStore } from "../../src/store";

const adUnitId = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-1203756903499434/7836421398";

export default function HomeScreen() {
  const router = useRouter();
  const { initializeApp, dailyRule, isLoading } = useStore();

  useEffect(() => {
    initializeApp();
  }, []);

  if (isLoading) {
    return (
      // Wrap loading state with SafeAreaView
      <SafeAreaView
        edges={["top", "left", "right"]}
        className="flex-1 bg-background justify-center items-center"
      >
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  // Calculate days remaining to YKS
  const calculateDaysToYKS = () => {
    // Current estimated YKS Date (usually mid-June, setting to June 21, 2026 for example)
    const yksDate = new Date("2026-06-21T00:00:00");
    const today = new Date();

    // Calculate difference in time
    const differenceInTime = yksDate.getTime() - today.getTime();

    // Calculate difference in days
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    return differenceInDays > 0 ? differenceInDays : 0;
  };

  const daysRemaining = calculateDaysToYKS();

  return (
    // Main container uses SafeAreaView to avoid notches
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-background"
    >
      <ScrollView className="flex-1 p-5">
        {/* Header Section */}
        <View className="mb-6 mt-2 flex-row justify-between items-center">
          <View>
            <View className="flex-row items-center mb-1">
              <Text className="text-text-muted text-lg font-medium mr-2">
                Hoş Geldin
              </Text>
            </View>
            <Text className="text-text text-3xl font-black mt-1">
              İyi Çalışmalar
            </Text>
          </View>
        </View>

        {/* Ad banner */}
        <View className="items-center mb-4">
          <BannerAd
            unitId={adUnitId}
            size={BannerAdSize.BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>

        {/* YKS Countdown Card - Redesigned */}
        <Card className="mb-6 border-0 bg-primary shadow-lg overflow-hidden relative">
          {/* Decorative background elements */}
          <View className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
          <View className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full" />

          <CardContent className="p-6 pt-8 pb-8 flex-row justify-between items-center relative z-10">
            <View className="flex-1">
              <Text className="text-white/80 text-sm font-bold uppercase tracking-wider mb-2">
                Hedefe Kalan Zaman
              </Text>
              <View className="flex-row items-baseline">
                <Text className="text-white font-black text-6xl shadow-sm">
                  {daysRemaining}
                </Text>
                <Text className="text-white/90 font-bold text-xl ml-2 mb-1">
                  Gün
                </Text>
              </View>
            </View>
            <View className="bg-white px-5 py-3 rounded-2xl shadow-sm">
              <Text className="text-primary font-black text-lg">YKS 2026</Text>
            </View>
          </CardContent>
        </Card>

        {/* Daily rule section - Enhanced */}
        {dailyRule && (
          <Card className="mb-8 border border-border bg-surface shadow-sm">
            <View className="dark:bg-blue-950/20 px-5 py-4 border-b border-border flex-row items-center">
              <View className="pb-5 pl-4 rounded-lg mr-5">
                <Brain color="#ff8011" size={32} />
              </View>
              <Text className="text-text pb-4 font-bold text-lg flex-1">
                {dailyRule.title}
              </Text>
            </View>
            <CardContent className="p-5">
              <Text className="text-text text-base leading-7 font-medium">
                {dailyRule.content}
              </Text>
            </CardContent>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
