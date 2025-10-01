# ブロック崩しクローン

Next.js 15 と HTML5 Canvas で作られたクラシックなブロック崩しゲーム。

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.13-38bdf8)

## 特徴

- 🎮 HTML5 Canvas ベースのスムーズな 60fps ゲームプレイ
- ⚡ Next.js 15 App Router + Turbopack による高速開発
- 🎨 5 色のカラフルなブロック配置
- 🖱️ キーボードとマウスの両方で操作可能
- 📱 レスポンシブなゲームキャンバス

## 技術スタック

- **Next.js 15.5.4** - App Router + Turbopack
- **React 19.1.0** - 最新のフック API
- **TypeScript 5.9.2** - 型安全な開発
- **Tailwind CSS 4.1.13** - モダンなスタイリング
- **HTML5 Canvas API** - ゲームレンダリング

## セットアップ

### 必要要件

- Node.js 20 以上
- pnpm (推奨パッケージマネージャー)

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/Nakayama-Yuki/breakout-clone.git
cd breakout-clone

# 依存関係をインストール
pnpm install
```

## 開発

```bash
# 開発サーバーを起動 (Turbopack)
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてゲームをプレイできます。

## ビルド

```bash
# 本番ビルド
pnpm build

# 本番サーバーを起動
pnpm start
```

## 操作方法

- **← →** キーボードの矢印キー: パドルを左右に移動
- **マウス**: マウスカーソルでパドルを操作
- **R キー** または **再スタートボタン**: ゲームを再開

## ゲームルール

- パドルでボールを跳ね返してすべてのブロックを破壊する
- ブロックを壊すとスコアが加算される
- ボールを落とすとゲームオーバー
- すべてのブロックを壊すとクリア

## プロジェクト構成

```
breakout-clone/
├── src/
│   └── app/
│       ├── page.tsx       # メインゲームロジック
│       ├── layout.tsx     # ルートレイアウト
│       └── globals.css    # グローバルスタイル
├── public/               # 静的ファイル
├── package.json
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

## アーキテクチャ

このプロジェクトは、シンプルさを優先した**単一コンポーネントアーキテクチャ**を採用しています：

- すべてのゲームロジックは `src/app/page.tsx` に実装（約 280 行）
- `useEffect` フック内で完結する Canvas レンダリングループ
- `requestAnimationFrame` による滑らかなアニメーション
- React state による UI 管理（スコア、ゲーム状態）

## 技術的な詳細

### Turbopack

開発とビルドの両方で Turbopack を使用し、高速な開発体験を実現しています。

### Tailwind CSS v4

最新の Tailwind CSS v4 の `@theme inline` 構文と新しい PostCSS プラグインアーキテクチャを使用しています。

### 衝突判定

毎フレーム、ボールとすべてのブロックの交差判定を行い、リアルタイムで物理演算を実行しています。