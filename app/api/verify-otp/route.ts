import twilio from 'twilio';

export async function POST(request: Request) {
  const { phone }= await request.json();

  const accountSid = process.env.ACCOUNT_SID;
  const authToken = process.env.AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  const verifyCode = Math.random().toString().slice(2, 8);

  try {
    const message = await client.messages.create({
      body: `your verify code: ${verifyCode}`,
      from: '+12075693402',
      to: `+886${phone}`
    });

    return Response.json({
      code: verifyCode
    });
  } catch (error) {
    const errorMsg = (error as Error)?.message;

    return Response.json({
      errorMsg
    }, { status: 500 });
  }
}
