type ControlVisibility = {
  bl?: boolean | undefined;
  br?: boolean | undefined;
  mb?: boolean | undefined;
  ml?: boolean | undefined;
  mr?: boolean | undefined;
  mt?: boolean | undefined;
  tl?: boolean | undefined;
  tr?: boolean | undefined;
  mtr?: boolean | undefined;
};

export const onlyScaleControl: ControlVisibility = {
  bl: true,
  br: true,
  mb: false,
  ml: false,
  mr: false,
  mt: false,
  tl: true,
  tr: true,
  mtr: false,
};

export const FABRIC_EVENT = {
  ObjectModified: "object:modified",
} as const;
