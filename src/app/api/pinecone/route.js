import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

// 環境変数から取得
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
// const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PINECONE_INDEX_NAME = 'my-index'; // 事前に作成済みのインデックス

// PineconeとOpenAIクライアント初期化
async function initClients() {
  // Pineconeクライアントの初期化
//   const pinecone = new Pinecone();

  const pinecone = new Pinecone({
    apiKey: PINECONE_API_KEY
  });

//   await pinecone.init({
//     apiKey: PINECONE_API_KEY,
//     environment: PINECONE_ENVIRONMENT,
//   });
  const index = pinecone.index(PINECONE_INDEX_NAME);

  // OpenAIクライアントの初期化
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

  return { pinecone, openai, index };
}

// テキストをOpenAI Embeddings APIでベクトル化する関数
async function getEmbeddingFromOpenAI(openai, text) {
  // ★ v4系は "await openai.embeddings.create()" の戻り値が
  //    { data: [ { embedding: [...] } ], ... } の形で返ってきます
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small', // 新しいEmbeddingモデル
    input: text,
    // 省略可: "float"にすると直接浮動小数点配列として返ってくる
    encoding_format: 'float',
  });

  // v4では配列が response.data に入っている
  return response.data[0].embedding;
}

// POSTメソッド: データ登録用 (テキストをEmbedding→Pineconeへアップサート)
export async function POST(request) {
  try {
    const { text, id } = await request.json();
    if (!text) {
      return NextResponse.json(
        { error: '登録するテキスト(text)がありません。' },
        { status: 400 }
      );
    }

    // クライアント初期化
    const { openai, index } = await initClients();

    // テキストをEmbeddingに変換
    const embedding = await getEmbeddingFromOpenAI(openai, text);

    // Pineconeにアップサート
    //index.namespace('ns1').upsert(vectors);に変更、namespaceはdefaultとした。
    await index.namespace('default').upsert([
          {
            id: id ?? `${Date.now()}`, // IDが無ければ簡易的にタイムスタンプを使用
            values: embedding,
            metadata: { text },
          },
        ]
     );

    return NextResponse.json(
      { message: 'データの登録に成功しました。' },
      { status: 200 }
    );
  } catch (error) {
    console.error('POSTエラー:', error);
    return NextResponse.json(
      { error: 'データ登録に失敗しました。' },
      { status: 500 }
    );
  }
}

// GETメソッド: 類似検索用 (クエリ文字列をEmbedding→Pineconeでクエリ)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryText = searchParams.get('query');
    if (!queryText) {
      return NextResponse.json(
        { error: 'クエリ文字列(query)がありません。' },
        { status: 400 }
      );
    }

    // クライアント初期化
    const { openai, index } = await initClients();

    // クエリをEmbeddingに変換
    const queryEmbedding = await getEmbeddingFromOpenAI(openai, queryText);

    // Pineconeへクエリ送信 (類似度上位5件)
    const queryResponse = await index.namespace('default').query({
        vector: queryEmbedding,
        topK: 5,
        includeMetadata: true,
      });

    const matches = queryResponse.matches || [];
    const results = matches.map((match) => ({
      id: match.id,
      score: match.score,
      metadata: match.metadata,
    }));

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error('GETエラー:', error);
    return NextResponse.json(
      { error: '検索に失敗しました。' },
      { status: 500 }
    );
  }
}
