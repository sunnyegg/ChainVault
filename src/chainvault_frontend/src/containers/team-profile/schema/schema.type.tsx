import { ReactNode } from "react";

export interface SchemaItem {
  title: string;
  id: string;
  showTitle?: boolean;
  children?: ReactNode;
  styles?: string;
  fullWidth?: boolean;
  hasBgSVG?: boolean;
}