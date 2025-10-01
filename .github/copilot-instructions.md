# ブロック崩しクローンの Copilot 指示書

## プロジェクト概要

Next.js 15 App Router で構築された Canvas ベースのブロック崩しゲーム。HTML5 Canvas API と React フックを使用した単一ページのクライアントサイドゲーム。すべてのゲームロジックはブラウザで実行され、サーバーサイドのゲームプレイはありません。

## 技術スタックと主要バージョン

- **Next.js 15.5.4** (開発・ビルドの両方で Turbopack を使用)
- **React 19.1.0** (最新の新フック対応版)
- **TypeScript 5.9.2** (strict モード有効)
- **Tailwind CSS 4.1.13** (v4 の新しい PostCSS プラグインアーキテクチャ)
- **ESLint 9** (flat config 形式)

## アーキテクチャ

`src/app/page.tsx` の単一コンポーネントアーキテクチャ (~280 行):

- すべてのゲーム状態、ロジック、レンダリングを 1 つの `useEffect` フック内に実装
- `requestAnimationFrame` ループを使用した Canvas レンダリング
- 状態管理: `useState` で score、gameOver、gameWon を管理
- 関心の分離なし - ゲームループ、衝突判定、レンダリングがすべてインライン

## 開発コマンド

```bash
pnpm dev          # Turbopack で開発サーバーを起動
pnpm build        # Turbopack で本番ビルド
pnpm start        # 本番サーバーを起動
pnpm lint         # ESLint を実行 (自動修正は未設定)
```

**重要**: 必ず `pnpm` を使用してください (npm/yarn ではなく)。Turbopack は `--turbopack` フラグで明示的に有効化されています。

## コードパターンと規約

### クライアントコンポーネント

すべてのインタラクティブなコードには `"use client"` ディレクティブが必要です (`src/app/page.tsx:1` を参照)。ゲームロジックはブラウザ API (Canvas、DOM イベント) を必要とします。

### ゲーム状態管理

状態更新は再レンダリングをトリガーしますが、ゲームループを中断しません:

- `setScore()` はゲームプレイ中に UI 上のスコア表示を更新
- `setGameOver()` と `setGameWon()` は `cancelAnimationFrame()` でアニメーションを停止
- ゲーム再開には `window.location.reload()` で完全リセット

### Canvas ライフサイクル

ゲームループは `useEffect` 内で完全に実行され、適切なクリーンアップを行います:

```tsx
useEffect(() => {
  // Canvas、イベントリスナー、ゲーム状態のセットアップ
  const draw = () => {
    /* ゲームループ */
  };
  draw();

  return () => {
    // 重要: クリーンアップでメモリリークを防ぐ
    document.removeEventListener(/* ... */);
    cancelAnimationFrame(animationId);
  };
}, []); // 空の依存配列 - マウント時に1回だけ実行
```

### 衝突判定

ネストされたループで毎フレームボールとブロックの交差をチェック。すべての衝突ロジックは `collisionDetection()` 関数内。ブロックのステータスをその場で更新し、状態変更をトリガーします。

### イベント処理

デュアル入力システム - キーボード矢印キー + マウス移動:

- キーボード: フラグ (`rightPressed`, `leftPressed`) を毎フレームチェック
- マウス: `mouseMoveHandler` によるパドル位置の直接更新
- 両方のイベントリスナーは `canvas` ではなく `document` にアタッチ

## スタイリングアプローチ

`globals.css` のインラインテーマ変数を使用した Tailwind v4:

- `@theme inline` 構文を使用 (v4 固有)
- CSS で Tailwind を直接インポート: `@import "tailwindcss"`
- PostCSS 設定は `@tailwindcss/postcss` プラグインを使用 (レガシーの `tailwindcss` ではない)
- メインゲーム UI はユーティリティクラス (bg-gray-900, flex など) を使用

## TypeScript 設定

- パスエイリアス `@/*` は `./src/*` にマッピング
- ターゲット: ES2024
- モジュール解決: "bundler" (Next.js 15 デフォルト)
- strict モード有効

## ファイル構成

- `src/app/page.tsx` - ゲーム実装全体
- `src/app/layout.tsx` - 日本語メタデータを持つ最小限のレイアウト
- `src/app/globals.css` - Tailwind インポート + テーマ変数
- components ディレクトリなし - 単一ファイルアプローチ

## よくある落とし穴

1. **Turbopack 必須**: ビルドスクリプトは明示的に `--turbopack` を使用。削除を提案しないこと。
2. **Canvas 状態**: ゲーム変数 (ballX, ballY, paddleX) は関数スコープで、React state ではない - 直接変更は意図的。
3. **アニメーションループ**: `setInterval` への変換は不可 - スムーズな 60fps レンダリングには `requestAnimationFrame` が正解。
4. **イベントクリーンアップ**: ホットリロード時の重複ハンドラーを防ぐため、useEffect クリーンアップで必ずイベントリスナーを削除すること。

## テストアプローチ

現在テストセットアップなし。ゲームテストはブラウザ操作で手動実行。

## 機能追加時の注意点

- 複雑さが増さない限り、すべてを `page.tsx` に保持
- 新しいゲームメカニクスは `draw()` 関数内に追加
- 新しい UI オーバーレイは gameOver/gameWon モーダルのパターンに従う (canvas 上に絶対配置)
- UI テキストは日本語を維持 (メタデータ、ボタンラベル、説明)
