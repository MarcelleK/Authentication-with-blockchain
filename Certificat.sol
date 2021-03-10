pragma solidity ^0.6.12;

// Contrat intelligent pour la certification de diplômes sur un registre distribué
// Projet Fin d'Etude (PFE) ESME SUDRIA Paris Sud Ivry A3 2021
// Adjoua Paul Marcelle Kassi - Sonia Somaya - Lilian Bordeau

// SPDX-License-Identifier: GPL-3.0

contract CertificateRegistry {
    address [] public registeredCertificates;
    event CertificateCreated(address certificateAddress);

    function createMarriage(string memory _nom, string memory _prenom, string memory _date_de_naissance, string memory _diplome, uint _annee_obtention) public {
        address newCertificate = address(new Certificate(msg.sender, _nom, _prenom, _date_de_naissance, _diplome, _annee_obtention));
        emit CertificateCreated(newCertificate);
        registeredCertificates.push(newCertificate);
    }

    function getDeployedCertificates() public view returns (address[] memory) {
        return registeredCertificates;
    }
}

/**
 * @title Certificate
 * @dev The certificate provides basic storage for name, diploma and year of graduation
 */
contract Certificate {

    //event graduationBells(address ringer, uint256 count);

    // Owner address
    address public owner;

    /// Certificate details
    string public nom;
    string public prenom;
    string public date_de_naissance;
    string public diplome;
    uint public annee_obtention;

    // Bell counter
    uint256 public bellCounter;

    /**
    * @dev Throws if called by any account other than the owner
    */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
    * @dev Constructor sets the original `owner` of the certificate to the sender account, and
    * commits the certificate details to the blockchain
    */
    constructor(address _owner, string memory _nom, string memory _prenom, string memory _date_de_naissance, string memory _diplome, uint _annee_obtention) public {
        // TODO: Assert statements for year, month, day
        owner = _owner;
        nom = _nom;
        prenom = _prenom;
        date_de_naissance = _date_de_naissance;
        diplome = _diplome;
        annee_obtention = _annee_obtention;
    }

    /**
    * @dev Adds two numbers, throws on overflow.
    */
    function add(uint256 a, uint256 b) private pure returns (uint256 c) {
        c = a + b;
        assert(c >= a);
        return c;
    }

    /**
    * @dev ringBells is a payable function that allows people to celebrate the graduation, and
    * also send Ether to the diploma certificate

    function ringBell() public payable {
        bellCounter = add(1, bellCounter);
        emit graduationBells(msg.sender, bellCounter);
    }
    */

    /**
    * @dev withdraw allows the owner of the certificate to withdraw all ether collected by bell ringers

    function collect() external onlyOwner {
        owner.transfer(address(this).balance);
    }
    */

    /**
    * @dev withdraw allows the owner of the certificate to withdraw all ether collected by bell ringers
    */
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    /**
    * @dev returns contract metadata in one function call, rather than separate .call()s
    * Not sure if this works yet
    */
    function getCertificateDetails() public view returns (
        address, string memory, string memory, string memory, string memory, uint, uint256) {
        return (
            owner,
            nom,
            prenom,
            date_de_naissance,
            diplome,
            annee_obtention,
            bellCounter
        );
    }
}
