# Twitch Banner Finder

Twitch API を使用して、ゲームの公式ボックスアート（バナー画像）を簡単に検索・取得できるデスクトップアプリケーションです。

## 🚀 特徴

- **クイック検索**: ゲーム名を入力するだけで、Twitch 公式の高品質なバナーを瞬時に表示。
- **永続化設定**: Client ID と Client Secret をローカルに保存し、再入力の手間を省きます。
- **ポータブル**: インストール不要の `.exe` 形式で動作。

## 🛠 使い方

1. [Releases](https://github.com/あなたのユーザー名/リポジトリ名/releases) ページから最新の `.exe` をダウンロードします。
2. [Twitch Developer Console](https://dev.twitch.tv/console) でアプリを登録し、`Client ID` と `Client Secret` を取得します。
3. アプリを起動し、取得した ID/Secret と検索したいゲーム名を入力して実行してください。

## 開発者向けセットアップ

自分でビルドまたはカスタマイズしたい場合：

```bash
# リポジトリをクローン
git clone [https://github.com/あなたのユーザー名/twitch-banner-tool.git](https://github.com/mashirovoc/twitch-banner-tool.git)

# 依存関係のインストール
npm install

# 開発モードで起動
npm run electron:dev

# .exe のビルド
npm run electron:build
```
