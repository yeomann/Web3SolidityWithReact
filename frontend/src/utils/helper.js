import { ethers } from "ethers";

function hex_to_ascii(str1) {
  var hex = str1.toString();
  var str = "";
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

async function transactionFailedReason(hash, provider) {
  // console.log("tx hash:", hash);
  // console.log("provider:", provider);

  // let tx = await provider.getTransaction(hash);
  // console.log("tx=", tx);
  // if (!tx) {
  //   console.log("tx not found");
  //   return;
  // }
  // console.log("%c cracking code...", "background:green;color:white");
  // let code = await provider.call(tx, tx.blockNumber);
  // // let code = await provider.call({to: tx.to, data: tx.data, value: tx.value}, tx.blockNumber)
  // console.log("code=", code, code.substr(138));

  // let reason = hex_to_ascii(code.substr(138));
  // console.log("revert reason:", reason);

  const a = await provider.getTransaction(hash);
  try {
    let code = await provider.call(a, a.blockNumber);
    console.log(code);
    code = code.data.replace('Reverted ','');
    console.log({code});
    let reason = ethers.utils.toUtf8String('0x' + code.substr(138));
    console.log('revert reason:', reason);

  } catch (err) {
    // const code = err.data.replace('Reverted ','');
    console.log({err});
    // let reason = ethers.utils.toUtf8String('0x' + code.substr(138));
    // console.log('revert reason:', reason);
  }
}


export { transactionFailedReason };
