const main = async () => {
  const [owner] = await hre.ethers.getSigners();

  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1") 
  });
  await waveContract.deployed();
  console.log("Contract deployed to:", waveContract.address);
  console.log("Contract deployed by:", owner.address);

  /*
   * Get Contract balance
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance), contractBalance);

  console.log("**********START WAVE TESTING**********");
  /* 
  * ##### Test Scenario ##### 
  * get contract
  * call AddWave func to add wave 
  * wait for wave to be done
  * get total count to see how many addresss waves us
  * 
  */

  /*
  waveTxn= {
    hash: '0xb101dc464a63fe019bedff056485070d21a3d272abb08ea87724bf280b259af2',
    type: 2,
    accessList: [],
    blockHash: '0xa70b1ac813229edf1b0738b9d3f39a12648c13c86f9731fcc806acc563787b90',
    blockNumber: 2,
    transactionIndex: 0,
    confirmations: 1,
    from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    gasPrice: BigNumber { value: "1768214650" },
    maxPriorityFeePerGas: BigNumber { value: "1000000000" },
    maxFeePerGas: BigNumber { value: "2536429300" },
    gasLimit: BigNumber { value: "29021272" },
    to: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    value: BigNumber { value: "0" },
    nonce: 1,
    data: '0x4c2d6664',
    r: '0x59cf018c42e5f9c37754be181b5251f5f35d49bd01dfd57303147329eaaf22b4',
    s: '0x4956627a43e0cd098a25e53031523c555db0bf2c83f185f017a96964eb57afaa',
    v: 0,
    creates: null,
    chainId: 31337,
    wait: [Function (anonymous)]
  }
  */
  let waveTxn;

  // how many addresss waves us
  await waveContract.getTotalWavesCount();

  // lets add wave
  waveTxn = await waveContract.AddWave("YO hi, sup?");
  await waveTxn.wait(); // wait for wave to finish
  // console.log("waveTxn=", waveTxn); // lets see what does it contains

  // check again: how many addresss waves us
  // await waveContract.getTotalWavesCount();
  /*
   * Get Contract balance to see what happened!
   */
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );


  // lets make a random address wave us
  const [_, randomPerson] = await hre.ethers.getSigners();
  waveTxn = await waveContract.connect(randomPerson).AddWave("2nd: hi guys"); // connect to random address and call AddWave func
  await waveTxn.wait(); // wait for wave to finish
  /*
   * Get Contract balance to see what happened!
   */
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  // check again: how many addresss waves us
  await waveContract.getTotalWavesCount();
  console.log("##################################");
  await waveContract.addressThatWavedUs();
  console.log("##################################");
  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
  console.log("**********END WAVE TESTING**********");
  /*
   * Get Contract balance to see what happened!
   */
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "FINALLY! Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );
};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // exit Node process without error
  } catch (error) {
    console.log(error);
    process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
  }
  // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
};

runMain();