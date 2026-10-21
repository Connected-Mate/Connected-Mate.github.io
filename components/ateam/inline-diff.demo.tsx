import { InlineDiff } from "./inline-diff";

const original =
  "Hi everyone, we are very excited to announce that the new dashboard is now available for all users. It loads a lot faster than before, and you can now export any report to CSV with just a single click. Let us know what you think!";
const suggested =
  "Hi everyone, the new dashboard is now live for all users. It loads twice as fast, and you can now export any report to CSV in one click. Let us know what you think!";

export default function Demo() {
  return <InlineDiff label="Suggested by AI · Make it shorter" original={original} suggested={suggested} />;
}
