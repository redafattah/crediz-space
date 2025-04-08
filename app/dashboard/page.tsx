import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies: () => cookies() });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const { data: loans, error } = await supabase
    .from("loan_requests")
    .select("*")
    .eq("email", session.user.email)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des prêts:", error.message);
  }

  const totalLoans = loans?.length || 0;
  const totalAmount = loans?.reduce((sum, loan) => sum + loan.amount, 0) || 0;
  const lastLoan = loans?.[0];

  return (
    <main className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Bienvenue {session.user.email} 👋</h1>
        <p className="text-gray-600">Voici votre tableau de bord client Crediz.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="text-sm text-muted-foreground">Demandes totales</h2>
          <p className="text-2xl font-semibold">{totalLoans}</p>
        </div>

        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="text-sm text-muted-foreground">Montant total demandé</h2>
          <p className="text-2xl font-semibold">{totalAmount.toLocaleString()} Dh</p>
        </div>

        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="text-sm text-muted-foreground">Dernier statut</h2>
          <p className="text-xl font-medium">{lastLoan?.status ?? "Aucune demande"}</p>
          {lastLoan && (
            <Link
              href={`/dashboard/loans/${lastLoan.id}`}
              className="text-xs text-blue-600 underline mt-2 inline-block"
            >
              Voir la dernière demande →
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
