import React from 'react';
import { makeStyles, lighten } from '@material-ui/core/styles';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  CardActionArea,
  Grid,
} from '@material-ui/core';
import { IconButton, Divider } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AddIcon from '@mui/icons-material/Add';
import image1 from '../../../../assets/images/image1.png';
import image2 from '../../../../assets/images/image2.png';
import image3 from '../../../../assets/images/image3.png';
import image4 from '../../../../assets/images/image4.png';
import image5 from '../../../../assets/images/image5.png';

const useStyles = makeStyles((theme) => ({
  Maincard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '309px',
    height: '234px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '309px',
    height: '234px',
    margin: 'auto',
    transition: '0.3s',
    background: '#FFFFFF',
    boxShadow: '0px 0px 1px rgba(42, 42, 45, 0.16)',
    '&:hover': {
      boxShadow: '0px 2px 6px rgba(42, 42, 45, 0.06)',
    },
    borderRadius: '6px',
  },
  media: {
    flex: 'none',
    order: 0,
    alignSelf: 'stretch',
    flexGrow: 0,
    width: '309px',
    height: '160px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(2),
    gap: '12px',
    width: '310px',
    height: '74px',
  },
  description: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '278px',
    height: '45px',
  },
  divider: {
    height: '1px',
    background: '#F3F4F6',
  },
  heading: {
    width: '278px',
    height: '20px',
    fontFamily: theme.typography.fontFamily,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '145%',
    color: '#2A2A2D',
  },
  subheading: {
    display: 'flex',
    alignItems: 'center',
    width: '278px',
    height: '16px',
    fontFamily: theme.typography.fontFamily,
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '135%',
    color: '#81818E',
  },
  overlay: {
    position: 'absolute',
    display: 'flex',
    height: '32px',
    right: '8px',
    top: '8px',
    transition: 'opacity .1s ease-in-out',
  },
  iconButton: {
    position: 'absolute',
    height: 32,
    width: 32,
    borderRadius: '50%',
    overflow: 'hidden',
    color: '#81818E',
    '&.MuiIconButton-root': {
      backgroundColor: '#FFFFFF',
    },
    '&.MuiIconButton-root:hover': {
      color: '#FFFFFF',
      backgroundColor: lighten(theme.palette.panel.main, 0.1),
    },
  },
  icon: {
    position: 'absolute',
    left: '12.5%',
    right: '12.5%',
    top: '12.5%',
    bottom: '12.5%',
  },
}));
const Templetdata = [
  {
    title: 'Template 1',
    subtitle: 'A short description of the project on one line',
    image: image1,
  },
  {
    title: 'Template 2',
    subtitle: 'A short description of the project on one line',
    image: image2,
  },
  {
    title: 'Template 3',
    subtitle: 'A short description of the project on one line',
    image: image3,
  },
  {
    title: 'Template 4',
    subtitle: 'A short description of the project on one line',
    image: image4,
  },
  {
    title: 'Template 5',
    subtitle: 'A short description of the project on one line',
    image: image5,
  },
  {
    title: 'Template 6',
    subtitle: 'A short description of the project on one line',
    image: image1,
  },
];
const TemplateCard = () => {
  const classes = useStyles();
  const [show, setShow] = React.useState({});

  const handleMouseOver = (index) => {
    setShow({ ...show, [index]: true });
  };
  const handleMouseOut = (index) => {
    setShow({ ...show, [index]: false });
  };

  return (
    <Grid
      container
      spacing={4}
      direction="row"
      justifyContent="space-evenly"
      alignItems="center"
      style={{ minHeight: '80vh' }}
    >
      {Templetdata.map((item, index) => (
        <Grid item xs={3} sm={6} md={4}>
          <div className={classes.Maincard}>
            <Card className={classes.card}>
              <CardActionArea
                onMouseEnter={() => handleMouseOver(index)}
                onMouseLeave={() => handleMouseOut(index)}
                className={classes.card}
              >
                <CardMedia
                  className={classes.media}
                  component="img"
                  height="194"
                  image={item.image}
                  alt="Paella dish"
                />
                <Divider className={classes.divider} light />
                <CardContent className={classes.content}>
                  <div className={classes.description}>
                    <Typography className="MuiTypography--heading" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography
                      className="MuiTypography--subheading"
                      variant="caption"
                    >
                      {item.subtitle}
                    </Typography>
                  </div>
                </CardContent>
                {show[index] && (
                  <CardActions
                    className={classes.overlay}
                    style={{
                      position: show[index] ? 'absolute' : 'unset',
                    }}
                  >
                    <IconButton className={classes.iconButton}>
                      <VisibilityOutlinedIcon className={classes.icon} />
                    </IconButton>
                    <IconButton className={classes.iconButton}>
                      <AddIcon className={classes.icon} />
                    </IconButton>
                  </CardActions>
                )}
              </CardActionArea>
            </Card>
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

export default TemplateCard;
