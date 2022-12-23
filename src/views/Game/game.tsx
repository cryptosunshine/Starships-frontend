import React, { FC, useState, useEffect } from 'react';
import { useWallet } from "@mysten/wallet-adapter-react";
import { Ed25519Keypair, JsonRpcProvider, RawSigner, Secp256k1Keypair } from '@mysten/sui.js';
import { useGlobal } from '../../state/provider'
import { contractAddress, globalMetaData } from '../../config/index'
import { reduceAddress } from '../../utils/index'
import Encounter from "./encounter"

const Game: FC = () => {
  const { wallets, wallet, select, connecting, connected, getAccounts, signAndExecuteTransaction } = useWallet();
  const provider = new JsonRpcProvider();
  const { state, dispatch } = useGlobal()
  const [activeTabs, setActiveTabs] = useState(0);
  const [myNFTList, SetMyNFTList] = useState([]);
  const [activeNFT, SetActiveNFT] = useState<any>();
  const [activeMix, setActiveMix] = useState<boolean>(false);
  const [myNFTMixList, setMyNFTMixList] = useState<any>([]);
  const [nameModal, setNameModal] = useState<boolean>(false);
  const [name, setName] = useState<string>();

  useEffect(() => {
    document.addEventListener('click', () => {
      setNameModal(false);
    })
  }, []);

  useEffect(() => {
    if(activeTabs === 2) {
      document.getElementsByClassName('video')[0].setAttribute('style', 'height: 100%;position: absolute;display: block;')
      document.getElementsByClassName('view-bg')[0].setAttribute('style', 'background-image: auto')
      
    }else{
      document.getElementsByClassName('video')[0].setAttribute('style', 'height: 100%;position: absolute;display: none;')
      
      document.getElementsByClassName('view-bg')[0].setAttribute('style', 'background-image: url("/img/1.webp")')
    }
  }, [activeTabs]);


  useEffect(() => {
    console.log(state.address)
    getNFTList(state.address)
  }, [state.address])


  const mint = async () => {
    if (!name) {
      return;
    }
    const reasult = await signAndExecuteTransaction({
      kind: "moveCall",
      data: {
        packageObjectId: contractAddress, // Immutable
        module: 'starships',
        function: 'mint',
        typeArguments: [],
        arguments: [
          globalMetaData, // Shared
          name
        ],
        gasBudget: 10000,
      },
    });
    setNameModal(false)
    getNFTList(state.address);
  }
  const mixture = async (id1: any, id2: any) => {

    const reasult = await signAndExecuteTransaction({
      kind: "moveCall",
      data: {
        packageObjectId: contractAddress, // Immutable
        module: 'starships',
        function: 'mixture',
        typeArguments: [],
        arguments: [
          globalMetaData, // Shared
          id1,
          id2,
          'Mixture Starships'
        ],
        gasBudget: 10000,
      },
    });
    console.log(reasult)
    getNFTList(state.address)
    setActiveTabs(0);
    setMyNFTMixList([]);
  }

  const escape = async (id: any) => {

    const reasult = await signAndExecuteTransaction({
      kind: "moveCall",
      data: {
        packageObjectId: contractAddress, // Immutable
        module: 'starships',
        function: 'escape',
        typeArguments: [],
        arguments: [
          globalMetaData, // Shared
          id,
        ],
        gasBudget: 10000,
      },
    });
    console.log(reasult)
    getNFTList(state.address)
  }





  const getNFTList = async (address: string) => {

    const object = await provider.getObjectsOwnedByAddress(state.address);
    let list: any = [];
    console.log(object)
    object.map(e => {
      if (e.type.indexOf(contractAddress) > -1) {
        list.push(e.objectId);
      }
    })
    let NFTList: any = []
    await Promise.all(list.map(async (e: any) => {
      const res: any = await provider.getObject(e);
      NFTList.push(res.details.data.fields)
    }))
    dispatch({ type: 'setMyNFTList', value: NFTList })
    SetMyNFTList(NFTList)
  }
  function addMix(item: any) {
    let filter = myNFTMixList && myNFTMixList.length > 0 && myNFTMixList.filter((e: any) => e.id.id == item.id.id);
    if (filter && filter.length != 0) return;
    let mixArr: any = []
    if (myNFTMixList && myNFTMixList.length > 0) {
      mixArr.push(myNFTMixList[0]);
    }
    mixArr.push(item);
    setMyNFTMixList(mixArr)
    setActiveTabs(1)
  }
  function removeMix(item: any) {
    let mixArr: any = JSON.parse(JSON.stringify(myNFTMixList));
    myNFTMixList.map((e: any, i: number) => {
      if (e.id.id === item.id.id) {
        mixArr.splice(i, 1);
      }
    })

    setMyNFTMixList(mixArr)
  }
  const Item = (e: any) => {
    let item = e.item;
    return <div className={'card ' + ((activeNFT && activeNFT.id.id == item.id.id) && 'card-active')} onClick={() => {
      SetActiveNFT(item);
    }}>
      <img src={item.url} style={{ height: `200px` }} />
      <div className='card-id'>
        <span>ID: </span> <a href={"https://explorer.sui.io/objects/" + item.id.id} target="_blank">{reduceAddress(item.id.id)}</a>
      </div>
      <div>
        <span>Name:</span> {item.name}
      </div>
      <div>
        <span>Level:</span> {item.level}
      </div>
      <div>
        <span>Speed:</span> {item.speed}
      </div>
      <div>
        <span>Milestone:</span> {item.milestone}
      </div>
      {
        activeMix && activeTabs === 0 && <div className='btn' onClick={() => addMix(item)}>
          Add to mix...
        </div>
      }
      {
        activeTabs === 1 && <div className='btn' onClick={() => removeMix(item)}>
          Remove to mix...
        </div>
      }
      {
        activeTabs === 2 && <div className='btn' onClick={() => escape(item.id.id)}>
          Run
        </div>
      }
    </div>
  }
  return (
    <div className='main'>
      <div className='content'>
        <div className='tabs justify-center'>
          <div className={`tab ${activeTabs === 0 && 'tab-active'}`} onClick={() => {
            setActiveTabs(0);
            setActiveMix(false);
          }}>Starships Squad</div>
          <div className={`tab ${activeTabs === 1 && 'tab-active'}`} onClick={() => setActiveTabs(1)}>Starships Mixture</div>
          <div className={`tab ${activeTabs === 2 && 'tab-active'}`} onClick={() => setActiveTabs(2)}>Start Escape</div>
          <div className={`tab ${activeTabs === 3 && 'tab-active'}`} onClick={() => setActiveTabs(3)}>Encounter</div>
        </div>
        {
          activeTabs === 0 &&
          <div className="content-list">
            {
              myNFTList && myNFTList.map((e: any) => {
                return <Item item={e} />
              })
            }
            <div className='card card-add flex justify-center align-center'
              style={{ height: `200px` }}
              onClick={(e) => {
                e.stopPropagation()
                setNameModal(true)
              }}
            >
              Mint
            </div>
          </div>
        }
        {
          activeTabs === 1 &&
          <div className="content-list">
            {
              myNFTMixList && myNFTMixList.map((e: any) => {
                return <Item item={e} />
              })
            }
            <div className='card card-add flex justify-center align-center'
              style={{ height: `200px` }}
              onClick={() => {
                if (myNFTMixList.length == 2) {
                  mixture(myNFTMixList[0].id.id, myNFTMixList[1].id.id)
                  return;
                }
                setActiveTabs(0);
                setActiveMix(true);
              }}
            >
              {myNFTMixList && myNFTMixList.length == 2 ? 'Mixture' : 'Add Star Ships'}

            </div>
          </div>
        }
        {
          activeTabs === 2 &&
          <div className="content-list">
            {
              myNFTList && myNFTList.map((e: any) => {
                if (e.milestone === 0) {
                  return <Item item={e} />
                }
              })
            }
          </div>
        }
        {
          activeTabs === 3 &&
          <div className="content-list">

            <Encounter />
          </div>
        }
        {nameModal &&
          <div className='modal' onClick={(e) => {
            e.stopPropagation()
          }}>
            <div className='flex' style={{ height: `80px`, marginTop: `25px` }}>
              <p>Name: </p>
              <textarea
                className='input'
                placeholder='Please give it a famous name.'
                style={{ width: `100%`, height: `50px`, marginLeft: `10px`, padding: `10px` }}
                onChange={(e) => {
                  setName(e.target.value);
                }} />
            </div>
            <div className='flex justify-center' style={{ marginTop: `45px` }}>
              <div className='btn' style={{ width: `100%` }} onClick={(e) => {
                e.stopPropagation()
                mint()
              }}>Mint</div>
            </div>
          </div>
        }
      </div>

    </div>

  );
};
export default Game

