
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TournamentScores", function () {
  let tournamentScores;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners(); // assign to outer variables
    tournamentScores = await ethers.deployContract("TournamentScores");
    // Check that the owner is set correctly
    expect(await tournamentScores.owner()).to.equal(owner.address);
  });

  it("should record a tournament", async function () {
    const tournamentId = 1;
    const alice = ethers.encodeBytes32String("Alice");
    const bob = ethers.encodeBytes32String("Bob");
    const players = [alice, bob];
    const winner = alice;

    const tounamentId2 = 2;
    const frank = ethers.encodeBytes32String("Frank");
    const george = ethers.encodeBytes32String("George");
    const harry = ethers.encodeBytes32String("Harry");
    const essi = ethers.encodeBytes32String("Essi");
    const players2 = [frank, george, harry, essi];
    const winner2 = essi;
    
    // Record the tournament (using block.timestamp automatically)
    await tournamentScores.recordTournament(tournamentId, players, winner);
    await tournamentScores.recordTournament(tounamentId2, players2, winner2);

    const scores = await tournamentScores.getScores();
    expect(scores.length).to.equal(2);
    expect(scores[0].tournamentId).to.equal(tournamentId);
    expect(scores[0].winner).to.equal(winner);
    expect(scores[0].players).to.eql(players);
    expect(scores[1].tournamentId).to.equal(tounamentId2);
    expect(scores[1].winner).to.equal(winner2);
    expect(scores[1].players).to.eql(players2);

    // convert bytes32 to string
    const tournamentWinner1 = ethers.decodeBytes32String(scores[0].winner);
    const tournamentWinner2 = ethers.decodeBytes32String(scores[1].winner);
    const tournamentPlayers1 = scores[0].players.map((player) => ethers.decodeBytes32String(player));
    const tournamentPlayers2 = scores[1].players.map((player) => ethers.decodeBytes32String(player));
    console.log("Tournament 1:");
    console.log("Tournament ID:", scores[0].tournamentId);
    console.log("Winner:", tournamentWinner1);
    console.log("Players:", tournamentPlayers1);
    console.log("Tournament 2:");
    console.log("Tournament ID:", scores[1].tournamentId);
    console.log("Winner:", tournamentWinner2);
    console.log("Players:", tournamentPlayers2);


    console.log("Scores:");
    console.log(scores);
  });

  // Add more tests as needed
});