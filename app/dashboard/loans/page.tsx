// app/dashboard/loans/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LoanListPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  // ✅ Use the correct table: loan_requests
  const { data: loans, error } = await supabase
    .from("loan_requests")
    .select("*")
    .eq("email", session.user.email)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching loan requests:", error.message);
    return <div className="p-6">Erreur lors de la récupération des prêts.</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Mes demandes de prêt</h1>

      {loans && loans.length === 0 && (
        <p className="text-gray-500">Aucune demande trouvée.</p>
      )}

      <ul className="space-y-3">
        {loans?.map((loan) => (
          <Link href={`/dashboard/loans/${loan.id}`}>
  <li
    key={loan.id}
    className="cursor-pointer border p-4 rounded-md shadow-sm bg-white flex justify-between items-center hover:bg-gray-50 transition"
  >
    <div>
      <p className="text-sm text-gray-600">
        Montant : <span className="font-medium">{loan.amount} Dh</span>
      </p>
      <p className="text-sm text-gray-600">
        Durée : <span className="font-medium">{loan.duration} mois</span>
      </p>
      <p className="text-xs text-gray-400">
        Soumis le : {new Date(loan.created_at).toLocaleDateString("fr-FR")}
      </p>
    </div>
    <span className="text-xs px-2 py-1 rounded bg-gray-100 border text-gray-700">
      {loan.status ?? "En cours"}
    </span>
  </li>
</Link>
        ))}
      </ul>
    </div>
  );
}
