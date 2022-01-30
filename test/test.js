const { assert, AssertionError } = require("chai");
const { default: Web3 } = require("web3");

const Decentragram = artifacts.require("./Decentragram.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("Decentragram", ([deployer, author, tipper]) => {
  let decentragram;

  before(async () => {
    decentragram = await Decentragram.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await decentragram.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await decentragram.name();
      assert.equal(name, "Decentragram");
    });
  });

  describe("images", async () => {
    let result, imageCount;
    const hash = "abc123";

    before(async () => {
      result = await decentragram.uploadImage(hash, "Image description", {
        from: author,
      });
      imageCount = await decentragram.imageCount();
    });

    it("creates images", async () => {
      //SUCCESS
      assert.equal(imageCount, 1);
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), imageCount.toNumber(), "id is correct");
      assert.equal(event.hash, hash, "hash is correct");
      assert.equal(
        event.description,
        "Image description",
        "description is correct"
      );
      assert.equal(event.tipAmount, "0", "tipamount correct");
      assert.equal(event.author, author, "author is correct");

      // FAILURE : image must have hash
      await decentragram.uploadImage("", "Image description", { from: author })
        .should.be.rejected;

      // FAILURE : image must have hash
      await decentragram.uploadImage("Image hash", "", { from: author }).should
        .be.rejected;
    });

    //check from struct
    it("lists images", async () => {
      const image = await decentragram.images(imageCount);
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), imageCount.toNumber(), "id is correct");
      assert.equal(event.hash, hash, "hash is correct");
      assert.equal(
        event.description,
        "Image description",
        "description is correct"
      );
      assert.equal(event.tipAmount, "0", "tipamount correct");
      assert.equal(event.author, author, "author is correct");
    });

    it("allows users to tip images", async () => {
      //track the author balance bfore purchase

      let oldAuthorBalance;
      oldAuthorBalance = await Web3.eth.getBalance(author);
      oldAuthorBalance = new Web3.utils.BN(oldAuthorBalance);

      result = await decentragram.tipImageOwner(imageCount, {
        from: tipper,
        value: web3.utils.toWei("1", "Ether"), // converts
      });

      // success
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(),  imageCount.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.description, 'Image description', 'description is correct')
      assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
      assert.equal(event.author, author, 'author is correct')

      // Check that author received funds
      let newAuthorBalance
      newAuthorBalance = await web3.eth.getBalance(author)
      newAuthorBalance = new web3.utils.BN(newAuthorBalance)

      let tipImageOwner
      tipImageOwner = web3.utils.toWei('1', 'Ether')
      tipImageOwner = new web3.utils.BN(tipImageOwner)

      const expectedBalance = oldAuthorBalance.add(tipImageOwner)

      assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

      // FAILURE: Tries to tip a image that does not exist
      await decentragram.tipImageOwner(99, { from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;

    });
  });
});
