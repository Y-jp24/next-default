import { NextResponse } from 'next/server';
import Twilio from 'twilio';

export async function GET() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
  const apiKey = process.env.TWILIO_API_KEY as string;
  const apiSecret = process.env.TWILIO_API_SECRET as string;

  const AccessToken = Twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;

  // ランダムなユーザーID（実際は認証済みのユーザーIDなどを使用してください）
  const identity = "user-" + Math.floor(Math.random() * 1000);

  // アクセストークンの作成
  const token = new AccessToken(accountSid, apiKey, apiSecret, { identity });
  // 任意のルーム名を指定（ここでは 'my-room'）
  const videoGrant = new VideoGrant({ room: 'my-room' });
  token.addGrant(videoGrant);

  return NextResponse.json({ token: token.toJwt() });
}
