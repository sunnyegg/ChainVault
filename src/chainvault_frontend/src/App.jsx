import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TeamProfile } from "./containers/team-profile";
import { ChainVault } from "./containers/chain-vault";
import { Registration } from "./components/Registration";

export default function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<TeamProfile />} />
          <Route path="/app" element={<ChainVault />} />
          <Route path="/login" element={<Registration />} />
        </Routes>
      </Router>
  );
}