

// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

// we need type converson for player names before saving them in chain
// const bytesName = ethers.encodeBytes32String("jack");
// and back to string
// const name = ethers.decodeBytes32String(bytesName);


contract TournamentScores {
    address public owner;

    struct Score {
        uint256 tournamentId;
        bytes32[] players;
        bytes32 winner;
        uint256 timestamp;
    }

    Score[] public scores;

    event scoreRecorded(uint256 tournamentId, bytes32[] players, bytes32 winner, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    modifier playerCount(bytes32[] memory _players) {
        require(_players.length >= 2, "At least 2 players are required");
        _;
    }

    function recordTournament(uint256 _tournamentId, bytes32[] calldata _players, bytes32 _winner) public playerCount(_players) {
        require(msg.sender == owner, "Only owner can record tournament");

        Score memory score = Score({
            tournamentId: _tournamentId,
            players: _players,
            winner: _winner,
            timestamp: block.timestamp
        });
        scores.push(score);
        emit scoreRecorded(_tournamentId, _players, _winner, block.timestamp);
    }

    function getScores() public view returns (Score[] memory) {
        return scores;
    }
}

// test arguments: ["2", ["player1", "player2", "player3", "player4"], "player3", 1620000000]
