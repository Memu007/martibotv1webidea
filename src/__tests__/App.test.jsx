import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders landing page hero text', () => {
  render(<App />);
  expect(screen.getByText(/Recuperá tu tiempo/i)).toBeInTheDocument();
});
