# sv-types-gen

> Generate a single “barrel” declaration file for all Sitevision API types

`sv-types-gen` är ett enkelt CLI-verktyg som automatiskt skannar din lokala installation av `@sitevision/api/types` och genererar en enda TypeScript-deklarations-barrel (`sitevision-api.d.ts`) under `src/types/`. På så vis slipper du djupa imports och långa sökvägar – allt importeras via:
```ts
import type { Node, SearchHit, SearchResult } from "sitevision-api";