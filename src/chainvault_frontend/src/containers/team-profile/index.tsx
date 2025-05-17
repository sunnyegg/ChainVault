import { Section } from "../../components/Section";
import { contentSchema } from "./schema/schema";

export const TeamProfile = () => {
  return (
    <div className="bg-gray-50 relative">
      <Contents />
    </div>
  );
};

const Contents = () => {
  return contentSchema.map(({ id, title, showTitle = true, children, styles, hasBgSVG }, idx) => (
    <Section key={idx} id={id} title={showTitle ? title : undefined} className={styles} hasBgSVG={hasBgSVG}>
      {children}
    </Section>
  ));
};