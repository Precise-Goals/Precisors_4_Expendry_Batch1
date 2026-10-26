import React from "react";

export const Divider = React.forwardRef(function Divider(
  {
    orientation = "horizontal",
    label,
    className = "",
    ...props
  },
  ref
) {
  if (orientation === "vertical") {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="vertical"
        className={`inline-block w-px self-stretch bg-[#262626] mx-2 ${className}`.trim()}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={`flex items-center my-4 ${className}`.trim()}
        {...props}
      >
        <div className="flex-grow border-t border-[#262626]" />
        <span className="mx-4 text-xs uppercase tracking-wider text-[#71717a] font-medium">
          {label}
        </span>
        <div className="flex-grow border-t border-[#262626]" />
      </div>
    );
  }

  return (
    <hr
      ref={ref}
      role="separator"
      aria-orientation="horizontal"
      className={`border-0 border-t border-[#262626] my-4 w-full ${className}`.trim()}
      {...props}
    />
  );
});

export default Divider;
