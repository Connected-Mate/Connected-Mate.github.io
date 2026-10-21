import { Dropzone } from "./dropzone";

export default function Demo() {
  return (
    <div style={{ width: "100%", maxWidth: 520, minHeight: 470 }}>
      <Dropzone accept={[".pdf", ".png", ".jpg", ".xlsx", ".mp4", ".docx"]} autoplay />
    </div>
  );
}
