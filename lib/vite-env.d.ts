/// <reference types="vite/client" />

declare global {
  interface Window {
    MSStream: {
      msClose: () => void;
      msDetachStream: () => object;
      type: string;
    };
    showPwaPrompt: () => Promise<void>;
  }

  interface BeforeInstallPromptEvent extends Event {
    readonly userChoice: Promise<{
      outcome: "accepted" | "dismissed";
      platform: string;
    }>;
    prompt(): Promise<void>;
  }
}

export {};
