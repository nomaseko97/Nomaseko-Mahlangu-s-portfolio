import { createRootRouteWithContext, Outlet, HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import appCss from "../styles.css?url";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Background } from "@/components/Background";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Nomaseko Mahlangu — IT Graduate, Data & Cloud" },
      { name: "description", content: "Portfolio of Nomaseko Brilliant Mahlangu — IT graduate specialising in data engineering, cloud, and AI-powered tools." },
      { property: "og:title", content: "Nomaseko Mahlangu — IT Graduate, Data & Cloud" },
      { property: "og:description", content: "Portfolio of Nomaseko Brilliant Mahlangu — IT graduate specialising in data engineering, cloud, and AI-powered tools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Nomaseko Mahlangu — IT Graduate, Data & Cloud" },
      { name: "twitter:description", content: "Portfolio of Nomaseko Brilliant Mahlangu — IT graduate specialising in data engineering, cloud, and AI-powered tools." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/335dce94-b1b4-49c0-a014-778af3ac78fb/id-preview-3adc2fa8--70b592d6-6c5c-4611-aace-dfc9ea74706c.lovable.app-1778228938992.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/335dce94-b1b4-49c0-a014-778af3ac78fb/id-preview-3adc2fa8--70b592d6-6c5c-4611-aace-dfc9ea74706c.lovable.app-1778228938992.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-7xl font-display font-bold text-gradient">404</h1>
        <p className="mt-3 text-muted-foreground">Page not found</p>
      </div>
    </div>
  ),
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Background />
      <Nav />
      <main className="pt-24">
        <Outlet />
      </main>
      <Footer />
    </QueryClientProvider>
  );
}
