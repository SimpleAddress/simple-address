import { ethers } from "ethers";
import SimpleAddressCore from "../abis/SimpleAddressCore.json";
import ContractAddress from "../abis/contract-address.json";  // keeps last deploied address

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(
  ContractAddress.SimpleAddressCore,
  SimpleAddressCore.abi,
  signer
);

export default contract;