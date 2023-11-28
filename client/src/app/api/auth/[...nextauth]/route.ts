import { NextAuthOptions } from 'next-auth';
import { DbUser, SessionWithToken } from '@/types';
import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';
import { JWT } from 'next-auth/jwt';
import { headers } from '../../../../../next.config';

const GOOGLE_ID = process.env.GOOGLE_ID!;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET!;

const GOOGLE_AUTHORISATION_URL =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    prompt: 'consent',
    access_type: 'offline',
    response_type: 'code',
  });

const API_URL = process.env.API_URL;

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      authorization: GOOGLE_AUTHORISATION_URL,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!(user && account)) return false;

      try {
        const response = await axios.post(
          `${API_URL}/signIn`,
          {
            oauth_id: user.id,
            oauth_provider: 'google',
          },
          {
            headers: { Authorization: account.access_token },
          }
        );

        if (response.status !== 200 && response.status !== 201) {
          console.log('User could not be created');
          return false;
        }

        const dbUser: DbUser = response.data;

        (user as DbUser).id = dbUser.id;
        (user as DbUser).oauth_id = dbUser.oauth_id;
        (user as DbUser).oauth_provider = dbUser.oauth_provider;
        (user as DbUser).roles = dbUser.roles;

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },

    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at! * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      }

      if (Date.now() < (token.expires_at as number)) {
        return token;
      }
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token) {
        (session as SessionWithToken).accessToken = token.accessToken as string;
        (session as SessionWithToken).error = token.error;
        (session as SessionWithToken).user = token.user as DbUser;
      }

      return session;
    },
  },
};

async function refreshAccessToken(token: JWT) {
  const url =
    'https://oauth2.googleapis.com/token?' +
    new URLSearchParams({
      client_id: GOOGLE_ID,
      client_secret: GOOGLE_SECRET,
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken as string,
    });

  const response = await axios.post(url);
  if (response.status !== 200) throw response.data;

  const refreshedTokens = response.data;
  return {
    ...token,
    accessToken: refreshedTokens.access_token,
    accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
    refreshToken: refreshedTokens.refresh_token || token.refreshToken,
  };
}

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
