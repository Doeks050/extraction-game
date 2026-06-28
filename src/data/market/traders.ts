import type { MarketTrader } from "../../types/market";

export const marketTraders: MarketTrader[] = [
  {
    id: "weapon_trader",
    name: "Weapon Trader",
    role: "Low-tier firearms",
    kind: "weapon",
    status: "available",
    reputationLevel: 1,
    categoryFilters: ["weapon"],
    description:
      "A rotating selection of affordable pistols, carbines and service rifles.",
    stockItemIds: [
      "wpn_makarov_pm",
      "wpn_tokarev_tt33",
      "wpn_glock17",
      "wpn_glock19",
      "wpn_cz_p10c",
      "wpn_sig_p320",
      "wpn_beretta_92fs",
      "wpn_walther_pdp",
      "wpn_imbel_ia2",
      "wpn_m4a1",
      "wpn_famas_f1",
      "wpn_hk_g36c",
      "wpn_type_56",
      "wpn_akm",
      "wpn_zastava_m92",
      "wpn_zastava_m70",
      "wpn_vz58",
      "wpn_ak104",
      "wpn_sam7",
    ],
    stockSize: 6,
    refreshSeconds: 300,
  },
];
