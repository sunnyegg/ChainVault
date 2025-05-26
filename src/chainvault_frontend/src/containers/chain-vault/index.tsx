import { Header } from "../../components/Header";
import { Navbar } from "../../components/Navbar";
import { Files } from "./files";
import { useState } from "react";
import { Card } from "@tixia/design-system";

export function ChainVault() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <Header />
      <Navbar expanded={expanded} setExpanded={setExpanded} />
      <div
        className={`mt-16 transition-all duration-200 px-4 md:px-8 ${
          expanded ? "md:ml-56" : "md:ml-16"
        }`}
      >
        <Card
          variant="ghost"
          className="flex flex-col gap-4 mx-auto w-full max-w-7xl"
        >
          <Files />
        </Card>
      </div>
    </div>
  );
}
