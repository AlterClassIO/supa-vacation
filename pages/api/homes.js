import { PrismaClient } from '@prisma/client';

// ファイルの先頭でPrismaをインポートして初期化した後、Prismaのcreate関数を呼び出してデータベースでクエリーを実行します。
const prisma = new PrismaClient();

export default async function handler(req, res) {
    // Create new home  ifブロックの内部で、Prisma Clientを使用して、現在のHTTPリクエストから受け取ったデータを使用して、データベースに新しいホームレコードを作成します。
    if (req.method === 'POST') {
        try {
            // TODO   リクエストのボディであるreq.bodyから必要なプロパティを取得することから始めます。
            const { image, title, description, price, guests, beds, baths } = req.body;
                // このクエリでは、提供されたデータで1つの住宅を作成します。ホームのidはcuid関数で自動生成され、createdAtとupdatedAtもPrismaが生成してくれることに注意しましょう。したがって、これらのフィールドをクエリに渡す必要はありません。
            const home = await prisma.home.create({
                data: { image, title, description, price, guests, beds, baths },
            });
            res.status(200).json(home);
        } catch (e) {
            res.status(500).json({ message: 'Something went wrong' });
        }
    // HTTP method not supported!
    } else {
      res.setHeader('Allow', ['POST']);
      res
        .status(405)
        .json({ message: `HTTP method ${req.method} is not supported.` });
    }
  }

//   Next.jsのAPIルートでリクエストを処理するために、デフォルトで次のパラメータを受け取る関数（リクエストハンドラ）をエクスポートする必要があります。

//   req: HTTPリクエストのインスタンスと、いくつかのビルド済みミドルウェア
//   res: サーバーレスポンスオブジェクトのインスタンスと、いくつかのヘルパー関数

// リクエストハンドラの内部で、req.method を使ってリクエストの HTTP メソッドをチェックします。
// 確かに、POSTリクエストを受け取った場合のみ、新しいレコードを作成することになる。
// それ以外のHTTPメソッドは扱わないので、クライアントに405というステータスコードを返します。