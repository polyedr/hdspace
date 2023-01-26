const serializerOptions = {
  serialize: {
    replacer: (key, value) => (value instanceof HTMLElement ? value.id : value),
  },
};

export default serializerOptions;
