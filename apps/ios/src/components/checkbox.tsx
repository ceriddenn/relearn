import * as CheckboxPrimitive from '@rn-primitives/checkbox';
import * as React from 'react';
import { Platform } from 'react-native';
import { Check } from 'lucide-react-native';
import { cn } from './lib/util';

const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
    return (
        <CheckboxPrimitive.Root
            ref={ref}
            className={cn(
                'h-4 w-4 native:h-[20] native:w-[20] shrink-0 rounded-sm native:rounded border border-gray-600 disabled:cursor-not-allowed disabled:opacity-50',
                props.checked && 'bg-primary',
                className
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator className={cn('items-center justify-center h-full w-full p-0')}>
                <Check
                    size={12}
                    strokeWidth={4}
                    color={'#9d4edd'}
                />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };