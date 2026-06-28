#!/usr/bin/env bash
set -euo pipefail

ROOT="public/items"
WEAPONS="$ROOT/weapons"

mkdir -p \
  "$WEAPONS/pistols/9x18" \
  "$WEAPONS/pistols/7.62x25" \
  "$WEAPONS/pistols/9x19" \
  "$WEAPONS/pistols/5.7x28" \
  "$WEAPONS/pistols/45-acp" \
  "$WEAPONS/pistols/50-ae" \
  "$WEAPONS/pistols/357-magnum" \
  "$WEAPONS/pistols/500-magnum" \
  "$WEAPONS/assault-rifles/5.56x45" \
  "$WEAPONS/assault-rifles/5.45x39" \
  "$WEAPONS/assault-rifles/7.62x39" \
  "$WEAPONS/assault-rifles/7.62x51" \
  "$WEAPONS/assault-rifles/6.8x51" \
  "$WEAPONS/assault-rifles/9x39" \
  "$WEAPONS/smgs/9x19" \
  "$WEAPONS/smgs/45-acp" \
  "$WEAPONS/smgs/4.6x30" \
  "$WEAPONS/smgs/5.7x28" \
  "$WEAPONS/smgs/9x39" \
  "$WEAPONS/shotguns" \
  "$WEAPONS/dmrs/5.56x45" \
  "$WEAPONS/dmrs/7.62x51" \
  "$WEAPONS/dmrs/6.5-creedmoor" \
  "$WEAPONS/dmrs/6.8x51" \
  "$WEAPONS/dmrs/7.62x54r" \
  "$WEAPONS/sniper-rifles/7.62x51" \
  "$WEAPONS/sniper-rifles/7.62x54r" \
  "$WEAPONS/sniper-rifles/300-win-mag" \
  "$WEAPONS/sniper-rifles/338-lapua" \
  "$WEAPONS/sniper-rifles/375-cheytac" \
  "$WEAPONS/sniper-rifles/408-cheytac" \
  "$WEAPONS/sniper-rifles/50-bmg" \
  "$WEAPONS/machine-guns/5.56x45" \
  "$WEAPONS/machine-guns/5.45x39" \
  "$WEAPONS/machine-guns/7.62x39" \
  "$WEAPONS/machine-guns/7.62x51" \
  "$WEAPONS/machine-guns/7.62x54r" \
  "$WEAPONS/machine-guns/50-bmg" \
  "$ROOT/ammo/9x18" \
  "$ROOT/ammo/7.62x25" \
  "$ROOT/ammo/9x19" \
  "$ROOT/ammo/5.7x28" \
  "$ROOT/ammo/45-acp" \
  "$ROOT/ammo/50-ae" \
  "$ROOT/ammo/357-magnum" \
  "$ROOT/ammo/500-magnum" \
  "$ROOT/ammo/4.6x30" \
  "$ROOT/ammo/5.56x45" \
  "$ROOT/ammo/5.45x39" \
  "$ROOT/ammo/7.62x39" \
  "$ROOT/ammo/7.62x51" \
  "$ROOT/ammo/7.62x54r" \
  "$ROOT/ammo/6.5-creedmoor" \
  "$ROOT/ammo/6.8x51" \
  "$ROOT/ammo/9x39" \
  "$ROOT/ammo/12-gauge" \
  "$ROOT/ammo/300-win-mag" \
  "$ROOT/ammo/338-lapua" \
  "$ROOT/ammo/375-cheytac" \
  "$ROOT/ammo/408-cheytac" \
  "$ROOT/ammo/50-bmg" \
  "$ROOT/attachments/optics" \
  "$ROOT/attachments/muzzles" \
  "$ROOT/attachments/barrels" \
  "$ROOT/attachments/magazines" \
  "$ROOT/attachments/grips" \
  "$ROOT/attachments/stocks" \
  "$ROOT/attachments/handguards" \
  "$ROOT/attachments/lights-lasers" \
  "$ROOT/chest-gear/armor" \
  "$ROOT/chest-gear/armored-rigs" \
  "$ROOT/chest-gear/chest-rigs" \
  "$ROOT/head-gear/helmets" \
  "$ROOT/head-gear/masks" \
  "$ROOT/head-gear/headsets" \
  "$ROOT/backpacks" \
  "$ROOT/medical/healing" \
  "$ROOT/medical/bandages" \
  "$ROOT/medical/surgery" \
  "$ROOT/medical/stimulants" \
  "$ROOT/loot/valuables" \
  "$ROOT/loot/electronics" \
  "$ROOT/loot/tools" \
  "$ROOT/loot/materials" \
  "$ROOT/loot/barter" \
  "$ROOT/keys" \
  "$ROOT/quest-items"

