//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ArtworkFactory is ERC721 {
    event ArtworkCreated(uint artworkId, address artist);
    event ArtworkSold(uint artworkId, address oldOwner, address newOwner);

    using SafeMath for uint;

    address public owner;
    mapping(uint => uint) public artworkToCurrentPrice;
    uint platformFee = 10;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) { 
        owner = msg.sender;
    }

    function createArtwork(string memory _tokenURI, uint _price) public returns (uint) {
        console.log("Attempting to create artwork");
        _tokenIds.increment();
        uint256 artworkId = _tokenIds.current();
        _mint(msg.sender, artworkId);
        _setTokenURI(artworkId, _tokenURI);
        artworkToCurrentPrice[artworkId] = _price;
        console.log("Artwork created with id", artworkId);

        emit ArtworkCreated(artworkId, msg.sender);
    }

    function buyArtwork(uint _artworkId) public payable {
        require(msg.value == artworkToCurrentPrice[_artworkId], "Wrong amount sent");
        address payable currentOwner = payable(ownerOf(_artworkId));
        super.transferFrom(currentOwner, msg.sender, _artworkId);
        currentOwner.transfer(msg.value.mul(100 - platformFee).div(100));

        emit ArtworkSold(_artworkId, currentOwner, msg.sender);
    }
}

