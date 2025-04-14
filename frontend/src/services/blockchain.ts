// src/services/blockchain.ts
import { ethers } from "ethers";

// Define a type for tournament scores as returned from your contract
export interface TournamentScore {
  tournamentId: number;
  players: string[];
  winner: string;
  timestamp: number;
}

const CONTRACT_ADDRESS = "0x50FBdC4200b9f358225D5f2f9e1bB5972116F35c";

// Minimal ABI for TournamentScores
const CONTRACT_ABI = [
  "function recordTournament(uint256 _tournamentId, bytes32[] calldata _players, bytes32 calldata _winner) external",
  "function getScores() view external returns (tuple(uint256 tournamentId, bytes32[] players, bytes32 winner, uint256 timestamp)[])"
];

// Helper function to get provider and signer using MetaMask's injected provider.
const getProviderAndSigner = (): { provider: ethers.BrowserProvider; signer: ethers.JsonRpcSigner } => {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    // Use ethers v6 BrowserProvider (for MetaMask)
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = provider.getSigner();
    return { provider, signer };
  }
  throw new Error("No Ethereum provider found. Please install MetaMask.");
};

// Returns an instance of your contract connected to the signer.
export const connectContract = (): ethers.Contract => {
  const { signer } = getProviderAndSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  return contract;
};

export const recordTournament = async (
  tournamentId: number,
  players: string[],
  winner: string
): Promise<ethers.ContractTransaction> => {
  // Convert strings to bytes32 using ethers.encodeBytes32String (v6)
  const playersBytes = players.map(name => ethers.encodeBytes32String(name));
  const winnerBytes = ethers.encodeBytes32String(winner);

  const contract = connectContract();
  const tx = await contract.recordTournament(tournamentId, playersBytes, winnerBytes);
  await tx.wait(); // Wait for the transaction to be mined
  return tx;
};

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
export const getScores = async (): Promise<TournamentScore[]> => {
  const contract = connectContract();
  const scores = await contract.getScores();

  // Map over the returned tuple array and convert BigNumbers and bytes32 values.
  const decodedScores: TournamentScore[] = scores.map((score: any) => ({
    tournamentId: Number(score.tournamentId.toString()),
    // Decode each player's name
    players: score.players.map((p: string) => ethers.decodeBytes32String(p)),
    winner: ethers.decodeBytes32String(score.winner),
    timestamp: Number(score.timestamp.toString()),
  }));

  return decodedScores;
};
