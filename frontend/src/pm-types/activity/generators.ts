import { ServerProject } from '@Src/types';
import { CallEffect, PutEffect } from 'redux-saga/effects';

export type GetActionSagaGenerator = Generator<
  CallEffect | PutEffect,
  void,
  any
>;

export type ClearHistorySagaGenerator = Generator<CallEffect | PutEffect>;

export type AddActionSagaGenerator = Generator<
  CallEffect | PutEffect,
  void,
  ServerProject
>;
