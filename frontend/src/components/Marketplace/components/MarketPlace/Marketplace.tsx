import React, { memo } from 'react';
import { Typography, Container, Box, styled as muiStyled } from '@mui/material';
import styled from 'styled-components';
import Theme from '@Src/styles/Theme';
import { ThemeProvider } from '@mui/material/styles';
import TemplateCard from './TemplateCard';
import Searchbar from './Searchbar';

const CustomRoot = muiStyled('div')(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(1),
}));
const CustomHeader = muiStyled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  gap: '25px',
}));
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
const Marketplace: React.FC = () => {
  return (
    <Container style={{ display: 'flex', justifyContent: 'space-around' }}>
      <ThemeProvider theme={Theme}>
        <CustomRoot>
          <CustomHeader>
            <CustomTitle variant="h5">Marketplace</CustomTitle>
            <CustomSubTitle variant="h6">
              Dont know where to start with your project? Feel free to use our
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
      </ThemeProvider>
    </Container>
  );
};

export default memo(Marketplace);
