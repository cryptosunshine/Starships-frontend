import React, { FC, useState, useEffect } from 'react';
import { useWallet } from "@mysten/wallet-adapter-react";
import { Ed25519Keypair, JsonRpcProvider, RawSigner, Secp256k1Keypair } from '@mysten/sui.js';
import { useGlobal } from '../../state/provider'
import TypeWriter from '../../components/TypeWriter';
import { contractAddress, globalMetaData } from '../../config/index'
import { useNavigate } from 'react-router-dom';

// The Best Of Me
const Home: FC = () => {
  const { wallets, wallet, select, connecting, connected, getAccounts, signAndExecuteTransaction } = useWallet();
  const provider = new JsonRpcProvider();
  const navigate = useNavigate()
  const { state, dispatch } = useGlobal()
  const [dialogue, setDialogue] = useState<number>(0);
  const [name, setName] = useState<string>();
  const [nameModal, setNameModal] = useState<boolean>(false);

  useEffect(() => {
    document.addEventListener('click', () => {
      setNameModal(false);
    })
  },[]);

  const mint = async () => {
    console.log(name)
    if(!name){
      console.log(name)
      return;
    }
    const reasult = await signAndExecuteTransaction({
      kind: "moveCall",
      data: {
        packageObjectId: contractAddress, // Immutable
        module: 'startships',
        function: 'mint',
        typeArguments: [],
        arguments: [
          globalMetaData, // Shared
          name
        ],
        gasBudget: 10000,
      },
    });
    if(reasult){
      navigate('/game');
    }
  }
  const FirstSpeech = () => {
    let msgs = "Captain: The solar system is about to become two-dimensional, please build a starship immediately and escape from the earth.";
    return <>
      <div className='flex' style={{
        width: `600px`,
        margin: `0 auto`,
        paddingTop: `150px`
      }}>
        <div>
          <img className='virtual' src="/img/virtual.png" />
        </div>
        <div style={{marginLeft: `10px`}}>
          <TypeWriter messages={msgs} end={dialogue > 1} callback={() => {
            setDialogue(3)
          }}/>
        </div>
      </div>
      <div style={{marginTop: `100px`}}>
          {
            dialogue >= 3 && <div className='btn' onClick={(e) => {
              e.stopPropagation()
              setNameModal(true)
            }}>Mint</div>
          }
        </div>
    </>
  }



  return (
    <div className='main'>
      <div className='content'>
        {
          dialogue >= 1 && <FirstSpeech />
        }
        {
          dialogue === 0 && <div className='btn' style={{width: `100%`}} onClick={() => setDialogue(1)}>Join in</div>
        }
        
      </div>
      {
        nameModal && 
        <div className='modal' onClick={(e)=>{
          e.stopPropagation()
        }}>
          <div className='flex' style={{height: `80px`,marginTop: `25px`}}>
            <p>Name: </p>
            <textarea 
            className='input' 
            placeholder='Please give it a famous name.' 
            style={{width: `100%`, height: `50px`, marginLeft: `10px`, padding: `10px`}}
            onChange={(e) => {
              console.log(e.target.value)
              setName(e.target.value);
            }}/>
          </div>
          <div className='flex justify-center' style={{marginTop: `45px`}}>
            <div className='btn' style={{width: `100%`}} onClick={() => mint()}>Mint</div>
          </div>
        </div>

      }
      
    </div>

  );
};
export default Home

