import type { AIService, AIProvider } from './types';
import { AnthropicAIService } from './anthropic-service';

/**
 * Factory to create AI service instances based on configuration
 * Supports multiple providers: Anthropic, OpenAI, or local Python service
 */
export class AIServiceFactory {
  private static instance: AIService | null = null;

  static getService(): AIService {
    if (this.instance) {
      return this.instance;
    }

    const provider = (process.env.AI_PROVIDER || 'anthropic') as AIProvider;

    switch (provider) {
      case 'anthropic':
        const anthropicKey = process.env.ANTHROPIC_API_KEY;
        if (!anthropicKey) {
          throw new Error('ANTHROPIC_API_KEY not configured');
        }
        this.instance = new AnthropicAIService(anthropicKey);
        break;

      case 'openai':
        // TODO: Implement OpenAI service when needed
        throw new Error('OpenAI provider not yet implemented. Use anthropic or local.');

      case 'local':
        // TODO: Implement local Python ML service client
        throw new Error('Local provider not yet implemented. Use anthropic for now.');

      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }

    return this.instance;
  }

  /**
   * Reset the singleton instance (useful for testing)
   */
  static reset() {
    this.instance = null;
  }
}

/**
 * Convenience function to get the AI service
 */
export function getAIService(): AIService {
  return AIServiceFactory.getService();
}
