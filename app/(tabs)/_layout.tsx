import { Tabs } from "expo-router";
import {
  Bookmark,
  BowArrow,
  FileText,
  Gamepad2,
  Home,
} from "lucide-react-native";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Apply colors based on theme, using the provided primary RGB
  const activeColor = "rgb(21, 93, 252)"; // primary color
  const inactiveColor = isDark ? "rgb(156, 163, 175)" : "rgb(107, 114, 128)"; // secondary color
  const backgroundColor = isDark ? "rgba(42, 44, 43)" : "rgb(255, 255, 255)"; // background color
  const borderColor = isDark ? "rgba(93, 99, 107, 1)" : "rgb(229, 231, 235)"; // border color

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          borderTopWidth: 1,
          height: 102,
          backgroundColor: backgroundColor,
          borderTopColor: borderColor,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Ana Sayfa",
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Kaydedilenler",
          tabBarIcon: ({ color }) => <Bookmark color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="exams"
        options={{
          title: "Çıkmışlar",
          tabBarIcon: ({ color }) => <BowArrow color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="game"
        options={{
          title: "Kelime Oyunu",
          tabBarIcon: ({ color }) => <Gamepad2 color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="rules"
        options={{
          title: "Kurallar",
          tabBarIcon: ({ color }) => <FileText color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
