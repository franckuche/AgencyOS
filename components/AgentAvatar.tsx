'use client';

import Image from 'next/image';

interface AgentAvatarProps {
  avatar?: string;
  emoji?: string;
  name: string;
  color?: string;
  size: number;
  className?: string;
}

export default function AgentAvatar({ avatar, emoji, name, color, size, className = '' }: AgentAvatarProps) {
  if (avatar) {
    return (
      <Image
        src={avatar}
        alt={name}
        width={size}
        height={size}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color ? `${color}20` : '#00000008',
        borderRadius: 'inherit',
      }}
    >
      <span style={{ fontSize: size * 0.5, lineHeight: 1 }}>{emoji || name.charAt(0)}</span>
    </div>
  );
}
