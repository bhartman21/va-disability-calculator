export type Extremity = 'none' | 'left-arm' | 'right-arm' | 'left-leg' | 'right-leg';

export interface Disability {
  id: string;
  name: string;
  rating: number; // 10, 20, ..., 100
  extremity: Extremity;
  isModified?: boolean;
}

export interface CalculationResult {
  rawPercentage: number;
  combinedRating: number;
  bilateralValue: number;
  hasBilateralFactor: boolean;
}
