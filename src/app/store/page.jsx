// app/store/page.jsx

'use client'; 
// ブラウザで動くコンポーネントなので"use client"が必要です

import { useState } from 'react';

export default function StorePage() {
  // 入力されたテキストを管理するステート
  const [text, setText] = useState('');
  // 結果メッセージを表示するためのステート
  const [result, setResult] = useState('');

  // 登録ボタンを押下した時の処理
  const handleSubmit = async (e) => {
    e.preventDefault(); // ページリロード防止

    if (!text) {
      setResult('テキストを入力してください。');
      return;
    }

    try {
      // /api/pinecone へPOSTリクエストを送る
      const response = await fetch('/api/pinecone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }), // テキストをJSONにして送信
      });

      if (!response.ok) {
        // エラー応答時
        const errorData = await response.json();
        setResult(`登録エラー: ${errorData.error || '不明なエラー'}`);
      } else {
        // 成功応答時
        const data = await response.json();
        setResult(`登録成功: ${data.message}`);
      }
    } catch (error) {
      console.error('登録例外エラー:', error);
      setResult('登録中に例外が発生しました。');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>テキスト登録ページ</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <label>
          登録するテキスト:
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ width: '400px', marginLeft: '1rem' }}
          />
        </label>
        <button type="submit" style={{ marginLeft: '1rem' }}>
          登録
        </button>
      </form>

      {/* 結果表示 */}
      {result && <p>{result}</p>}
    </div>
  );
}
