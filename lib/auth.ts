import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { dbConnect } from "./mongodb";
import { User } from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await dbConnect();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            await User.create({
              googleId: user.id || profile?.sub,
              name: user.name,
              email: user.email,
              image: user.image,
              plan: "free",
              qrCount: 0,
            });
          }
        } catch (error) {
          console.error("Error creating user during sign in", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        try {
          await dbConnect();
          const dbUser = await User.findOne({ email: session.user.email });
          if (dbUser) {
            (session.user as any).plan = dbUser.plan;
            (session.user as any).dbId = dbUser._id.toString();
          }
        } catch (e) {
          console.error("Session callback DB error:", e);
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
