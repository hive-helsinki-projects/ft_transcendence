
## Launch smartcontract
- Make sure to include privateKey in .env file
  
```npx hardhat ignition deploy ignition/modules/TournamentScoresV3.js --network fuji```

- After deployment add ``contract address`` to .env file

## Call functions from deployed smart contract

- Example how to call functions using our **SDK functions**

````
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
````

- Returns json from tx and scores:
````
✔ tx hash: ContractTransactionResponse {
  provider: JsonRpcProvider {},
  blockNumber: null,
  blockHash: null,
  index: undefined,
  hash: '0x069e03b2b23fd9f15299162d48046ebd2717a4a83c1703e9da952564d2f24164',
  etc...

📝 data: [
  {
    tournamentId: 1,
    players: [ 'Alice', 'Bob', 'Charlie' ],
    winner: 'Alice',
    timestamp: 1745247770
  },
  {
    tournamentId: 1,
    players: [ 'Valle', 'Kim', 'Oliver', 'Miyuki', 'Lumi' ],
    winner: 'Lumi',
    timestamp: 1745247825
  },
  {
    tournamentId: 1,
    players: [ 'Valle', 'Kim', 'Oliver', 'Miyuki', 'Lumi' ],
    winner: 'Valle',
    timestamp: 1745247992
  }
]
````
