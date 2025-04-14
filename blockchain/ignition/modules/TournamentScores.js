const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TournamentScoresModule", (m) => {
  // Deploy your TournamentScores contract; no constructor parameters needed
  const tournamentScores = m.contract("TournamentScores");
  return { tournamentScores };
});
