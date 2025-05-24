import { useCallback, useMemo, useState, type PropsWithChildren } from "react";
import { getPlatform, platforms, type PlatformType } from "../platform-detect";
import { PwaPromptContext } from "../contexts/pwa-prompt";
import { useEffect } from "react";
import { getLogger } from "../logger";
import { PwaPrompt } from "./PwaPrompt";

export type PwaPromptProviderProps = {
  enableLogging?: boolean;
};

export function PwaPromptProvider({
  enableLogging = false,
  children,
}: PropsWithChildren<PwaPromptProviderProps>) {
  const logger = getLogger(!enableLogging);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<PlatformType>(platforms.OTHER);

  const supported = useCallback(() => {
    if (platform === platforms.NATIVE) {
      logger.info("supported: true - native platform");
      return true;
    }

    if (platform !== platforms.OTHER) {
      logger.info("supported: true - manual support");
      return true;
    }

    logger.info("supported: false");
    return false;
  }, [logger, platform]);

  const installed = useCallback(() => {
    const isStandalone = !!(
      window.navigator as Navigator & { standalone?: boolean }
    )["standalone"];

    const isDisplayModeStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;

    if (isStandalone || isDisplayModeStandalone) {
      logger.info("installed: true. Already in standalone mode");
      return true;
    }

    logger.info("installed: false");
    return false;
  }, [logger]);

  const install = useCallback(async () => {
    if (platform === platforms.OTHER) {
      logger.info("platform does not support pwa installation");
      return false;
    }

    if (platform === platforms.NATIVE && !deferredPrompt) {
      logger.info("native platform did not trigger beforeinstallprompt event");
      return false;
    }

    try {
      await window.showPwaPrompt();

      return true;
    } catch (err) {
      if (err) {
        logger.error(err);
      }
      return false;
    }
  }, [logger, platform, deferredPrompt]);

  const contextValue = useMemo(
    () => ({ supported, installed, install }),
    [supported, installed, install]
  );

  useEffect(() => {
    setPlatform(getPlatform());
  }, []);

  useEffect(() => {
    const handleBeforeInstallPromptEvent = (e: Event) => {
      e.preventDefault();
      // logger.info("beforeinstallprompt event fired and captured");
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPromptEvent
    );
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPromptEvent
      );
    };
  }, []);

  return (
    <PwaPromptContext.Provider value={contextValue}>
      {children}
      <PwaPrompt platform={platform} nativePromptEvent={deferredPrompt} />
    </PwaPromptContext.Provider>
  );
}
