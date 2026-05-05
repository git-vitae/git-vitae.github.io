// Web worker for WebLLM to prevent blocking the main UI thread
import { WebWorkerMLCEngineHandler } from '@mlc-ai/web-llm';

// Create and export the handler
const handler = new WebWorkerMLCEngineHandler();
self.onmessage = (msg) => {
  handler.onmessage(msg);
};
