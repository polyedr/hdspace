import React from 'react';

const WindowContext = React.createContext<Window | null>(null);
const DocumentContext = React.createContext<Document | null>(null);

const WindowProvider = WindowContext.Provider;
const WindowConsumer = WindowContext.Consumer;
const DocumentProvider = DocumentContext.Provider;
const DocumentConsumer = DocumentContext.Consumer;

export {
  WindowProvider,
  WindowConsumer,
  DocumentProvider,
  DocumentConsumer,
  WindowContext,
  DocumentContext,
};
