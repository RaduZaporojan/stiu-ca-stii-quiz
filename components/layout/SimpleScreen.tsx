import type { ReactNode } from "react";
import { Footer } from "./Footer";

export function SimpleScreen({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden bg-white">
      <section className="flex flex-1 flex-col items-center px-5 pb-8 pt-6 text-center sm:px-6 sm:pb-10 sm:pt-8">
        {children}
      </section>
      <Footer />
    </main>
  );
}
