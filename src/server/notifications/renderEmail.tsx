import * as React from 'react';
import { render } from '@react-email/render';

export async function renderEmail<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  props: P
) {
  const element = React.createElement(Component, props);
  const html = await render(element, { pretty: true });
  const text = await render(element, { plainText: true });
  return { html, text };
}