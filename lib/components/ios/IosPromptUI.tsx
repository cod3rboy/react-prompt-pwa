import classes from "./IosPromptUI.module.css";
import { IconShareIos } from "./IconShareIos";

export type IosPromptUIProps = {
  onCancel: () => void;
  onDone: () => void;
};

export function IosPromptUI({ onCancel, onDone }: IosPromptUIProps) {
  return (
    <div className={classes.iPrompt}>
      <p className={classes.iTitle}>Add to Home Screen</p>
      <ul className={classes.iInstructions}>
        <li>
          <IconShareIos /> Press 'Share' button
        </li>
        <li>Press 'Add to Home Screen'</li>
      </ul>
      <div className={classes.iActions}>
        <button className={classes.red} onClick={onCancel}>
          Cancel
        </button>
        <button onClick={onDone}>Done</button>
      </div>
    </div>
  );
}
