import { Layout } from '@Src/types';
import { useSelector } from 'react-redux';
import { selectLayout } from '@Redux/project/selectors/base';

const useLayout = (layouts: Layout[] | undefined) => {
  const currentLayout = useSelector(selectLayout);
  if (!layouts) return false;

  return layouts.includes(currentLayout);
};

export default useLayout;
