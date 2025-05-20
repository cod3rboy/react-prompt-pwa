import { useEffect, useRef, useState, type RefObject } from "react";
import { platforms, type PlatformType } from "../platform-detect";

export type PwaPromptProps = {
  platform: PlatformType;
  nativePromptRef: RefObject<BeforeInstallPromptEvent | null>;
};

type PromiseResolveFn<T> = (value: T | PromiseLike<T>) => T;
type PromiseRejectFn = (reason?: Error) => void;

export function PwaPrompt({ platform, nativePromptRef }: PwaPromptProps) {
  const awaitingPromiseRef = useRef<{
    resolve: PromiseResolveFn<void>;
    reject: PromiseRejectFn;
  }>(null);

  const [open, setOpen] = useState<boolean>(false);

  const openNativePrompt = (event: BeforeInstallPromptEvent): Promise<void> =>
    new Promise((reject, resolve) => {
      event
        .prompt()
        .then(() => event.userChoice)
        .then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            resolve();
          } else {
            reject();
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
    if (nativePromptRef.current) {
      return openNativePrompt(nativePromptRef.current);
    }

    return openManualPrompt();
  };

  const handleDone = () => {
    setOpen(false);

    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.resolve();
    }
  };

  const handleDismiss = () => {
    setOpen(false);

    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.reject();
    }
  };

  useEffect(() => {
    const previousValue = window.showPwaPrompt;
    window.showPwaPrompt = showPrompt;

    return () => {
      window.showPwaPrompt = previousValue;
    };
  }, []);

  if (platform === platforms.NATIVE || platform === platforms.OTHER) {
    return null;
  }

  // TODO: implement platform-specific user interface
  return open ? (
    <div>
      <h3>Install this app</h3>
      <ol>
        <li>First instruction</li>
        <li>Second instruction</li>
      </ol>
      <button onClick={handleDone}>Done</button>
      <button onClick={handleDismiss}>Dismiss</button>
    </div>
  ) : null;
}
