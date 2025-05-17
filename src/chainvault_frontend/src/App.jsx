import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TeamProfile } from "./containers/team-profile";
import { ChainVault } from "./containers/chain-vault";

export default function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<TeamProfile />} />
          <Route path="/app" element={<ChainVault />} />
        </Routes>
      </main>
    </Router>
  );
}