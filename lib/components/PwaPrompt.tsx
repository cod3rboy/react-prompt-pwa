import "./PwaPrompt.css";
import { useEffect, useRef, useState } from "react";
import { platforms, type PlatformType } from "../platform-detect";
import { IosPromptUI } from "./ios/IosPromptUI";
import { AndroidPromptUI } from "./android/AndroidPromptUI";

export type PwaPromptProps = {
  platform: PlatformType;
  nativePromptEvent: BeforeInstallPromptEvent | null;
};

type PromiseResolveFn<T> = (value: T | PromiseLike<T>) => T;
type PromiseRejectFn = (reason?: Error) => void;

export function PwaPrompt({ platform, nativePromptEvent }: PwaPromptProps) {
  const awaitingPromiseRef = useRef<{
    resolve: PromiseResolveFn<void>;
    reject: PromiseRejectFn;
  }>(null);

  const [open, setOpen] = useState<boolean>(false);

  const handleDone = () => {
    setOpen(false);

    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.resolve();
    }
  };

  const handleCancel = () => {
    setOpen(false);

    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.reject(
        new Error("pwa installation request was dismissed")
      );
    }
  };

  useEffect(() => {
    const openNativePrompt = (event: BeforeInstallPromptEvent): Promise<void> =>
      new Promise((resolve, reject) => {
        event
          .prompt()
          .then(() => event.userChoice)
          .then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
              resolve();
            } else {
              throw new Error("pwa installation request was dismissed");
            }
          })
          .catch((err) => {
            reject(err);
          });
      });

    const openManualPrompt = (): Promise<void> => {
      setOpen(true);

      return new Promise((resolve, reject) => {
        awaitingPromiseRef.current = { resolve, reject };
      });
    };

    const showPrompt = (): Promise<void> => {
      if (nativePromptEvent) {
        return openNativePrompt(nativePromptEvent);
      }

      return openManualPrompt();
    };

    const previousValue = window.showPwaPrompt;
    window.showPwaPrompt = showPrompt;

    return () => {
      window.showPwaPrompt = previousValue;
    };
  }, [nativePromptEvent]);

  if (platform === platforms.NATIVE || platform === platforms.OTHER) {
    return null;
  }

  return open ? (
    <div className="pwa-prompt">
      {platform === platforms.IDEVICE ? (
        <IosPromptUI onCancel={handleCancel} onDone={handleDone} />
      ) : (
        <AndroidPromptUI
          platform={platform}
          onCancel={handleCancel}
          onDone={handleDone}
        />
      )}
    </div>
  ) : null;
}
