pragma solidity ^0.8.11;

contract Decinstagram {

    string public name = "Decinstagram";

    // Store images
    uint public imageCount = 0;

    struct Image {
        uint _id;
        string _hash; // location in IPFS
        string _description;
        uint _tipAmount;
        address payable _author;
    }

    event imageCreated(uint id, string hash, string description, uint tipAmount, address payable author);

    mapping(uint => Image) public images;

    function uploadImage(string memory _imgHash, string memory _imgDescription) public {
        require(bytes(_imgHash).length > 0, "cant upload empty hash");
        require(bytes(_imgDescription).length > 0, "cant upload empty description");
        require(msg.sender != address(0x0), "cant upload empty address");

        imageCount++; 
        images[imageCount] = Image(imageCount, _imgHash, _imgDescription, 0, payable(msg.sender));
        emit imageCreated(imageCount, _imgHash, _imgDescription, 0, payable(msg.sender));
    }

    // CREATE AN EVENT AND TEST AL FUNCTION FUNCTIONALITIES

    function tipImageOwner(uint _id) public payable {
        require(_id > 0 && _id <= imageCount, "Id does not exist");
        Image memory _image = images[_id];
        address payable _author = _image._author;
        _author.transfer(msg.value);
        _image._tipAmount += msg.value;
        images[_id] = _image;
    }

}
