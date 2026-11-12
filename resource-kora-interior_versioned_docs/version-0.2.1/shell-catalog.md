---
title: Shell catalog
sidebar_position: 6
---

# Shell catalog

Every factory export takes `spawn` (a vector3 or any table with `x`, `y`, `z`) and returns the shell result described in [Exports](./api/index.md). The `exit` column is the offset from `spawn` and heading `w` that the player is teleported to on entry. Each factory is exported under both `kora_interior` and `qb-interior`.

Factory exports are defined by two tables in the code: bundled shells in `client/main.lua` and optional shells in `client/optional.lua`.

## Bundled shells

These 16 models are shipped in `stream/` and registered through `starter_shells_k4mb1.ytyp`. Their model-local bounds are in [Shell geometry](./shell-geometry.md).

| Export | Model | Exit `vector4` |
| --- | --- | --- |
| `CreateApartmentShell` | `shell_v16low` | `4.693, -6.015, 1.11, 358.634` |
| `CreateCaravanShell` | `shell_trailer` | `-1.4, -2.1, 3.3, 358.633972168` |
| `CreateContainer` | `container_shell` | `0.08, -5.73, 1.24, 359.32` |
| `CreateFranklinAunt` | `shell_frankaunt` | `-0.36, -5.89, 1.70, 358.21` |
| `CreateFurniMid` | `furnitured_midapart` | `1.46, -10.33, 1.06, 0.39` |
| `CreateFurniMotelModern` | `modernhotel_shell` | `4.98, 4.35, 1.16, 179.79` |
| `CreateFurniMotelStandard` | `standardmotel_shell` | `-0.43, -2.51, 1.0, 271.29` |
| `CreateGarageMed` | `shell_garagem` | `13.90, 1.63, 1.0, 87.05` |
| `CreateLesterShell` | `shell_lester` | `-1.780, -0.795, 1.1, 270.30` |
| `CreateMichael` | `shell_michael` | `-9.49, 5.54, 9.91, 270.86` |
| `CreateOffice1` | `shell_office1` | `1.88, 5.06, 2.05, 180.07` |
| `CreateRanchShell` | `shell_ranch` | `-1.257, -5.469, 2.5, 270.57` |
| `CreateStore1` | `shell_store1` | `-2.61, -4.73, 1.08, 1.0` |
| `CreateTier1House` | `shell_v16mid` | `1.561, -14.305, 1.147, 2.263` |
| `CreateTrevorsShell` | `shell_trevor` | `0.374, -3.789, 2.428, 358.633` |
| `CreateWarehouse1` | `shell_warehouse1` | `-8.95, 0.51, 1.04, 268.82` |

Two further legacy factories also exist in `client/main.lua` and use the bundled `furnitured_midapart` model:

| Export | Model | Exit `vector4` | Extras |
| --- | --- | --- | --- |
| `CreateApartmentFurnished` | `furnitured_midapart` | `1.5, -10.0, 0.0, 358.50` | Adds `clothes`, `stash` and `logout` points to the second return value; triggers `qb-clothes:client:CreateFirstCharacter` if the new-character flag is set (see [Events](./events.md)). |
| `CreateHouseRobbery` | `furnitured_midapart` | `1.46, -10.33, 1.06, 0.39` | None. Same exit as `CreateFurniMid`. |

## Optional shells

These 109 factories are registered by `client/optional.lua` but the models are **not** in `stream/`. They only work if the matching shell pack (the links in the code comments point at k4mb1maps.com packages) is installed and streamed by another resource. See [Troubleshooting](./troubleshooting.md).

