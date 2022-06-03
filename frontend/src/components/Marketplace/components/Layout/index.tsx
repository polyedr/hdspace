import React from 'react';
import styled from 'styled-components';
import TopPanel from './TopPanel';

const CustomLayout = styled.div`
  min-height: 100vh;
  height: 1%;
  display: flex;
  flex-flow: column nowrap;
`;
const CustomePlaceholder = styled.div`
  min-height: 50px;
  flex: 0 0;
`;
const CustomContent = styled.div`
  flex: 1;
`;

const Layout = ({ children }) => {
  return (
    <CustomLayout>
      <TopPanel />
      <CustomePlaceholder />
      <CustomContent>{children}</CustomContent>
    </CustomLayout>
  );
};

export default Layout;
