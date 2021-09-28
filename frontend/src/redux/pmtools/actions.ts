const sideError = (error: any) => ({
  type: 'TYPES.ERROR',
  e: error,
});

export default sideError;
