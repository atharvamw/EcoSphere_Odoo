import React from 'react';
import { ShieldAlert, AlertTriangle, Info, ShieldCheck } from 'lucide-react';

interface SeverityBadgeProps {
  level: 'Low' | 'Medium' | 'High' | 'Critical';
}

export function SeverityBadge({ level }: SeverityBadgeProps) {
  const config = {
    Low: { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: Info },
    Medium: { color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: AlertTriangle },
    High: { color: 'bg-orange-500/10 text-orange-500 border-orange-500/20', icon: ShieldAlert },
    Critical: { color: 'bg-destructive/10 text-destructive border-destructive/20 font-bold', icon: ShieldAlert },
  };

  const { color, icon: Icon } = config[level];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {level}
    </span>
  );
}
