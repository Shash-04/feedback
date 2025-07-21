import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // redirect if not logged in
  },
});

export const config = {
  matcher: ["/admin/:path*", "/admin"], // protect only /admin and its subroutes
};
