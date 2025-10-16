import Anthropic from '@anthropic-ai/sdk';
import type { AIService, ExtractedInvoiceData } from './types';

export class AnthropicAIService implements AIService {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async extractInvoiceData(imageUrl: string): Promise<ExtractedInvoiceData> {
    try {
      // Fetch the image and convert to base64
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';

      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: `Extract the following information from this construction invoice and return as JSON:

{
  "invoiceNumber": { "value": "string or null", "confidence": 0.0-1.0 },
  "invoiceDate": { "value": "DD/MM/YYYY or null", "confidence": 0.0-1.0 },
  "amount": { "value": number or null, "confidence": 0.0-1.0 },
  "amountExcludingVAT": { "value": number or null, "confidence": 0.0-1.0 },
  "vatAmount": { "value": number or null, "confidence": 0.0-1.0 },
  "subcontractorName": { "value": "string or null", "confidence": 0.0-1.0 },
  "subcontractorUTR": { "value": "10 digits or null", "confidence": 0.0-1.0 },
  "workDescription": { "value": "string or null", "confidence": 0.0-1.0 },
  "cisDeduction": { "value": number or null, "confidence": 0.0-1.0 },
  "projectReference": { "value": "string or null", "confidence": 0.0-1.0 },
  "paymentTerms": { "value": "string or null", "confidence": 0.0-1.0 }
}

For each field:
- If found and clear: set value and confidence 0.8-1.0
- If found but unclear: set value and confidence 0.3-0.7
- If not found: set value to null and confidence 0.0

Return ONLY valid JSON, no additional text.`,
              },
            ],
          },
        ],
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from API');
      }

      const extracted = JSON.parse(content.text);
      return this.validateExtractedData(extracted);
    } catch (error) {
      console.error('Error extracting invoice data:', error);
      throw new Error('Failed to extract invoice data');
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    // Note: Anthropic doesn't provide embeddings API
    // Fall back to a simple hash-based approach for now
    // In production, you'd want to use OpenAI or a dedicated embedding service
    throw new Error('Anthropic does not provide embeddings. Please use OpenAI or local service.');
  }

  async compareTexts(
    text1: string,
    text2: string
  ): Promise<{ similarity: number; explanation: string }> {
    try {
      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `Compare these two texts and determine if they describe the same work:

Text 1: "${text1}"
Text 2: "${text2}"

Return a JSON object with:
{
  "similarity": 0.0-1.0 (how similar they are),
  "explanation": "brief explanation"
}

Return ONLY valid JSON.`,
          },
        ],
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from API');
      }

      return JSON.parse(content.text);
    } catch (error) {
      console.error('Error comparing texts:', error);
      return { similarity: 0.5, explanation: 'Unable to compare due to error' };
    }
  }

  private validateExtractedData(data: any): ExtractedInvoiceData {
    // Ensure all required fields exist with proper structure
    const fields = [
      'invoiceNumber',
      'invoiceDate',
      'amount',
      'amountExcludingVAT',
      'vatAmount',
      'subcontractorName',
      'subcontractorUTR',
      'workDescription',
      'cisDeduction',
      'projectReference',
      'paymentTerms',
    ];

    const validated: any = {};

    for (const field of fields) {
      if (data[field] && typeof data[field] === 'object') {
        validated[field] = {
          value: data[field].value ?? null,
          confidence: Math.max(0, Math.min(1, data[field].confidence ?? 0)),
        };
      } else {
        validated[field] = { value: null, confidence: 0 };
      }
    }

    return validated as ExtractedInvoiceData;
  }
}
