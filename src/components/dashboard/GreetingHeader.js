import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, Shield } from 'lucide-react-native';
import { Colors, BorderRadius, Spacing } from '../../constants/Colors';

export default function GreetingHeader({
  userName = 'Candidate',
  roleLabel = 'Candidate (4% Reservation Program)',
  unreadNotifications = 2,
  onNotificationPress,
  highContrast = false,
  fontScale = 1,
}) {
  const theme = highContrast ? Colors.highContrast : Colors.light;

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style={styles.govRow}>
          <Shield size={12} color={theme.primary} />
          <Text
            style={[
              styles.govLabel,
              { color: theme.primary, fontSize: 11 * fontScale },
            ]}
          >
            GOVERNMENT OF INDIA • NIEPMD
          </Text>
        </View>

        <Text
          style={[
            styles.greeting,
            { color: theme.text, fontSize: 22 * fontScale },
          ]}
        >
          Namaste, {userName} 👋
        </Text>

        <Text
          style={[
            styles.role,
            { color: theme.textSecondary, fontSize: 13 * fontScale },
          ]}
        >
          {roleLabel}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onNotificationPress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Notifications. You have ${unreadNotifications} unread alerts`}
        accessibilityHint="Opens notification center"
        style={[
          styles.bellButton,
          {
            backgroundColor: theme.surface,
            borderColor: highContrast ? '#000000' : theme.border,
          },
        ]}
      >
        <Bell size={22} color={theme.text} />
        {unreadNotifications > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadNotifications}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  govRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  govLabel: {
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  greeting: {
    fontWeight: '700',
    marginBottom: 2,
  },
  role: {
    fontWeight: '500',
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginLeft: 12,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#DC2626',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
