import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";

const s3 = new S3Client({ region: "us-east-1" });
const ses = new SESClient({ region: "us-east-1" });

const FORWARD_TO = "groupemholdings@gmail.com";
const BUCKET = "avero-ses-incoming";
const FROM_ADDRESS = "noreply@averocloud.com";

export async function handler(event) {
  const record = event.Records?.[0];
  if (!record?.ses) {
    console.log("Not an SES event");
    return;
  }

  const mail = record.ses.mail;
  const messageId = mail.messageId;

  console.log(`Processing email ${messageId} from ${mail.source}`);

  try {
    const obj = await s3.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: messageId })
    );
    let rawEmail = await obj.Body.transformToString();

    // Rewrite headers for forwarding
    rawEmail = rawEmail.replace(
      /^From: .+$/m,
      `From: ${FROM_ADDRESS}\r\nReply-To: ${mail.source}`
    );
    rawEmail = rawEmail.replace(
      /^To: .+$/m,
      `To: ${FORWARD_TO}`
    );
    rawEmail = rawEmail.replace(
      /^Subject: (.+)$/m,
      `Subject: [averocloud.com] $1`
    );

    // Remove DKIM/SPF headers that would fail after modification
    rawEmail = rawEmail.replace(/^DKIM-Signature:[\s\S]*?(?=\r?\n\S)/gm, "");
    rawEmail = rawEmail.replace(/^Return-Path:.*$/gm, `Return-Path: <${FROM_ADDRESS}>`);

    await ses.send(
      new SendRawEmailCommand({
        RawMessage: { Data: Buffer.from(rawEmail) },
        Source: FROM_ADDRESS,
        Destinations: [FORWARD_TO],
      })
    );

    console.log(`Forwarded email from ${mail.source} to ${FORWARD_TO}`);
  } catch (err) {
    console.error("Email forwarding error:", err);
    throw err;
  }
}
