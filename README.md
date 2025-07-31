# Injective Counter dApp

这是一个与 Injective 区块链上的 Counter 合约交互的前端应用。该应用允许用户连接钱包，查询计数值，递增计数值，以及重置计数值（如果是合约所有者）。

## 功能

- 连接 Keplr 和 Metamask 钱包
- 查询当前计数值
- 递增计数值
- 重置计数值（仅合约所有者）

## 合约地址

合约已部署在 Injective 主网，地址为：`inj133yj4674mf0mz4vnya76t0ckel23q62ygtgzyp`

## 技术栈

- React + TypeScript
- Vite
- Injective SDK
  - @injectivelabs/sdk-ts
  - @injectivelabs/wallet-ts
  - @injectivelabs/networks
  - @injectivelabs/utils

## 开发

1. 克隆代码库

```
git clone <repository-url>
cd counter-frontend
```

2. 安装依赖

```
yarn install
```

3. 启动开发服务器

```
yarn dev
```

4. 构建生产版本

```
yarn build
```

## 使用方法

1. 打开应用
2. 使用 Keplr 或 Metamask 连接钱包
3. 连接后，您将看到当前计数值
4. 点击"递增计数"按钮可以将计数值+1
5. 如果您是合约所有者，可以在输入框中输入新的计数值，然后点击"重置计数"

## 部署

该应用已部署在 GitHub Pages 上，您可以访问以下链接使用：

[访问 Counter dApp](https://your-github-username.github.io/counter-frontend/)

## 许可证

MIT
