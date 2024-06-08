import { render } from '@testing-library/react';

import CreateDronePage from './create-drone-page';

describe('CreateDronePage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CreateDronePage />);
    expect(baseElement).toBeTruthy();
  });
});
