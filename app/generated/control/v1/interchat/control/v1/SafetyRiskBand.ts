// Original file: ../interchat-protobuf/control/v1/models.proto

export const SafetyRiskBand = {
  SAFETY_RISK_BAND_UNSPECIFIED: 'SAFETY_RISK_BAND_UNSPECIFIED',
  SAFETY_RISK_BAND_LOW: 'SAFETY_RISK_BAND_LOW',
  SAFETY_RISK_BAND_MEDIUM: 'SAFETY_RISK_BAND_MEDIUM',
  SAFETY_RISK_BAND_HIGH: 'SAFETY_RISK_BAND_HIGH',
  SAFETY_RISK_BAND_CRITICAL: 'SAFETY_RISK_BAND_CRITICAL',
} as const;

export type SafetyRiskBand =
  | 'SAFETY_RISK_BAND_UNSPECIFIED'
  | 0
  | 'SAFETY_RISK_BAND_LOW'
  | 1
  | 'SAFETY_RISK_BAND_MEDIUM'
  | 2
  | 'SAFETY_RISK_BAND_HIGH'
  | 3
  | 'SAFETY_RISK_BAND_CRITICAL'
  | 4

export type SafetyRiskBand__Output = typeof SafetyRiskBand[keyof typeof SafetyRiskBand]
