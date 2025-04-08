// app/dashboard/loans/[id]/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Demande de prêt ${params.id}`,
  };
}

export default async function LoanDetailsPage({ params }: PageProps) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const { data: loan, error } = await supabase
    .from("loan_requests")
    .select("*")
    .eq("id", params.id)
    .eq("email", session.user.email)
    .single();

  if (error || !loan) {
    console.error("Erreur lors de la récupération des détails du prêt :", error?.message);
    return <div className="p-6">Aucune demande trouvée.</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Détails de la demande de prêt</h1>
      <div className="border rounded-md p-4 shadow-sm space-y-2 bg-white">
        <p>
          <span className="font-medium">Montant :</span> {loan.amount} Dh
        </p>
        <p>
          <span className="font-medium">Durée :</span> {loan.duration} mois
        </p>
        <p>
          <span className="font-medium">Statut :</span> {loan.status ?? "En cours"}
        </p>
        <p className="text-sm text-gray-500">
          Soumis le : {new Date(loan.created_at).toLocaleDateString("fr-FR")}
        </p>
      </div>
    </div>
  );
}
