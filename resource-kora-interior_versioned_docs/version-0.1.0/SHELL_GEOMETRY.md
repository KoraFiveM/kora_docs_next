# Bundled shell geometry evidence

The sixteen archetypes in [bundled-shell-bounds.json](bundled-shell-bounds.json)
are decoded directly from the installed `stream/starter_shells_k4mb1.ytyp`.
The report includes the asset SHA-256, exact float32 model-local AABB, bounding
sphere center and radius. `python3 tests/shell_assets.py` re-reads that binary,
checks every named bundled factory against its drawable/archetype, and rejects
a stale report. This is static asset verification, not a client walkthrough.

The parser uses the RSC7 resource and `CBaseArchetypeDef` layouts documented in
[CodeWalker's source](https://github.com/dexyfex/CodeWalker/blob/master/CodeWalker.Core/GameFiles/MetaTypes/MetaTypes.cs).
The garage is named `shell_garagem` in both its `.ydr` and archetype; the old
`shell_garagemed` name has no bundled model.

Pinned `qbcore-fivem/qb-houses` at `3f2478557f22e4f063c7f1cbe3a994993101c54f`
selects `CreateFurniMotelStandard` for tier 16. Its standard motel is bundled.
The factory model and exit `(-0.43, -2.51, 1.0, 271.29)` match the authored
[Qbox successor factory at f62aa08](https://github.com/Qbox-project/qbx_interior/blob/f62aa08cba134c8d93074e0e1530bb8fdd1e68bb/client/main.lua).
This factory does not replace optional `CreateFurniMotel` / `furnitured_motel`.

## Placement boundary

[CreateObject](https://github.com/citizenfx/natives/blob/master/OBJECT/CreateObject.md)
applies a model offset; [CreateObjectNoOffset](https://github.com/citizenfx/natives/blob/master/OBJECT/CreateObjectNoOffset.md)
uses the supplied entity origin. Stock factories use the former. Native shared
geometry defaults to the latter, and now accepts an explicit `legacy` mode to
run the original native with the original spawn coordinates. The native itself
performs the placement; no guessed Z translation is applied.

The AABB report alone is not a verified transformation for stock world bounds.
Several authored stock exits sit outside a centered model AABB. The documented
radius offset does not identify which engine field supplies that radius.
Using the YTYP bounding-sphere radius places all sixteen authored exit heights
below the shifted AABB. For example, `standardmotel_shell` has local Z bounds
`[-1.56572, 1.56572]`, sphere radius `5.23614`, and an authored exit Z of `1.0`;
adding that radius would put its bounds at `[3.67042, 6.80186]` above the exit.
`shell_michael` similarly has bounds `[-5.06372, 5.06372]`, radius `16.3398`,
and exit Z `9.91`, below the proposed minimum `11.27608`. Using no offset
instead leaves five authored exits outside their local Z bounds. These checks
show that neither candidate is established as a correct transformation; they
do not establish an alternative formula. Floor-aligning with `-bbMin.z` is
another hypothesis, not a documented engine contract. Therefore the report must not be used to automatically activate server
world polygons or authorize arbitrary furniture placement. Supply an accurately
mapped world boundary through housing's existing configuration workflow. Until
then, housing can retain stock shell entry and exact persisted fixture points,
with server ownership, occupancy and proximity checks, without pretending that
a model-local bounding box is a measured world space.

Run `lua tests/geometry.lua`, `lua tests/legacy_exports.lua` and
`python3 tests/shell_assets.py` here. Housing additionally exercises the real
geometry provider during a delayed load/character-unload race in
`tests/shell_lifecycle.lua`.
