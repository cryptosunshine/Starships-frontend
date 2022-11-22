import React, { useState, useEffect, useCallback } from 'react'
import { useWallet } from "@mysten/wallet-adapter-react";
import { useGlobal } from '../state/provider'
import styles from "styled-components";
import { useNavigate } from 'react-router-dom';

const App: React.FC<any> = () => {
  const navigate = useNavigate()
  const { wallets, wallet, select, connecting, connected, getAccounts, signAndExecuteTransaction } = useWallet();

  const { state, dispatch } = useGlobal()
  const [autoConnectStatus, setAutoConnect] = useState(true)

  const connect = async () => {
    // select(walletName);
    let walletName = wallets[1].name;
    select(walletName);
  }
  useEffect(() => {
    getAccounts().then((accounts) => {
      console.log("Getting Accounts", accounts);
      dispatch({ type: 'setAddress', value: accounts[0] })
    });
  }, [connected])

  const first = useCallback(async () => {
    let GameRecord = localStorage.getItem('GameRecord');
    if(!GameRecord) {
      navigate('/')
    }else{
      navigate('/game')
    }
  }, [])
  useEffect(() => {
    const timeout = setTimeout(() =>
      first(), 300);
    return () => clearTimeout(timeout);
  }, [first])

  return (
    <>
      <div className='header'>
        <div className='header-bg'>
          <svg className="c0130" width="1787" height="84"><path className="c0131 c0135" stroke="rgba(0,0,0,0.5)" stroke-width="1" fill="rgba(0,0,0,0.5)" d="M0,0 L1787,0 L1787,84 L1393.5,84 L1373.5,74 L913.5,74 L413.5,74 L393.5,84 L0,84 L0,0" ></path><path className="c0131 c0135" stroke="rgba(187,187,187,0.5)" stroke-width="1" d="M0,84 L393.5,84" ></path><path className="c0131 c0135" stroke="#fae127" stroke-width="3" d="M393.5,84 L413.5,74 M381.5,84 L401.5,74" ></path><path className="c0131 c0135" stroke="rgba(187,187,187,0.5)" stroke-width="1" d="M401.5,74 L913.5,74" ></path><path className="c0131 c0135" stroke="rgba(187,187,187,0.5)" stroke-width="1" d="M1385.5,74 L913.5,74" ></path><path className="c0131 c0135" stroke="#fae127" stroke-width="3" d="M1393.5,84 L1373.5,74 M1405.5,84 L1385.5,74" ></path><path className="c0131 c0135" stroke="rgba(187,187,187,0.5)" stroke-width="1" d="M1787,84 L1393.5,84" ></path></svg>
        </div>
        <div className='header-content'>
          <div className='header-logo'>
            Star ships
          </div>
          <div>
            {
              state.address ? <div className='header-wallet'>
                {state.address}
              </div>
                :
                <div className='btn' onClick={connect} style={{ marginTop: '20px' }}>Connect</div>
            }
          </div>
        </div>




      </div>
    </>
  )
};

export default App;
