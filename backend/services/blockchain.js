
import "dotenv/config";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x50FBdC4200b9f358225D5f2f9e1bB5972116F35c";

// Minimal ABI for TournamentScores
const CONTRACT_ABI = [
  "function recordTournament(uint256 _tournamentId, bytes32[] calldata _players, bytes32 calldata _winner) external",
  "function getScores() view external returns (tuple(uint256 tournamentId, bytes32[] players, bytes32 winner, uint256 timestamp)[])"
];

// Helper function to get provider and signer.
function getProviderAndSigner() {
    const url = process.env.AVAX_RPC_URL;
    const pk  = process.env.AVAX_PRIVATE_KEY;
    if (!url || !pk) {
      throw new Error("Both AVAX_RPC_URL and AVAX_PRIVATE_KEY must be set in .env");
    }
    const provider = new ethers.JsonRpcProvider(url);
    const signer   = new ethers.Wallet(pk, provider);
    return { provider, signer };
  }

// Returns an instance of your contract connected to the signer.
function connectContract() {
    const { signer } = getProviderAndSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

export async function recordTournament(tournamentId, players, winner) {
    const playersBytes = players.map(name => ethers.encodeBytes32String(name));
    const winnerBytes  = ethers.encodeBytes32String(winner);

    const contract = connectContract();
    const tx = await contract.recordTournament(tournamentId, playersBytes, winnerBytes);
    await tx.wait(); // Wait for the transaction to be mined
    return tx;
}

/*
* @brief Fetches tournament scores from the smart contract.
* @returns {Promise<TournamentScore[]>} - A promise that resolves to an array of tournament scores.
* Each score contains the tournament ID, players, winner, and timestamp.
* @throws {Error} - Throws an error if the Ethereum provider is not found or if the transaction fails.
* @example
* const scores = await getScores();
* console.log(scores);
* // Output: [
* //   { tournamentId: 1, players: ['Alice', 'Bob'], winner: 'Alice', timestamp: 1633072800 },
* //   { tournamentId: 2, players: ['Charlie', 'Dave'], winner: 'Charlie', timestamp: 1633076400 }
* // ]
*/
export async function getScores() {
    const contract = connectContract();
    const raw      = await contract.getScores();

    // Decode into plain JS objects
    return raw.map(score => ({
      tournamentId: Number(score.tournamentId.toString()),
      players:      score.players.map(p => ethers.decodeBytes32String(p)),
      winner:       ethers.decodeBytes32String(score.winner),
      timestamp:    Number(score.timestamp.toString()),
    }));
}
