import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import CategoryMaster from './CategoryMaster';

describe('CategoryMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <CategoryMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
