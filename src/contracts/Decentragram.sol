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

    event ImageCreated(
        uint256 id,
        string hash,
        string description,
        uint256 tipAmount,
        address payable author
    );

    event ImageTipped(
       uint256 id,
        string hash,
        string description,
        uint256 tipAmount,
        address payable author
    );

    // create images
    function uploadImage(string memory _imgHash, string memory _description)
        public
    {
        // image description exists
        require(bytes(_description).length > 0); // only if description is there, run the below code ,its just a if statement

        // image exists
        require(bytes(_imgHash).length > 0);

        // uploader address exists
        require(msg.sender != address(0x0));

        //increment image count
        imageCount++;

        // add image to contract
        images[imageCount] = Image(
            imageCount,
            _imgHash,
            _description,
            0,
            msg.sender
        ); //id, hash, description, tipAmount, author

        emit ImageCreated(imageCount, _imgHash, _description, 0, msg.sender);
    }

    // tip images
    function tipImageOwner(uint256 _id) public payable {

      // valid image id
      require(_id >0 && id <= imageCount);


        // fetch the image
        Image memory _image = images[_id];

        // fetch the author
        address payable _author = _image.author;

        // pay the author by sending them ether
        address(_author).transfer(msg.value);

        // increment the tip amount
        _image.tipAmount = _image.tipAmount + msg.value;

        //update the image
        image[_id] = image;

        //triger the event;
        emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);
    }
}
