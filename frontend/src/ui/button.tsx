import {cva} from 'class-variance-authority';
import { cn } from '../lib/utils.ts';
import React from 'react';
const buttonVariants = cva("py-3 px-6 rounded transition-colors duration-300 border", {
    variants: {
        variant: {
            primary: "bg-warmrasberry text-white border-warmrasberry hover:bg-white hover:text-warmrasberry",
            secondary: "bg-transparent border border-warmrasberry text-warmrasberry hover:bg-warmrasberry hover:text-white",
        },
        type: {
            submit: "type='submit'",
            button: "type='button'",
            rest: "",
        },
    },
});
interface ButtonPropsCVA {
    variant?: "primary" | "secondary";
    type?: "submit" | "button" | "rest";
}

interface ButtonProps {
    children: React.ReactNode;
}

type Props = ButtonPropsCVA & ButtonProps;

export default function Button({ variant = "primary", type="submit", children }: Props) {
    
    return    <a className={cn(buttonVariants({ variant, type }))}>{children}</a>

}
