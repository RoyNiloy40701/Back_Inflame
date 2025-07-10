import NextAuth from 'next-auth'
import connectToDtabase from '@/lib/mongodb'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    CredentialsProvider({
        // the name of display on the sign in fotm

        name: 'Credentials',
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password", placeholder: "password" }
        },
        async authorize(credentials, req) {
            const db = await connectToDtabase();
            const collection = db.collection('admin');
            const user = await collection.findOne({
                email: credentials.email,
            }); if(user && user.password === credentials.password) {
                return {
                 id:user._id,email:user.email
                };
            }return null;

        }
    })
       
  ],
  database: process.env.MONGODB_URI,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
    
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      
      return session;
    },
  },

  pages:{
    signIn: '/auth/signin',
   
  }
})