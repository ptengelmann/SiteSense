# AI Service Architecture

This directory contains a flexible AI service architecture that supports multiple AI providers.

## Supported Providers

### 1. Anthropic (Default)
Uses the API key you provided. Best for invoice OCR and text analysis.

**Configuration:**
```env
AI_PROVIDER="anthropic"
ANTHROPIC_API_KEY="your-key-here"
```

**Features:**
- ✅ Invoice data extraction (OCR)
- ✅ Text comparison
- ❌ Embeddings (not supported - use OpenAI or local)

### 2. OpenAI (Coming Soon)
Alternative provider for OCR and embeddings.

**Configuration:**
```env
AI_PROVIDER="openai"
OPENAI_API_KEY="your-key-here"
```

**Features:**
- ✅ Invoice data extraction (GPT-4 Vision)
- ✅ Text comparison
- ✅ Embeddings (for duplicate detection)

### 3. Local Python Service (Coming Soon)
Run your own ML models locally for cost savings and data privacy.

**Configuration:**
```env
AI_PROVIDER="local"
PYTHON_ML_SERVICE_URL="http://localhost:8000"
```

**Features:**
- ✅ Custom ML models
- ✅ Data privacy (no external API calls)
- ✅ Cost savings
- ✅ Full control over model training

## Usage

```typescript
import { getAIService } from '@/lib/ai/ai-factory';

// Get the configured AI service
const ai = getAIService();

// Extract invoice data
const data = await ai.extractInvoiceData(imageUrl);

// Compare texts (for PO matching)
const comparison = await ai.compareTexts(text1, text2);

// Generate embeddings (for duplicate detection)
// Note: Not supported by Anthropic, use OpenAI or local
const embedding = await ai.generateEmbedding(text);
```

## Adding a New Provider

1. Create a new service class implementing the `AIService` interface
2. Add it to `ai-factory.ts`
3. Update environment variables
4. Update this README

## Architecture Benefits

- **Flexibility**: Easy to switch providers
- **Testing**: Mock providers for testing
- **Cost Optimization**: Use different providers for different tasks
- **No Vendor Lock-in**: Not dependent on a single API
- **Privacy**: Option to run models locally

## Future Enhancements

- [ ] Implement OpenAI service
- [ ] Implement local Python ML service
- [ ] Add caching layer for API responses
- [ ] Add retry logic with exponential backoff
- [ ] Add cost tracking per provider
- [ ] Support hybrid approach (use different providers for different tasks)
