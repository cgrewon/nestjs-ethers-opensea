import { Injectable } from '@nestjs/common';

import { ERC1155 } from 'src/contract/abis/ERC1155';
import { ERC721 } from 'src/contract/abis/ERC721';

const { ethers } = require("ethers");


export const ETH_WSS_URL = 
  process.env.NETWORK == 'live' ?
    process.env.PUBLIC_ETH_RPC_WSS_MAIN :
    process.env.PUBLIC_ETH_RPC_WSS_RINKEBY;

export const ETH_RPC_URL = 
  process.env.NETWORK == 'live' ?
    process.env.PUBLIC_ETH_RPC_JSON_MAIN :
    process.env.PUBLIC_ETH_RPC_JSON_RINKEBY;


@Injectable()
export class ContractService {



  _getProviderUrls() {

    const NODE_API_KEY = process.env.INFURA_KEY;
    const isInfura = !!process.env.INFURA_KEY;

    const NETWORK = process.env.NETWORK;
    const network =  NETWORK === 'mainnet' || NETWORK === 'live' ? 'mainnet' : 'rinkeby';
      
    console.log('>>>>>>>  Current Network : ', network);
    let infuraRpcSubproviderRPCUrl = isInfura
      ? 'https://' + network + '.infura.io/v3/' + NODE_API_KEY
      : 'https://eth-' + network + '.alchemyapi.io/v2/' + NODE_API_KEY;

    let infuraSocketProviderURL = 'wss://' + network + '.infura.io/ws/v3/' + NODE_API_KEY;

    // let res = [ETH_RPC_URL, ETH_WSS_URL];
    let res = [infuraRpcSubproviderRPCUrl, infuraSocketProviderURL];
 
    console.log('_getProviderUrls : ', res);
    return res;
  }

  _getProvider = () => {
    const [RPC_URL, WSS_URL] = this._getProviderUrls();
    const ethProvider = new ethers.providers.JsonRpcProvider(RPC_URL);

    return ethProvider;
  }

  _getNftABI(nftSchemaName: string) {
    let nftABI = undefined;
    if (nftSchemaName == 'ERC1155') {
      nftABI = ERC1155;
    } else if (nftSchemaName == 'ERC721') {
      nftABI = ERC721;
    } else {
      console.log(
        'Error unknown contract_schema_name : at _getNftABI: ',
        nftSchemaName,
      );
      
      return undefined;
    }
    return nftABI;
  }


  _getContract = (contractAddr: string, abi: any, privKey: string, withoutSigner: boolean = false) => {

    const [RPC_URL, WSS_URL] = this._getProviderUrls();
    const ethProvider = new ethers.providers.JsonRpcProvider(RPC_URL);

    let contract;
    if (withoutSigner) {
      contract = new ethers.Contract(contractAddr, abi, ethProvider);
    } else {
      const wallet = new ethers.Wallet(privKey, ethProvider);
      contract = new ethers.Contract(contractAddr, abi, wallet);
    }
    return contract;

  }



  async ownerOfNFT(nftContractAddr: string, nftTokenId: string, nftSchemaName: string, _owner: string) {
    console.log('@ownerOfNFT >>>> Checking ownerOfNFT: _agent :', _owner, { nftContractAddr, nftTokenId, _owner, nftSchemaName })
    try {
      

      console.log('ownerOfNFT >  _owner : ', _owner);
      console.log('NFT schema : ', nftSchemaName);
      console.log('NFT contract address : ', nftContractAddr);

      let nftABI = this._getNftABI(nftSchemaName);
      const nftContract = this._getContract(nftContractAddr, nftABI, undefined, true);
      // let sendOption = { from: _owner };

      if (nftSchemaName == 'ERC1155') {
        const res = await nftContract.balanceOf(_owner, nftTokenId);
        console.log('balanceOf >>> ', res.toNumber(), ' for : ', { _owner, nftTokenId });
        return res.toNumber() > 0;
      } else if (nftSchemaName == 'ERC721') {
        const address = await nftContract.ownerOf(nftTokenId);
        console.log('address of nft owner: ', address, { nftTokenId });
        return address.toLowerCase() == _owner.toLowerCase();
      }

      return undefined;
    } catch (ex) {
      console.log('Exception while ownerOfNFT: ', ex);
      return null;
    }
  }





  

}
