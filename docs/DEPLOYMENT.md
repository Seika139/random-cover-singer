# Vercel デプロイ手順

このドキュメントでは、Random Cover Singer アプリケーションを Vercel にデプロイする手順を説明します。

## 前提条件

- GitHubアカウント
- Vercelアカウント（GitHubアカウントでサインアップ可能）
- このプロジェクトがGitHubリポジトリにプッシュされていること

## 手順

### 1. GitHubリポジトリの準備

プロジェクトをGitHubにプッシュします。

```bash
# まだリモートリポジトリを設定していない場合
git remote add origin https://github.com/<your-username>/<repository-name>.git

# 変更をコミット（未コミットの変更がある場合）
git add .
git commit -m "chore: prepare for vercel deployment"

# GitHubにプッシュ
git push -u origin main
```

### 2. Vercelアカウントの作成

1. [Vercel](https://vercel.com) にアクセス
2. "Sign Up" をクリック
3. "Continue with GitHub" を選択してGitHubアカウントで認証

### 3. プロジェクトのインポート

1. Vercelダッシュボードで **"Add New..."** → **"Project"** をクリック
2. **"Import Git Repository"** セクションで、GitHubリポジトリを検索
3. 該当するリポジトリの **"Import"** をクリック

### 4. プロジェクト設定

以下の設定を確認・入力します：

- **Project Name**: 任意の名前（例: `random-cover-singer`）
- **Framework Preset**: `Next.js` （自動検出されるはず）
- **Root Directory**: `./` （デフォルト）
- **Build Command**: `npm run build` （デフォルト）
- **Output Directory**: `.next` （デフォルト）
- **Install Command**: `npm install` （デフォルト）

**Environment Variables（環境変数）**: 現時点では設定不要

### 5. デプロイ

**"Deploy"** ボタンをクリックします。

デプロイには数分かかります。完了すると、以下が表示されます：
- デプロイURL（例: `https://random-cover-singer.vercel.app`）
- デプロイステータス

### 6. 動作確認

1. 提供されたURLにアクセス
2. 「セトリ予想を生成！」ボタンをクリックして動作確認
3. X（Twitter）でシェアして、OGP画像が正しく表示されるか確認

## トラブルシューティング

### ビルドエラーが発生した場合

1. Vercelのデプロイログを確認
2. ローカルで `npm run build` を実行してエラーを再現
3. エラーを修正してGitHubにプッシュ（自動的に再デプロイされます）

### OGP画像が表示されない場合

1. `/api/og?s=テスト&m=アリス` に直接アクセスして画像が生成されるか確認
2. [Twitter Card Validator](https://cards-dev.twitter.com/validator) でURLをテスト
3. キャッシュのクリアが必要な場合があります

## 継続的デプロイ

GitHubの `main` ブランチにプッシュすると、Vercelが自動的に再デプロイします。

```bash
git add .
git commit -m "feat: add new feature"
git push
```

数分後、変更が本番環境に反映されます。

## カスタムドメインの設定（オプション）

1. Vercelダッシュボードでプロジェクトを選択
2. **Settings** → **Domains** に移動
3. カスタムドメインを追加
4. DNSレコードを設定（Vercelが指示を表示します）

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
