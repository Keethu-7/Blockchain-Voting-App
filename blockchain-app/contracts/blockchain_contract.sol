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
        string name;
        string dob;
        string email;
        string mobileNumber;
        string username;
        bytes32 passwordHash;
    }

    mapping(address => Voter) public voters;
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;
    
    address[] public voterAddresses; // Stores all registered voter addresses

    event CandidateRegistered(uint id, string name);
    event VoterRegistered(address voter, string username);
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

    function registerAsVoter(
        string memory _name,
        string memory _dob,
        string memory _email,
        string memory _mobileNumber,
        string memory _username,
        string memory _password
    ) public {
        require(!voters[msg.sender].registered, "Voter already registered.");
        bytes32 passwordHash = keccak256(abi.encodePacked(_password));

        voters[msg.sender] = Voter(true, false, 0, _name, _dob, _email, _mobileNumber, _username, passwordHash);
        voterAddresses.push(msg.sender); // Store the voter's address

        emit VoterRegistered(msg.sender, _username);
    }

    function authenticateVoter(string memory _username, string memory _password) public view returns (bool) {
        require(voters[msg.sender].registered, "You are not registered to vote.");
        require(keccak256(abi.encodePacked(voters[msg.sender].username)) == keccak256(abi.encodePacked(_username)), "Invalid username.");
        return voters[msg.sender].passwordHash == keccak256(abi.encodePacked(_password));
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

    // ✅ **New Function**: Returns a list of registered voter usernames
    function getRegisteredVoters() public view onlyAdmin returns (string[] memory) {
        string[] memory usernames = new string[](voterAddresses.length);
        for (uint i = 0; i < voterAddresses.length; i++) {
            usernames[i] = voters[voterAddresses[i]].username;
        }
        return usernames;
    }
}
