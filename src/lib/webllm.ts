import { CreateWebWorkerMLCEngine, prebuiltAppConfig } from "@mlc-ai/web-llm";
import readmeText from "../../README.md?raw";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface WebLLMStatus {
  status: "not_loaded" | "loading" | "ready" | "error";
  progress?: number;
  error?: string;
}

class WebLLMService {
  private engine: any = null;
  private status: WebLLMStatus = { status: "not_loaded" };
  private statusCallbacks: ((status: WebLLMStatus) => void)[] = [];

  // Check if WebGPU is available
  isWebGPUSupported(): boolean {
    return typeof navigator !== "undefined" && "gpu" in navigator;
  }

  // Subscribe to status updates
  onStatusChange(callback: (status: WebLLMStatus) => void) {
    this.statusCallbacks.push(callback);
    return () => {
      this.statusCallbacks = this.statusCallbacks.filter(cb => cb !== callback);
    };
  }

  private updateStatus(status: WebLLMStatus) {
    this.status = status;
    this.statusCallbacks.forEach(cb => cb(status));
  }

  // Initialize the model
  async initialize() {
    if (!this.isWebGPUSupported()) {
      this.updateStatus({
        status: "error",
        error: "WebGPU not supported. Please use a modern browser like Chrome 113+, Safari 26+, or Edge 113+."
      });
      return;
    }

    if (this.status.status === "ready") return;

    try {
      this.updateStatus({ status: "loading", progress: 0 });

      // Create web worker for better UI performance
      const worker = new Worker(new URL("./webllm-worker.ts", import.meta.url), {
        type: "module"
      });

      // Use the smallest model: Llama-3.2-1B-Instruct-q4f16_1-MLC
      const appConfig = {
        ...prebuiltAppConfig,
        cacheBackend: "indexeddb" as const
      };

      this.engine = await CreateWebWorkerMLCEngine(worker, "Llama-3.2-1B-Instruct-q4f16_1-MLC", {
        appConfig,
        initProgressCallback: (progress) => {
          this.updateStatus({
            status: "loading",
            progress: Math.round(progress.progress * 100)
          });
        }
      });

      this.updateStatus({ status: "ready" });
    } catch (error) {
      console.error("WebLLM initialization failed:", error);
      this.updateStatus({
        status: "error",
        error: error instanceof Error ? error.message : "Failed to initialize AI model"
      });
    }
  }

  // Generate chat response
  async *chat(messages: ChatMessage[], pageContext: string): AsyncGenerator<string> {
    if (this.status.status !== "ready" || !this.engine) {
      await this.initialize();
    }

    if (this.status.status !== "ready" || !this.engine) {
      throw new Error("WebLLM not ready. Please wait for initialization.");
    }

    try {
      const systemPrompt = `You are a STRICTLY page-specific AI assistant for a GitVitae portfolio website. Your ONLY purpose is to answer questions about:
1. GitVitae project documentation and setup
2. The current portfolio page content
3. How to use GitVitae features
4. Portfolio-related topics

You MUST refuse to answer ANY question that is not directly related to GitVitae or the current page. 

Examples of questions you CAN answer:
- How do I set up a GitVitae portfolio?
- What information is on this page?
- How do I customize my portfolio?

Examples of questions you CANNOT answer:
- General knowledge questions (math, science, history, etc.)
- How-to questions unrelated to GitVitae
- Questions about other projects or topics

For ANY off-topic question, respond with: "I can only help with questions about GitVitae and this portfolio page. Please ask me something related to the project or current page."

PROJECT DOCUMENTATION:
${readmeText}

CURRENT PAGE CONTEXT:
${pageContext}

IMPORTANT: Always refuse off-topic questions politely but firmly.`;

      // Convert messages to OpenAI format
      const openaiMessages = [
        { role: "system" as const, content: systemPrompt },
        ...messages.map(msg => ({ role: msg.role, content: msg.content }))
      ];

      // Create streaming completion
      const chunks = await this.engine.chat.completions.create({
        messages: openaiMessages,
        stream: true,
        max_tokens: 500, // Limit for quick responses
        temperature: 0.7
      });

      for await (const chunk of chunks) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error("Chat generation failed:", error);
      throw error;
    }
  }

  // Get current status
  getStatus(): WebLLMStatus {
    return this.status;
  }

  // Reset/clear the service
  reset() {
    this.engine = null;
    this.status = { status: "not_loaded" };
  }
}

// Singleton instance
export const webLLMService = new WebLLMService();