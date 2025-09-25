import * as React from 'react';

function cn(...classes: Array<string | false | null | undefined>) {
	return classes.filter(Boolean).join(' ');
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'default' | 'outline' | 'ghost';
	size?: 'default' | 'icon' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
		const base = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
		const variants = {
			default: 'bg-blue-600 text-white hover:bg-blue-600',
			outline: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-900',
			ghost: 'bg-transparent hover:bg-slate-50 text-slate-900',
		} as const;
		const sizes = {
			default: 'h-9 px-4 py-2',
			icon: 'h-9 w-9',
			lg: 'h-10 px-6',
		} as const;

		return (
			<button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props}>
				{children}
			</button>
		);
	}
);

Button.displayName = 'Button';
