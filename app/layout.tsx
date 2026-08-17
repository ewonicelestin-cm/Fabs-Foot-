import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sports Predictions AI | Pronostics en temps réel",
  description:
    "Pronostics sportifs intelligents alimentés par IA.",
  keywords: [
    "sports",
    "pronostics",
    "IA",
    "football",
    "predictions"
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">

              <h1 className="text-3xl font-bold gradient-text">
                🏆 Pronostics IA
              </h1>

              <nav className="flex gap-6">
                <a
                  href="/"
                  className="text-gray-400 hover:text-white transition"
                >
                  Accueil
                </a>

                <a
                  href="#stats"
                  className="text-gray-400 hover:text-white transition"
                >
                  Statistiques
                </a>

                <a
                  href="#live"
                  className="text-gray-400 hover:text-white transition"
                >
                  En direct
                </a>
              </nav>

            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="border-t border-slate-700 bg-slate-900/50 mt-12 py-6 text-center text-gray-400">
          <p>
            © 2026 Sports Predictions AI.
            Tous droits réservés.
          </p>
        </footer>
      </body>
    </html>
  );
}
