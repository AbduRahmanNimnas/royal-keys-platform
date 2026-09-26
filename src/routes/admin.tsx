import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminAuthGate } from "@/components/AdminAuthGate";
import { AdminFrame, type AdminSection } from "@/components/admin/AdminFrame";
import { AdminOverview } from "@/components/admin/AdminOverview";
import {
  ApplicationsPanel,
  IntroductionsPanel,
  LeadsPanel,
  MatchesPanel,
  OffersPanel,
  OwnersPanel,
  PropertiesPanel,
  ViewingsPanel,
} from "@/components/admin/AdminOperations";
import {
  CommissionsPanel,
  DealsPanel,
  SettingsPanel,
  TasksPanel,
} from "@/components/admin/AdminFinance";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  return (
    <AdminAuthGate>
      <BrokerDashboard />
    </AdminAuthGate>
  );
}

function BrokerDashboard() {
  const [section, setSection] = useState<AdminSection>("overview");
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <AdminFrame
      section={section}
      setSection={setSection}
      mobileMenu={mobileMenu}
      setMobileMenu={setMobileMenu}
    >
      {section === "overview" ? <AdminOverview /> : null}
      {section === "properties" ? <PropertiesPanel /> : null}
      {section === "owners" ? <OwnersPanel /> : null}
      {section === "leads" ? <LeadsPanel /> : null}
      {section === "matches" ? <MatchesPanel /> : null}
      {section === "introductions" ? <IntroductionsPanel /> : null}
      {section === "viewings" ? <ViewingsPanel /> : null}
      {section === "offers" ? <OffersPanel /> : null}
      {section === "applications" ? <ApplicationsPanel /> : null}
      {section === "deals" ? <DealsPanel /> : null}
      {section === "commissions" ? <CommissionsPanel /> : null}
      {section === "tasks" ? <TasksPanel /> : null}
      {section === "settings" ? <SettingsPanel /> : null}
    </AdminFrame>
  );
}
