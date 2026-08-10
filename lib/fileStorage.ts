import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export function readDataFile<T>(fileName: string): T[] {
  const filePath = path.join(dataDir, fileName);
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  // Handle empty or whitespace-only files
  if (!content || content.trim() === '') {
    return [];
  }
  try {
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error parsing JSON from ${fileName}:`, error);
    return [];
  }
}

export function writeDataFile<T>(fileName: string, data: T[]): void {
  const filePath = path.join(dataDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function appendToDataFile<T>(fileName: string, item: T): T {
  const items = readDataFile<T>(fileName);
  const newItem = { ...item, id: Date.now().toString() };
  items.push(newItem);
  writeDataFile(fileName, items);
  return newItem;
}

export function updateDataFile<T extends { id: string }>(
  fileName: string,
  id: string,
  updates: Partial<T>
): T | null {
  const items = readDataFile<T>(fileName);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates };
  writeDataFile(fileName, items);
  return items[index];
}

export function deleteFromDataFile(fileName: string, id: string): boolean {
  const items = readDataFile<any>(fileName);
  const filtered = items.filter(item => item.id !== id);
  if (filtered.length === items.length) return false;
  writeDataFile(fileName, filtered);
  return true;
}