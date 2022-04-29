import Image from 'next/image';
import Layout from '@/components/Layout';
import { PrismaClient } from '@prisma/client';
import { useRouter } from 'next/router';

// Instantiate Prisma Client
const prisma = new PrismaClient();

// const ListedHome = (home = null) => { ... }



const ListedHome = (home = null) => {
    const router = useRouter();

     // Fallback version
    if (router.isFallback) {
        return 'Loading...';
    }

  return (
    <Layout>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4 space-y-4">
          <div>
            <h1 className="text-2xl font-semibold truncate">
              {home?.title ?? ''}
            </h1>
            <ol className="inline-flex items-center space-x-1 text-gray-500">
              <li>
                <span>{home?.guests ?? 0} guests</span>
                <span aria-hidden="true"> · </span>
              </li>
              <li>
                <span>{home?.beds ?? 0} beds</span>
                <span aria-hidden="true"> · </span>
              </li>
              <li>
                <span>{home?.baths ?? 0} baths</span>
              </li>
            </ol>
          </div>
        </div>

        <div className="mt-6 aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg shadow-md overflow-hidden">
          {home?.image ? (
            <Image
              src={home.image}
              alt={home.title}
              layout="fill"
              objectFit="cover"
            />
          ) : null}
        </div>

        <p className="mt-8 text-lg">{home?.description ?? ''}</p>
      </div>
    </Layout>
  );
}

// この関数は、ビルド時にプリレンダリングするページのすべてのパスを、返されたオブジェクトのparamsプロパティの下に対応するid値とともに返す必要があります。
// この関数の中で、prisma.home.findManyを呼び出してデータベースからすべての住宅レコードを取得し、Prismaのselect指示文を使用して各レコードのidフィールドのみを取得します。
// そして、pathsプロパティにページをプリレンダリングしたいホームのすべてのIDを含むオブジェクトを返します。paths はオブジェクトの配列で、params プロパティには動的ルートのクエリパラメータが含まれます。ここでは、クエリパラメータはページのファイル名である [id].js で定義した id だけです。
    export async function getStaticPaths() {
        // Get all the homes IDs from the database
        const homes = await prisma.home.findMany({
        select: { id: true },
        });

        // 最後に、返されたオブジェクトは、falseに設定されたfallbackプロパティを持っています。これは、getStaticPathsによって返されなかったパスは、404ページとなることを意味します。
        // fallback: true,ビルド時に既存のホームのページを構築すると同時に、実行時に遅延的にページを構築し続けるフォールバックを定義する
        // getStaticPaths関数から返されるfallbackプロパティを使用します。

        // この例では、fallbackをtrueに設定しています。つまり、ビルド時に生成されていないパスは、もう404ページにはならず、代わりにNext.jsは、そのようなパスへの最初のリクエスト時に「予備」バージョンのページを提供することになります。
        // そしてバックグラウンドで、Next.jsはリクエストされた経路を静的に生成し、getStaticPropsを実行します。それが終わると、ブラウザはサーバーから取得したデータを受け取り、自動的にページを再レンダリングします。そして同時に、Next.jsはこの新しいパスをプリレンダリングページのリストに追加します。
        // したがって、同じパスへのその後のすべてのリクエストは、ビルド時にプリレンダリングされた他のページと同様に、生成されたページを提供します。
        return {
        paths: homes.map(home => ({
            params: { id: home.id },
        })),
        fallback: true,
        };
    }

    // PrismaのfindUnique関数を使って、クエリのparamsオブジェクトから取得したidでリクエストされたルートのデータを取得しています。
    // そして、データベースで対応するホームが見つかれば、それをListedHome Reactコンポーネントにpropとして返します。そうでない場合は、リクエストされたホームが見つからない場合に、ユーザーをアプリのホームページにリダイレクトするようにNext.jsに伝えるためのオブジェクトを返します。
    export async function getStaticProps({ params }) {
        // Get the current home from the database
        const home = await prisma.home.findUnique({
        where: { id: params.id },
        });
        if (home) {
        return {
            props: JSON.parse(JSON.stringify(home)),
        };
        }

        return {
        redirect: {
            destination: '/',
            permanent: false,
        },
        };
    }

export default ListedHome;