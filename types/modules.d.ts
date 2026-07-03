/**
 * Module declaration for non-TS files
 * Allows the project to be progressively migrated to TypeScript
 */

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.html' {
  const content: string;
  export default content;
}
