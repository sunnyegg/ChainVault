import { useEffect, useState } from "react";
import { chainvault_backend } from "declarations/chainvault_backend";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await chainvault_backend.getAll();
      setData(result);
    }
    fetchData();
  });

  return (
    <main>
      <section>{JSON.stringify(data)}</section>
    </main>
  );
}

export default App;
