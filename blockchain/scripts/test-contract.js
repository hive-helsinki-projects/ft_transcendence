// scripts/test-contract.js

const { expect } = require("chai");
const { ethers } = require("hardhat");
require("@nomicfoundation/hardhat-ethers");
// get substrac


async function main() {
	// Create a provider for Fuji using your environment variable
	const provider = new ethers.JsonRpcProvider(process.env.AVAX_RPC_URL);

	// Create a Wallet (signer) using your private key and the provider
	const wallet = new ethers.Wallet(process.env.AVAX_PRIVATE_KEY, provider);

	// Your deployed contract address on Fuji
	const contractAddress = "0x50FBdC4200b9f358225D5f2f9e1bB5972116F35c";

	// Minimal ABI for TournamentScores - include the functions you need
	const abi = [
	  "function recordTournament(uint256 _tournamentId, bytes32[] calldata _players, bytes32 calldata _winner) external",
	  "function getScores() view external returns (tuple(uint256 tournamentId, bytes32[] players, bytes32 winner, uint256 timestamp)[])"
	];

	// Attach to the deployed contract using its address, ABI, and your signer
	const tournamentContract = new ethers.Contract(contractAddress, abi, wallet);

	// --- Test Data ---
	// Tournament 1: Two players ("Alice" and "Bob")
	const tournamentId1 = 1;
	const alice = ethers.encodeBytes32String("Valle");
	const bob   = ethers.encodeBytes32String("Miyuki");
	const players1 = [alice, bob];
	const winner1 = alice;

	// Record Tournament 1
	console.log("Recording Tournament 1 on Fuji...");
	const balanceBefore = await wallet.provider.getBalance(wallet.address);
	console.log("Balance before transaction:", ethers.formatEther(balanceBefore), "AVAX");
	const tx1 = await tournamentContract.recordTournament(tournamentId1, players1, winner1);
	await tx1.wait();
	console.log("Tournament 1 recorded!");
	const balanceAfter = await wallet.provider.getBalance(wallet.address);
	console.log("Balance after transaction:", ethers.formatEther(balanceAfter), "AVAX");

	// Retrieve scores from the contract
	console.log("Fetching scores from the contract...");
	const scores = await tournamentContract.getScores();
	console.log("Raw scores:", scores);

	// Decode the stored bytes32 values back to strings
	const decodedScores = scores.map((score) => {
	  return {
		tournamentId: score.tournamentId.toString(),
		winner: ethers.decodeBytes32String(score.winner),
		players: score.players.map((p) => ethers.decodeBytes32String(p)),
		timestamp: score.timestamp.toString()
	  };
	});

	console.log("Decoded Scores:", decodedScores);
  }

  main()
	.then(() => process.exit(0))
	.catch((error) => {
	  console.error("Error in test script:", error);
	  process.exit(1);
	});
