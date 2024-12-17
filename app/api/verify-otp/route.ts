import twilio from 'twilio';

export async function POST(request: Request) {
  const { phone }= await request.json();

  const accountSid = process.env.ACCOUNT_SID;
  const authToken = process.env.AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  const verifyCode = Math.random().toString().slice(2, 8);

  try {
    const message = await client.messages.create({
      body: `親愛的東森購物網會員，驗證碼：${verifyCode}，請至手機驗證頁輸入此組號碼，以確保會員帳戶安全。\n\n@${process.env.DOMAIN} #${verifyCode}`,
      from: process.env.FROM_PHONE,
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
