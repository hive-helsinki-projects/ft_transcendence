// scripts/test-contract.js
import "dotenv/config";
import { recordTournament, getScores } from "./blockchain.js";

async function main() {
  const id      = 1;
  const players = ["Valle", "Kim", "Oliver", "Miyuki", "Lumi"];
  const winner  = "Valle";

  console.log("⏳ recording…");
  const tx = await recordTournament(id, players, winner);
  console.log("✔ tx hash:", tx.hash);

  console.log("⏳ fetching…");
  const data = await getScores();
  console.log("📝 data:", data);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
