# qb-cityhall
City Services for QB-Core Framework

## Dependencies
- [qb-core](https://github.com/qbcore-framework/qb-core)
- [PolyZone](https://github.com/mkafrin/PolyZone) - For Interaction (DrawText and qb-target both require this)
- [qb-target](https://github.com/BerkieBb/qb-target) - For Interaction (Optional)
- [qb-phone](https://github.com/qbcore-framework/qb-phone) - For E-Mail

## Features
- Ability to request birth certificate when lost
- Ability to request driver license when granted by a driving instructor
- Ability to request weapon license when granted it by the police
- Ability to apply to government jobs
- Ability to add multiple cityhall locations
- Ability to add nultiple driving school locations
- Ability to take driving lessons
- qb-target integration, this is optional
- PolyZone and qb-core DrawText integration, this is optional

## Installation
### Manual
- Download the script and put it in the `[qb]` directory.
- Add the following code to your server.cfg/resources.cfg
```
ensure qb-core
ensure qb-target # Optional
ensure qb-phone
ensure kora_cityhall # provides qb-cityhall
```

## QBCore compatibility
- `qb-cityhall:server:requestId(item, hall)` is aliased to `purchaseID`.
- `qb-cityhall:server:ApplyJob(job, coords)` (stock shape) resolves the hall from the player's server-side position; the client coords are ignored.
- `exports['qb-cityhall']:AddCityJob(job, { label, isManaged })` adds an applicable job at runtime.
- Client events `getIds`, `openCityhallMenu`, `openIdentityMenu`, `openJobMenu` open the nearest hall.
- `drivinglicense` is not provided.

Full documentation: see [docs/](docs/index.md).

## Screenshots
![City Services](https://i.imgur.com/l6ZRlXP.png)
![Request Birth Certificate](https://i.imgur.com/zJRiuDI.png)
![Request Driver License](https://i.imgur.com/2scxBew.png)
![Request Weapon License](https://i.imgur.com/pSudfVl.png)
![Apply For a Job](https://i.imgur.com/26Kd0FU.png)
![Cityhall DrawText Interaction](https://i.imgur.com/Uxh2GZC.png)
![Cityhall QB-Target Interaction](https://i.imgur.com/K54cMLt.png)
![Driving School Sending And Receiving Mail](https://i.imgur.com/iJof4jI.png)
![Driving School DrawText Interaction](https://i.imgur.com/32BPp8f.png)
![Driving School QB-Target Interaction](https://i.imgur.com/P7jWBsV.png)

# License

    QBCore Framework
    Copyright (C) 2021 Joshua Eger

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/)
## Options (`shared/config.lua`)

| Option | Default | Effect |
| --- | --- | --- |
| `Config.PurchaseDistance` | `5.0` | Server-side maximum distance to the cityhall for buying a licence or applying for a job. Too far: the player is told and nothing is charged. |
| `Config.RequireFreeWeight` | `true` | Refuse a licence purchase when the player's free inventory weight is 0 or less, even though licences weigh nothing. |
| `Config.ConfirmActions` | `true` | Ask for confirmation before buying a licence or applying for a job. |
| `Config.GiveStarterItems` | `true` | Grant pending starter items after the first-character outfit is confirmed, and on spawn for characters that still have them pending. |
