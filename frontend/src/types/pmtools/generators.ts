import { CallEffect, PutEffect } from 'redux-saga/effects';
import { ServerProject } from '../types';
import { FromServerColumn, ToServerTask } from './api';

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

export type ActionSagaGenerator = Generator<
  CallEffect | PutEffect,
  void,
  ServerProject
>;
