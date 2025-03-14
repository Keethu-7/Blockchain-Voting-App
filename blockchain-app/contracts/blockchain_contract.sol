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
        uint voterId;
        bytes32 passwordHash;  //securely store password as a hash
    }

    mapping(address => Voter) public voters;
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;

    event CandidateRegistered(uint id, string name);
    event VoterRegistered(address voter, uint voterId);
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

   
    function registerVoter(address _voter, uint _voterId, string memory _password) public onlyAdmin {
        require(!voters[_voter].registered, "Voter already registered.");

        //store password as a hash for security
        bytes32 passwordHash = keccak256(abi.encodePacked(_password));

        voters[_voter] = Voter(true, false, 0, _voterId, passwordHash);
        emit VoterRegistered(_voter, _voterId);
    }
     function registerAsVoter(uint _voterId, string memory _password) public {
        require(!voters[msg.sender].registered, "Voter already registered.");
        bytes32 passwordHash = keccak256(abi.encodePacked(_password));
        voters[msg.sender] = Voter(true, false, 0, _voterId, passwordHash);
        emit VoterRegistered(msg.sender, _voterId);
    }
    function authenticateVoter(uint _voterId, string memory _password) public view returns (bool) {
        require(voters[msg.sender].registered, "You are not registered to vote.");
        require(voters[msg.sender].voterId == _voterId, "Invalid voter ID.");
        return voters[msg.sender].passwordHash == keccak256(abi.encodePacked(_password));
    }


    function startVoting() public onlyAdmin {
        require(!votingActive, "Voting already started.");
        votingActive = true;
        emit VotingStarted();
    }
    

    function vote(uint _candidateId, uint _voterId, string memory _password) public votingOpen {
        require(voters[msg.sender].registered, "You are not registered to vote.");
        require(!voters[msg.sender].voted, "You have already voted.");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID.");
        require(voters[msg.sender].voterId == _voterId, "Incorrect Voter ID.");

        //verify password
        bytes32 passwordHash = keccak256(abi.encodePacked(_password));
        require(voters[msg.sender].passwordHash == passwordHash, "Incorrect password!");

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
