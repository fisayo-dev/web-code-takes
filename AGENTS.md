<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!--Codebase rules-->

1. All next.js pages involving fetch should be in a server component that renders a client component with the fetched data.
2. All elysia routes should have their types defined using TypeScript. the handlers should follow the struture - controller, service, repository.
3. Also maintain the sentry integration for error tracking.
4. Don't make any changes to middleware or routing configuration.
5. All UI should be device responsive.


<!--End of Codebase rules-->