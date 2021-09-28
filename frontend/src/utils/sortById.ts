import { ColumnData, TaskData } from '@Src/types/pmtools/types';

const sortById = <T extends { id: number } = ColumnData | TaskData>(
  arr: T[],
): T[] => [...arr].sort((a, b) => a.id - b.id);

export default sortById;
