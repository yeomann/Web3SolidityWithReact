// SPDX-License-Identifier: gnuplot

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
  uint256 totalWaves;

  constructor() {
    console.log("Yo yo, I am a contract and I am smart");
  }

  function AddWave() public {
    totalWaves +=1;
    console.log("%s has waved!", msg.sender);
  }

  function getTotalWavesCount() public view returns(uint256) {
    console.log("Total waves count=%d", totalWaves);
    return totalWaves;
  }
}
