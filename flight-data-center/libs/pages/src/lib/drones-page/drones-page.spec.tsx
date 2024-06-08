import { render } from '@testing-library/react';

import DronesPage from './drones-page';

describe('DronesPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DronesPage />);
    expect(baseElement).toBeTruthy();
  });
});
