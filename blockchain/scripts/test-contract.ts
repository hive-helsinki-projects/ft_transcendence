// scripts/test-contract.js
import { recordTournament, getScores } from "./blockchain";

async function main() {
  const id      = 1;
  const players = ["Valle", "Kim", "Oliver", "Miyuki", "Lumi"];
  const winner  = "Valle";

  console.log("⏳ recording…");
  const tx = await recordTournament(id, players, winner);
  console.log("✔ tx hash:", tx);

  console.log("⏳ fetching…");
  const data = await getScores();
  console.log("📝 data:", data);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});