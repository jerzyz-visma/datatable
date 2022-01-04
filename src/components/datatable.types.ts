export enum ALIGNS {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right"
}

export enum TYPES {
  TEXT_SHORT = "text-short",
  TEXT_LONG = "text-long",
  NUMERIC = "numeric"
}

export interface ICellProps {
  id: number,
  freeze: boolean,
  type: string,
  align: string
}

