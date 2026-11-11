# qb-scoreboard
Scoreboard for QB-Core

Server owners can change display and police-count settings through `/config`.
The default key is an Advanced setting; existing players retain their personal
FiveM key binding. Display capacity changes the scoreboard, not the server's
connection limit. Activity thresholds describe availability; the activity
resource remains responsible for enforcing its own requirements.

Busy/cooldown status is runtime state. Trusted server scripts can use
`TriggerEvent('qb-scoreboard:server:SetActivityBusy', activityId, true)` and
send `false` when it ends. Clients cannot set this state on the server.

Run `bash test/run.sh` for the configuration and interaction smoke checks.

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
