export type Example = Record<string, string | number | boolean | null>;

export type TreeNode = {
  name: string;
  edgeLabel?: string | null;         // branch label coming *into* this node
  attributeValue?: string | null;    // tolerant of older DTOs
  children?: TreeNode[];
  remainingAttributes?: string[];
  examples?: Example[];
};
