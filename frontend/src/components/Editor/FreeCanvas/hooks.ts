import { useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { StateElement } from '../../../redux/project/types';
import { selectProjectClasses } from '../../../redux/project/selectors';

// eslint-disable-next-line import/prefer-default-export
export const useElementClassNames = (element: StateElement) => {
  const projectClasses = useSelector(selectProjectClasses);

  const [entityClass, groupClass] = element.styles.classNames;
  const entityStyles =
    projectClasses?.find((cssClass: any) => cssClass.className === entityClass)
      ?.rules || {};
  const groupStyles =
    projectClasses?.find((cssClass: any) => cssClass.className === groupClass)
      ?.rules || {};

  return makeStyles({
    entityStyles: {
      ...entityStyles,
    },

    groupStyles: {
      ...groupStyles,
    },

    ownStyles: {
      ...element.styles.ownStyles,
    },
  })();
};
