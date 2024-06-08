import { render } from '@testing-library/react';

import DroneMap from './drone-map';

describe('DroneMap', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DroneMap />);
    expect(baseElement).toBeTruthy();
  });
});
