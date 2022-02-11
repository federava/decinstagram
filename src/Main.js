//import { FormControl } from '@mui/material';
import React, { Component } from 'react';
import { create } from 'ipfs-http-client'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


// import for the image list
//import ImageList from '@mui/material/ImageList';
//import ImageListItem from '@mui/material/ImageListItem';
//import ImageListItemBar from '@mui/material/ImageListItemBar';

const client = create('https://ipfs.infura.io:5001/api/v0')
//console.log(client)

/*
const ipfsClient = require('ipfs-http-client')
console.log(ipfsClient)
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'})
*/
class Main extends Component {
    
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.fileInput = React.createRef();
      }

    // Buffer image and prepare it for ipfs
    handleChange(event) {

        //console.log("handleChange")
        //console.log(event)
        //console.log(this.fileInput.current.files[0])
        const file = this.fileInput.current.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        
        reader.onloadend = () => {
          this.setState({ buffer: Buffer(reader.result) })
          //console.log('buffer', this.state.buffer)
          console.log('buffer ready')
        }
    }

    // Upload image
    async handleSubmit(event) {
        const description = event.target[1].value
        console.log(description)
        event.preventDefault();
        alert(`description: ${description}`);
        

        //if(this.state.buffer) {
            //console.log('buffer', this.state.buffer)
         
        try {
            console.log("Submitting file to IPFS...")
            //console.log(client)
            const added = await client.add(this.state.buffer)
            //const url = `https://ipfs.infura.io/ipfs/${added.path}`
            //console.log(added)
            //console.log(url)
            //console.log("Beautiful")
            //this.setState({ ipfsPath: added.path })

            this.props.setStateOfParent('loading',true)
            

            console.log(this.props)
            console.log(this.props.decinstagram)
            
            this.props.decinstagram.methods.uploadImage(added.path, description).send({from: this.props.account}).on('transactionHash', (hash) => {
                this.props.setStateOfParent('loading',false)
            })
            
        
        } catch (error) {
            console.log('Error uploading file: ', error)
        }

    }

    render() {

        return (
            <React.Fragment>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3  }}>
                    <p>&nbsp;</p>
                    <Box>
                        <form onSubmit={this.handleSubmit}>
                            <input type="file" accept=".jpg, .jpeg, .png, .bmp, .gif" ref={this.fileInput} onChange={this.handleChange}></input>
                            <input type="text"></input>
                            <input type="submit" value="Submit"></input>
                        </form>
                        </Box>
                    <p>&nbsp;</p>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column'  }}>

                    {this.props.images.map( (image) => {
                            return (
                                <Box sx={{ alignSelf: 'center', width: 350  }} key={image._id}>
                                    <img
                                        src={`https://ipfs.infura.io/ipfs/${image._hash}?w=248&fit=crop&auto=format`}
                                        srcSet={`https://ipfs.infura.io/ipfs/${image._hash}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                        alt={image._description}
                                        loading="lazy"
                                        width="350px"
                                    />
                                    <Box sx={{ alignSelf: 'center', mb: 4, p: 1, color: 'white'  }}
                                        title={image._description}
                                        subtitle={<span>by: {image._author}</span>}
                                        position="below"
                                    >   
                                        <Typography variant="caption" component="div">
                                            Comment: {image._description} <br></br>
                                        </Typography>
                                        <Typography variant="caption" component="div">
                                            Author: {image._author} 
                                        </Typography>
                                        <Typography variant="caption" component="div">
                                            Tips: {window.web3.utils.fromWei(image._tipAmount.toString(), 'Ether')} 
                                        </Typography>
                                        <button
                                            name = {image._id}
                                            onClick={(event) => {
                                                let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                                                console.log(this.props.tipImageOwner)
                                                this.props.tipImageOwner(event.target.name, tipAmount)
                                            }}
                                        >
                                            Tip author 0,1 ETH
                                        </button>
                                    </Box>
                                </Box>
                                
                            )}
                        )}

                </Box>
            </React.Fragment>
        );
    }
}


export default Main;