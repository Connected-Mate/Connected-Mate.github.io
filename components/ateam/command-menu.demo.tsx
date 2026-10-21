import { CommandMenu } from "./command-menu";

export default function Demo() {
  return (
    <div style={{ width: "100%", maxWidth: 600, display: "grid", placeItems: "center" }}>
      <CommandMenu onRun={() => {}} />
    </div>
  );
}
