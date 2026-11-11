
## Offline check

With the sibling `kora_core` and `kora_sql` repositories available, run from this repository:

```sh
lua test/smoke/crypto_sql.lua
```

This checks configured market odds, price history, persistence and publication through the actual kora_sql Lua wrapper with an in-memory SQL driver. It does not connect to a database or start FiveM.

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
