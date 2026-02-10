export interface Skill {
  name: string;
  level: number;
}

export interface SkillCategory {
  category: string;
  items: Skill[];
}
