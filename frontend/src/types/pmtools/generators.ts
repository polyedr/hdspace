import { CallEffect, PutEffect, SelectEffect } from 'redux-saga/effects';
import { ServerProject } from '..';
import { IColumnData } from './board';
import { ActionTypePM } from './types';

export type MoveCardGenerator = Generator<
  CallEffect | SelectEffect | PutEffect,
  void | Error,
  any
>;

export interface ToServerColumn {
  id: string;
  name: string;
  description: string;
  project: ServerProject['id'];
}

export interface ToServerTask {
  title: string;
  description: string;
  status: string;
  column: number;
  creator: string;
  owner: number;
}

export type TasksAddSagaGenerator = Generator<
  CallEffect | PutEffect,
  void,
  any
>;

export type TasksEditSagaGenerator = Generator<
  CallEffect | PutEffect | SelectEffect,
  void,
  (ToServerTask & number) & any
>;

export type ColumnSagaGenerator = Generator<
  CallEffect | PutEffect,
  void,
  IColumnData | any
>;

export type ColumnDeletSagaGenerator = Generator<
  CallEffect | PutEffect | SelectEffect,
  void,
  ToServerColumn['project'] & ActionTypePM
>;

export type ActionSagaGenerator = Generator<
  CallEffect | PutEffect,
  void,
  ServerProject
>;
