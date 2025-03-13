// app/call/page.jsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { connect, createLocalTracks } from 'twilio-video';

export default function CallPage() {
  const [room, setRoom] = useState(null);
  const [token, setToken] = useState('');
  const localMediaRef = useRef(null);
  const remoteMediaRef = useRef(null);

  // 初回レンダリング時にAccess Tokenを取得（ランダムなidentityを使用）
  useEffect(() => {
    async function fetchToken() {
      const identity = Math.random().toString(36).substring(2);
      const res = await fetch(`/api/twilio/token?identity=${identity}&room=my-audio-room`);
      const data = await res.json();
      setToken(data.token);
    }
    fetchToken();
  }, []);

  // ルームに参加する関数
  const joinRoom = async () => {
    if (!token) return;

    // 音声のみのローカルトラックを作成
    const localTracks = await createLocalTracks({ audio: true, video: false });
    const room = await connect(token, {
      name: 'my-audio-room',
      tracks: localTracks,
    });
    setRoom(room);

    // （音声は通常ビジュアルコンポーネントが不要ですが、場合に応じてDOMにattachできます）
    localTracks.forEach(track => {
      if (track.kind === 'audio') {
        const audioElem = track.attach();
        audioElem.style.display = 'none'; // 必要に応じて表示／非表示を調整
        localMediaRef.current.appendChild(audioElem);
      }
    });

    // 既存の参加者の音声トラックを表示（attach()でaudio要素を生成）
    room.participants.forEach(participant => {
      participant.tracks.forEach(publication => {
        if (publication.track) {
          const audioElem = publication.track.attach();
          remoteMediaRef.current.appendChild(audioElem);
        }
      });
      // 新たな参加者が接続した場合
      participant.on('trackSubscribed', track => {
        const audioElem = track.attach();
        remoteMediaRef.current.appendChild(audioElem);
      });
    });

    // 新規参加者の接続時イベント
    room.on('participantConnected', participant => {
      participant.tracks.forEach(publication => {
        if (publication.track) {
          const audioElem = publication.track.attach();
          remoteMediaRef.current.appendChild(audioElem);
        }
      });
      participant.on('trackSubscribed', track => {
        const audioElem = track.attach();
        remoteMediaRef.current.appendChild(audioElem);
      });
    });
  };

  // ルームから退出する関数
  const leaveRoom = () => {
    if (room) {
      room.disconnect();
      setRoom(null);
      // DOMをクリーンアップ
      if (localMediaRef.current) localMediaRef.current.innerHTML = '';
      if (remoteMediaRef.current) remoteMediaRef.current.innerHTML = '';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Twilio Audio Call</h1>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={joinRoom}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={room !== null}
        >
          Join Room
        </button>
        <button
          onClick={leaveRoom}
          className="bg-red-500 text-white px-4 py-2 rounded"
          disabled={room === null}
        >
          Leave Room
        </button>
      </div>
      <div ref={localMediaRef} id="local-media" />
      <div ref={remoteMediaRef} id="remote-media" />
    </div>
  );
}
