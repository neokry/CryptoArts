//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract ArtworkFactory is Initializable, ERC721Upgradeable {
    event ArtworkCreated(uint artworkId, address artist, uint price);
    event ArtworkSold(uint artworkId, address oldOwner, address newOwner, uint price);
    event ArtworkPriceSet(uint artworkId, uint price);

    address payable public platform;
    uint platformFee;

    mapping(uint => uint) public artworkToCurrentPrice;
    mapping(address => uint256) public failedTransferCredits;

    using SafeMath for uint;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    function initialize(string memory name, string memory symbol) public initializer { 
        __ERC721_init(name, symbol);
        platform = msg.sender;
        platformFee = 10;
    }

    function createArtwork(string memory _tokenURI, uint _price) public {
        _tokenIds.increment();
        uint256 artworkId = _tokenIds.current();
        _mint(msg.sender, artworkId);
        _setTokenURI(artworkId, _tokenURI);
        artworkToCurrentPrice[artworkId] = _price;
        emit ArtworkCreated(artworkId, msg.sender, _price);
    }

    function buyArtwork(uint _artworkId) public payable {
        uint currentPrice = artworkToCurrentPrice[_artworkId];
        require(currentPrice > 0, "Artwork not for sale");
        require(msg.value == currentPrice, "Wrong amount sent");
        console.log("passed requirements");

        address payable currentOwner = payable(ownerOf(_artworkId));
        uint platformAmount = msg.value.mul(platformFee).div(100);
        safeFundsTransfer(platform, platformAmount);
        safeFundsTransfer(currentOwner, msg.value.sub(platformAmount));
        console.log("funds transfered");

        console.log("owner", ownerOf(_artworkId), "sender", msg.sender);
        console.log("user approved");

        _transfer(currentOwner, msg.sender, _artworkId);
        console.log("token transfered");

        artworkToCurrentPrice[_artworkId] = 0;

        emit ArtworkSold(_artworkId, currentOwner, msg.sender, currentPrice);
    }

    function setPrice(uint _artworkId, uint _price) public {
        require(msg.sender == ownerOf(_artworkId));
        artworkToCurrentPrice[_artworkId] = _price;
        emit ArtworkPriceSet(_artworkId, _price);
    }

    function getPrice(uint _artworkId) public view returns(uint) {
        return artworkToCurrentPrice[_artworkId];
    }

    // Safely transfer funds and if fail then store that amount as credits for a later pull
    function safeFundsTransfer(address payable recipient, uint256 amount) internal {
        // if it failed, update their credit balance so they can pull it later
        if (recipient.send(amount) == false) {
            failedTransferCredits[recipient] = failedTransferCredits[recipient].add(amount);
        }
    }
}

