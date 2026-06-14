import { Tabs } from "expo-router";
import { ColorValue, StyleSheet, Text } from "react-native";

import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZE,
  SPACING,
} from "../../src/constants";

type TabIconProps = {
  color: ColorValue;
  focused: boolean;
  icon: string;
};

type TabLabelProps = {
  color: ColorValue;
  focused: boolean;
  label: string;
};

const TAB_ITEMS = {
  index: { icon: "🏠", label: "Trang chủ" },
  learn: { icon: "📚", label: "Học" },
  practice: { icon: "🎮", label: "Luyện" },
  read: { icon: "📖", label: "Đọc" },
  profile: { icon: "👤", label: "Cá nhân" },
} as const;

function TabIcon({ color, focused, icon }: TabIconProps) {
  return (
    <Text
      style={[
        styles.icon,
        {
          color,
          fontSize: focused ? FONT_SIZE.xl : FONT_SIZE.lg,
        },
      ]}
    >
      {icon}
    </Text>
  );
}

function TabLabel({ color, focused, label }: TabLabelProps) {
  return (
    <Text
      numberOfLines={1}
      style={[
        styles.label,
        {
          color,
          fontWeight: focused ? "800" : "700",
        },
      ]}
    >
      {focused ? "Đang học" : label}
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
        tabBarShowLabel: true,
        tabBarItemStyle: styles.item,
        tabBarStyle: styles.bar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: TAB_ITEMS.index.label,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              color={color}
              focused={focused}
              icon={TAB_ITEMS.index.icon}
            />
          ),
          tabBarLabel: ({ color, focused }) => (
            <TabLabel
              color={color}
              focused={focused}
              label={TAB_ITEMS.index.label}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: TAB_ITEMS.learn.label,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              color={color}
              focused={focused}
              icon={TAB_ITEMS.learn.icon}
            />
          ),
          tabBarLabel: ({ color, focused }) => (
            <TabLabel
              color={color}
              focused={focused}
              label={TAB_ITEMS.learn.label}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: TAB_ITEMS.practice.label,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              color={color}
              focused={focused}
              icon={TAB_ITEMS.practice.icon}
            />
          ),
          tabBarLabel: ({ color, focused }) => (
            <TabLabel
              color={color}
              focused={focused}
              label={TAB_ITEMS.practice.label}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="read"
        options={{
          title: TAB_ITEMS.read.label,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              color={color}
              focused={focused}
              icon={TAB_ITEMS.read.icon}
            />
          ),
          tabBarLabel: ({ color, focused }) => (
            <TabLabel
              color={color}
              focused={focused}
              label={TAB_ITEMS.read.label}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: TAB_ITEMS.profile.label,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              color={color}
              focused={focused}
              icon={TAB_ITEMS.profile.icon}
            />
          ),
          tabBarLabel: ({ color, focused }) => (
            <TabLabel
              color={color}
              focused={focused}
              label={TAB_ITEMS.profile.label}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.border,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    borderTopWidth: 1,
    elevation: 10,
    height: 65,
    overflow: "hidden",
    paddingBottom: SPACING.sm,
    paddingTop: SPACING.xs,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  icon: {
    lineHeight: 24,
    textAlign: "center",
  },
  item: {
    paddingVertical: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    lineHeight: 16,
    marginTop: 0,
    textAlign: "center",
  },
});
