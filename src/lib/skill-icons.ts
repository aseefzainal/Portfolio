import {
  siGit,
  siJavascript,
  siLaravel,
  siMysql,
  siNextdotjs,
  siPhp,
  siReact,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";

const icons: Record<string, SimpleIcon> = {
  siLaravel,
  siPhp,
  siMysql,
  siJavascript,
  siTypescript,
  siReact,
  siNextdotjs,
  siTailwindcss,
  siGit,
};

export function resolveSkillIcon(slug: string): SimpleIcon | undefined {
  return icons[slug];
}

export const skillIconOptions = Object.keys(icons);
