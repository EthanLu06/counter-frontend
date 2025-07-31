import { ChainId, EthereumChainId } from "@injectivelabs/networks";
import {
  Web3Strategy,
  WalletStrategy,
  Wallet,
  ConcreteStrategy,
} from "@injectivelabs/wallet-ts";
import { CHAIN_ID, ETHEREUM_CHAIN_ID } from "./contract";

export class WalletService {
  private walletStrategy: WalletStrategy;

  constructor() {
    this.walletStrategy = new WalletStrategy({
      chainId: CHAIN_ID,
      ethereumOptions: {
        ethereumChainId: ETHEREUM_CHAIN_ID,
        rpcUrl: "",
      },
    });
  }

  async connectWallet(wallet: Wallet): Promise<string> {
    await this.walletStrategy.setWallet(wallet);

    const addresses = await this.walletStrategy.getAddresses();
    return addresses[0];
  }

  async connectKeplr(): Promise<{
    address: string;
    ethereumAddress: string;
  }> {
    const address = await this.connectWallet(Wallet.Keplr);

    const ethereumAddress = await this.walletStrategy
      .getAddresses()
      .then((addresses) => addresses[0]);

    return {
      address,
      ethereumAddress,
    };
  }

  async connectMetamask(): Promise<{
    address: string;
    ethereumAddress: string;
  }> {
    const address = await this.connectWallet(Wallet.Metamask);

    const ethereumAddress = await this.walletStrategy
      .getAddresses()
      .then((addresses) => addresses[0]);

    return {
      address,
      ethereumAddress,
    };
  }

  async getStrategy(): Promise<ConcreteStrategy> {
    return this.walletStrategy.getStrategy();
  }
}
