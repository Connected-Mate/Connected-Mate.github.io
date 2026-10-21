import { useState } from "react";
import { Combobox, type ComboboxOption } from "./combobox";

const people: ComboboxOption[] = [
  { value: "maya", label: "Maya Chen", hint: "Product Designer", avatar: true, group: "Design" },
  { value: "jonas", label: "Jonas Weber", hint: "Design Lead", avatar: true, group: "Design" },
  { value: "priya", label: "Priya Raman", hint: "Brand Designer", avatar: true, group: "Design" },
  { value: "sara", label: "Sara Okafor", hint: "Staff Engineer", avatar: true, group: "Engineering" },
  { value: "leo", label: "Leo Martins", hint: "Frontend", avatar: true, group: "Engineering" },
  { value: "nina", label: "Nina Petrova", hint: "Backend", avatar: true, group: "Engineering" },
  { value: "tom", label: "Tom Becker", hint: "iOS", avatar: true, group: "Engineering" },
  { value: "elif", label: "Elif Yilmaz", hint: "Head of Product", avatar: true, group: "Product" },
  { value: "daniel", label: "Daniel Kim", hint: "Product Manager", avatar: true, group: "Product" },
  { value: "lucas", label: "Lucas Moreau", hint: "Product Analyst", avatar: true, group: "Product" },
];

export default function Demo() {
  const [reviewers, setReviewers] = useState<string[]>(["maya", "sara"]);
  return (
    <div style={{ width: "100%", maxWidth: 420, minHeight: 440, paddingTop: 8 }}>
      <Combobox
        label="Reviewers"
        options={people}
        value={reviewers}
        onChange={setReviewers}
        placeholder="Add reviewers…"
        maxVisibleTags={4}
        creatable
        createLabel={(text) => `Invite “${text}”`}
        onCreate={(text) => ({ value: text.toLowerCase(), label: text, avatar: true, group: "Invited" })}
        defaultOpen
      />
    </div>
  );
}
