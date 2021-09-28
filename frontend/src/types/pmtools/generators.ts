import { CallEffect, PutEffect } from 'redux-saga/effects';
import { ServerProject } from '../types';
import { FromServerColumn, ToServerTask } from './api';

// Board
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
  FromServerColumn
>;

export type ColumnDeletSagaGenerator = Generator<
  CallEffect | PutEffect,
  void,
  FromServerColumn
>;

// Activity
export type ClearHistorySagaGenerator = Generator<CallEffect | PutEffect>;

export type AddActionSagaGenerator = Generator<
  CallEffect | PutEffect,
  void,
  ServerProject
>;
