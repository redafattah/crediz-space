import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-6 py-16 bg-gray-50 text-gray-900">
      {/* Logo */}
      <div className="mb-10">
        <Image
          src="/crediz-logo.svg" // Replace with your actual logo
          alt="Crediz Logo"
          width={160}
          height={48}
          priority
        />
      </div>

      {/* Headline */}
      <h1 className="text-3xl sm:text-4xl font-semibold mb-4 text-center">
        Bienvenue sur l’Espace Client Crediz
      </h1>
      <p className="text-gray-600 text-center max-w-md mb-10">
        Connectez-vous à votre compte pour suivre vos prêts, consulter vos
        échéances et gérer vos informations personnelles.
      </p>

      {/* Auth buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link
          href="/sign-in"
          className="px-6 py-3 text-sm font-medium bg-black text-white rounded-md hover:bg-gray-800 transition-all text-center"
        >
          Se connecter
        </Link>
        <Link
          href="/sign-up"
          className="px-6 py-3 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-100 transition-all text-center"
        >
          Créer un compte
        </Link>
      </div>

      {/* Optional footer */}
      <footer className="mt-16 text-xs text-gray-400 text-center">
        © {new Date().getFullYear()} Crediz. Tous droits réservés.
      </footer>
    </div>
  );
}
