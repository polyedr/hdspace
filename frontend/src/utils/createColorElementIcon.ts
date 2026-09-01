const createColorElementIcon = (nameElement: string) => {
  if (
    nameElement.includes('Header') ||
    nameElement.includes('Main') ||
    nameElement.includes('Footer')
  ) {
    if (nameElement.includes('Header')) {
      return {
        squareTopLeft: '#f1dd0e',
        squareTopRight: '#0ef16c',
      };
    }
    if (nameElement.includes('Main')) {
      return {
        squareTopLeft: '#f1dd0e',
        squareTopRight: '##088a3e',
      };
    }
    if (nameElement.includes('Footer')) {
      return {
        squareTopLeft: '#f1dd0e',
        squareTopRight: '#06602b',
      };
    }
    if (nameElement.includes('Other')) {
      return {
        squareTopLeft: '#f1dd0e',
        squareTopRight: '#04401d',
      };
    }
  } else if (
    nameElement.includes('Form') ||
    nameElement.includes('Nav') ||
    nameElement.includes('Section') ||
    nameElement.includes('Article') ||
    nameElement.includes('Card Group') ||
    nameElement.includes('Aside')
  ) {
    if (nameElement.includes('Form')) {
      return {
        squareTopLeft: '#7818e7',
        squareTopRight: '#e71820',
      };
    }
    if (nameElement.includes('Nav')) {
      return {
        squareTopLeft: '#7818e7',
        squareTopRight: '#c0141a',
      };
    }
    if (nameElement.includes('Section')) {
      return {
        squareTopLeft: '#7818e7',
        squareTopRight: '#a61117',
      };
    }
    if (nameElement.includes('Article')) {
      return {
        squareTopLeft: '#7818e7',
        squareTopRight: '#8b0e13',
      };
    }
    if (nameElement.includes('Card Group')) {
      return {
        squareTopLeft: '#7818e7',
        squareTopRight: '#e71820',
      };
    }
    if (nameElement.includes('Aside')) {
      return {
        squareTopLeft: '#7818e7',
        squareTopRight: '#620a0d',
      };
    }
    if (nameElement.includes('Other')) {
      return {
        squareTopLeft: '#7818e7',
        squareTopRight: '#4d080b',
      };
    }
  } else if (nameElement.includes('Alert') || nameElement.includes('Card')) {
    if (nameElement.includes('Alert')) {
      return {
        squareTopLeft: '#1c6ee3',
        squareTopRight: '#e31cd2',
      };
    }
    if (nameElement.includes('Card')) {
      return {
        squareTopLeft: '#1c6ee3',
        squareTopRight: '#77226f',
      };
    }
  } else if (
    nameElement.includes('Alert') ||
    nameElement.includes('Card') ||
    nameElement.includes('Button')
  ) {
    if (nameElement.includes('Button')) {
      return {
        squareTopLeft: '#43f10e',
        squareTopRight: '#075b79',
      };
    }
    if (nameElement.includes('Input')) {
      return {
        squareTopLeft: '#43f10e',
        squareTopRight: '#0eb5f1',
      };
    }
  }
  return {
    squareTopLeft: '#00ffea',
    squareTopRight: '#6a00ff',
  };
};

export default createColorElementIcon;
