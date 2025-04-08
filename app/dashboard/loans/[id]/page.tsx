import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  User, Phone, MapPin, Calendar, CreditCard, Coins, FileText, Home, Users, BadgeEuro, Banknote
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

interface LoanDetailsPageProps {
  params: { id: string };
}

const steps = [
  { label: "Demande reçue", key: "submitted" },
  { label: "En traitement", key: "processing" },
  { label: "Analyse financière", key: "scoring" },
  { label: "Validation finale", key: "final_review" },
  { label: "Réponse envoyée", key: "completed" },
];

const statusStageMap: Record<string, string> = {
  "en attente": "submitted",
  "processing": "processing",
  "scoring": "scoring",
  "final_review": "final_review",
  "refusé": "completed",
  "approuvé": "completed",
};

export default async function LoanDetailsPage({ params }: LoanDetailsPageProps) {
  const supabase = createServerComponentClient({ cookies: () => cookies() });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/sign-in");

  const { data: loan, error } = await supabase
    .from("loan_requests")
    .select("*")
    .eq("id", params.id)
    .eq("email", session.user.email)
    .single();

  if (error || !loan) notFound();

  const currentStepKey = statusStageMap[loan.status] || "submitted";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approuvé":
        return "bg-green-100 text-green-700 border border-green-200";
      case "refusé":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back link */}
      <Link
        href="/dashboard/loans"
        className="inline-flex items-center text-sm text-muted-foreground hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Retour à la liste des prêts
      </Link>

      {/* Loan detail card */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Détails de la demande</CardTitle>
          <Badge className={getStatusColor(loan.status)}>{loan.status}</Badge>
        </CardHeader>

        {/* Timeline */}
        <CardContent className="px-8 pt-4">
          <h2 className="text-sm font-medium mb-4">Avancement de la demande</h2>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {steps.map((step, index) => {
              const isActive = steps.findIndex((s) => s.key === currentStepKey) >= index;
              return (
                <React.Fragment key={step.key}>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2",
                        isActive ? "bg-green-500 border-green-500" : "border-gray-300"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs",
                        isActive ? "text-green-600 font-medium" : "text-gray-500"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index !== steps.length - 1 && (
                    <div className="hidden md:block w-8 h-px bg-gray-300" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>

        {/* Loan details */}
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
          <Box icon={<User />} label="Nom" value={loan.full_name} />
          <Box icon={<BadgeEuro />} label="Montant" value={`${loan.amount} Dh`} />
          <Box icon={<Calendar />} label="Durée" value={`${loan.duration} mois`} />
          <Box icon={<Coins />} label="Mensualité" value={`${loan.mensualite} Dh`} />
          <Box icon={<FileText />} label="Type de prêt" value={loan.loan_type} />
          <Box icon={<CreditCard />} label="Type de client" value={loan.client_type} />
          <Box icon={<Banknote />} label="Apport" value={loan.apport ?? "Aucun"} />
          <Box icon={<Phone />} label="Téléphone" value={loan.phone} />
          <Box icon={<MapPin />} label="Adresse" value={loan.address} />
          <Box icon={<Home />} label="Situation familiale" value={loan.marital_status} />
          <Box icon={<Users />} label="Personnes à charge" value={loan.dependents} />
          <Box icon={<Calendar />} label="Soumis le" value={new Date(loan.created_at).toLocaleDateString("fr-FR")} />
        </CardContent>
      </Card>
    </div>
  );
}

function Box({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-md border shadow-sm">
      <div className="w-5 h-5 mt-1 text-muted-foreground">{icon}</div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
    </div>
  );
}
