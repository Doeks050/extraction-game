import { OperatorProfileClient } from "../../components/operator/OperatorProfileClient";
import { GameShell } from "../../components/shell/GameShell";

export default function OperatorPage() {
  return (
    <GameShell title="Operator" eyebrow="Profile">
      <OperatorProfileClient />
    </GameShell>
  );
}
