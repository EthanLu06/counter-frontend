import {
  ChainId,
  EthereumChainId,
  getNetworkEndpoints,
} from "@injectivelabs/networks";
import { MsgExecuteContractCompat } from "@injectivelabs/sdk-ts";
import { getInjectiveAddress } from "@injectivelabs/wallet-ts";

// 计数器合约地址
export const CONTRACT_ADDRESS = "inj133yj4674mf0mz4vnya76t0ckel23q62ygtgzyp";

// 网络配置
export const CHAIN_ID = ChainId.Mainnet;
export const ETHEREUM_CHAIN_ID = EthereumChainId.Mainnet;
export const NETWORK_ENDPOINTS = getNetworkEndpoints(CHAIN_ID);

export interface CounterState {
  count: number;
}

// 查询计数器值
export const queryCounter = async (
  injectiveAddress: string
): Promise<CounterState> => {
  try {
    const endpoint = NETWORK_ENDPOINTS.rest;

    const queryMsg = {
      get_count: {},
    };

    const queryMsgBase64 = Buffer.from(JSON.stringify(queryMsg)).toString(
      "base64"
    );
    const url = `${endpoint}/cosmwasm/wasm/v1/contract/${CONTRACT_ADDRESS}/smart/${queryMsgBase64}`;

    const response = await fetch(url);
    const responseData = await response.json();

    return {
      count: responseData.data.count,
    };
  } catch (error) {
    console.error("Error querying counter:", error);
    throw error;
  }
};

// 递增计数器
export const incrementCounter = async (
  address: string,
  ethereumAddress: string
): Promise<{
  txHash: string;
  message: MsgExecuteContractCompat;
}> => {
  try {
    const injectiveAddress = getInjectiveAddress(ethereumAddress);

    const msg = {
      increment: {},
    };

    const message = MsgExecuteContractCompat.fromJSON({
      contractAddress: CONTRACT_ADDRESS,
      sender: injectiveAddress,
      msg,
    });

    return {
      txHash: "", // 这将在实际交易提交后填写
      message,
    };
  } catch (error) {
    console.error("Error incrementing counter:", error);
    throw error;
  }
};

// 重置计数器
export const resetCounter = async (
  address: string,
  ethereumAddress: string,
  count: number
): Promise<{
  txHash: string;
  message: MsgExecuteContractCompat;
}> => {
  try {
    const injectiveAddress = getInjectiveAddress(ethereumAddress);

    const msg = {
      reset: { count },
    };

    const message = MsgExecuteContractCompat.fromJSON({
      contractAddress: CONTRACT_ADDRESS,
      sender: injectiveAddress,
      msg,
    });

    return {
      txHash: "", // 这将在实际交易提交后填写
      message,
    };
  } catch (error) {
    console.error("Error resetting counter:", error);
    throw error;
  }
};
