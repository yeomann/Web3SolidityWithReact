// SPDX-License-Identifier: gnuplot

pragma solidity ^0.8.0;

import "hardhat/console.sol";

// Struct to save how many waves were done by address
struct Wavers { 
  address addr;
  uint256 amount;
}

contract WavePortal {
  
  Wavers[] public waversArr;
  address public owner;
  uint256 totalWaves;

  constructor() {
    owner = msg.sender;
    console.log("Yo yo, I am a contract and I am smart, owner = %s", owner);
  }

  function AddWave() public {
    totalWaves +=1;
    console.log("%s has waved!", msg.sender);
    waversArr.push(Wavers(msg.sender, totalWaves));
  }

  function getTotalWavesCount() public view returns(uint256) {
    console.log("Total waves count=%d", totalWaves);
    return totalWaves;
  }

  function addressThatWavedUs() public view {
    console.log("Following Addresses waved us!");
    for (uint256 index = 0; index < waversArr.length; index++) {
      console.log(waversArr[index].addr, waversArr[index].amount);
    }
  }
}
