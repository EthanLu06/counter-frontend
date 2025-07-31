import { useState, useEffect } from "react";
import "./App.css";
import { WalletService } from "./services/wallet";
import {
  CounterState,
  queryCounter,
  incrementCounter,
  resetCounter,
} from "./services/contract";
import { MsgExecuteContractCompat } from "@injectivelabs/sdk-ts";
import { TxResponse } from "@injectivelabs/ts-types";
import { ConcreteStrategy } from "@injectivelabs/wallet-ts";

function App() {
  const [walletService] = useState<WalletService>(new WalletService());
  const [address, setAddress] = useState<string>("");
  const [ethereumAddress, setEthereumAddress] = useState<string>("");
  const [counter, setCounter] = useState<CounterState>({ count: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [strategy, setStrategy] = useState<ConcreteStrategy | null>(null);
  const [newCount, setNewCount] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const isConnected = address !== "";

  const connectKeplr = async () => {
    try {
      setIsLoading(true);
      setError("");
      const { address, ethereumAddress } = await walletService.connectKeplr();
      setAddress(address);
      setEthereumAddress(ethereumAddress);

      const strategy = await walletService.getStrategy();
      setStrategy(strategy);

      // 获取计数器当前值
      await fetchCounter(address);
    } catch (e) {
      setError("连接钱包失败: " + (e as Error).message);
      console.error("Failed to connect wallet:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const connectMetamask = async () => {
    try {
      setIsLoading(true);
      setError("");
      const { address, ethereumAddress } =
        await walletService.connectMetamask();
      setAddress(address);
      setEthereumAddress(ethereumAddress);

      const strategy = await walletService.getStrategy();
      setStrategy(strategy);

      // 获取计数器当前值
      await fetchCounter(address);
    } catch (e) {
      setError("连接钱包失败: " + (e as Error).message);
      console.error("Failed to connect wallet:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCounter = async (walletAddress: string) => {
    try {
      setIsLoading(true);
      setError("");
      const counterData = await queryCounter(walletAddress);
      setCounter(counterData);
    } catch (e) {
      setError("获取计数器值失败: " + (e as Error).message);
      console.error("Failed to fetch counter:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrement = async () => {
    if (!strategy || !address) return;

    try {
      setIsLoading(true);
      setError("");

      const { message } = await incrementCounter(address, ethereumAddress);
      const response = await broadcastMessage(message);

      if (response) {
        await fetchCounter(address);
      }
    } catch (e) {
      setError("递增计数器失败: " + (e as Error).message);
      console.error("Failed to increment counter:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (!strategy || !address) return;

    try {
      setIsLoading(true);
      setError("");

      const { message } = await resetCounter(
        address,
        ethereumAddress,
        newCount
      );
      const response = await broadcastMessage(message);

      if (response) {
        await fetchCounter(address);
      }
    } catch (e) {
      setError("重置计数器失败: " + (e as Error).message);
      console.error("Failed to reset counter:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const broadcastMessage = async (
    message: MsgExecuteContractCompat
  ): Promise<TxResponse | undefined> => {
    if (!strategy) return undefined;

    try {
      const txHash = await strategy.broadcast({
        messages: [message],
        injectiveAddress: address,
      });

      console.log("Transaction hash:", txHash);
      return txHash;
    } catch (e) {
      console.error("Failed to broadcast transaction:", e);
      throw e;
    }
  };

  return (
    <div className="container">
      <h1>Injective 计数器 dApp</h1>

      {!isConnected ? (
        <div className="connect-container">
          <h2>请连接您的钱包</h2>
          <div className="wallet-buttons">
            <button onClick={connectKeplr} disabled={isLoading}>
              {isLoading ? "连接中..." : "连接 Keplr"}
            </button>
            <button onClick={connectMetamask} disabled={isLoading}>
              {isLoading ? "连接中..." : "连接 Metamask"}
            </button>
          </div>
        </div>
      ) : (
        <div className="counter-container">
          <h2>当前计数: {counter.count}</h2>

          <div className="action-buttons">
            <button
              onClick={handleIncrement}
              disabled={isLoading}
              className="increment-button"
            >
              {isLoading ? "处理中..." : "递增计数"}
            </button>

            <div className="reset-container">
              <input
                type="number"
                value={newCount}
                onChange={(e) => setNewCount(parseInt(e.target.value) || 0)}
                placeholder="输入新的计数值"
              />
              <button
                onClick={handleReset}
                disabled={isLoading}
                className="reset-button"
              >
                {isLoading ? "处理中..." : "重置计数"}
              </button>
            </div>
          </div>

          <div className="wallet-info">
            <p>
              <strong>钱包地址:</strong> {address}
            </p>
          </div>

          <button
            onClick={() => fetchCounter(address)}
            disabled={isLoading}
            className="refresh-button"
          >
            刷新计数
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default App;
