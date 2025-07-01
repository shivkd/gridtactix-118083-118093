import { render, screen, fireEvent } from '@testing-library/react';
import AlertModal from './AlertModal';

describe('AlertModal', () => {
  test('displays message and fires onClose', () => {
    const handleClose = jest.fn();
    render(<AlertModal message="Something went wrong." onClose={handleClose} />);
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();

    const btn = screen.getByRole('button', { name: /Close/i });
    fireEvent.click(btn);
    expect(handleClose).toHaveBeenCalled();
  });
});
