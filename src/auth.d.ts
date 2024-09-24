import NextAuth, { DefaultSession , User } from 'next-auth';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user?: {
            id?: string;
        } & DefaultSession['user'];
        accessToken: string;
    }
}