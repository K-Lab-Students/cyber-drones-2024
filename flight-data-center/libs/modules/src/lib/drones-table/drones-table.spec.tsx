import { render } from '@testing-library/react';

import DronesTable from './drones-table';

describe('DronesTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DronesTable />);
    expect(baseElement).toBeTruthy();
  });
});
