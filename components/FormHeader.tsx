/**
 * FormHeader – renders the SENGE-CE institutional header at the top of the form,
 * replicating the header shown in the ATUALIZAÇÃO CADASTRAL document.
 * Visual style is based on the SENGE-CE website color palette.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

export default function FormHeader() {
  return (
    <View style={styles.container}>
      {/* Top accent bar */}
      <View style={styles.topBar} />

      <View style={styles.content}>
        {/* Logo placeholder – circular icon representing SENGE branding */}
        <View style={styles.logoContainer}>
          <View style={styles.logoOuter}>
            <View style={styles.logoInner} />
          </View>
          <Text style={styles.logoText}>SENGE.CE</Text>
          <Text style={styles.logoSubText}>sindicato dos engenheiros{'\n'}no estado do ceará</Text>
        </View>

        {/* Institutional details */}
        <View style={styles.details}>
          <Text style={styles.orgName}>SINDICATO DOS ENGENHEIROS NO ESTADO DO CEARÁ</Text>
          <Text style={styles.detailText}>
            Rua: Alegre, 01 Praia de Iracema, CEP: 60.060-280 – Fortaleza-CE
          </Text>
          <Text style={styles.detailText}>
            CNPJ: 05.242.714/0001-20  Fone: (85) 3219-0099
          </Text>
          <Text style={styles.detailText}>E-mail: atendimento@sengece.org.br</Text>
          <Text style={styles.detailText}>Site: www.sengece.org.br</Text>
        </View>
      </View>

      {/* Form title banner */}
      <View style={styles.titleBanner}>
        <Text style={styles.titleText}>ATUALIZAÇÃO CADASTRAL</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
    marginBottom: 4,
  },
  topBar: {
    height: 6,
    backgroundColor: COLORS.primaryDark,
  },
  content: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    alignItems: 'center',
    minWidth: 80,
  },
  logoOuter: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primaryDark,
  },
  logoText: {
    fontSize: 11,
    fontFamily: 'Roboto-Bold',
    color: COLORS.primaryDark,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  logoSubText: {
    fontSize: 7,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    lineHeight: 10,
  },
  details: {
    flex: 1,
  },
  orgName: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    color: COLORS.primaryDark,
    marginBottom: 3,
  },
  detailText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontFamily: 'Roboto-Regular',
    lineHeight: 15,
  },
  titleBanner: {
    backgroundColor: COLORS.sectionHeader,
    paddingVertical: 10,
    alignItems: 'center',
  },
  titleText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
