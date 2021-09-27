import { CallEffect, PutEffect } from 'redux-saga/effects';
import { IFromServerColumn, IToServerTask } from './types';

export type TasksAddSagaGenerator = Generator<
  CallEffect | PutEffect,
  void,
  IToServerTask
>;

export type TasksEditSagaGenerator = Generator<
  CallEffect | PutEffect,
  void,
  IToServerTask | any
>;

export type ColumnsFetchSagaGenerator = Generator<
  CallEffect | PutEffect,
  void,
  Array<string>
>;

export type ColumnSagaGenerator = Generator<
  CallEffect | PutEffect,
  void,
  IFromServerColumn
>;

export type ColumnDeletSagaGenerator = Generator<
  CallEffect | PutEffect,
  void,
  IFromServerColumn | any
>;
