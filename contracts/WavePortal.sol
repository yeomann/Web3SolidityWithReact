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
  // help generate a random number
  uint256 private seed;
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
  // give user 0.0001 ETH i.e $0.31 who waves at us
  uint256 prizeMoneyForWaver = 0.0001 ether;
  /*
  * This is an address => uint mapping, meaning I can associate an address with a number!
  * In this case, I'll be storing the address with the last time the user waved at us.
  */
  mapping(address => uint256) public lastWavedAt;
  
  constructor() payable {
    owner = msg.sender;
    console.log("This is a smart contract, Contract Owner = %s", owner);
    /*
    * Set the initial seed
    */
    seed = (block.timestamp + block.difficulty) % 100;
  }
  /*
  * Make wave, Emit event that wave happened and save in waves array
  */
  function AddWave(string memory message) public {
    /*
    * We need to make sure the current timestamp is at least 15-minutes bigger than the last timestamp we stored
    */
    //  now = block.timestamp = 20
    // last called time = lastWavedAt[msg.sender] = 0
    // if i add 15 mints in last called time, 0 + 15 
    // then it should be less than "now" time
    require(
      lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
      "Oops, you are in cooldown period, Wait 15 minutes.."
    );
    /*
      * Update the current timestamp we have for the user
      */
    lastWavedAt[msg.sender] = block.timestamp;
    
    totalWaves +=1;
    console.log("%s has waved!", msg.sender);
    /*
      * Generate a new seed for the next user that sends a wave
      */
    seed = (block.difficulty + block.timestamp + seed) % 100;
    console.log("Random # generated: %d", seed);
    // store the wave data in the array
    // waves.push(Wave(msg.sender, message, BlockInfo(block.coinbase, block.difficulty, block.gaslimit, block.number, block.timestamp)));
    waves.push(Wave(msg.sender, message, block.timestamp));
    waversArr.push(Wavers(msg.sender, 1));
    // Give a 50% chance that the user wins the prize
    if(seed <= 50) {
      console.log("%s won!", msg.sender);
      // check if contract have money to award waver
      //  If it's not true, it will quit the function and cancel the transaction
      require(prizeMoneyForWaver <= address(this).balance, "You are trying to withdraw money more than what we have in Contract!");
      // if contract have money then award him prize money 
      (bool success, ) = (msg.sender).call{
        value: prizeMoneyForWaver
      }("");
      // if money is send proceed with transaction otherwise force error with returning leftover gas money
      require(success, "Failed to withdraw money from contract.");
    }
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
