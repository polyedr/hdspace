import { IColumn, ITask } from '../types/board/types';

const sortById = <T extends { id: number } = IColumn | ITask>(arr: T[]): T[] =>
  [...arr].sort((a, b) => a.id - b.id);

export default sortById;
