import { KpiChart } from "./kpi-chart";

const labels = ["Mar 3", "Mar 4", "Mar 5", "Mar 6", "Mar 7", "Mar 8", "Mar 9"];
const tooltipLabels = ["Mon, Mar 3", "Tue, Mar 4", "Wed, Mar 5", "Thu, Mar 6", "Fri, Mar 7", "Sat, Mar 8", "Sun, Mar 9"];

// Colours left out on purpose: the chart then uses the A-Team palette, tuned for light and dark.
const series = [
  { label: "Organic", values: [4200, 4700, 3900, 4600, 5400, 5100, 5900] },
  { label: "Paid ads", values: [3600, 3300, 4400, 4800, 4000, 4500, 4200] },
  { label: "Referral", values: [1800, 2300, 2000, 1500, 2400, 2200, 2700] },
  { label: "Email", values: [1200, 1100, 1700, 2100, 1600, 1300, 1500] },
  { label: "Direct", values: [600, 900, 700, 800, 1000, 1400, 1100] },
];

export default function Demo() {
  return (
    <KpiChart
      title="Revenue"
      value="$96.4k"
      delta={7900}
      format={(n) => (Math.abs(n) >= 1000 ? `$${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : `$${Math.round(n)}`)}
      labels={labels}
      tooltipLabels={tooltipLabels}
      series={series}
      footer="Top 5 channels"
    />
  );
}
