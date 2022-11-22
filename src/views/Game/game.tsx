import React, { FC, useState, useEffect } from 'react';
import { useWallet } from "@mysten/wallet-adapter-react";
import { Ed25519Keypair, JsonRpcProvider, RawSigner, Secp256k1Keypair } from '@mysten/sui.js';
import { useGlobal } from '../../state/provider'

// The Best Of Me
const Home: FC = () => {
  const { wallets, wallet, select, connecting, connected, getAccounts, signAndExecuteTransaction } = useWallet();
  const provider = new JsonRpcProvider();
  const { state, dispatch } = useGlobal()
  const [ activeTabs, setActiveTabs] = useState(1);
  const [ myNFTList, SetMyNFTList ] = useState([]);
  const [ activeNFT, SetActiveNFT ] = useState<any>();
  const [ activeMix, setActiveMix ] = useState<boolean>(false);
  const [ myNFTMixList, setMyNFTMixList ] = useState<any>([]);

  
  
  const contractAddress = "0x61d0b3199cfd0c54902a8321b31bc820a5839341";
  const globalMetaData = "0x106269a44678f1410df45479a160a21e558cf712";
  useEffect(() => {
    getNFTList(state.address)
  }, [state.address])

  const hiddenAddr = (e:any) => {
    if(!e) return '...';
    let first = e.substring(0,6);
    let end = e.substring(e.length - 4, e.length);
    return first+'...'+end;
  }
  const mint = async (name:string) => {
    getAccounts().then((accounts: any) => {
      console.log("Getting Accounts", accounts);
    });

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
    console.log(reasult)
    getNFTList(state.address);
  }
  const mixture = async (id1:any, id2:any) => {

    const reasult = await signAndExecuteTransaction({
      kind: "moveCall",
      data: {
        packageObjectId: contractAddress, // Immutable
        module: 'startships',
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

  const escape = async (id:any) => {

    const reasult = await signAndExecuteTransaction({
      kind: "moveCall",
      data: {
        packageObjectId: contractAddress, // Immutable
        module: 'startships',
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
  const change = async () => {

    const reasult = await signAndExecuteTransaction({
      kind: "moveCall",
      data: {
        packageObjectId: '0x3e6cfe77b098264d5dc2661dea48a4242471999b', // Immutable
        module: 'game2',
        function: 'newSpeed',
        typeArguments: [],
        arguments: [
          activeNFT.id.id, // Shared
          '900',
        ],
        gasBudget: 10000,
      },
    });
    console.log(reasult)
    getNFTList(state.address)
  }
  const getNFTList = async (address: string) => {
    console.log(address)
    const object = await provider.getObjectsOwnedByAddress(address);
    let list: any = [];
    object.map(e => {
      console.log(e)
      if (e.type.indexOf(contractAddress) > -1) {
        list.push(e.objectId);
      }
    })
    let NFTList: any = []
    await Promise.all(list.map(async (e: any) => {
      const res: any = await provider.getObject(e);
      NFTList.push(res.details.data.fields)
    }))
    console.log(NFTList)
    SetMyNFTList(NFTList)
  }
  function addMix(item:any) {
    console.log(item)
    let filter = myNFTMixList && myNFTMixList.length > 0 && myNFTMixList.filter((e:any) => e.id.id == item.id.id);
    console.log(filter)
    if(filter && filter.length != 0) return;
    let mixArr:any = []
    if(myNFTMixList && myNFTMixList.length > 0) {
      mixArr.push(myNFTMixList[0]);
    } 
    console.log(mixArr)
    mixArr.push(item);
    console.log(mixArr)
    setMyNFTMixList(mixArr)
    setActiveTabs(1)
  }
  function removeMix(item:any) {
    let mixArr:any = JSON.parse(JSON.stringify(myNFTMixList));
    myNFTMixList.map((e:any,i:number) => {
      if(e.id.id === item.id.id){
        mixArr.splice(i, 1);
      }
    })

    setMyNFTMixList(mixArr)
  }
  const Item = (e:any) => {
    let item = e.item;
    return <div className={'card '+((activeNFT && activeNFT.id.id == item.id.id) && 'card-active')} onClick={() => {
      SetActiveNFT(item);
    }}>
      <img src={item.url} alt="" />
      <div className='card-id'>
        <span>ID: </span> <a href={"https://explorer.sui.io/objects/"+item.id.id} target="_block">{hiddenAddr(item.id.id)}</a> 
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
        activeMix && activeTabs === 0 &&  <div className='btn' onClick={() => addMix(item)}>
            Add to mix...
        </div>
      }
      {
        activeTabs === 1 &&  <div className='btn' onClick={() => removeMix(item)}>
            Remove to mix...
        </div>
      }
      {
        activeTabs === 2 &&  <div className='btn' onClick={() => escape(item.id.id)}>
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
          {/* <div className='btn' onClick={change}>Bug</div> */}
        </div>
        {
          activeTabs === 0 && 
          <div className="content-list">
            {
              myNFTList && myNFTList.map((e: any) => {
                return <Item item={e} />
              })
            }
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
            style={{height: `200px`}}
            onClick={() => {
              if(myNFTMixList.length == 2) {
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
                return <Item item={e} />
              })
            }
          </div>
        }
      </div>

    </div>

  );
};
export default Home

