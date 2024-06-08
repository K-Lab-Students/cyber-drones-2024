import { render } from '@testing-library/react';

import ViewDronePage from './view-drone-page';

describe('ViewDronePage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ViewDronePage />);
    expect(baseElement).toBeTruthy();
  });
});
