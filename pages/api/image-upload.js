 import { createClient } from '@supabase/supabase-js';
// import { nanoid } from 'nanoid';
// import { decode } from 'base64-arraybuffer';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// export default async function handler(req, res) {
//     // Upload image to Supabase
//     if (req.method === 'POST') {
//       // リクエストのボディから画像データを取得し、それが空でないことを確認します。
//         let { image } = req.body;

//         if (!image) {
//         return res.status(500).json({ message: 'No image provided' });
//         }

//         try {
//             // Base64でエンコードされているはずの画像データを確認します。
//             const contentType = image.match(/data:(.*);base64/)?.[1];
//             const base64FileData = image.split('base64,')?.[1];

//             if (!contentType || !base64FileData) {
//             return res.status(500).json({ message: 'Image data not valid' });
//             }

//             // ユニークなファイル名を生成する。ここでは、ファイル拡張子とともに、nanoidというnpmパッケージを使っています。
//             const fileName = nanoid();
//             const ext = contentType.split('/')[1];
//             const path = `${fileName}.${ext}`;

//             // Supbaseのバケットにファイルをアップロードします。ここでは、SUPABASE_BUCKET envでバケット名、上記で定義したファイルパス、contentTypeとともにデコードされたBase64データを指定する必要があります。
//             // Base64データをデコードするには、base64-arraybuffer npm パッケージを使用します。
//             const { data, error: uploadError } = await supabase.storage
//                 .from(process.env.SUPABASE_BUCKET)
//                 .upload(path, decode(base64FileData), {
//                     contentType,
//                     upsert: true,
//             });

//             if (uploadError) {
//             throw new Error('Unable to upload image to storage');
//             }

//             // 画像のアップロードに成功したら、その公開URLを作成し、HTTPリクエストを開始したクライアントに返すことができます。
//             const url = `${process.env.SUPABASE_URL.replace('.co', '.in')}/storage/v1/object/public/${data.Key}`;

//             return res.status(200).json({ url });
//         } catch (e) {
//             res.status(500).json({ message: 'Something went wrong' });
//         }
//     }
//     // HTTP method not supported!
//     else {
//       res.setHeader('Allow', ['POST']);
//       res
//         .status(405)
//         .json({ message: `HTTP method ${req.method} is not supported.` });
//     }
//   }



// import { supabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';
import { decode } from 'base64-arraybuffer';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  // Upload image to Supabase
  if (req.method === 'POST') {
    let { image } = req.body;

    if (!image) {
      return res.status(500).json({ message: 'No image provided' });
    }

    try {
      const contentType = image.match(/data:(.*);base64/)?.[1];
      const base64FileData = image.split('base64,')?.[1];

      if (!contentType || !base64FileData) {
        return res.status(500).json({ message: 'Image data not valid' });
      }

      // Upload image
      const fileName = nanoid();
      const ext = contentType.split('/')[1];
      const path = `${fileName}.${ext}`;

      const { data, error: uploadError } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(path, decode(base64FileData), {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        console.log(uploadError);
        throw new Error('Unable to upload image to storage');
      }

      // Construct public URL
      const url = `${process.env.SUPABASE_URL.replace(
        '.co',
        '.in'
      )}/storage/v1/object/public/${data.Key}`;

      return res.status(200).json({ url });
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader('Allow', ['POST']);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}