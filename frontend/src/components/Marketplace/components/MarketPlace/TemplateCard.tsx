import React, { useEffect, useRef } from 'react';
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
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AddIcon from '@mui/icons-material/Add';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { getTemplatesLists } from '@Redux/marketplace/actions';
import {
  selectMarketplacesData,
  selectTemplatessDataNext,
  selectAreTemplatesLoading,
} from '@Redux/marketplace/selectors/base';
import tempImage from '../../../../assets/images/image1.png';

const GridContainer = styled(Grid)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
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
const CustomeCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  gap: 12px;
  width: '310px';
  height: '74px';
`;
const CustomDescription = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 278px;
  height: 45px;
`;
const CustomHeading = styled(Typography)`
  width: 278px;
  height: 20px;
  font-family: 'Roboto';
  font-size: 14px;
  font-weight: 500;
  line-height: 145%;
`;

const CostomSubHeading = styled(Typography)`
  display: flex;
  align-items: center;
  width: 278px;
  height: 16px;
  font-family: 'Roboto';
  font-size: 12px;
  font-weight: 400;
  line-height: 135%;
  color: #81818e;
`;
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
const Loader = styled.div`
  padding: 1rem;
  text-align: center;
  position: relative;
  left: 16rem;
`;
function TemplateCard() {
  const [show, setShow] = React.useState({});
  const Template = useSelector(selectMarketplacesData);
  const templateListLoader = useSelector(selectAreTemplatesLoading);

  const dispatch = useDispatch();
  const hasNext = useSelector(selectTemplatessDataNext);
  const handleMouseOver = (index) => {
    setShow({ show, [index]: true });
  };
  const handleMouseOut = (index) => {
    setShow({ show, [index]: false });
  };

  const ref = useRef<HTMLDivElement>(null);
  const el = ref && ref.current;

  useEffect(() => {
    dispatch(getTemplatesLists());
  }, [dispatch]);

  const handleGetTemplates = () => {
    if (hasNext) {
      dispatch(getTemplatesLists());
    }
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleGetTemplates();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.01,
      },
    );

    if (el) {
      obs.observe(el);
    }

    return () => {
      if (el) {
        obs.unobserve(el);
      }
    };
  }, [el]);

  const sortedTemplateList = Object.values(Template).sort(
    (a, b) => b.created.getTime() - a.created.getTime(),
  );
  return (
    <>
      <GridContainer container spacing={4}>
        {sortedTemplateList.map((item, index) => (
          <Grid
            key={item.id.toString()}
            item
            xs={3}
            sm={6}
            md={4}
            style={{ marginTop: 0 }}
          >
            <CustomRoot>
              <CustomCard>
                <CardActionArea
                  onMouseEnter={() => handleMouseOver(index)}
                  onMouseLeave={() => handleMouseOut(index)}
                >
                  <CustomCardMedia
                    component="img"
                    height="194"
                    image={tempImage}
                    alt="Paella dish"
                  />
                  <Divider style={{ background: '#F3F4F6' }} light />

                  <CustomeCardContent>
                    <CustomDescription>
                      <CustomHeading gutterBottom>{item?.name}</CustomHeading>
                      <CostomSubHeading variant="caption">
                        A short description of the project on one line
                      </CostomSubHeading>
                    </CustomDescription>
                  </CustomeCardContent>

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

      {!sortedTemplateList.length && !templateListLoader && (
        <Loader>No Templates found :(</Loader>
      )}
    </>
  );
}

export default TemplateCard;
