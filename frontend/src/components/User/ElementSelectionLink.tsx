import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router';
import { setPreSelectedElementId } from '@Redux/project/actions';
import { selectPreSelectedElementId } from '@Redux/project/selectors/element';

type ParamProps = {
  projectId: string;
  screenId: string;
  elementId: string;
};

const ElementSelectionLink: React.FC<RouteComponentProps<ParamProps>> = ({
  match: { params },
}: RouteComponentProps<ParamProps>) => {
  const { projectId, screenId, elementId } = params;
  const dispatch = useDispatch();
  const history = useHistory();
  const preSelectedElementId = useSelector(selectPreSelectedElementId);

  useEffect(() => {
    if (!elementId) {
      return;
    }
    dispatch(setPreSelectedElementId(elementId));
  }, [dispatch, elementId, history, projectId, screenId]);

  useEffect(() => {
    if (!preSelectedElementId || !projectId || !screenId) {
      return;
    }

    history.push(`/project/${projectId}/${screenId}`);
  }, [preSelectedElementId, history, projectId, screenId]);

  return null;
};

export default ElementSelectionLink;
