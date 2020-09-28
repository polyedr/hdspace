import React from 'react';
import { useSelector } from 'react-redux';
import Projects from '../components/Projects/Projects';
import Spinner from '../components/UI/Spinner';
import { selectProjectListLoader } from '../redux/project/selectors';

const ProjectsLogic: React.FC = () => {
  const projectListLoader = useSelector(selectProjectListLoader);

  return (
    <>
      <Projects />
      <Spinner active={projectListLoader} />
    </>
  );
};

export default ProjectsLogic;
