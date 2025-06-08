import { render, screen } from '@testing-library/react';
import App from '../App';

test('muestra el texto del héroe', () => {
  render(<App />);
  expect(screen.getByText(/Recuperá tu tiempo/i)).toBeInTheDocument();
});