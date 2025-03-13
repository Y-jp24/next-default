// app/call/page.jsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { connect, createLocalTracks } from 'twilio-video';

export default function CallPage() {
  const [room, setRoom] = useState(null);
  const [token, setToken] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('未接続');
  const [remoteParticipants, setRemoteParticipants] = useState([]);
  const localMediaRef = useRef(null);
  const remoteMediaRef = useRef(null);

  // ページ読み込み時にトークンを取得（identityはランダムな値を利用）
  useEffect(() => {
    async function fetchToken() {
      const identity = Math.random().toString(36).substring(2);
      const res = await fetch(`/api/twilio/token?identity=${identity}&room=my-audio-room`);
      const data = await res.json();
      setToken(data.token);
    }
    fetchToken();
  }, []);

  const joinRoom = async () => {
    if (!token) return;
    setConnectionStatus('接続中...');
    const localTracks = await createLocalTracks({ audio: true, video: false });
    const room = await connect(token, {
      name: 'my-audio-room',
      tracks: localTracks,
    });
    setRoom(room);
    setConnectionStatus(`入室中: ${room.name}`);

    // ローカルの音声トラックをDOMに追加
    localTracks.forEach(track => {
      if (track.kind === 'audio') {
        const audioElem = track.attach();
        audioElem.style.display = 'none'; // 必要に応じて表示／非表示を調整
        localMediaRef.current.appendChild(audioElem);
      }
    });

    // 既に入室している参加者の情報をセット
    const initialParticipants = [];
    room.participants.forEach(participant => {
      initialParticipants.push({ id: participant.sid, identity: participant.identity, status: '入室中' });
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
    setRemoteParticipants(initialParticipants);

    // 新たな参加者の入室イベント
    room.on('participantConnected', participant => {
      setRemoteParticipants(prev => [
        ...prev,
        { id: participant.sid, identity: participant.identity, status: '入室中' },
      ]);
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

    // 参加者の退室イベント
    room.on('participantDisconnected', participant => {
      setRemoteParticipants(prev => prev.filter(p => p.id !== participant.sid));
      // リモートメディアのDOMを再描画
      remoteMediaRef.current.innerHTML = '';
      room.participants.forEach(p => {
        p.tracks.forEach(publication => {
          if (publication.track) {
            const audioElem = publication.track.attach();
            remoteMediaRef.current.appendChild(audioElem);
          }
        });
      });
    });

    // ローカル参加者が退室したときのイベント
    room.on('disconnected', () => {
      setConnectionStatus('退室済み');
      setRoom(null);
      setRemoteParticipants([]);
      localMediaRef.current.innerHTML = '';
      remoteMediaRef.current.innerHTML = '';
    });
  };

  const leaveRoom = () => {
    if (room) {
      // 退室前にローカルの各トラックを停止（マイクの動作を停止）
      room.localParticipant.tracks.forEach(publication => {
        publication.track.stop();
      });
      room.disconnect();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Twilio Audio Call改2</h1>
      <p className="mb-4">状態: {connectionStatus}</p>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={joinRoom}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={room !== null}
        >
          入室
        </button>
        <button
          onClick={leaveRoom}
          className="bg-red-500 text-white px-4 py-2 rounded"
          disabled={room === null}
        >
          退室
        </button>
      </div>
      <div className="mb-4">
        <h2 className="font-bold">リモート参加者:</h2>
        <ul>
          {remoteParticipants.map(participant => (
            <li key={participant.id}>
              {participant.identity} - {participant.status}
            </li>
          ))}
        </ul>
      </div>
      <div ref={localMediaRef} id="local-media" />
      <div ref={remoteMediaRef} id="remote-media" />
    </div>
  );
}
