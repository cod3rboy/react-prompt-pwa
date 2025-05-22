import "./AndroidPromptUI.css";
import type { ReactNode } from "react";
import { type PlatformType } from "../../platform-detect";
import { IconFirefoxA2HS } from "./IconFirefoxA2HS";
import { IconMenu } from "./IconMenu";
import { IconOperaA2HS } from "./IconOperaA2HS";

export type SupportedPlatformType = Exclude<
  PlatformType,
  "other" | "native" | "idevice"
>;

export type AndroidPromptUIProps = {
  platform: SupportedPlatformType;
  onCancel: () => void;
  onDone: () => void;
};

const instructions: Record<
  SupportedPlatformType,
  Array<ReactNode> & { length: 2 }
> = {
  firefox: [
    <>
      <IconFirefoxA2HS /> Tap this icon on the address bar
    </>,
    "then tap '+Add to Homescreen'",
  ],
  firefox_new: [
    <>
      <IconMenu /> Tap the menu button
    </>,
    "then tap 'Install'",
  ],
  opera: [
    <>
      <IconMenu /> Tap the menu button
    </>,
    <>
      <IconOperaA2HS /> then tap 'Home screen'
    </>,
  ],
};

export function AndroidPromptUI({
  platform,
  onCancel,
  onDone,
}: AndroidPromptUIProps) {
  return (
    <div className="a-prompt">
      <p className="a-title">Instructions to install app</p>
      <ul className="a-instructions">
        <li>{instructions[platform][0]}</li>
        <li>{instructions[platform][1]}</li>
      </ul>
      <div className="a-actions">
        <button onClick={onCancel}>Cancel</button>
        <button className="filled" onClick={onDone}>
          Done
        </button>
      </div>
    </div>
  );
}
