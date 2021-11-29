import { CallEffect, PutEffect, SelectEffect } from 'redux-saga/effects';
import { ServerProject } from '../types';
import { IColumnData } from './trelloTypes';
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
  project: number;
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
  ToServerTask
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