| Export | Model | Exit `vector4` | Pack (code comment) |
| --- | --- | --- | --- |
| `CreateMedium2` | `shell_medium2` | `6.04, 0.34, 1.03, 357.99` | Medium Housing Shells V1 |
| `CreateMedium3` | `shell_medium3` | `3.32, 1.23, 2.57, 273.46` | Medium Housing Shells V1 |
| `CreateBanham` | `shell_banham` | `-3.26, -1.63, 6.25, 90.49` | Modern Housing Shells V1 |
| `CreateWestons` | `shell_westons` | `4.29, 10.59, 6.95, 183.60` | Modern Housing Shells V1 |
| `CreateWestons2` | `shell_westons2` | `-1.76, 10.62, 6.95, 179.20` | Modern Housing Shells V1 |
| `CreateClassicHouse` | `classichouse_shell` | `4.78, -2.11, 5.26, 87.93` | Classic Housing Shells V1 |
| `CreateClassicHouse2` | `classichouse2_shell` | `4.78, -2.09, 5.26, 90.58` | Classic Housing Shells V1 |
| `CreateClassicHouse3` | `classichouse3_shell` | `4.78, -2.12, 5.26, 91.60` | Classic Housing Shells V1 |
| `CreateHighend1` | `shell_apartment1` | `-2.23, 9.01, 8.69, 178.81` | Highend Housing Shells V1 |
| `CreateHighend2` | `shell_apartment2` | `-2.25, 9.00, 8.69, 177.86` | Highend Housing Shells V1 |
| `CreateHighend3` | `shell_apartment3` | `11.75, 4.55, 8.13, 129.16` | Highend Housing Shells V1 |
| `CreateHighend` | `shell_highend` | `-22.37, -0.33, 7.26, 267.73` | Deluxe Housing Shells V1 |
| `CreateHighendV2` | `shell_highendv2` | `-10.51, 0.86, 6.56, 270.38` | Deluxe Housing Shells V1 |
| `CreateStashHouse` | `stashhouse_shell` | `20.88, -0.40, 15.42, 86.54` | Stash House Shells |
| `CreateStashHouse2` | `stashhouse2_shell` | `-1.98, 2.26, 1.0, 263.81` | Stash House Shells |
| `CreateGarageLow` | `shell_garages` | `5.85, 3.86, 1.0, 180.05` | Garage Shells |
| `CreateGarageHigh` | `shell_garagel` | `12.02, -14.30, 0.99, 89.42` | Garage Shells |
| `CreateOffice2` | `shell_office2` | `3.66, -1.94, 1.26, 92.73` | Office Shells |
| `CreateOfficeBig` | `shell_officebig` | `-12.48, 1.91, 5.30, 175.13` | Office Shells |
| `CreateBarber` | `shell_barber` | `1.54, 5.40, 1.0, 175.27` | Store Shells |
| `CreateGunstore` | `shell_gunstore` | `-1.02, -5.43, 1.03, 359.77` | Store Shells |
| `CreateStore2` | `shell_store2` | `-0.64, -5.07, 1.02, 1.91` | Store Shells |
| `CreateStore3` | `shell_store3` | `-0.14, -7.87, 2.01, 358.15` | Store Shells |
| `CreateWarehouse2` | `shell_warehouse2` | `12.51, -0.01, 1.03, 94.52` | Warehouse Shells |
| `CreateWarehouse3` | `shell_warehouse3` | `2.61, -1.65, 1.00, 85.2` | Warehouse Shells |
| `CreateK4Coke` | `k4coke_shell` | `-11.06, -2.52, 22.64, 272.51` | Highend Lab Shells |
| `CreateK4Meth` | `k4meth_shell` | `-11.06, -2.48, 9.47, 277.54` | Highend Lab Shells |
| `CreateK4Weed` | `k4weed_shell` | `-11.05, -2.50, 20.96, 283.97` | Highend Lab Shells |
| `CreateContainer2` | `container2_shell` | `0.02, -5.37, 1.12, 355.28` | Furnished Stash House Shells |
| `CreateFurniStash1` | `stashhouse1_shell` | `21.41, -0.52, 19.33, 85.84` | Furnished Stash House Shells |
| `CreateFurniStash3` | `stashhouse3_shell` | `-0.003, 5.5, 3.04, 180.77` | Furnished Stash House Shells |
| `CreateFurniLow` | `furnitured_lowapart` | `5.05, -1.39, 3.0, 357.14` | Furnished Housing Shells |
| `CreateFurniMotel` | `furnitured_motel` | `-1.51, -3.99, 1.08, 1.28` | Furnished Housing Shells |
| `CreateFurniMotelClassic` | `classicmotel_shell` | `0.045, -3.707, 1.05, 351.86` | Furnished Motel Shells |
| `CreateFurniMotelHigh` | `highendmotel_shell` | `3.21, 3.50, 1.16, 178.23` | Furnished Motel Shells |
| `CreateFurniMotelModern2` | `modernhotel2_shell` | `4.87, 4.38, 1.16, 176.40` | Furnished Modern Hotels |
| `CreateFurniMotelModern3` | `modernhotel3_shell` | `4.95, 4.38, 1.16, 176.01` | Furnished Modern Hotels |
| `CreateCoke` | `shell_coke1` | `-6.24, 8.48, 1.00, 179.30` | Drug Lab Shells |
| `CreateCoke2` | `shell_coke2` | `-6.32, 8.60, 1.03, 179.23` | Drug Lab Shells |
| `CreateMeth` | `shell_meth` | `-6.39, 8.54, 1.03, 178.84` | Drug Lab Shells |
| `CreateWeed` | `shell_weed` | `17.46, 11.71, 1.01, 88.37` | Drug Lab Shells |
| `CreateWeed2` | `shell_weed2` | `17.85, 11.75, 1.01, 88.11` | Drug Lab Shells |
| `CreateMansion` | `k4_mansion_shell` | `-0.32, -0.68, 7.86, 178.98` | Mansion Housing Shells |
| `CreateMansion2` | `k4_mansion2_shell` | `-0.32, -0.57, 7.86, 178.74` | Mansion Housing Shells |
| `CreateMansion3` | `k4_mansion3_shell` | `-0.18, -0.57, 7.86, 180.76` | Mansion Housing Shells |
| `CreateHotel1` | `k4_hotel1_shell` | `4.94, 4.39, 1.17, 177.55` | Empty Hotel Shells |
| `CreateHotel2` | `k4_hotel2_shell` | `4.99, 4.39, 1.17, 178.62` | Empty Hotel Shells |
| `CreateHotel3` | `k4_hotel3_shell` | `4.90, 4.39, 1.17, 182.13` | Empty Hotel Shells |
| `CreateMotel1` | `k4_motel1_shell` | `-0.46, -2.46, 1.00, 274.07` | Empty Motel Shells |
| `CreateMotel2` | `k4_motel2_shell` | `0.06, -3.75, 1.05, 359.40` | Empty Motel Shells |
| `CreateMotel3` | `k4_motel3_shell` | `3.13, 3.50, 1.16, 182.53` | Empty Motel Shells |
| `CreateV2Default1` | `default_housing1_k4mb1` | `-2.32, -0.63, 1.60, 272.87` | Default Shells V2 |
| `CreateV2Default2` | `default_housing2_k4mb1` | `-5.14, -5.05, 3.18, 270.61` | Default Shells V2 |
| `CreateV2Default3` | `default_housing3_k4mb1` | `-1.35, -2.06, 1.11, 1.14` | Default Shells V2 |
| `CreateV2Default4` | `default_housing4_k4mb1` | `0.13, -3.85, 1.09, 1.71` | Default Shells V2 |
| `CreateV2Default5` | `default_housing5_k4mb1` | `1.42, -14.34, 1.14, 0.87` | Default Shells V2 |
| `CreateV2Default6` | `default_housing6_k4mb1` | `4.75, -6.49, 1.03, 359.60` | Default Shells V2 |
| `CreateV2Deluxe1` | `deluxe_housing1_k4mb1` | `-22.28, -0.45, 7.26, 268.97` | Deluxe Shells V2 |
| `CreateV2Deluxe2` | `deluxe_housing2_k4mb1` | `-10.30, 0.87, 6.55, 274.91` | Deluxe Shells V2 |
| `CreateV2Deluxe3` | `deluxe_housing3_k4mb1` | `-9.37, 5.66, 1.08, 270.04` | Deluxe Shells V2 |
| `CreateV2HighEnd1` | `highend_housing1_k4mb1` | `-2.22, 9.02, 8.69, 182.64` | Highend Shells V2 |
| `CreateV2HighEnd2` | `highend_housing2_k4mb1` | `-2.22, 8.97, 8.69, 171.95` | Highend Shells V2 |
| `CreateV2HighEnd3` | `highend_housing3_k4mb1` | `11.48, 4.50, 6.42, 128.15` | Highend Shells V2 |
| `CreateV2Medium1` | `medium_housing1_k4mb1` | `-0.24, -5.66, 1.71, 1.5` | Medium Shells V2 |
| `CreateV2Medium2` | `medium_housing2_k4mb1` | `6.04, 0.34, 1.03, 357.99` | Medium Shells V2 |
| `CreateV2Medium3` | `medium_housing3_k4mb1` | `3.42, 1.18, 1.01, 274.17` | Medium Shells V2 |
| `CreateV2Modern1` | `modern_housing1_k4mb1` | `4.29, 10.52, 6.30, 178.92` | Modern Shells V2 |
| `CreateV2Modern2` | `modern_housing2_k4mb1` | `-1.76, 10.37, 6.30, 184.71` | Modern Shells V2 |
| `CreateV2Modern3` | `modern_housing3_k4mb1` | `-3.39, -1.45, 5.65, 90.77` | Modern Shells V2 |
| `VineWoodHouse1` | `vinewood_housing1_k4mb1` | `11.86, -2.73, 3.96, 2.11` | K4mb1 Vinewood V2 Shells |
| `VineWoodHouse2` | `vinewood_housing2_k4mb1` | `1.57, 4.96, 9.63, 2.11` | K4mb1 Vinewood V2 Shells |
| `VineWoodHouse3` | `vinewood_housing3_k4mb1` | `3.41, 7.11, 2.76, 2.11` | K4mb1 Vinewood V2 Shells |
| `CreateK4GunWarehouse` | `gunworkshop_k4mb1` | `0.29, 4.74, -0.0, 179.603271` | K4mb1 September Update |
| `CreateK4LuxuryHouse1` | `luxury_housing1_k4mb1` | `-6.344482, -1.034912, 3.0, 268.09` | K4mb1 September Update |
| `CreateK4LuxuryHouse2` | `luxury_housing2_k4mb1` | `-6.344482, -1.034912, 3.0, 268.09` | K4mb1 September Update |
| `CreateK4LuxuryHouse3` | `luxury_housing3_k4mb1` | `-6.344482, -1.034912, 3.0, 268.09` | K4mb1 September Update |
| `CreateK4LuxuryHouse4` | `luxury_housing4_k4mb1` | `-6.344482, -1.034912, 3.0, 268.09` | K4mb1 September Update |
| `CreateK4ManorHouse` | `manor_housing1_k4mb1` | `6.839844, -9.136841, 13.0, 359.318207` | K4mb1 September Update |
| `CreateK4Garage1` | `new_garages1_k4mb1` | `0.000366, 14.130432, 1.827162, 183.492355` | K4mb1 September Update |
| `CreateK4Garage2` | `new_garages2_k4mb1` | `-3.737671, -0.096680, 1.427162, 268.669922` | K4mb1 September Update |
| `CreateK4Garage3` | `new_garages3_k4mb1` | `-3.737671, -0.096680, 1.427162, 268.669922` | K4mb1 September Update |
| `CreateK4Garage4` | `new_garages4_k4mb1` | `8.806641, 1.580383, 1.439952, 93.087669` | K4mb1 September Update |
| `CreateK4Safehouse` | `safehouse_k4mb1` | `-5.317017, 1.031738, 1.439952, 269.149353` | K4mb1 September Update |
| `CreateK4Warehouse` | `warehouse_k4mb1` | `13.414185, -7.386108, 2.539952, 90.148018` | K4mb1 September Update |
| `CreateK4NewGarage` | `new_garages1_k4mb1` | `-0.010498, 13.742065, 5.216461, 180.0` | New Garages |
| `CreateK4NewGarage2` | `new_garages2_k4mb1` | `-3.885496, 0.018372, 0.119728, 271.723022` | New Garages |
| `CreateK4NewGarage3` | `new_garages3_k4mb1` | `-3.557486, -0.223755, 0.113129, 269.100739` | New Garages |
| `CreateK4NewGarage4` | `new_garages4_k4mb1` | `8.948175, 1.714355, 0.049950, 95.899307` | New Garages |
| `CreateK4Basement` | `k4mb1_basement1_shell` | `-5.08, -4.33, 5.90, 3.45` | Basement Shells |
| `CreateK4Basement1` | `k4mb1_basement2_shell` | `-5.08, -4.33, 5.90, 3.45` | Basement Shells |
| `CreateK4Basement2` | `k4mb1_basement3_shell` | `-5.08, -4.33, 5.90, 3.45` | Basement Shells |
| `CreateK4Basement3` | `k4mb1_basement4_shell` | `-5.08, -4.33, 5.90, 3.45` | Basement Shells |
| `CreateK4Basement4` | `k4mb1_basement5_shell` | `-5.08, -4.33, 5.90, 3.45` | Basement Shells |
| `CreateK4CasinoHotel` | `k4mb1_casinohotel_shell` | `-3.03, -0.03, 0.10, 266.89` | Casino Hotel |
| `CreateK4House1` | `k4mb1_house1_shell` | `-8.33, 1.01, 2.02, 270.22` | New Houses |
| `CreateK4House2` | `k4mb1_house2_shell` | `-8.33, 1.01, 2.02, 270.22` | New Houses |
| `CreateK4House3` | `k4mb1_house3_shell` | `9.00, -7.43, 2.02, 1.04` | New Houses |
| `CreateK4House4` | `k4mb1_house4_shell` | `-2.22, -2.50, 0.70, 357.22` | New Houses |
| `CreateFurnishedOffice1` | `k4mb1_furnishedoffice1_shell` | `3.33, -2.05, 1.39, 92.20` | Furnished Offices |
| `CreateFurnishedOffice2` | `k4mb1_furnishedoffice2_shell` | `4.42, 3.54, 1.36, 179.63` | Furnished Offices |
| `CreateFurnishedOffice3` | `k4mb1_furnishedoffice3_shell` | `-0.66, 5.81, 1.51, 90.57` | Furnished Offices |
| `CreateFurnishedOffice4` | `k4mb1_furnishedoffice4_shell` | `8.60, -2.28, 1.56, 91.17` | Furnished Offices |
| `CreateFurnishedOffice5` | `k4mb1_furnishedoffice5_shell` | `3.19, -13.87, 1.26, 2.37` | Furnished Offices |
| `CreateHoodHouse` | `k4mb1_hoodhouse1_shell` | `-2.49, -7.38, 2.01, 93.19` | Hood House |
| `CreateLaundry` | `k4mb1_laundry_shell` | `10.45, -5.70, 3.37, 5.13` | Laundry Shell |
| `CreatePaletoHouse` | `k4mb1_palhouse1_shell` | `-0.92, 5.65, 3.34, 90.05` | Paleto House |
| `CreateSandyHouse` | `k4mb1_sandyhouse1_shell` | `1.65, -4.60, 3.19, 2.53` | Sandy House |
| `CreateEmptyHouse` | `kambi_emptyhouse1` | `-0.42, -2.35, 1.91, 271.88` | Empty House |
| `CreateFurnishedHouse` | `kambi_furnishedhouse1` | `-0.47, -2.38, 1.90, 274.87` | Furnished House |

Notes taken from the code:

- `CreateK4Garage1` to `CreateK4Garage4` and `CreateK4NewGarage` to `CreateK4NewGarage4` use the same four models (`new_garages1_k4mb1` to `new_garages4_k4mb1`) with different exit offsets.
- Several factories reuse an identical exit (for example `CreateK4LuxuryHouse1` to `CreateK4LuxuryHouse4`, `CreateK4Basement` to `CreateK4Basement4`). The source marks some of these with a "verify if intentional" comment.
