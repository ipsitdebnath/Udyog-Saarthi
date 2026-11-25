import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, Users, Bot, ChevronRight } from 'lucide-react-native';
import Card from '../common/Card';
import { Colors, BorderRadius, Spacing } from '../../constants/Colors';

export default function QuickActionShortcuts({
  highContrast = false,
  fontScale = 1,
}) {
  const router = useRouter();
  const theme = highContrast ? Colors.highContrast : Colors.light;

  const shortcuts = [
    {
      id: 'learning',
      title: 'Saarthi Learning',
      sub: 'Exam preparation, model tests, and skill building',
      icon: BookOpen,
      iconBg: '#E0F2F1',
      iconColor: '#168C83',
      route: '/(tabs)/learn',
    },
    {
      id: 'coach',
      title: 'Job Coach Assistance',
      sub: 'Request mentorship, scribes, or exam accommodations',
      icon: Users,
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
      route: '/(tabs)/profile',
    },
    {
      id: 'assistant',
      title: 'Saarthi AI Assistant',
      sub: 'Simplify complicated recruitment notifications with Gemini',
      icon: Bot,
      iconBg: '#E8F0FE',
      iconColor: '#2457A6',
      route: '/(tabs)/assistant',
    },
  ];

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.heading,
          { color: theme.text, fontSize: 17 * fontScale },
        ]}
      >
        Ecosystem Shortcuts
      </Text>

      {shortcuts.map((sc) => {
        const Icon = sc.icon;
        return (
          <Card
            key={sc.id}
            onPress={() => router.push(sc.route)}
            style={styles.card}
            highContrast={highContrast}
            accessibilityLabel={`${sc.title}: ${sc.sub}`}
          >
            <View style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: sc.iconBg }]}>
                <Icon size={22} color={sc.iconColor} />
              </View>

              <View style={styles.textCol}>
                <Text
                  style={[
                    styles.title,
                    { color: theme.text, fontSize: 15 * fontScale },
                  ]}
                >
                  {sc.title}
                </Text>
                <Text
                  style={[
                    styles.sub,
                    { color: theme.textSecondary, fontSize: 12 * fontScale },
                  ]}
                >
                  {sc.sub}
                </Text>
              </View>

              <ChevronRight size={20} color="#94A3B8" />
            </View>
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  heading: {
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  card: {
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textCol: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontWeight: '700',
    marginBottom: 2,
  },
  sub: {
    lineHeight: 16,
  },
});
