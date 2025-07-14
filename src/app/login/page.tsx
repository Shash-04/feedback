'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: any) => {
        e.preventDefault();

        const res = await signIn("credentials", {
            email,
            password,
            redirect: true,
            callbackUrl: "/", // redirect after login
        });

        console.log(res);
    };

    return (
        <form onSubmit={handleLogin} className="flex flex-col gap-2 w-1/3 mx-auto mt-10">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="border p-2"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="border p-2"
            />
            <button type="submit" className="bg-blue-500 text-white p-2">Login</button>
        </form>
    );
}
