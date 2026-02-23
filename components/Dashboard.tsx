'use client';

import Image from 'next/image';

interface AgentSkill {
  name: string;
  value: number;
  color: string;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  color: string;
  bio: string;
  skills: AgentSkill[];
}

interface DashboardProps {
  agents: Agent[];
  onSelectAgent: (id: string) => void;
  agentStatus: Record<string, 'idle' | 'busy'>;
}

export default function Dashboard({ agents, onSelectAgent, agentStatus }: DashboardProps) {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold font-mono tracking-wide mb-2">
        L&apos;<span className="text-accent-cyan">ÉQUIPE</span>
      </h1>
      <p className="text-sm text-text-secondary mb-8">
        Ton équipe perso. Chacun a sa spécialité.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {agents.map((agent) => {
          const status = agentStatus[agent.id] || 'idle';

          return (
            <div
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              className="bg-bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:border-border-active transition-all group"
            >
              {/* Avatar + Identity */}
              <div className="flex items-start gap-4 p-6 pb-4">
                <div className="relative flex-shrink-0">
                  <div
                    className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-offset-2 ring-offset-bg-card"
                    style={{ ['--tw-ring-color' as string]: agent.color }}
                  >
                    <Image
                      src={agent.avatar}
                      alt={agent.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-bg-card"
                    style={{
                      backgroundColor: status === 'busy' ? '#FFB800' : agent.color,
                      animation: status === 'busy' ? 'pulse-dot 1.5s infinite' : 'none',
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text-primary">{agent.name}</h3>
                    <span
                      className="text-[10px] uppercase tracking-wider font-semibold"
                      style={{ color: status === 'busy' ? '#FFB800' : agent.color }}
                    >
                      {status === 'busy' ? 'BUSY' : 'DISPO'}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: agent.color }}>{agent.role}</p>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed">{agent.bio}</p>
                </div>
              </div>

              {/* Quote */}
              <div className="px-6 pb-3">
                <p className="text-xs text-text-muted italic">
                  &ldquo;{agent.quote}&rdquo;
                </p>
              </div>

              {/* Skills */}
              <div className="px-6 pb-5 space-y-2">
                {agent.skills.map((skill) => (
                  <div key={skill.name} className="flex items-center gap-3">
                    <span className="text-[11px] text-text-secondary w-20 text-right">
                      {skill.name}
                    </span>
                    <div className="flex-1 h-1.5 bg-bg-primary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 group-hover:opacity-100 opacity-70"
                        style={{
                          width: `${skill.value}%`,
                          backgroundColor: skill.color,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-text-muted w-7">{skill.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
