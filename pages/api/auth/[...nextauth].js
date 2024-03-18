import NextAuth, { getServerSession } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";

export const authproviders = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile.role ?? "User",
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        await mongooseConnect();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found");
        }
        const correctPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!correctPassword || credentials.email !== user.email) {
          throw new Error("Invalid credentials");
        }
        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user.role = token.role;

      return session;
    },
  },

  adapter: MongoDBAdapter(clientPromise),
};

// --------------------------------------------------

// export const authproviders = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_SECRET,
//       profile(profile) {
//         return {
//           id: profile.sub,
//           name: profile.name,
//           email: profile.email,
//           image: profile.picture,
//           role: profile.role ?? "User",
//         };
//       },
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       async authorize(credentials) {
//         await mongooseConnect();

//         const user = await User.findOne({ email: credentials.email });

//         console.log(user);

//         if (!user) {
//           throw new Error("No user found");
//         }
//         const correctPassword = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );

//         if (!correctPassword || credentials.email !== user.email) {
//           throw new Error("Invalid credentials");
//         }
//         return user;
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },

//   callbacks: {
//     async jwt({ token, user }) {
//       return { ...token, ...user };
//     },
//     async session({ session, token, user }) {
//       session.user.role = token.role;

//       return session;
//     },
//   },
//   adapter: MongoDBAdapter(clientPromise),
// };

export default NextAuth(authproviders);
