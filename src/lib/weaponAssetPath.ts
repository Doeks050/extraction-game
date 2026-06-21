import type { GameItem } from "../types/items";

const weaponClassFolders: Record<string, string> = {
  pistol: "pistols",
  assault_rifle: "assault-rifles",
  smg: "smgs",
  shotgun: "shotguns",
  dmr: "dmrs",
  sniper: "sniper-rifles",
  machine_gun: "machine-guns",
};

const caliberFolders: Record<string, string> = {
  "9x18": "9x18",
  "7.62x25": "7.62x25",
  "9x19": "9x19",
  "5.7x28": "5.7x28",
  ".45 ACP": "45-acp",
  ".50 AE": "50-ae",
  ".357 Magnum": "357-magnum",
  ".500 Magnum": "500-magnum",
  "4.6x30": "4.6x30",
  "5.56x45": "5.56x45",
  "5.45x39": "5.45x39",
  "7.62x39": "7.62x39",
  "7.62x51": "7.62x51",
  "7.62x54r": "7.62x54r",
  "6.5 Creedmoor": "6.5-creedmoor",
  "6.8x51": "6.8x51",
  "9x39": "9x39",
  ".300 Win Mag": "300-win-mag",
  ".338 Lapua": "338-lapua",
  ".375 CheyTac": "375-cheytac",
  ".408 CheyTac": "408-cheytac",
  ".50 BMG": "50-bmg",
};

function getFileName(imagePath: string) {
  return imagePath.split("/").pop() ?? imagePath;
}

export function resolveWeaponAssetPath(item: GameItem) {
  if (item.category !== "weapon" || !item.image) {
    return item.image;
  }

  const weaponClassTag = item.tags.find((tag) => tag in weaponClassFolders);

  if (!weaponClassTag) {
    return item.image;
  }

  const classFolder = weaponClassFolders[weaponClassTag];
  const fileName = getFileName(item.image);

  if (weaponClassTag === "shotgun") {
    return `/items/weapons/${classFolder}/${fileName}`;
  }

  const caliberTag = item.tags.find((tag) => tag in caliberFolders);

  if (!caliberTag) {
    return `/items/weapons/${classFolder}/${fileName}`;
  }

  return `/items/weapons/${classFolder}/${caliberFolders[caliberTag]}/${fileName}`;
}
