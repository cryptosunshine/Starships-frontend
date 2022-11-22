import React, { useEffect, useState, lazy, useReducer } from 'react'
import {
    BrowserRouter as Router,
} from "react-router-dom";
import Layouts from './components/Layout'
import AppProviders from './contexts'
import './App.css';

import { useMemo } from "react";
import { WalletProvider } from "@mysten/wallet-adapter-react";
import { UnsafeBurnerWalletAdapter } from "@mysten/wallet-adapter-all-wallets";
import { WalletStandardAdapterProvider } from "@mysten/wallet-adapter-wallet-standard";


const App = () => {

    const adapters = useMemo(
        () => [new UnsafeBurnerWalletAdapter(), new WalletStandardAdapterProvider()],
        []
    );
    return (
        <AppProviders>
            <WalletProvider adapters={adapters}>
                <Router>
                    <Layouts></Layouts>
                </Router>
            </WalletProvider>
        </AppProviders>

    );
}

export default App;
