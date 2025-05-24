import { UAParser } from "ua-parser-js";

const isIOS13Check = (type: string): boolean => {
  let nav: Navigator | undefined;
  if (typeof window !== "undefined") {
    if (window.navigator || navigator) {
      nav = window.navigator || navigator;
    }
  }

  return !!(
    nav &&
    nav.platform &&
    (nav.platform.indexOf(type) !== -1 ||
      (nav.platform === "MacIntel" &&
        nav.maxTouchPoints > 1 &&
        !window.MSStream))
  );
};

type DeviceInfo = {
  isMobile: boolean;
  isAndroid: boolean;
  isFirefox: boolean;
  isOpera: boolean;
  isIOS: boolean;
  browserVersion: string;
};

function getDeviceInfoFromUserAgent(): DeviceInfo {
  const uagent = new UAParser();
  const browser = uagent.getBrowser();
  const device = uagent.getDevice();
  const os = uagent.getOS();

  const isMobile =
    device.type === "mobile" ||
    device.type === "tablet" ||
    isIOS13Check("iPad");
  const isAndroid = os.name === "Android";
  const isFirefox = browser.name === "Firefox";
  const isOpera = browser.name === "Opera";
  const isIOS = os.name === "iOS" || isIOS13Check("iPad");
  const browserVersion = browser.version ?? "0";

  return {
    isMobile,
    isAndroid,
    isFirefox,
    isOpera,
    isIOS,
    browserVersion,
  };
}

export const platforms = {
  NATIVE: "native" as const, // supports beforeinstallprompt event
  FIREFOX: "firefox" as const,
  FIREFOX_NEW: "firefox_new" as const, // above version 79
  OPERA: "opera" as const,
  IDEVICE: "idevice" as const,
  OTHER: "other" as const, // unsupported platform
};

export type PlatformType = (typeof platforms)[keyof typeof platforms];

export function getPlatform() {
  if (!window) {
    return platforms.OTHER;
  }

  let platform: PlatformType = platforms.OTHER;
  const { isMobile, isAndroid, isFirefox, isOpera, isIOS, browserVersion } =
    getDeviceInfoFromUserAgent();

  if (window.hasOwnProperty("BeforeInstallPromptEvent")) {
    platform = platforms.NATIVE;
  } else if (
    isMobile &&
    isAndroid &&
    isFirefox &&
    Number.parseInt(browserVersion) >= 79
  ) {
    platform = platforms.FIREFOX_NEW;
  } else if (isMobile && isAndroid && isFirefox) {
    platform = platforms.FIREFOX;
  } else if (isMobile && isAndroid && isOpera) {
    platform = platforms.OPERA;
  } else if (isMobile && isIOS) {
    platform = platforms.IDEVICE;
  }

  return platform;
}
