import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Shield, Building2, Briefcase } from 'lucide-react-native';
import { getSectorColors } from '../../utils/jobHelpers';

export default function SectorBadge({ sector, fontScale = 1 }) {
  const colors = getSectorColors(sector);

  const renderIcon = () => {
    switch (sector) {
      case 'Government':
        return <Shield size={12} color={colors.text} style={{ marginRight: 4 }} />;
      case 'PSU':
        return <Building2 size={12} color={colors.text} style={{ marginRight: 4 }} />;
      case 'Private Sector':
        return <Briefcase size={12} color={colors.text} style={{ marginRight: 4 }} />;
      default:
        return null;
    }
  };

  return (
    <View
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`Sector: ${sector}`}
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
      ]}
    >
      {renderIcon()}
      <Text
        style={[
          styles.text,
          {
            color: colors.text,
            fontSize: 11 * fontScale,
          },
        ]}
      >
        {sector}
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
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
