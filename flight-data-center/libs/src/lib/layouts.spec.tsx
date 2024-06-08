import { render } from '@testing-library/react';

import Layouts from './layouts';

describe('Layouts', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Layouts />);
    expect(baseElement).toBeTruthy();
  });
});
