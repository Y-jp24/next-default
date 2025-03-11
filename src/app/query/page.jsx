'use client';

import { useState } from 'react';

// shadcn/ui コンポーネント
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Alert,
  AlertTitle,
  AlertDescription
} from '@/components/ui/alert';
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"

// Heroiconsなど別途アイコンライブラリを使う場合
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function QueryPage() {
  const [queryText, setQueryText] = useState('');
  const [results, setResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // 検索ボタン押下時の処理
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!queryText) {
      setErrorMsg('検索テキストを入力してください。');
      return;
    }
    setErrorMsg('');
    setResults([]);

    try {
      // APIにクエリ文字列を付加してGETリクエスト
      const response = await fetch(`/api/pinecone?query=${encodeURIComponent(queryText)}`);
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMsg(errorData.error || '不明なエラーが発生しました。');
        return;
      }
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('検索例外エラー:', error);
      setErrorMsg('検索中に例外が発生しました。');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">類似文章検索ページ</h1>
      
      {/* フォーム */}
      <form onSubmit={handleSearch} className="space-y-4 mb-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="queryText" className="whitespace-nowrap">
            検索テキスト:
          </Label>
          <Input
            id="queryText"
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            className="w-full max-w-md"
          />
          <Button type="submit">検索</Button>
        </div>
      </form>

      {/* エラーメッセージ */}
      {errorMsg && (
        <Alert variant="destructive" className="mb-4">
          {/* アイコンはお好みで */}
          <ExclamationTriangleIcon className="h-5 w-5 shrink-0 mr-2" />
          <div>
            <AlertTitle className="font-semibold">エラー</AlertTitle>
            <AlertDescription>
              {errorMsg}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* 検索結果 */}
      {results.length > 0 && (
        <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">検索結果</h2>
    <Carousel
      opts={{
        align: "start",
      }}
      orientation="vertical"
      className="w-full"
    >
      <CarouselContent>
        {results.map((res) => (
          <CarouselItem key={res.id} className="pt-1 md:basis-1/2">
            <div className="p-1">
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                                <p>スコア: {res.score}</p>
                                <p>ID: {res.id}</p>
                                <p>テキスト: {res.metadata?.text}</p>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>

          
            <Carousel orientation="vertical">
                <CarouselContent>
                    
                </CarouselContent>
            </Carousel>
        </div>
      )}
    </div>
  );
}
