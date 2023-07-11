import React from 'react';
import { render, screen } from '@testing-library/react';
import Autocomplete from './Autocomplete';

test('renders learn react link', () => {
  render(<Autocomplete />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
