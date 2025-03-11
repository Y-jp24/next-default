/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useState, useEffect } from 'react';
import { connect, LocalAudioTrack, createLocalAudioTrack } from 'twilio-video';

export default function CallPage() {
  const [token, setToken] = useState<string | null>(null);
  const [room, setRoom] = useState<any>(null);

  // 初回マウント時にアクセストークンを取得
  useEffect(() => {
    fetch('/api/twilio/token')
      .then((res) => res.json())
      .then((data) => {
        setToken(data.token);
      })
      .catch((err) => console.error('Token取得エラー:', err));
  }, []);

  // ある participant の公開しているトラックをまとめてアタッチ
  const attachParticipantTracks = (participant: any) => {
    // 既に発行されているトラック（publication）をアタッチ
    participant.tracks.forEach((publication: any) => {
      if (publication.isSubscribed) {
        attachTrack(publication.track);
      }
    });

    // 新規に公開されたトラックがあればアタッチ
    participant.on('trackSubscribed', (track: any) => {
      attachTrack(track);
    });

    // track が取り下げられた場合のクリーンアップも必要なら
    participant.on('trackUnsubscribed', (track: any) => {
      detachTrack(track);
    });
  };

  // 1つの track を HTML にアタッチ
  const attachTrack = (track: any) => {
    const audioElement = track.attach();
    // ブラウザの自動再生ポリシー回避のための属性設定例
    audioElement.autoplay = true;
    audioElement.playsInline = true;
    audioElement.controls = false; // 必要に応じて
    // audioElement.play().catch((err: any) => console.error(err)); // さらに直接再生呼び出しが必要な場合

    document.getElementById('remoteAudio')?.appendChild(audioElement);
  };

  // 1つの track を HTML からデタッチ
  const detachTrack = (track: any) => {
    track.detach().forEach((el: HTMLMediaElement) => {
      el.remove();
    });
  };

  // ローカルのオーディオトラックを自分用にアタッチ（任意）
  // 自分の声をモニタしたい場合は attach、不要なら省略可
  const attachLocalAudio = async () => {
    const localTrack: any = await createLocalAudioTrack();
    const audioElement = localTrack.attach();
    audioElement.autoplay = true;
    audioElement.muted = true; // 自分の声が二重で聞こえないようにするなら muted
    document.getElementById('localAudio')?.appendChild(audioElement);
    return localTrack;
  };

  // 通話参加ハンドラー
  const handleJoinCall = async () => {
    if (!token) return;

    try {
      // 先にローカル音声を取得（必要に応じて）
      const localAudioTrack = await createLocalAudioTrack();

      // 部屋に接続
      const joinedRoom = await connect(token, {
        name: 'my-room',
        tracks: [localAudioTrack], // 自分のトラックを明示的に渡す
      });
      setRoom(joinedRoom);
      console.log(`Room ${joinedRoom.name} に参加しました`);

      // --- ここでローカルのオーディオを画面に表示したい場合 ---
      // （ユーザー自身の声を聞きたくない場合は不要）
      // attachLocalAudio(); // 上記のヘルパーを呼び出してもOK

      // 既に参加しているリモート参加者のトラックを表示＆イベントリスナー設定
      joinedRoom.participants.forEach((participant: any) => {
        console.log('既存参加者:', participant.identity);
        attachParticipantTracks(participant);
      });

      // 新規参加者が入室したとき
      joinedRoom.on('participantConnected', (participant: any) => {
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
        <div id="localAudio" className="mt-2"></div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">相手の音声</h2>
        <div id="remoteAudio" className="mt-2"></div>
      </div>
    </div>
  );
}
