import { Tabs } from "expo-router";
import { Text } from "react-native";

import { COLORS, FONT_SIZE } from "../../src/constants";

type TabIconProps = {
  focused: boolean;
  icon: string;
};

function TabIcon({ focused, icon }: TabIconProps) {
  return (
    <Text style={{ fontSize: focused ? FONT_SIZE.xl : FONT_SIZE.lg }}>
      {icon}
    </Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelStyle: {
          fontSize: FONT_SIZE.xs,
          fontWeight: "800",
        },
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="🏠" />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Học",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="📚" />,
        }}
      />
      <Tabs.Screen
        name="read"
        options={{
          title: "Đọc",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="📖" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Cá nhân",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="👤" />,
        }}
      />
    </Tabs>
  );
}
