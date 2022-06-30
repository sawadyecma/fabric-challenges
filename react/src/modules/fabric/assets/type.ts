import { fabric } from "fabric";

export type AssetType = "menu" | "checkbox";

export interface Asset extends fabric.Object {
  get kind(): AssetType;
  get placementId(): string;
}
