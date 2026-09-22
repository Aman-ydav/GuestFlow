"use client"

import { FiCheckCircle, FiInfo, FiLoader, FiXOctagon, FiAlertTriangle } from "react-icons/fi"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

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
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)"
        }
      }
      {...props} />
  );
}

export { Toaster }
