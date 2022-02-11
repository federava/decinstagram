import React, { Component } from 'react';
//import Identicon from 'identicon.js';
//import '.App.css';
import Decinstagram from './abis/Decinstagram.json';
import ResponsiveAppBar from './Navbar';
import Main from './Main';
import Box from '@mui/material/Box';

import Web3 from 'web3'

import { ThemeProvider, createTheme } from '@mui/material/styles';


class App extends Component {

  constructor(props) {
    super(props)

    const darkTheme = createTheme({
      palette: {
        mode: 'dark',
        primary: {
          main: '#1976d2',
        },
      },
    });
    
    this.state = {
      account: '',
      decinstagram: null,
      images: [],
      loading: true,
      darkTheme: darkTheme,
    }



  }



  setStateOfParent = (key,value) => {
    this.setState({[key]: value});
  }

  componentDidMount() { // componentWillMount deprecated
    this.loadWeb3();
    this.loadBlockchainData()
  }

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable() // deprecate -> change for something new
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('No ethereum broser detected, install and download Metamask (metamask.io).')
    }

  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.requestAccounts() // tengo que darle permiso desde Metamask
    //console.log(accounts)
    this.setState({ account: accounts[0]})

    const networkId = await web3.eth.net.getId()
    const networkData = Decinstagram.networks[networkId]
    if(networkData) {
      //console.log(networkData.address)
      const decinstagram = new web3.eth.Contract(Decinstagram.abi,networkData.address);
      this.setState({ decinstagram: decinstagram }) // same as { decinstagram: decinstagram}
      
      //console.log(decinstagram.methods)

      const imagesCount = await decinstagram.methods.imageCount().call()
      //console.log(imagesCount)
      this.setState({ imagesCount })

      for(let i = 1; i <= imagesCount; i++) {
        const image = await decinstagram.methods.images(i).call()
        this.setState({
          images: [...this.state.images, image]
        })
      }
      //console.log(this.state.images)
      /*
      this.state.images.map((image, key) => {
        console.log(image._hash,key)
      })
      */
      this.setState({ loading: false })
    } else {
      alert("Smart contract not deployed in the correct network.")
    }
    /*
    // Get the contract instance.
    this.networkId = await this.web3.eth.net.getId();

    this.itemManager = new this.web3.eth.Contract(
      ItemManagerContract.abi,
      ItemManagerContract.networks[this.networkId] && ItemManagerContract.networks[this.networkId].address,
    );
    */

  }

/*
  captureFile = event => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }
*/
/*
  test = event => {
    event.preventDefault()
    alert(
      `Selected file - ${this.fileInput.current.files[0].name}`
    );
  }
*/

  tipImageOwner = (id, tipAmount) => {
    this.setState({ loading: true})
    this.state.decinstagram.methods.tipImageOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
      this.setState({ loading: false})
    })
  }

  render() {
    //console.log(this.captureFile)

    
    return (
      <ThemeProvider theme={this.state.darkTheme}>
        <Box sx={{ bgcolor: 'background.paper', }}>
        <div>
          
          <ResponsiveAppBar account={this.state.account} />
          { this.state.loading
            ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
            :
              <>
                <Main 
                  account = {this.state.account}
                  setStateOfParent = {this.setStateOfParent}
                  decinstagram = {this.state.decinstagram}
                  images = {this.state.images}
                  tipImageOwner = {this.tipImageOwner}
                />
              </>
          }
        </div>
        </Box>
      </ThemeProvider>
    );
  }
}

export default App;

