export type Extremity = 'none' | 'left-arm' | 'right-arm' | 'left-leg' | 'right-leg';

export interface Disability {
  id: string;
  name: string;
  rating: number; // 10, 20, ..., 100
  extremity: Extremity;
  isModified?: boolean;
}

export interface CalculationStep {
  name: string;
  rating: number;
  appliedValue: number;
  remainingWholePerson: number;
}

export const AVAILABLE_RATINGS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export const EXTREMITY_OPTIONS: {label: string, value: Extremity}[] = [
  { label: 'None/General', value: 'none' },
  { label: 'Left Arm', value: 'left-arm' },
  { label: 'Right Arm', value: 'right-arm' },
  { label: 'Left Leg', value: 'left-leg' },
  { label: 'Right Leg', value: 'right-leg' }
];

export interface CalculationResult {
  rawPercentage: number;
  combinedRating: number;
  bilateralValue: number;
  hasBilateralFactor: boolean;
  steps: CalculationStep[];
}

export interface ReferenceInfo {
  title: string;
  description: string;
  sourceUrl: string;
}
