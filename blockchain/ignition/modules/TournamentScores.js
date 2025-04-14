const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TournamentScoresModule", (m) => {
  const tournamentScores = m.contract("TournamentScores");

  return { tournamentScores };
});