import * as React from "react";
import { TextInput } from "react-native";
import { cn } from "./lib/util";

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  React.ComponentPropsWithoutRef<typeof TextInput>
>(({ className, placeholderClassName, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      className={cn(
        "text-white h-10 text-base lg:text-sm native:text-lg native:leading-[1.25] placeholder:text-gray-600 file:border-0 file:bg-transparent file:font-medium",
        props.editable === false && "opacity-50 web:cursor-not-allowed",
        className,
      )}
      placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
