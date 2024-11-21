// src\lib\auth.ts
import { compare } from 'bcryptjs';
import NextAuth, { Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDatabase } from './db';
import { signInSchema } from './zod';

/**
 * NextAuth configuration for handling authentication.
 * Includes Google, GitHub, and Credentials providers.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          // Validate credentials using zod schema
          const parsedData = await signInSchema.parseAsync(credentials);

          if (
            typeof parsedData.email !== 'string' ||
            typeof parsedData.password !== 'string'
          ) {
            throw new Error('Invalid credentials');
          }
          // Find user in database by email
          const { db } = await connectToDatabase();
          const user = await db
            .collection('users')
            .findOne({ email: parsedData.email });

          // Compare password with stored hash
          if (user && (await compare(parsedData.password, user.password))) {
            return {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role,
            };
          }

          throw new Error('Invalid email or password');
        } catch (error: any) {
          console.error('Error in authorize:', error);
          if (error.name === 'ZodError') {
            throw new Error('Validation error');
          }
          throw new Error('Authentication failed');
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      const { db } = await connectToDatabase();

      // Vérifiez si l'utilisateur existe déjà
      const existingUser = await db.collection('users').findOne({
        email: user.email,
      });

      if (!existingUser) {
        const { db } = await connectToDatabase();

        // Génération ou extraction du username
        let usernameNormalized =
          user.name?.toLowerCase().replace(/[^a-z0-9]/g, '') || // Normalisez le username
          user.email
            ?.split('@')[0]
            .toLowerCase()
            .replace(/[^a-z0-9]/g, ''); // Utilisez le début de l'email si aucun nom n'est fourni

        // Vérifiez si le username existe déjà dans la base de données
        let isUsernameTaken = await db
          .collection('users')
          .findOne({ usernameNormalized });
        let attempt = 1; // Compteur pour générer un username unique

        while (isUsernameTaken) {
          // Ajoutez un suffixe pour rendre le username unique
          usernameNormalized = `${usernameNormalized}${attempt}`;
          attempt += 1;

          // Vérifiez à nouveau si le nouveau username existe déjà
          isUsernameTaken = await db
            .collection('users')
            .findOne({ usernameNormalized });
        }

        const newUser = {
          email: user.email,
          username: user.name || usernameNormalized,
          usernameNormalized: usernameNormalized,
          password: null, // Les utilisateurs OAuth n'ont pas de mot de passe
          oauthProvider: account?.provider, // Champ dédié pour le fournisseur OAuth
          projects: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await db.collection('users').insertOne(newUser);
        console.log('✅ New user created via OAuth:', newUser);
      } else {
        console.log('🔄 User already exists in database:', existingUser);
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session) {
        return { ...token, ...session?.user };
      }
      if (user) {
        token.username = user.username || '';
        token.email = user.email || '';
        token.role = user.role || 'user';
        token.image = user.image || '';
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {
      session.user = {
        id: token.sub,
        username: token.username,
        email: token.email,
        role: token.role,
        image: token.image,
        emailVerified: token.emailVerified
          ? new Date(token.emailVerified)
          : null,
      } as User;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});
