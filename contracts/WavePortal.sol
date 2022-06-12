// SPDX-License-Identifier: gnuplot

pragma solidity ^0.8.0;

import "hardhat/console.sol";

// Struct to save how many waves were done by address
struct Wavers { 
  address addr;
  uint256 amount;
}

struct BlockInfo {
  // uint basefee; // current block’s base
  // uint chainid; // current chain id
  address payable coinbase; // current block miner’s address
  uint difficulty;  // current block difficulty
  uint gaslimit; // current block gaslimit
  uint number; // current block number
  uint256 timestamp; // The timestamp when the user waved.
}

contract WavePortal {
  // event
  event NewWave(address indexed from, uint256 timestamp, string message);
  // save wave message by address and time
  struct Wave {
    address waver; // The address of the user who waved.
    string message; // The message the user sent.
    // BlockInfo blockinfo;
    uint256 timestamp; // The timestamp when the user waved.
  }
  // store an array of Wave
  // hold all the waves anyone ever sends to us
  Wave[] waves;

  Wavers[] waversArr;
  address owner;
  uint256 totalWaves;

  constructor() {
    owner = msg.sender;
    console.log("This is a smart contract, Contract Owner = %s", owner);
  }
  /*
  * Make wave, Emit event that wave happened and save in waves array
  */
  function AddWave(string memory message) public {
    totalWaves +=1;
    console.log("%s has waved!", msg.sender);

    // store the wave data in the array
    // waves.push(Wave(msg.sender, message, BlockInfo(block.coinbase, block.difficulty, block.gaslimit, block.number, block.timestamp)));
    waves.push(Wave(msg.sender, message, block.timestamp));
    waversArr.push(Wavers(msg.sender, 1));
    // emit event that we have New Wave
    emit NewWave(msg.sender, block.timestamp, message);
  }
  /*
  * total waves count.
  */
  function getTotalWavesCount() public view returns(uint256) {
    console.log("Total waves count=%d", totalWaves);
    return totalWaves;
  }
  /*
    * return the struct array, waves, to us.
    */
  function getAllWaves() public view returns (Wave[] memory) {
    return waves;
  }

  function addressThatWavedUs() public view {
    console.log("Following Addresses waved us!");
    for (uint256 index = 0; index < waversArr.length; index++) {
      console.log(waversArr[index].addr, waversArr[index].amount);
    }
  }
}
