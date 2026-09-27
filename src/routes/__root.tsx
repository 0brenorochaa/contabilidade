import { QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth/provider";
import { APP_NAME, APP_SLOGAN } from "@/lib/constants";
import { makeQueryClient } from "@/lib/query";
import { bootstrapApp } from "@/lib/server/user";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: `${APP_NAME} — ${APP_SLOGAN}` },
      { name: "description", content: "Tenha uma visão clara das suas finanças, controle seus gastos e organize seu futuro financeiro." },
      { name: "theme-color", content: "#0D7A5F" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: Root,
});

function Bootstrap() {
  useEffect(() => {
    void bootstrapApp();
  }, []);
  return null;
}

function Root() {
  const [queryClient] = useState(() => makeQueryClient());
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <ThemeProvider>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <Bootstrap />
              <Outlet />
              <Toaster richColors position="top-center" />
            </QueryClientProvider>
          </AuthProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
