import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import CategoryDetail from './CategoryDetail';

describe('CategoryDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <CategoryDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
