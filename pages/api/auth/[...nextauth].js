import NextAuth from 'next-auth';
import nodemailer from 'nodemailer';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import EmailProvider from "next-auth/providers/email";
import Handlebars from 'handlebars';
import GoogleProvider from 'next-auth/providers/google';
import path from 'path';

// Instantiate Prisma Client
const prisma = new PrismaClient();

// Email sender 新規ユーザーにウェルカムメールを送信
// const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_SERVER_HOST,
//     port: process.env.EMAIL_SERVER_PORT,
//     auth: {
//       user: process.env.EMAIL_SERVER_USER,
//       pass: process.env.EMAIL_SERVER_PASSWORD,
//     },
//     secure: true,
// });

// メールプロバイダの設定
const emailsDir = path.resolve(process.cwd(), 'emails');
// 1.まず、確認メールのファイルを読み、Handlebars を使ってテンプレートを作成し、動的な値を注入しています。
// 2.次に、transporter オブジェクトを使用して、関数の引数で取得したユーザのメールアドレスを識別子としてメールを送信しています。
// 3.最後に、sendMail 関数の html オプションは、マジックリンクやユーザーのメールアドレスなど、いくつかの値を注入し、Handlebars でコンパイルした後のメールの HTML を受け取ります。
// 以下は、アプリケーションにログインしようとしたときに受け取るべきメールです。
// const sendVerificationRequest = ({ identifier, url }) => {
//     const emailFile = readFileSync(path.join(emailsDir, 'confirm-email.html'), {
//       encoding: 'utf8',
//     });
//     const emailTemplate = Handlebars.compile(emailFile);
//     transporter.sendMail({
//       from: `"✨ SupaVacation" ${process.env.EMAIL_FROM}`,
//       to: identifier,
//       subject: 'Your sign-in link for SupaVacation',
//       html: emailTemplate({
//         base_url: process.env.NEXTAUTH_URL,
//         signin_url: url,
//         email: identifier,
//       }),
//     });
// };

// このイベントは、サインイン時にアダプタ（Prisma）が新規ユーザを作成したときに、NextAuthから呼び出される非同期関数です。
// このようなイベントが発生したときに、副作用を実行することができるので、非常に便利です。
const sendWelcomeEmail = async ({ user }) => {
    const { email } = user;

    try {
      const emailFile = readFileSync(path.join(emailsDir, 'welcome.html'), {
        encoding: 'utf8',
      });
      const emailTemplate = Handlebars.compile(emailFile);
      await transporter.sendMail({
        from: `"✨ SupaVacation" ${process.env.EMAIL_FROM}`,
        to: email,
        subject: 'Welcome to SupaVacation! 🎉',
        html: emailTemplate({
          base_url: process.env.NEXTAUTH_URL,
          support_email: 'support@themodern.dev',
        }),
      });
    } catch (error) {
      console.log(`❌ Unable to send welcome email to user (${email})`);
    }
};

export default NextAuth({
    pages: {
        signIn: '/',
        signOut: '/',
        error: '/',
        verifyRequest: '/',
      },
    providers: [
      EmailProvider({
        server: {
            host: process.env.EMAIL_SERVER_HOST,
            port: process.env.EMAIL_SERVER_PORT,
            auth: {
              user: process.env.EMAIL_SERVER_USER,
              pass: process.env.EMAIL_SERVER_PASSWORD,
            },
          },
        from: process.env.EMAIL_FROM,
        maxAge: 10 * 60, // Magic links are valid for 10 min only
        // sendVerificationRequest,
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
      }),
    ],
    adapter: PrismaAdapter(prisma),
    events: { createUser: sendWelcomeEmail }
  });


// import NextAuth from 'next-auth';
// import EmailProvider from 'next-auth/providers/email';
// import GoogleProvider from 'next-auth/providers/google';
// import { PrismaAdapter } from '@next-auth/prisma-adapter';
// // import { prisma } from '@/lib/prisma';
// import nodemailer from 'nodemailer';
// // import Handlebars from 'handlebars';
// import { readFileSync } from 'fs';
// import path from 'path';

// const prisma = new PrismaClient();
// // Email sender
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_SERVER_HOST,
//   port: process.env.EMAIL_SERVER_PORT,
//   auth: {
//     user: process.env.EMAIL_SERVER_USER,
//     pass: process.env.EMAIL_SERVER_PASSWORD,
//   },
//   secure: true,
// });

// const emailsDir = path.resolve(process.cwd(), 'emails');

// const sendVerificationRequest = ({ identifier, url }) => {
//   const emailFile = readFileSync(path.join(emailsDir, 'confirm-email.html'), {
//     encoding: 'utf8',
//   });
//   const emailTemplate = Handlebars.compile(emailFile);
//   transporter.sendMail({
//     from: `"✨ SupaVacation" ${process.env.EMAIL_FROM}`,
//     to: identifier,
//     subject: 'Your sign-in link for SupaVacation',
//     html: emailTemplate({
//       base_url: process.env.NEXTAUTH_URL,
//       signin_url: url,
//       email: identifier,
//     }),
//   });
// };

// const sendWelcomeEmail = async ({ user }) => {
//   const { email } = user;

//   try {
//     const emailFile = readFileSync(path.join(emailsDir, 'welcome.html'), {
//       encoding: 'utf8',
//     });
//     const emailTemplate = Handlebars.compile(emailFile);
//     await transporter.sendMail({
//       from: `"✨ SupaVacation" ${process.env.EMAIL_FROM}`,
//       to: email,
//       subject: 'Welcome to SupaVacation! 🎉',
//       html: emailTemplate({
//         base_url: process.env.NEXTAUTH_URL,
//         support_email: 'support@themodern.dev',
//       }),
//     });
//   } catch (error) {
//     console.log(`❌ Unable to send welcome email to user (${email})`);
//   }
// };

// export default NextAuth({
//   pages: {
//     signIn: '/',
//     signOut: '/',
//     error: '/',
//     verifyRequest: '/',
//   },
//   providers: [
//     EmailProvider({
//       maxAge: 10 * 60,
//       sendVerificationRequest,
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_SECRET,
//     }),
//   ],
//   adapter: PrismaAdapter(prisma),
//   events: { createUser: sendWelcomeEmail },
// });
