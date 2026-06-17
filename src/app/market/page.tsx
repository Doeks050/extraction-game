import { MarketClient } from "../../components/market/MarketClient";
import { GameShell } from "../../components/shell/GameShell";
import { marketTraders } from "../../data/market/traders";

export default function MarketPage() {
  return (
    <GameShell title="Market" eyebrow="Trader Network">
      <MarketClient traders={marketTraders} />
    </GameShell>
  );
}