move_asset() {
  local source="$1"
  local destination="$2"

  if [[ ! -f "$source" ]]; then
    return
  fi

  mkdir -p "$(dirname "$destination")"

  if git ls-files --error-unmatch "$source" >/dev/null 2>&1; then
    git mv "$source" "$destination"
  else
    mv "$source" "$destination"
  fi
}

move_asset "$WEAPONS/makarov-pm.png" "$WEAPONS/pistols/9x18/makarov-pm.png"
move_asset "$WEAPONS/tokarev-tt33.png" "$WEAPONS/pistols/7.62x25/tokarev-tt33.png"

for file in \
  glock17.png glock19.png cz-p10c.png sig-p320.png beretta-92fs.png sig-p226.png \
  hk-vp9.png fn-509-tactical.png walther-pdp.png staccato-p.png; do
  move_asset "$WEAPONS/$file" "$WEAPONS/pistols/9x19/$file"
done

for file in hk-usp.png glock21.png 1911-government.png; do
  move_asset "$WEAPONS/$file" "$WEAPONS/pistols/45-acp/$file"
done

move_asset "$WEAPONS/fn-five-seven.png" "$WEAPONS/pistols/5.7x28/fn-five-seven.png"
move_asset "$WEAPONS/desert-eagle.png" "$WEAPONS/pistols/50-ae/desert-eagle.png"
move_asset "$WEAPONS/colt-python.png" "$WEAPONS/pistols/357-magnum/colt-python.png"
move_asset "$WEAPONS/sw-500.png" "$WEAPONS/pistols/500-magnum/sw-500.png"

for file in \
  m4a1.png ak-19.png bt-apc556.png bushmaster-acr.png car-816.png desert-tech-mdrx.png \
  famas-f1.png fn-15-tactical.png fn-scar-l.png geissele-super-duty.png hk-g36c.png \
  haenel-mk556.png imbel-ia2.png l85a3.png mk18.png sig-mcx.png sr-15.png \
  steyr-aug-a3-m2.png vektor-cr-21.png; do
  move_asset "$WEAPONS/$file" "$WEAPONS/assault-rifles/5.56x45/$file"
done

for file in \
  ak-104.png ak-203.png akm.png cz-bren-2-ms-7.62.png galil-ace-32.png \
  kac-sr-47.png mk-47.png rd-704.png sam-7.png sig-556r.png sig-556xi.png \
  type-56.png vz-58.png zastava-m70.png zastava-m92.png; do
  move_asset "$WEAPONS/$file" "$WEAPONS/assault-rifles/7.62x39/$file"
done

for file in hk-417.png desert-tech-mdr-762.png scar-h.png hk-g3-dmr.png; do
  move_asset "$WEAPONS/$file" "$WEAPONS/assault-rifles/7.62x51/$file"
done

for file in \
  aero-precision-m5.png c20.png cmmg-endeavor-mk3.png g28.png keltec-rfb.png m1a.png \
  m1a-socom.png m14.png m14-ebr.png m110.png noveske-n6.png sr-25.png; do
  move_asset "$WEAPONS/$file" "$WEAPONS/dmrs/7.62x51/$file"
done

echo "Item asset folders created and current weapon images moved."
