# Neo Snap

This Snap allows MetaMask users to interact with the Neo blockchain.

## Usage

Since this is a beta version, you need [MetaMask Flask](https://metamask.io/flask/). You cannot have other versions of MetaMask installed. For apps to be able to connect to Flask, you will need to disable MetaMask and any other wallets that might be overriding the `window.ethereum` object.

The Snap can be installed by visiting [https://vitalwallet.xyz/](https://vitalwallet.xyz/).

Docs: TODO

## Development

### Prerequisites

- [MetaMask Flask](https://metamask.io/flask/)

  - ⚠️ You cannot have other versions of MetaMask installed

### Installing

```bash
yarn
```

### Running

#### wallet-adapter build

```bash
yarn workspace neo-snap-wallet-adapter build:dev
```

#### snap dev

```bash
yarn workspace neo-snap start
```

- Snap server: http://localhost:8080/

#### dapp site dev

```bash
yarn workspace wallet-site dev
```

- Wallet Site dapp: http://localhost:8000/

## Deploy Wallet Site

```bash
yarn

yarn workspace neo-snap-wallet-adapter build

yarn workspace wallet-site build
yarn workspace wallet-site start
```
