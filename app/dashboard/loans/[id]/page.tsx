// app/dashboard/loans/[id]/page.tsx

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ✅ Déclare bien les props comme objets simples
export default async function LoanDetailsPage({
  params,
}: {
  params: { id: string };
}) {
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
    console.error("Erreur lors de la récupération du prêt :", error?.message);
    return <div className="p-6">Erreur lors du chargement de la demande.</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Détails de la demande</h1>
      <div className="border rounded p-4 bg-white shadow space-y-2">
        <p><strong>Montant :</strong> {loan.amount} Dh</p>
        <p><strong>Durée :</strong> {loan.duration} mois</p>
        <p><strong>Statut :</strong> {loan.status ?? "En cours"}</p>
        <p className="text-sm text-gray-500">
          Soumis le : {new Date(loan.created_at).toLocaleDateString("fr-FR")}
        </p>
      </div>
    </div>
  );
}
