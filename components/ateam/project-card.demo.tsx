"use client";

import { useState } from "react";
import { ProjectCard, type ProjectTask } from "./project-card";

const INITIAL: ProjectTask[] = [
  { id: "welcome", label: "Welcome screen", done: true, assignee: "Mara Okafor" },
  { id: "workspace", label: "Workspace setup", done: true, assignee: "Jonas Weber" },
  { id: "invite", label: "Invite teammates", done: true, assignee: "Mara Okafor" },
  { id: "checklist", label: "First-run checklist", assignee: "Priya Nair" },
  { id: "emails", label: "Lifecycle emails", assignee: "Jonas Weber" },
];

export default function Demo() {
  const [tasks, setTasks] = useState(INITIAL);
  const [status, setStatus] = useState("progress");
  const [opened, setOpened] = useState(0);

  return (
    <div style={{ width: "100%", maxWidth: 320, minHeight: 300 }}>
      <ProjectCard
        title="Onboarding flow"
        tasks={tasks}
        onTasksChange={setTasks}
        status={status}
        onStatusChange={setStatus}
        due="Oct 24"
        members={[{ name: "Mara Okafor" }, { name: "Jonas Weber" }, { name: "Priya Nair" }]}
        action={{ label: "Open", onClick: () => setOpened((count) => count + 1) }}
        hint={opened ? "Opening the project…" : undefined}
        defaultOpen
      />
    </div>
  );
}
