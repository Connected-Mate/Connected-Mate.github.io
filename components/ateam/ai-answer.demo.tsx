import { useCallback, useEffect, useRef, useState } from "react";
import { AIAnswer, type AnswerSource } from "./ai-answer";

const sources: AnswerSource[] = [
  {
    name: "Notion",
    title: "Offsite plan – shortlist and budget",
    href: "https://www.notion.so",
    snippet: "Budget €4,500 for three nights, 12 people. Shortlist: Alfama, Baixa, Cascais.",
  },
  {
    name: "Slack",
    title: "#team-offsite – who can make which dates",
    href: "https://slack.com",
    snippet: "Everyone is in for 14–16 May. Jonas: I can only join from Friday.",
  },
  {
    name: "Wikipedia",
    title: "Alfama – the oldest district of Lisbon",
    href: "https://en.wikipedia.org/wiki/Alfama",
    snippet: "A maze of narrow streets between the castle and the river, mostly walkable.",
  },
  {
    name: "Google Flights",
    title: "BER and MUC → LIS, Thursday 14 May",
    href: "https://www.google.com/travel/flights",
    snippet: "Direct flights land at 09:55 (from Berlin) and 10:20 (from Munich).",
  },
  {
    name: "Airbnb",
    title: "Two linked houses in Alfama, sleeps 14",
    href: "https://www.airbnb.com",
    snippet: "€960 a night for both houses. Only the 14–16 May weekend is still open in May.",
  },
  {
    name: "Booking.com",
    title: "Hotels in Baixa for 12 guests",
    href: "https://www.booking.com",
    snippet: "Best match: €1,200 a night for six double rooms, breakfast included.",
  },
];

const answer = `**Alfama** is the best fit for the 12-person offsite: walkable, quiet in the mornings and inside the budget you set [1,3].

- **Dates:** 14–16 May works for everyone, Jonas joins on day two [2].
- **Stay:** two linked houses in Alfama come to €2,880 for three nights, about 20% less than the hotel [5,6].
- **Flights:** direct flights from Berlin and Munich land before 10:30, so day one can start after lunch [4].

Book the houses this week – only one May weekend is still free [5].`;

export default function Demo() {
  const [text, setText] = useState("");
  const [streaming, setStreaming] = useState(true);
  const timer = useRef<number | undefined>(undefined);

  const run = useCallback(() => {
    window.clearTimeout(timer.current);
    setText("");
    setStreaming(true);
    timer.current = window.setTimeout(() => {
      setText(answer);
      setStreaming(false);
    }, 1800);
  }, []);

  useEffect(() => {
    run();
    return () => window.clearTimeout(timer.current);
  }, [run]);

  return (
    <AIAnswer
      question="Where should we hold the team offsite in Lisbon?"
      sources={sources}
      answer={text}
      streaming={streaming}
      followUps={["Compare the houses with the hotel", "Draft a three-day agenda"]}
      onRegenerate={run}
      onStop={() => window.clearTimeout(timer.current)}
    />
  );
}
