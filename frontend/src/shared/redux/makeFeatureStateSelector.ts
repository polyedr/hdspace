import { AppReduxState } from '@Redux/types';

function makeFeatureStateSelector<
  T extends AppReduxState,
  K extends keyof AppReduxState,
>(featureName: K) {
  return (state: T): T[K] => {
    if (!state[featureName]) {
      throw new Error(`Cannot find ${featureName} feature state!`);
    }

    return state[featureName];
  };
}

export default makeFeatureStateSelector;
