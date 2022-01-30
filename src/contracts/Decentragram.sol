pragma solidity ^0.5.0; // 0.5 previously

contract Decentragram {
    string public name = "Decentragram";

    // store images
    uint256 public imageCount = 0;
    mapping(uint256 => Image) public images; // a hashmap of images

    struct Image {
        uint256 id; // positive integer (unsigned)
        string hash;
        string description;
        uint256 tipAmount;
        address payable author;
    }

    // create images
    function uploadImage(string memory _imgHash, string memory _description ) public {

        //increment image count
        imageCount++;

        // add image to contract
        images[imageCount] = Image(imageCount, _imgHash, _description, 0, msg.sender); //id, hash, description, tipAmount, author
    }
    // tip images
}
