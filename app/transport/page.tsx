import TransportTips from "@/components/TransportTips";

export const metadata = {
  title: "Transport Guide - Getting Around Pattaya | Pattaya Directory",
  description: "Complete guide to transportation in Pattaya including baht bus routes, motorbike taxis, parking spots, and travel tips for tourists.",
};

export default function TransportPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container-custom">
        <TransportTips />
      </div>
    </div>
  );
}