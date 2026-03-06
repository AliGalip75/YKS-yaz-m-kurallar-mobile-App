import { Text } from "@/components/ui/text";
import { Flame } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { SafeAreaView } from "react-native-safe-area-context";
import WordPairsSource from "../../src/data/wordPairs.json";

const adUnitId = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-1203756903499434/7836421398";

type WordPair = {
  id: string;
  correct: string;
  incorrect: string;
};

interface GameCardProps {
  word: string;
  isCorrectTruth: string;
  position: "top" | "bottom";
  selectedPosition: "top" | "bottom" | null;
  isEvaluating: boolean;
  onPress: (position: "top" | "bottom", truth: string) => void;
}

const GameCard = ({
  word,
  isCorrectTruth,
  position,
  selectedPosition,
  isEvaluating,
  onPress,
}: GameCardProps) => {
  const isSelected = selectedPosition === position;
  const isCorrect = isCorrectTruth === "correct";

  let bgClass = "bg-surface border-primary/20";
  let textClass = "text-text";

  if (isEvaluating) {
    if (isCorrect) {
      bgClass = "bg-[#dcfce7] border-[#22c55e]";
      textClass = "text-[#05DF72]";
    } else if (isSelected && !isCorrect) {
      bgClass = "bg-[#fee2e2] border-[#ef4444]";
      textClass = "text-[#991b1b]";
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={isEvaluating}
      onPress={() => onPress(position, isCorrectTruth)}
      className={`rounded-3xl border-2 items-center justify-center p-6 shadow-md w-full my-3 flex-[0.4] ${bgClass}`}
    >
      <View className="w-full justify-center items-center">
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          minimumFontScale={0.4}
          className={`font-black text-3xl text-center w-full ${textClass}`}
        >
          {word}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function GameScreen() {
  const [currentPair, setCurrentPair] = useState<WordPair | null>(null);
  const [leftWord, setLeftWord] = useState<{
    word: string;
    truth: string;
  } | null>(null);
  const [rightWord, setRightWord] = useState<{
    word: string;
    truth: string;
  } | null>(null);
  const [streak, setStreak] = useState(0);

  const [selectedPosition, setSelectedPosition] = useState<
    "top" | "bottom" | null
  >(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const loadNewPair = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * WordPairsSource.length);
    const pair = WordPairsSource[randomIndex] as WordPair;
    setCurrentPair(pair);

    if (Math.random() > 0.5) {
      setLeftWord({ word: pair.correct, truth: "correct" });
      setRightWord({ word: pair.incorrect, truth: "incorrect" });
    } else {
      setLeftWord({ word: pair.incorrect, truth: "incorrect" });
      setRightWord({ word: pair.correct, truth: "correct" });
    }

    setSelectedPosition(null);
    setIsEvaluating(false);
  }, []);

  useEffect(() => {
    loadNewPair();
  }, [loadNewPair]);

  const handlePress = (position: "top" | "bottom", truth: string) => {
    if (isEvaluating) return;

    setSelectedPosition(position);
    setIsEvaluating(true);

    const isSuccess = truth === "correct";

    if (isSuccess) {
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      loadNewPair();
    }, 1200);
  };

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-background"
    >
      <View className="flex-row justify-between items-center px-6 pt-6 pb-4">
        <View>
          <Text className="text-text font-bold text-3xl">Kelime Oyunu</Text>
          <Text className="text-text-muted text-sm mt-1">
            Doğru yazımı seç!
          </Text>
        </View>
        <View className="bg-orange-500/20 px-4 py-2 rounded-2xl flex-row items-center">
          <Flame color="#f97316" size={24} className="mr-2" />
          <Text className="text-orange-500 font-extrabold text-xl">
            {streak}
          </Text>
        </View>
      </View>

      <View className="flex-1 justify-center px-6 relative">
        <View className="flex-col items-center justify-center flex-1 pb-20">
          {leftWord && rightWord && (
            <>
              <GameCard
                word={leftWord.word}
                isCorrectTruth={leftWord.truth}
                position="top"
                selectedPosition={selectedPosition}
                isEvaluating={isEvaluating}
                onPress={handlePress}
              />
              <GameCard
                word={rightWord.word}
                isCorrectTruth={rightWord.truth}
                position="bottom"
                selectedPosition={selectedPosition}
                isEvaluating={isEvaluating}
                onPress={handlePress}
              />
            </>
          )}
        </View>

        <View className="absolute bottom-12 left-0 right-0 items-center">
          <Text className="text-text/40 text-center font-medium px-10">
            Doğru kelimenin yazılı olduğu karta dokun!
          </Text>
        </View>
      </View>

      <View className="items-center pb-5">
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
    </SafeAreaView>
  );
}
