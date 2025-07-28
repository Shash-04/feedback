import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) return null;

                const { email, password } = credentials;

                const users = [
                    {
                        id: "1",
                        name: "Admin User",
                        email: "shash@gmail.com",
                        password: "shash",
                    },
                    {
                        id: "2",
                        name: "Test User",
                        email: "user@gmail.com",
                        password: "user123",
                    },
                ];

                const user = users.find(
                    (u) => u.email === email && u.password === password
                );

                if (user) {
                    const { password, ...userWithoutPassword } = user;
                    return userWithoutPassword;
                }

                return null;
            }

        }),
    ],
    pages: {
        signIn: "/login", // optional
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET, // set in your .env file
});

export { handler as GET, handler as POST };
