import "./IosPromptUI.css";
import { IconShareIos } from "./IconShareIos";

export type IosPromptUIProps = {
  onCancel: () => void;
  onDone: () => void;
};

export function IosPromptUI({ onCancel, onDone }: IosPromptUIProps) {
  return (
    <div className="i-prompt">
      <p className="i-title">Add to Home Screen</p>
      <ul className="i-instructions">
        <li>
          <IconShareIos /> Press 'Share' button
        </li>
        <li>Press 'Add to Home Screen'</li>
      </ul>
      <div className="i-actions">
        <button className="red" onClick={onCancel}>
          Cancel
        </button>
        <button onClick={onDone}>Done</button>
      </div>
    </div>
  );
}
