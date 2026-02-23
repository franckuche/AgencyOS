export interface AgentSkill {
  name: string;
  value: number;
  color: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  quote: string;
  emoji: string;
  color: string;
  statusColor: string;
  skills: AgentSkill[];
  cwd: string;
}

import path from 'path';

const AGENTS_BASE = process.env.AGENTS_DIR || path.join(process.cwd(), 'agents');

export const agents: Agent[] = [
  {
    id: 'seo',
    name: 'SEOmar',
    role: "L'Analyste SEO",
    quote: "Data don't lie, people do",
    emoji: '🔍',
    color: '#00D4AA',
    statusColor: '#00D4AA',
    skills: [
      { name: 'Audits', value: 90, color: '#00D4AA' },
      { name: 'Maillage', value: 85, color: '#00D4AA' },
      { name: 'Technique', value: 80, color: '#00D4AA' },
      { name: 'Contenu', value: 70, color: '#00D4AA' },
    ],
    cwd: `${AGENTS_BASE}/seo`,
  },
  {
    id: 'coach',
    name: 'Coach',
    role: 'Le Préparateur Physique',
    quote: "No pain, no gain — but smart pain",
    emoji: '💪',
    color: '#FF8C42',
    statusColor: '#FF8C42',
    skills: [
      { name: 'Musculation', value: 90, color: '#FF8C42' },
      { name: 'Nutrition', value: 75, color: '#FF8C42' },
      { name: 'Récupération', value: 80, color: '#FF8C42' },
      { name: 'Cardio', value: 70, color: '#FF8C42' },
    ],
    cwd: `${AGENTS_BASE}/coach`,
  },
  {
    id: 'chef',
    name: 'Chef',
    role: 'Le Cuisinier Personnel',
    quote: "On mange bien, on vit bien",
    emoji: '👨‍🍳',
    color: '#4ECB71',
    statusColor: '#4ECB71',
    skills: [
      { name: 'Recettes', value: 90, color: '#4ECB71' },
      { name: 'Meal Prep', value: 85, color: '#4ECB71' },
      { name: 'Nutrition', value: 75, color: '#4ECB71' },
      { name: 'Budget', value: 80, color: '#4ECB71' },
    ],
    cwd: `${AGENTS_BASE}/chef`,
  },
  {
    id: 'alfred',
    name: 'Alfred',
    role: "L'Assistant Personnel",
    quote: "À votre service, Monsieur",
    emoji: '🎩',
    color: '#5B8DEF',
    statusColor: '#5B8DEF',
    skills: [
      { name: 'Organisation', value: 85, color: '#5B8DEF' },
      { name: 'Recherche', value: 90, color: '#5B8DEF' },
      { name: 'Productivité', value: 80, color: '#5B8DEF' },
      { name: 'Admin', value: 75, color: '#5B8DEF' },
    ],
    cwd: `${AGENTS_BASE}/alfred`,
  },
  {
    id: 'bullshito',
    name: 'Bullshito',
    role: "L'Expert LinkedIn",
    quote: "Ton post mérite mieux que 200 impressions",
    emoji: '🎯',
    color: '#E040FB',
    statusColor: '#E040FB',
    skills: [
      { name: 'Scoring', value: 92, color: '#E040FB' },
      { name: 'Rédaction', value: 88, color: '#E040FB' },
      { name: 'Analytics', value: 85, color: '#E040FB' },
      { name: 'Algorithme', value: 95, color: '#E040FB' },
    ],
    cwd: `${AGENTS_BASE}/bullshito`,
  },
];

export function getAgent(id: string): Agent | undefined {
  return agents.find((a) => a.id === id);
}
