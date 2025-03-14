// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract blockchain_contract {
    address public admin;
    bool public votingActive;

    struct Candidate {
        string name;
        uint voteCount;
    }

    struct Voter {
        bool registered;
        bool voted;
        uint vote;
    }

    mapping(address => Voter) public voters;
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;

    event CandidateRegistered(uint id, string name);
    event VoterRegistered(address voter);
    event VoteCast(address voter, uint candidateId);
    event VotingStarted();
    event VotingEnded();

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action.");
        _;
    }

    modifier votingOpen() {
        require(votingActive, "Voting is not active.");
        _;
    }

    constructor() {
        admin = msg.sender;
        votingActive = false;

        // Pre-registering sample candidates
        addInitialCandidate("Alice");
        addInitialCandidate("Bob");
        addInitialCandidate("Charlie");
    }

    function addInitialCandidate(string memory _name) internal {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(_name, 0);
        emit CandidateRegistered(candidatesCount, _name);
    }

    function registerVoter(address _voter) public onlyAdmin {
        require(!voters[_voter].registered, "Voter already registered.");
        voters[_voter] = Voter(true, false, 0);
        emit VoterRegistered(_voter);
    }

    function startVoting() public onlyAdmin {
        require(!votingActive, "Voting already started.");
        votingActive = true;
        emit VotingStarted();
    }

    function vote(uint _candidateId) public votingOpen {
        require(voters[msg.sender].registered, "You are not registered to vote.");
        require(!voters[msg.sender].voted, "You have already voted.");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID.");

        voters[msg.sender].voted = true;
        voters[msg.sender].vote = _candidateId;
        candidates[_candidateId].voteCount++;

        emit VoteCast(msg.sender, _candidateId);
    }

    function endVoting() public onlyAdmin {
        require(votingActive, "Voting is not active.");
        votingActive = false;
        emit VotingEnded();
    }

    function getCandidate(uint _candidateId) public view returns (string memory, uint) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID.");
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.name, candidate.voteCount);
    }

    function getVotingStatus() public view returns (bool) {
        return votingActive;
    }
}
