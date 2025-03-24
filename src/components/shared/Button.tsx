import React, { MouseEventHandler, ReactNode } from "react"
import { twMerge } from 'tailwind-merge'

export const Button = ({ onClick, children, className, ...props }: { onClick: MouseEventHandler<HTMLButtonElement>, children: ReactNode, className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      onClick={onClick} 
      className={twMerge(
        "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", 
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}