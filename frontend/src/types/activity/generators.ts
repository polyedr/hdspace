import { CallEffect, PutEffect } from 'redux-saga/effects';

export type GetActionSagaGenerator = Generator<
  CallEffect | PutEffect,
  void,
  Array<string>
>;

export type ClearHistorySagaGenerator = Generator<CallEffect | PutEffect>;

export type AddActionSagaGenerator = Generator<
  CallEffect | PutEffect | PutEffect<{ type: 'invite/ERROR'; e: string }>
>;
