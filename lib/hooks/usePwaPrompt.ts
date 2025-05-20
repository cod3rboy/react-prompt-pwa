import { useContext } from "react";
import {
  type IPwaPromptContext,
  PwaPromptContext,
} from "../contexts/pwa-prompt";

export function usePwaPrompt(): IPwaPromptContext {
  return useContext(PwaPromptContext);
}
