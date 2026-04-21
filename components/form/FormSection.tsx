/**
 * FormSection – renders a blue header bar with a centered section title,
 * matching the visual style of the SENGE-CE ATUALIZAÇÃO CADASTRAL form.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

interface Props {
  title: string;
}

export default function FormSection({ title }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.sectionHeader,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 16,
    marginBottom: 2,
    borderRadius: 2,
  },
  title: {
    color: COLORS.white,
    fontFamily: 'Roboto-Bold',
    fontSize: 13,
    letterSpacing: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
