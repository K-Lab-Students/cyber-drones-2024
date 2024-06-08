import { render } from '@testing-library/react';

import Uis from './uis';

describe('Uis', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Uis />);
    expect(baseElement).toBeTruthy();
  });
});
