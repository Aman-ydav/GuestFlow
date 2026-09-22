"use client"

import { FiCheckCircle, FiInfo, FiLoader, FiXOctagon, FiAlertTriangle } from "react-icons/fi"
import { useTheme } from "@/hooks/useTheme"
import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <FiCheckCircle className="size-4" />,
        info: <FiInfo className="size-4" />,
        warning: <FiAlertTriangle className="size-4" />,
        error: <FiXOctagon className="size-4" />,
        loading: <FiLoader className="size-4 animate-spin" />,
      }}
      style={
        {
          // --popover/--popover-foreground/--border are bare HSL triplets
          // ("0 0% 100%"), not full color values — every other token usage in
          // this app goes through Tailwind's `hsl(var(--x))` wrapping
          // (index.css's @theme inline block), but this inline style prop
          // bypasses that, so it has to wrap them itself. Without hsl(...),
          // `background: 0 0% 100%` is an invalid CSS value the browser
          // silently drops, and every toast fell back to Sonner's own
          // built-in colors instead of matching the app's actual theme, in
          // both light and dark mode.
          "--normal-bg": "hsl(var(--popover))",
          "--normal-text": "hsl(var(--popover-foreground))",
          "--normal-border": "hsl(var(--border))",
          "--border-radius": "var(--radius)"
        }
      }
      {...props} />
  );
}

export { Toaster }
