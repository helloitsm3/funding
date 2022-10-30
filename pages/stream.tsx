import { useState, } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import type { NextPage } from "next";
import { useAccount, useProvider, useSigner } from 'wagmi'


const Stream: NextPage = () => {
  const { address } = useAccount();
  const [recipient, setRecipient] = useState('0xd4924261323DAc5fAAD8524864d35D43d7190F92')
  const [flowRate, setFlowRate] = useState(1);
  const provider = useProvider()
  const { data: signer } = useSigner()

  async function deleteFlow() {
    const sf = await Framework.create({
      provider: provider,
      chainId: 80001
    })
    const DAIxContract = await sf.loadSuperToken("fDAIx");
    const DAIx = DAIxContract.address;
    try {
      const deleteFlowOperation = sf.cfaV1.deleteFlow({
        sender: address,
        receiver: recipient,
        superToken: DAIx
        // userData?: string
      });
  
      console.log("Deleting your stream...");
  
      await deleteFlowOperation.exec(signer);

    } catch (error) {
      console.error(error);
    }
  }
  

  async function createNewFlow() {
    const sf = await Framework.create({
      provider: provider,
      chainId: 80001
    })
    
    const DAIxContract = await sf.loadSuperToken("fDAIx");
    const DAIx = DAIxContract.address;
    const flowRate = 1;
    try {
      const createFlowOperation = sf.cfaV1.createFlow({š
        //@ts-ignore
        receiver: address,
        //@ts-ignore
        flowRate: flowRate,
        superToken: DAIx
      });

      console.log("Creating your stream...");
      console.log(signer)
      //@ts-ignore
      const result = await createFlowOperation.exec(signer);
      console.log(result);

    } catch (error) {
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      console.error(error);
    }
  }

  return <>
    <div>
      <h2>Create a Flow</h2>
      <button
        onClick={() => {
          createNewFlow();
        }}
      >
        Create stream
      </button>
      <button onClick={()=>{deleteFlow()}}>
        Delete stream
      </button>

      <div>
        Result in console
        <p>
          <li>Recipient: {recipient}</li>
          <li>Flow: {flowRate}</li>
        </p>
      </div>
    </div>
  </>
}

export default Stream;