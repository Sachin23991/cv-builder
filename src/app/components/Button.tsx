import React, { useRef, useEffect } from "react";
import { cx } from "lib/cx";
import { Tooltip } from "components/Tooltip";

type ReactButtonProps = React.ComponentPropsWithoutRef<"button">;
type ReactAnchorProps = React.ComponentPropsWithoutRef<"a"> & { href?: string };
type ButtonProps = ReactButtonProps | ReactAnchorProps;

const isAnchor = (props: ButtonProps): props is ReactAnchorProps => {
  return typeof (props as any).href === "string";
};

export const Button = React.forwardRef<HTMLElement, ButtonProps>((props, ref) => {
  if (isAnchor(props)) {
    const { href, ...rest } = props as any;
    return <a ref={ref as any} href={href} {...rest} />;
  } else {
    const { type = "button", ...rest } = props as any;
    return <button ref={ref as any} type={type} {...rest} />;
  }
});

Button.displayName = "Button";

export const PrimaryButton = ({ className, ...props }: ButtonProps) => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current as HTMLElement | null;
    if (!node) return;
    // initialize spotlight position
    node.style.setProperty("--x", "50%");
    node.style.setProperty("--y", "50%");
  }, []);

  const handleMove = (e: React.MouseEvent) => {
    const node = ref.current as HTMLElement | null;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    node.style.setProperty("--x", `${x}%`);
    node.style.setProperty("--y", `${y}%`);
  };

  const handleLeave = () => {
    const node = ref.current as HTMLElement | null;
    if (!node) return;
    node.style.setProperty("--x", "50%");
    node.style.setProperty("--y", "50%");
  };

  return (
    <Button
      ref={ref}
      className={cx("btn-primary spotlight-btn", className)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...(props as any)}
    />
  );
};

type IconButtonProps = ButtonProps & {
  size?: "small" | "medium";
  tooltipText: string;
};

export const IconButton = ({
  className,
  size = "medium",
  tooltipText,
  ...props
}: IconButtonProps) => (
  <Tooltip text={tooltipText}>
    <Button
      type="button"
      className={cx(
        "rounded-full outline-none hover:bg-gray-100 focus-visible:bg-gray-100",
        size === "medium" ? "p-1.5" : "p-1",
        className
      )}
      {...props}
    />
  </Tooltip>
);
