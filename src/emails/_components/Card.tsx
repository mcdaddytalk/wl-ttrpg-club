import * as React from 'react';

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="px-5 py-4 bg-slate-900 text-slate-100 text-base font-semibold">{children}</div>;
}
export function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="px-5 py-5 text-[14px] leading-6 text-slate-300">{children}</div>;
}
export function EmailButton(props: React.HTMLProps<HTMLAnchorElement>) {
  const { className, ...rest } = props;
  return (
    <a
      {...rest}
      className={`inline-block rounded-xl px-4 py-2 font-semibold bg-emerald-400 text-slate-900 no-underline ${className ?? ''}`}
    />
  );
}