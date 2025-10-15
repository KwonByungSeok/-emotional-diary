import React from "react";
import { DiariesDetail } from "@/components/diaries-detail";

// ============================================
// Types & Interfaces
// ============================================

interface DiariesDetailPageProps {
  params: {
    id: string;
  };
}

// ============================================
// Diaries Detail Page Component
// ============================================

export default function DiariesDetailPage({ params }: DiariesDetailPageProps) {
  return (
    <main>
      <DiariesDetail id={params.id} />
    </main>
  );
}
