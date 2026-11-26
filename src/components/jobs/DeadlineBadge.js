import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, AlertTriangle } from 'lucide-react-native';
import { formatDeadline } from '../../utils/jobHelpers';

export default function DeadlineBadge({ deadline, fontScale = 1 }) {
  const info = formatDeadline(deadline);

  const getStyle = () => {
    if (info.isClosed) {
      return { bg: '#F1F5F9', text: '#64748B', border: '#CBD5E1' };
    }
    if (info.isUrgent) {
      return { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' };
    }
    return { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' };
  };

  const colors = getStyle();

  return (
    <View
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`Application deadline: ${info.text}`}
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
      ]}
    >
      {info.isUrgent ? (
        <AlertTriangle size={12} color={colors.text} style={{ marginRight: 4 }} />
      ) : (
        <Clock size={12} color={colors.text} style={{ marginRight: 4 }} />
      )}
      <Text
        style={[
          styles.text,
          {
            color: colors.text,
            fontSize: 11 * fontScale,
            fontWeight: info.isUrgent ? '700' : '600',
          },
        ]}
      >
        {info.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    letterSpacing: 0.2,
  },
});
