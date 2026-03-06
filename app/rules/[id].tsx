import { Text } from "@/components/ui/text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { SafeAreaView } from "react-native-safe-area-context";
import SpellingRulesSource from "../../src/data/spellingRules.json";

const adUnitId = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-1203756903499434/7836421398";

export default function RuleDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Find the rule based on the ID
  const rule = SpellingRulesSource.find((r) => r.id === id);

  if (!rule) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <Text className="text-text font-bold">Kural bulunamadı.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 p-2">
          <Text className="text-primary font-bold">Geri Dön</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft color="#6B7280" size={28} />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-bold text-lg text-text mr-8">
          Kural Detayı
        </Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-6 pb-20 mt-4">
        {/* Ad banner */}
        <View className="items-center mb-6">
          <BannerAd
            unitId={adUnitId}
            size={BannerAdSize.BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>

        {/* Title Section */}
        <View className="mb-8">
          <View className="relative bg-background p-6">
            {/* Top Left Notch border */}
            <View className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-border-gold rounded-tl-lg" />
            {/* Bottom Right Notch border */}
            <View className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-border-gold rounded-br-lg" />

            <Text className="text-center text-text text-2xl font-black leading-8">
              {rule.title}
            </Text>
          </View>
        </View>

        {/* Content Section */}
        <View className="bg-surface border border-border rounded-3xl p-6 shadow-sm mb-12">
          <Text className="text-text text-lg leading-8 font-medium">
            {rule.content}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
