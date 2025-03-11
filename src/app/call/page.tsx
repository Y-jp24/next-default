/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useState, useEffect } from 'react';
import { connect } from 'twilio-video';

export default function CallPage() {
  const [token, setToken] = useState<string | null>(null);
  const [room, setRoom] = useState<any>(null);

  // 初回マウント時にアクセストークンを取得
  useEffect(() => {
    fetch('/api/twilio/token')
      .then(res => res.json())
      .then(data => {
        setToken(data.token);
      })
      .catch(err => console.error('Token取得エラー:', err));
  }, []);

  // 既存参加者のトラックをアタッチするヘルパー関数
  const attachParticipantTracks = (participant: any) => {
    // 既に発行されているトラックを処理
    participant.tracks.forEach((publication: any) => {
      if (publication.isSubscribed) {
        const audioTrack = publication.track;
        const audioElement = audioTrack.attach();
        document.getElementById('remoteAudio')?.appendChild(audioElement);
      }
    });
    // 新たに公開されたトラックにも対応
    participant.on('trackSubscribed', (track: any) => {
      const audioElement = track.attach();
      document.getElementById('remoteAudio')?.appendChild(audioElement);
    });
  };

  // 通話参加ハンドラー
  const handleJoinCall = async () => {
    if (!token) return;
    try {
      const room = await connect(token, {
        name: 'my-room',
        audio: true,
        video: false,
      });
      setRoom(room);
      console.log(`Room ${room.name} に参加しました`);

      // 既に参加しているリモート参加者のトラックを表示＆イベントリスン設定
      room.participants.forEach((participant: any) => {
        console.log('既存参加者:', participant.identity);
        attachParticipantTracks(participant);
      });

      // 新規参加者が入室したとき
      room.on('participantConnected', (participant: any) => {
        console.log('新規参加者:', participant.identity);
        attachParticipantTracks(participant);
      });
    } catch (error) {
      console.error("通話参加エラー:", error);
    }
  };

  // 通話終了ハンドラー
  const handleLeaveCall = () => {
    if (room) {
      room.disconnect();
      setRoom(null);
      console.log("ルームから切断しました");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Twilio WebRTC 音声通話</h1>
      {!room ? (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleJoinCall}
        >
          通話に参加する
        </button>
      ) : (
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleLeaveCall}
        >
          通話を終了する
        </button>
      )}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">自分の音声</h2>
        {/* ローカルの音声トラックはTwilio側で自動で送信されるため、必要に応じて表示用に扱う */}
        <div id="localAudio" className="mt-2"></div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">相手の音声</h2>
        <div id="remoteAudio" className="mt-2"></div>
      </div>
    </div>
  );
}
