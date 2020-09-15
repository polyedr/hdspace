import React from 'react';
import { render, fireEvent } from '../../test-utils';
import Navigator from '../../../../components/Navigator';

describe('Navigator', () => {
  const { container, getByText, getByRole } = render(<Navigator />);

  it('should render a Navigator component', () => {
    expect(container).toMatchSnapshot();
  });

  it('should have a header', () => {
    expect(getByText('Navigator')).toBeInTheDocument();
  });

  it('open context menu on tree item right click', async () => {
    const rootItem = getByRole('treeitem');
    fireEvent.contextMenu(rootItem);

    const menu = getByRole('menu');
    expect(menu).toBeInTheDocument();
  });
});
