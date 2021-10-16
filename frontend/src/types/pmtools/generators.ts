import { CallEffect, PutEffect, SelectEffect } from 'redux-saga/effects';
import { ServerProject } from '../types';
import { ActionTypePM } from './types';

export interface ToServerColumn {
  id: number;
  title: string;
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
  CallEffect | PutEffect,
  void,
  ToServerTask
>;

export type ColumnSagaGenerator = Generator<
  CallEffect | PutEffect,
  void,
  ToServerColumn
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
