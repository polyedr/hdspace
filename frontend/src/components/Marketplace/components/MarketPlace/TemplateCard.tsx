import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  CardActionArea,
  Grid,
  IconButton,
  Divider,
  styled as muiStyled,
} from '@mui/material';

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AddIcon from '@mui/icons-material/Add';
import styled from 'styled-components';
import Theme from '@Src/styles/Theme';
import { ThemeProvider } from '@mui/material/styles';
import tempImage from '../../../../assets/images/image1.png';

const GridContainer = styled(Grid)`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 0;
`;
const CustomRoot = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 309px;
  height: 234px;
`;
const CustomCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 309px;
  height: 234px;
  margin: auto;
  transition: 0.3s;
  background-color: #ffffff;
  box-shadow: rgba(42, 42, 45, 0.06);
  border-radius: 6px;
`;
const CustomCardMedia = styled(CardMedia)`
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  width: 309px;
  height: 160px;
`;

const CustomeCardContent = muiStyled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: theme.spacing(2),
  gap: '12px',
  width: '310px',
  height: '74px',
}));
const CustomDescription = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 278px;
  height: 45px;
`;

const CustomHeading = muiStyled(Typography)(({ theme }) => ({
  width: '278px',
  height: '20px',
  fontFamily: theme.typography.fontFamily,
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '145%',
  color: '#2A2A2D',
}));
const CostomSubHeading = muiStyled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '278px',
  height: '16px',
  fontFamily: theme.typography.fontFamily,
  fontSize: '12px',
  fontWeight: 400,
  lineHeight: '135%',
  color: '#81818E',
}));
const CustomCardActions = styled(CardActions)`
  display: flex;
  right: 8px;
  top: 8px;
  transition: opacity 0.1s ease-in-out;
`;
const CustomIconButton = styled(IconButton)`
  position: absolute;
  border-radius: 50%;
  overflow: hidden;
  &:nth-child(1) {
    background: #fff !important;
    height: 32px;
    width: 32px;
  }
  &:nth-child(1):hover {
    background: rgb(67, 83, 97) !important;
    color: #fff;
  }
  &:nth-child(2) {
    background: #fff !important;
    height: 32px;
    width: 32px;
  }
  &:nth-child(2):hover {
    background: rgb(67, 83, 97) !important;
    color: #fff;
  }
`;
const Templetdata = [
  {
    title: 'Template 1',
    subtitle: 'A short description of the project on one line',
    image: tempImage,
  },
  {
    title: 'Template 2',
    subtitle: 'A short description of the project on one line',
    image: tempImage,
  },
  {
    title: 'Template 3',
    subtitle: 'A short description of the project on one line',
    image: tempImage,
  },
  {
    title: 'Template 4',
    subtitle: 'A short description of the project on one line',
    image: tempImage,
  },
  {
    title: 'Template 5',
    subtitle: 'A short description of the project on one line',
    image: tempImage,
  },
  {
    title: 'Template 6',
    subtitle: 'A short description of the project on one line',
    image: tempImage,
  },
];
const TemplateCard = () => {
  const [show, setShow] = React.useState({});
  const handleMouseOver = (index) => {
    setShow({ show, [index]: true });
  };
  const handleMouseOut = (index) => {
    setShow({ show, [index]: false });
  };
  return (
    <GridContainer container spacing={4}>
      {Templetdata.map((item, index) => (
        <Grid item xs={3} sm={6} md={4} style={{ marginTop: 0 }}>
          <CustomRoot>
            <CustomCard>
              <CardActionArea
                onMouseEnter={() => handleMouseOver(index)}
                onMouseLeave={() => handleMouseOut(index)}
              >
                <CustomCardMedia
                  component="img"
                  height="194"
                  image={item.image}
                  alt="Paella dish"
                />
                <Divider style={{ background: '#F3F4F6' }} light />
                <ThemeProvider theme={Theme}>
                  <CustomeCardContent>
                    <CustomDescription>
                      <CustomHeading gutterBottom>{item.title}</CustomHeading>
                      <CostomSubHeading variant="caption">
                        {item.subtitle}
                      </CostomSubHeading>
                    </CustomDescription>
                  </CustomeCardContent>
                </ThemeProvider>
                {show[index] && (
                  <CustomCardActions
                    style={{
                      position: show[index] ? 'absolute' : 'unset',
                    }}
                  >
                    <CustomIconButton>
                      <VisibilityOutlinedIcon />
                    </CustomIconButton>
                    <CustomIconButton>
                      <AddIcon />
                    </CustomIconButton>
                  </CustomCardActions>
                )}
              </CardActionArea>
            </CustomCard>
          </CustomRoot>
        </Grid>
      ))}
    </GridContainer>
  );
};

export default TemplateCard;
