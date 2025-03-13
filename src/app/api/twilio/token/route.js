// app/api/twilio/token/route.js
import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const identity = searchParams.get('identity') || 'anonymous';
    const roomName = searchParams.get('room') || 'default-room';

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;

    if (!accountSid || !apiKey || !apiSecret) {
      throw new Error('Twilioの環境変数が正しく設定されていません。');
    }

    const AccessToken = twilio.jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;

    const token = new AccessToken(accountSid, apiKey, apiSecret, { identity });
    const videoGrant = new VideoGrant({ room: roomName });
    token.addGrant(videoGrant);

    return NextResponse.json({ token: token.toJwt() });
  } catch (error) {
    console.error('トークン生成エラー:', error);
    return NextResponse.error();
  }
}
