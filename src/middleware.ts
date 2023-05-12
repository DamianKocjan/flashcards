import { withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

export default withClerkMiddleware((_req: NextRequest) => {
  return NextResponse.next();
});

export const config = {
  matcher: "/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)",
};
