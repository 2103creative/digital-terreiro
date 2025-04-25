import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../pages/Dashboard';

describe('Smoke Test', () => {
  it('renderiza o dashboard sem crashar', () => {
    render(<Dashboard />);
    expect(screen.getByText(/frentes/i)).toBeInTheDocument();
  });
});
