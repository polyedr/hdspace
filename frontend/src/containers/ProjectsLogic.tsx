import React from 'react';
import { useSelector } from 'react-redux';
import Projects from '../components/Projects/Projects';
import Spinner from '../components/UI/Spinner';
import { selectAreProjectsLoading } from '../redux/project/selectors';

const ProjectsLogic: React.FC = () => {
  const projectListLoader = useSelector(selectAreProjectsLoading);

  return (
    <>
      <Projects />
      <Spinner active={projectListLoader} />
    </>
  );
};

export default ProjectsLogic;
