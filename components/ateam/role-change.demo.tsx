import { RoleChange, type RoleChangeRow } from "./role-change";

const rows: RoleChangeRow[] = [
  { id: "1", name: "Camille Durand", email: "camille.durand@sncf.fr", before: "Lecteur", after: "Éditeur" },
  { id: "2", name: "Hugo Martin", email: "hugo.martin@sncf.fr", before: "Aucun accès", after: "Lecteur" },
  { id: "3", name: "Léa Bernard", email: "lea.bernard@sncf.fr", before: "Admin", after: "Admin" },
  { id: "4", name: "Thomas Petit", email: "thomas.petit@sncf.fr", before: "Éditeur", after: "Aucun accès" },
  { id: "5", name: "Inès Moreau", email: "ines.moreau@sncf.fr", before: "Éditeur", after: "Lecteur" },
];

export default function Demo() {
  return (
    <RoleChange
      title="Rôles d'accès – Formulaires"
      target="app_formulaires.membres"
      requestedBy="Alex Martin"
      rows={rows}
    />
  );
}
