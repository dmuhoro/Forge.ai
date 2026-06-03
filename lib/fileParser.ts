export interface ParsedFile {
  path: string;
  content: string;
}

export function parseFileBlocks(text: string): ParsedFile[] {
  const regex = /<file path="([^"]+)">([\s\S]*?)<\/file>/g;
  const files: ParsedFile[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    files.push({
      path: match[1].trim(),
      content: match[2].trim(),
    });
  }
  return files;
}

export function toSandpackFiles(
  files: ParsedFile[]
): Record<string, { code: string }> {
  return Object.fromEntries(
    files.map(({ path, content }) => [path, { code: content }])
  );
}
