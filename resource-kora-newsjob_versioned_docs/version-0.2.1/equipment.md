---
title: Equipment
sidebar_position: 8
---

# Equipment

## Items

The resource does not define items; they must exist in your item list.

| Item | Prop | Bone | Animation |
| --- | --- | --- | --- |
| `newscam` | `prop_v_cam_01` | 28422 | `missfinale_c2mcs_1` / `fin_c2_mcs_1_camman`, plus the camera overlay |
| `newsmic` (boom mic) | `prop_v_bmike_01` | 28422 | `missfra1` / `mcs2_crew_idle_m_boom` |
| `newsbmic` (hand mic) | `p_ing_microphonel_01` | 60309 | `missheistdocksprep1hold_cellphone` / `hold_cellphone` |

## Counter

The zone at `Config.Locations.shop` offers "Take news camera", "Take boom mic" and "Take hand mic" to news employees. Each sends `qb-newsjob:server:requestedEquipment`; the server adds one of the item through `qb-inventory`. There is no limit on how many a player can take, and no distance check on the server.

## Using

Using an item (registered with `exports.kora_core:createUseable`) requires the news job on the server and then triggers a client event. Using it again while any equipment is active removes it. Using one while another is active only removes the active one.

For the camera, `Kora.camera.open` is called with mode `recording`, title `WEAZEL NEWS`, subtitle `FIELD UNIT // LIVE`, label `NEWS CAM 01`.

## Automatic removal

A per-frame monitor removes the prop, animation and camera when the player:

- no longer has the `news` job
- dies
- is holding the camera and the camera overlay is no longer open

The equipment is also removed when the resource stops. The items themselves stay in the inventory.
