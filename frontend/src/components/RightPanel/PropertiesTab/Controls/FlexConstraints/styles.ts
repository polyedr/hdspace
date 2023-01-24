import { makeStyles } from '@mui/styles';

export const constraintsStyles = makeStyles(() => ({
  flexParent: {
    // padding: '8px 12px',
  },
  topParent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  buttonGroup: {
    display: 'flex',
    gap: 4,
  },
  iconBox: {
    width: 28,
    height: 28,
    padding: '0 !important',
    backgroundColor: '#E4E6EB !important',
    borderRadius: '4px !important',
    transition: 'background-color 0.2s ease-in-out',

    '&:hover': {
      backgroundColor: '#2A2A2D !important',

      '& path': {
        fill: '#E4E6EB',
      },

      '& rect': {
        fill: '#E4E6EB',
      },
    },
  },
  iconBoxActive: {
    backgroundColor: '#2A2A2D !important',
    '& path': {
      fill: '#fff',
    },
    '& rect': {
      fill: '#fff',
    },
  },
  inputGroup: {
    display: 'flex',
    gap: 4,
  },
  inputWithIcon: {
    height: 28,
    backgroundColor: '#E4E6EB',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 5px 0 7px',
    width: '60px',

    '& input': {
      padding: '0 0 0 8px',
      border: 'none',
      width: 30,
      height: 28,
    },

    '& fieldset': {
      border: 'none',
    },

    '& label': {
      display: 'none',
    },
  },
  spacingBox: {
    border: '1px solid #E4E6EB',
    height: 250,
    marginTop: 4,

    '& fieldset': {
      border: 'none',
    },

    '& input': {
      border: 'none',
      width: '100%',
      height: 35,
      padding: '0 5px',
      backgroundColor: '#F3F4F6',
      textAlign: 'right',
    },

    '& label': {
      display: 'none',
    },
  },
  outerTopInput: {
    width: 'calc(100% - 70px)',
    margin: 'auto',
    position: 'relative',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-35px',
      borderRight: '35px solid #F3F4F6',
      borderBottom: '35px solid transparent',
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: '-35px',
      borderLeft: '35px solid #F3F4F6',
      borderBottom: '35px solid transparent',
    },

    '& .MuiTextField-root': {
      display: 'flex',
    },
  },

  outerRightInput: {
    left: 'calc(100% - 35px)',
    width: 'fit-content',
    bottom: '0',
    position: 'relative',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-35px',
      right: 0,
      borderLeft: '35px solid transparent',
      borderBottom: '35px solid #F3F4F6',
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-33px',
      left: '0',
      borderRight: '35px solid #F3F4F6',
      borderBottom: '33px solid transparent',
    },

    '& input': {
      height: 'calc(250px - 70px)',
      width: '35px',
      padding: '6px',
      boxSizing: 'border-box',
    },
  },

  outerBottomInput: {
    width: 'calc(100% - 70px)',
    bottom: '2px',
    margin: 'auto',
    position: 'relative',

    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '-35px',
      borderLeft: '35px solid transparent',
      borderBottom: '35px solid #F3F4F6',
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      right: '-35px',
      borderLeft: '35px solid #F3F4F6',
      borderTop: '33px solid transparent',
    },

    '& .MuiTextField-root': {
      display: 'flex',
    },
  },

  outerLeftInput: {
    width: 'fit-content',
    bottom: '215px',
    position: 'relative',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-35px',
      left: 0,
      borderRight: '35px solid transparent',
      borderBottom: '35px solid #F3F4F6',
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-33px',
      left: '0',
      borderRight: '35px solid transparent',
      borderTop: '33px solid #F3F4F6',
    },

    '& input': {
      height: 'calc(250px - 70px)',
      width: '35px',
      boxSizing: 'border-box',
    },
  },
  innerSpacingBox: {
    backgroundColor: '#ffffff',
    border: '1px solid #E4E6EB',
    height: 'calc(250px - 70px)',
    width: 'calc(100% - 70px)',
    margin: 'auto',
    position: 'relative',
    bottom: '395px',

    '& input': {
      backgroundColor: 'transparent',
    },
  },
  innerTopInput: {
    width: 'calc(100% - 70px)',
    margin: 'auto',

    '& .MuiTextField-root': {
      display: 'flex',
    },
  },
  innerRightInput: {
    left: 'calc(100% - 35px)',
    width: 'fit-content',
    bottom: '0',
    position: 'relative',

    '& input': {
      height: 'calc(250px - 140px)',
      width: '35px',
      padding: '6px',
      boxSizing: 'border-box',
    },
  },
  innerBottomInput: {
    width: 'calc(100% - 70px)',
    bottom: '2px',
    margin: 'auto',
    position: 'relative',

    '& .MuiTextField-root': {
      display: 'flex',
    },
  },
  innerLeftInput: {
    width: 'fit-content',
    bottom: '146px',
    position: 'relative',

    '& input': {
      height: 'calc(250px - 140px)',
      width: '35px',
      boxSizing: 'border-box',
    },
  },
  innerButtonBox: {
    width: 'calc(100% - 70px)',
    border: '1px solid #E4E6EB',
    bottom: '256px',
    position: 'relative',
    margin: 'auto',
    height: 'calc(250px - 140px)',
    padding: 10,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'spacep-between',
    alignItems: 'center',

    '& button': {
      height: '33%',
      width: '33%',
      textAlign: 'center',
      padding: 0,

      '& span': {
        height: 4,
        width: 4,
        borderRadius: '50%',
        backgroundColor: '#B0B0BD',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },

      '&:hover': {
        backgroundColor: 'transparent',

        '& span': {
          backgroundColor: 'black',
        },
      },
    },
  },
  bottomParent: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  bottomIconBox: {
    justifyContent: 'space-around !important',
  },
  justifyContentIcon: {
    justifyContent: 'space-between !important',
    padding: '0 2px !important',
  },
  activeGridItem: {
    '&:before': {
      content: '""',
      height: 'calc(100% - 7px)',
      width: 'calc(100% - 18px)',
      backgroundColor: 'black',
      display: 'block',
      transform: 'rotate(-45deg)',
      borderRadius: '2.5px',
    },

    '& span': {
      backgroundColor: 'black !important',
    },
  },
  flexRow: {
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      borderLeft: '20px solid #fff',
      borderTop: '20px solid transparent',
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      borderLeft: '20px solid #fff',
      borderBottom: '20px solid transparent',
    },

    '& span': {
      '&:before': {
        content: '""',
        position: 'absolute',
        right: 0,
        borderTop: '20px solid #fff',
        borderLeft: '20px solid transparent',
      },
      '&:after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        borderBottom: '20px solid #fff',
        borderLeft: '20px solid transparent',
        right: 0,
      },
    },
  },
  flexColumn: {
    '&:after': {
      content: '""',
      position: 'absolute',
      borderTop: '15px solid #fff',
      borderLeft: '15px solid transparent',
      right: 0,
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      borderLeft: '15px solid #fff',
      borderBottom: '15px solid transparent',
    },

    '& span': {
      '&:before': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        borderTop: '15px solid transparent',
        borderLeft: '15px solid #fff',
      },
      '&:after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderTop: '15px solid transparent',
        borderRight: '15px solid #fff',
      },
    },
  },
}));
