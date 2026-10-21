import { DateRangePicker } from "./date-range-picker";

export default function Demo() {
  return (
    <div style={{ width: "100%", maxWidth: 664, minHeight: 540, paddingTop: 4 }}>
      <DateRangePicker today={new Date(2026, 9, 21)} defaultOpen />
    </div>
  );
}
