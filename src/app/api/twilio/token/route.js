// app/api/twilio/token/route.js
import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  // ユーザー識別子をクエリから取得（なければ "anonymous" とする）
  const identity = searchParams.get('identity') || 'anonymous';
  // ルーム名（指定がなければ"default-room"）
  const roomName = searchParams.get('room') || 'default-room';

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const apiKey = process.env.TWILIO_API_KEY;
  const apiSecret = process.env.TWILIO_API_SECRET;

  const AccessToken = twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;

  // アクセストークンを作成（この例ではVideoGrantを使用しますが、audio通話のみの場合でも同様）
  const token = new AccessToken(accountSid, apiKey, apiSecret, { identity });
  const videoGrant = new VideoGrant({ room: roomName });
  token.addGrant(videoGrant);

  return NextResponse.json({ token: token.toJwt() });
}
