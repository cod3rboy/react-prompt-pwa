import { createContext } from "react";
export interface IPwaPromptContext {
  supported: () => boolean;
  installed: (checkInstalledRelatedApps?: boolean) => boolean;
  install: () => Promise<boolean>;
}

export const PwaPromptContext = createContext<IPwaPromptContext>({
  supported: () => false,
  installed: () => false,
  install: async () => false,
});
