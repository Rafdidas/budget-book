import { JSX } from "react";

type TypographyType = "headline" | "title" | "label" | "body" | "bodyBold" | "caption";
type TypographySize = "xxl" | "xl" | "lg" | "md" | "sm" | "xs" | "xxs";

interface TypographyProps {
  type?: TypographyType;
  size?: TypographySize;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
}

type TypographyMap = Record<TypographyType, Partial<Record<TypographySize, string>>>;

const typographyMap: TypographyMap = {
  headline: {
    md: "text-[28px] font-bold",
    sm: "text-[24px] font-bold",
  },
  title: {
    lg: "text-[20px] font-bold",
    md: "text-[18px] font-bold",
    sm: "text-[16px] font-bold",
    xs: "text-[14px] font-bold",
  },
  label: {
    xl: "text-[16px] font-medium",
    lg: "text-[15px] font-medium",
    md: "text-[14px] font-medium",
    sm: "text-[13px] font-medium",
    xs: "text-[12px] font-medium",
  },
  bodyBold: {
    xxl: "text-[44px] font-bold",
    xl: "text-[30px] font-bold",
    lg: "text-[26px] font-bold",
    md: "text-[24px] font-bold",
    sm: "text-[18px] font-bold",
    xs: "text-[15px] font-bold",
    xxs: "text-[14px] font-bold",
  },
  body: {
    xl: "text-[16px] font-normal",
    lg: "text-[15px] font-normal",
    md: "text-[14px] font-normal",
    sm: "text-[13px] font-normal",
    xs: "text-[12px] font-normal",
  },
  caption: {
    lg: "text-[12px] font-normal",
    sm: "text-[11px] font-normal",
    xs: "text-[10px] font-normal",
  },
};

export function Typography({
  type = "body",
  size = "md",
  className = "",
  as: Tag = "p",
  children,
}: TypographyProps) {
  const styleClass = typographyMap[type]?.[size];

  if (!styleClass) {
    console.warn(`[Typography]: '${type}' 타입은 '${size}' 사이즈를 지원하지 않습니다.`);
  }

  return <Tag className={`${styleClass ?? ""} ${className}`}>{children}</Tag>;
}
