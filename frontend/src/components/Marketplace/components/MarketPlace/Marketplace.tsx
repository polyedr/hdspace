import React, { memo } from 'react';
import { Typography, Container, Box } from '@mui/material';
import styled from 'styled-components';
import TemplateCard from './TemplateCard';
import Searchbar from './Searchbar';

const CustomRoot = styled.div`
  margin: 16px;
  padding: 8px;
`;
const CustomHeader = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;
const CustomHeaderAction = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  gap: 16px;
  width: 660px;
  height: 36px;
  left: 203px;
  top: 186px;
`;
const CustomTitle = styled(Typography)`
  display: 'flex';
  align-items: center;
  width: 135px;
  height: 30px;
  left: 203px;
  top: 80px;
  font-weight: 500 !important;
  font-style: normal;
  line-height: 150% !important;
  color: '#2A2A2D';
`;
const CustomSubTitle = styled(Typography)`
  display: flex;
  width: 472px;
  height: 40px;
  left: 203px;
  top: 122px;
  font-family: 'Roboto';
  font-size: 14px !important;
  font-weight: 400 !important;
  line-height: 145% !important;
  color: '#2A2A2D';
`;
const CustomProjectCard = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 960px;
  height: 484px;
  left: 203px;
  top: 238px;
  padding: 8px;
`;
const Marketplace: React.FC = () => (
  <Container style={{ display: 'flex', justifyContent: 'space-around' }}>
    <CustomRoot>
      <CustomHeader>
        <CustomTitle variant="h5">Marketplace</CustomTitle>
        <CustomSubTitle variant="h6">
          Don&apos;t know where to start with your project? Feel free to use our
          templates to inspire your creativity
        </CustomSubTitle>
        <CustomHeaderAction>
          <Searchbar />
        </CustomHeaderAction>
      </CustomHeader>
      <CustomProjectCard sx={{ flexGrow: 1 }}>
        <TemplateCard />
      </CustomProjectCard>
    </CustomRoot>
  </Container>
);

export default memo(Marketplace);
