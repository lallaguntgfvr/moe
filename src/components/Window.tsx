import type { ReactNode } from "react";

type WindowProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export default function Window({
  title,
  children,
  className = "",
}: WindowProps) {
  return (
    <section className={`window ${className}`}>
      <div className="window-title">
        <span>{title}</span>
        <span className="window-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="window-body">{children}</div>
    </section>
  );
}
