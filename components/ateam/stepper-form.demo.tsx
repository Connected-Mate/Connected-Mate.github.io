import {
  StepperChoices,
  StepperField,
  StepperForm,
  StepperInput,
  StepperReview,
  StepperSuccess,
  StepperTags,
  type Step,
  type StepperChoice,
} from "./stepper-form";

type Values = { name: string; slug: string; invites: string[]; plan: string };

const plans: StepperChoice[] = [
  { value: "free", title: "Free", aside: "$0", description: "Up to 3 members and 5 projects" },
  { value: "pro", title: "Pro", badge: "Popular", aside: "$12 / seat", description: "Unlimited projects, guests and history" },
  { value: "business", title: "Business", aside: "$24 / seat", description: "SSO, audit log and priority support" },
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const steps: Step<Values>[] = [
  {
    id: "workspace",
    title: "Workspace",
    heading: "Name your workspace",
    description: "This is where your team's projects live.",
    render: ({ values, setValues }) => (
      <>
        <StepperField name="name" label="Workspace name">
          <StepperInput
            value={values.name}
            autoComplete="organization"
            onChange={(e) => setValues({ name: e.target.value, slug: slugify(e.target.value) })}
          />
        </StepperField>
        <StepperField name="slug" label="Workspace URL" hint="Lowercase letters, numbers and dashes">
          <StepperInput prefix="acme.app/" value={values.slug} onChange={(e) => setValues({ slug: e.target.value })} />
        </StepperField>
      </>
    ),
    validate: (v) => ({
      name: v.name.trim() ? undefined : "Give your workspace a name",
      slug: !v.slug
        ? "Pick an address for your workspace"
        : /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v.slug)
          ? undefined
          : "Use lowercase letters, numbers and single dashes",
    }),
  },
  {
    id: "team",
    title: "Team",
    heading: "Invite your teammates",
    description: "They'll get an email with a link to join.",
    render: ({ values, setValues }) => (
      <StepperField name="invites" label="Email addresses" hint="Press Enter or comma to add" optional>
        <StepperTags value={values.invites} onChange={(invites) => setValues({ invites })} max={20} />
      </StepperField>
    ),
  },
  {
    id: "plan",
    title: "Plan",
    heading: "Pick a plan",
    description: "Every plan starts with a 14-day trial.",
    render: ({ values, setValues }) => (
      <StepperChoices label="Plan" value={values.plan} options={plans} onChange={(plan) => setValues({ plan })} />
    ),
  },
  {
    id: "review",
    title: "Review",
    heading: "Review and create",
    description: "Everything can be changed later in settings.",
    render: ({ values, goTo }) => {
      const plan = plans.find((p) => p.value === values.plan);
      const n = values.invites.length;
      return (
        <StepperReview
          onEdit={goTo}
          rows={[
            { label: "Workspace", value: values.name, detail: `acme.app/${values.slug}`, step: "workspace" },
            {
              label: "Teammates",
              value: n ? `${n} ${n === 1 ? "invite" : "invites"}` : "Just you for now",
              detail: n ? values.invites.join(", ") : undefined,
              step: "team",
            },
            { label: "Plan", value: `${plan?.title} · ${plan?.aside}`, step: "plan" },
          ]}
        />
      );
    },
  },
];

export default function Demo() {
  return (
    <div style={{ width: "100%", maxWidth: 520, minHeight: 470, display: "grid", alignContent: "start" }}>
      <StepperForm<Values>
        steps={steps}
        initialValues={{
          name: "Northwind Studio",
          slug: "northwind-studio",
          invites: ["maya@northwind.studio", "leo@northwind.studio"],
          plan: "pro",
        }}
        submitLabel="Create workspace"
        onComplete={() => new Promise((resolve) => setTimeout(resolve, 1400))}
        success={(values, reset) => {
          const n = values.invites.length;
          return (
            <StepperSuccess
              title={`${values.name} is ready`}
              description={`${n ? `${n} ${n === 1 ? "invite is" : "invites are"} on the way. ` : ""}Your trial runs for 14 days.`}
              actionLabel="Start over"
              onAction={reset}
            />
          );
        }}
      />
    </div>
  );
}
