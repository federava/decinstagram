const Decinstagram = artifacts.require("./Decinstagram.sol");

contract("Decinstagram", accounts => {
    it("...should be deployed", async () => {
        const decinstagramInstance = await Decinstagram.deployed();
        const address = await decinstagramInstance.address;
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    it("...should have a name", async () => {
        const decinstagramInstance = await Decinstagram.deployed();
        const name = await decinstagramInstance.name();
        assert.notEqual(name, '')
        assert.notEqual(name, null)
        assert.notEqual(name, undefined)
        assert.equal(name, 'Decinstagram')
    })

    it("...upload 1 image", async () => {
        const decinstagramInstance = await Decinstagram.deployed();
        const tx = await decinstagramInstance.uploadImage('hash123','description123');
        const imagen = await decinstagramInstance.images(1);
        //console.log(tx)

        // do it with the dynamic function
        assert.equal(imagen[0], 1, 'Wrong id')
        assert.equal(imagen[1], 'hash123', 'Wrong hash')
        assert.equal(imagen[2], 'description123', 'Wrong description')
        assert.equal(imagen[3], 0, 'Wrong tip value')
        assert.equal(imagen[4], accounts[0], 'Wrong author account')

        // also with event
        const evtArgs = await tx.logs[0].args
        assert.equal(evtArgs.id, 1, 'Wrong id')
        assert.equal(evtArgs.hash, 'hash123', 'Wrong hash')
        assert.equal(evtArgs.description, 'description123', 'Wrong description')
        assert.equal(evtArgs.tipAmount, 0, 'Wrong tip value')
        assert.equal(evtArgs.author, accounts[0], 'Wrong author account')
        //console.log(evtArgs)

        // test the requires
        try {
            const tx1 = await decinstagramInstance.uploadImage('','description123',{from: accounts[0]})

        } catch (err) {
            //console.log(err.message)
            assert(err.message.indexOf('empty hash') >= 0)
        }

        try {
            const tx2 = await decinstagramInstance.uploadImage('hash123','',{from: accounts[0]})

        } catch (err2) {
            //console.log(err2.message)
            assert(err2.message.indexOf('empty description') >= 0)
        }

        try {
            const tx3 = await decinstagramInstance.uploadImage('hash123','description123',{from: address(0x0)})

        } catch (err3) {
            console.log(err3.message)
            assert(err3.message.indexOf('empty address') >= 0, 'falla papa')
        }

    })    
})