import * as React from 'react';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
	orientation?: 'horizontal' | 'vertical';
}

export function Separator({ orientation = 'horizontal', className, ...props }: SeparatorProps) {
	if (orientation === 'vertical') {
		return <div role='separator' className={`w-px bg-slate-200 ${className ?? ''}`} {...props} />;
	}
	return <div role='separator' className={`h-px bg-slate-200 ${className ?? ''}`} {...props} />;
}
