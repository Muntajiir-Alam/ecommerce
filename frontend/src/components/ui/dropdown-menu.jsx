'use client';

import * as React from 'react';
import { cn } from 'cn';

const DropdownMenuContext = React.createContext(null);

function DropdownMenu({ className, children, ...props }) {
    const [open, setOpen] = React.useState(false);

    return (
        <DropdownMenuContext.Provider value={{ open, setOpen }}>
            <div className={cn('relative', className)} {...props}>
                {children}
            </div>
        </DropdownMenuContext.Provider>
    );
}

function DropdownMenuTrigger({ asChild = false, children, className, ...props }) {
    const context = React.useContext(DropdownMenuContext);
    const toggleOpen = () => context?.setOpen((prev) => !prev);

    if (asChild) {
        const child = React.Children.only(children);

        return React.cloneElement(child, {
            ...props,
            className: cn(className, child.props.className),
            onClick: (event) => {
                child.props.onClick?.(event);
                if (!event.defaultPrevented) toggleOpen();
            },
        });
    }

    return (
        <button
            type="button"
            className={cn(className)}
            onClick={toggleOpen}
            {...props}
        >
            {children}
        </button>
    );
}

function DropdownMenuContent({ align = 'end', className, children, ...props }) {
    const { open } = React.useContext(DropdownMenuContext) ?? {};

    if (!open) return null;

    const alignClass = {
        start: 'left-0',
        center: 'left-1/2 -translate-x-1/2',
        end: 'right-0',
    }[align] ?? 'right-0';

    return (
        <div
            className={cn(
                'absolute z-50 mt-2 min-w-44 rounded-md border border-border bg-popover p-1 shadow-lg',
                alignClass,
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

function DropdownMenuItem({ asChild = false, className, children, onClick, ...props }) {
    const context = React.useContext(DropdownMenuContext);
    const closeMenu = () => context?.setOpen(false);

    if (asChild) {
        const child = React.Children.only(children);

        return React.cloneElement(child, {
            ...props,
            className: cn(
                'block w-full rounded-sm px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted focus:bg-muted focus:outline-none',
                className,
                child.props.className
            ),
            onClick: (event) => {
                child.props.onClick?.(event);
                onClick?.(event);
                if (!event.defaultPrevented) closeMenu();
            },
        });
    }

    return (
        <button
            type="button"
            className={cn(
                'flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted focus:bg-muted focus:outline-none',
                className
            )}
            onClick={(event) => {
                onClick?.(event);
                if (!event.defaultPrevented) closeMenu();
            }}
            {...props}
        >
            {children}
        </button>
    );
}

export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger };
