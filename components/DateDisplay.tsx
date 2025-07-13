"use client";

interface DateDisplayProps {
  isoString: string;
}

export default function DateDisplay({ isoString }: DateDisplayProps) {
  const date = new Date(isoString);
  const formatted = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth()+1).toString().padStart(2, '0')}.${date.getFullYear()}`;
  return <>{formatted}</>;
} 