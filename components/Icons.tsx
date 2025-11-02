
import React from 'react';

const iconProps = {
  className: "w-6 h-6",
  strokeWidth: 2,
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const DailyIcon = () => <svg {...iconProps} viewBox="0 0 24 24"><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/><circle cx="12" cy="12" r="4"/></svg>;
export const WeeklyIcon = () => <svg {...iconProps} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
export const MonthlyIcon = () => <svg {...iconProps} viewBox="0 0 24 24"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M17.5 17.5 16 16.25V14"/><path d="M20 16h-4"/></svg>;
export const HafezIcon = () => <svg {...iconProps} viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
export const CoffeeIcon = () => <svg {...iconProps} viewBox="0 0 24 24"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M8 8H7a4 4 0 0 0 0 8h1"/><path d="M14.5 15a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1 5 0Z"/><path d="M6 8V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"/><path d="M18 19v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1"/></svg>;
export const TarotIcon = () => <svg {...iconProps} viewBox="0 0 24 24"><rect x="2" y="5" width="10" height="16" rx="2" /><rect x="12" y="3" width="10" height="16" rx="2" transform="rotate(15 17 11)"/></svg>;
export const VisualIcon = () => <svg {...iconProps} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;
export const LockIcon = () => <svg {...iconProps} viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
export const BotIcon = () => <svg {...iconProps} className="w-10 h-10 text-purple-300" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 8V4H8"/><rect x="4" y="12" width="16" height="8" rx="2"/><path d="M2 12h20"/><path d="M12 12v8"/></svg>;
export const CopyIcon = () => <svg {...iconProps} className="w-5 h-5" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>;
export const CheckIcon = () => <svg {...iconProps} className="w-5 h-5 text-green-400" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg>;
export const GiftIcon = () => <svg {...iconProps} className="w-6 h-6 text-yellow-400" viewBox="0 0 24 24"><path d="M20 12v10H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="m12 7-2-2.5A2.5 2.5 0 1 1 12 7Z"/><path d="m12 7 2-2.5A2.5 2.5 0 0 0 12 7Z"/></svg>;
