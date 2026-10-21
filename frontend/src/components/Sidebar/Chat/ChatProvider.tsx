import React from 'react';

/** Stream Chat is disabled in the first cutover. */
export default function ChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
