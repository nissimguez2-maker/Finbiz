import { Shell } from "@/components/layout/Shell";
import { sections } from "@/content/registry";

export default function App() {
  return (
    <Shell>
      {sections.map(({ meta, Component }) => (
        <Component key={meta.id} />
      ))}
    </Shell>
  );
}
