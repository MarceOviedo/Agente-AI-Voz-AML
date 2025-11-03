
import type React from 'react';

export enum StepStatus {
  Pending,
  Current,
  Completed,
  Skipped,
}

export interface ProcessStep {
  id: number;
  title: string;
  description: string;
  command: string;
  assistantResponse: string | React.ReactNode;
  nextStepId?: number;
  decision?: {
    truePositive: { command: string; nextStepId: number };
    falsePositive: { command: string; nextStepId: number };
  };
  isFinal?: boolean;
  requiresInput?: 'justification' | 'voiceNote';
}
