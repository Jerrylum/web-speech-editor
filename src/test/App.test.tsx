import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Web Speech/i);
  expect(linkElement).toBeInTheDocument();
});


test('renders learn react link', () => {
  expect(1).toBeTruthy();
});