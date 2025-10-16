// AI Service Types
export type AIProvider = 'anthropic' | 'openai' | 'local';

export interface AIConfig {
  provider: AIProvider;
  apiKey?: string;
  baseUrl?: string; // For local Python service
}

export interface ExtractedInvoiceData {
  invoiceNumber: { value: string | null; confidence: number };
  invoiceDate: { value: string | null; confidence: number };
  amount: { value: number | null; confidence: number };
  amountExcludingVAT: { value: number | null; confidence: number };
  vatAmount: { value: number | null; confidence: number };
  subcontractorName: { value: string | null; confidence: number };
  subcontractorUTR: { value: string | null; confidence: number };
  workDescription: { value: string | null; confidence: number };
  cisDeduction: { value: number | null; confidence: number };
  projectReference: { value: string | null; confidence: number };
  paymentTerms: { value: string | null; confidence: number };
}

export interface ValidationCheckResult {
  passed: boolean;
  confidence: number;
  details: string;
  points: number;
  issues?: string[];
}

export interface ValidationResult {
  duplicateCheck: ValidationCheckResult;
  pricingAnomalyCheck: ValidationCheckResult;
  cisComplianceCheck: ValidationCheckResult;
  documentCompletenessCheck: ValidationCheckResult;
  poMatchCheck?: ValidationCheckResult;
}

export interface RiskScore {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  checks: ValidationResult;
  recommendation: string;
  suggestedActions: string[];
  autoApproveEligible: boolean;
}

// Base interface for all AI providers
export interface AIService {
  extractInvoiceData(imageUrl: string): Promise<ExtractedInvoiceData>;
  generateEmbedding(text: string): Promise<number[]>;
  compareTexts(text1: string, text2: string): Promise<{ similarity: number; explanation: string }>;
}
