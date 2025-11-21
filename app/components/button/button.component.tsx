import React from "react";
import clsx from "clsx"; // clsx 없으면 직접 join 로 만들 수도 있음

export interface ButtonProps {
  children?: React.ReactNode;
  id?: string;
  className?: string;
  disabled?: boolean;
  onClick?: (_e: React.MouseEvent<HTMLButtonElement>) => void;
  size?: "xs" | "sm" | "md" | "lg";
  styleTheme?:
    | "default"
    | "primary"
    | "secondary"
    | "outline"
    | "subtle"
    | "transparent"
    | "transparent2"
    | "brand";
  onlyIcon?: boolean;
  circle?: boolean;
  icon?: React.ReactNode;
  negative?: boolean;
  shadow?: boolean;
  style?: React.CSSProperties;
}

const sizeMap = {
  lg: "h-[48px] px-[20px] text-[16px]",
  md: "h-[40px] px-[16px] text-[14px]",
  sm: "h-[32px] px-[12px] text-[14px]",
  xs: "h-[24px] px-[8px] text-[13px]",
} as const;

const themeMap = {
  default:
    "text-on-surface-container bg-transparency hover:bg-transparency-low active:bg-transparency-high",
  primary: "text-on-primary bg-primary hover:bg-primary-mid active:bg-primary-high",
  secondary:
    "text-on-primary-container bg-primary-container border border-solid border-primary-lowest hover:bg-primary-container-low hover:border-primary-lower active:bg-primary-container-mid active:border-primary-low",
  outline:
    "border border-solid border-outline-mid text-on-surface-container bg-surface-container hover:border-outline-high hover:bg-surface-container-low active:border-outline-high active:bg-surface-container-mid",
  subtle:
    "text-on-surface-container bg-transparent hover:bg-transparency active:bg-transparency-low",
  transparent:
    "text-on-surface-container bg-transparent hover:bg-opacity-light20 active:bg-opacity-light30",
  transparent2:
    "text-on-surface-container bg-opacity-light10 hover:bg-opacity-light20 active:bg-opacity-light30",
  brand:
    "text-on-secondary bg-secondary-high hover:bg-secondary-higher active:bg-secondary-highest",
} as const;

export default function Button({
  children,
  id,
  className,
  onClick,
  size = "md",
  styleTheme = "default",
  style,
  disabled = false,
  onlyIcon = false,
  circle = false,
  icon,
  negative = false,
  shadow = false,
}: ButtonProps) {
  const hasIconAndText = !!icon && !!children;

  const base = `
    inline-flex items-center justify-center
    rounded-[6px] font-medium select-none
    disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
    transition-colors
  `;

  const onlyIconSizeMap = {
    lg: "min-w-[48px] h-[48px] p-0",
    md: "min-w-[40px] h-[40px] p-0",
    sm: "min-w-[32px] h-[32px] p-0",
    xs: "min-w-[24px] h-[24px] p-0",
  } as const;

  const iconTextGapMap = {
    lg: "gap-2 pl-[16px]",
    md: "gap-1 pl-[12px]",
    sm: "gap-1 pl-[8px]",
    xs: "gap-1 pl-[4px]",
  } as const;

  // negative 관련 조합
  const negativeMap: Record<string, string> = {
    default: "text-red hover:bg-red-container-high active:bg-red-container-low",
    outline: "hover:text-red active:text-red",
    subtle: "hover:text-red active:text-red",
  };

  return (
    <button
      id={id}
      style={style}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        base,
        sizeMap[size],
        themeMap[styleTheme],

        // onlyIcon이면 size 별 전용 스타일 적용
        onlyIcon && onlyIconSizeMap[size],

        // circle
        circle && "rounded-full",

        // 아이콘 + 텍스트 조합일 때
        hasIconAndText && iconTextGapMap[size],

        // 네거티브 스타일
        negative && negativeMap[styleTheme],

        // 그림자
        shadow && "shadow-gs1",

        className // 사용자 override
      )}
    >
      {icon && <span className="inline-flex items-center justify-center">{icon}</span>}
      {children}
    </button>
  );
}
