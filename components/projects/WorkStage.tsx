import type { ReactNode } from 'react';

/** Decorative layers keep each project's real, clickable artwork in the foreground. */
export default function WorkStage({ children, number, note, caption }: {
 children: ReactNode; number: string; note: string; caption: string;
}) {
 return <div className="work-stage">
  <span className="stage-orbit" aria-hidden="true" />
  <span className="stage-glass stage-glass-back" aria-hidden="true" />
  <div className="stage-art">{children}</div>
  <span className="stage-chip" aria-hidden="true"><span className="stage-chip-icon">↗</span>{note}</span>
  <span className="stage-footer" aria-hidden="true"><b>{number}</b><span>{caption}</span><i>↗</i></span>
 </div>;
}
