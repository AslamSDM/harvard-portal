import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../src/app/page'; // Adjust the import path according to your project structure
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

jest.mock('next-auth/react');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('d3', () => ({
  select: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    // Add any other router methods you're using
  }),
}));

describe('Home Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
    mockPush.mockClear();
  });

  test('displays loading when user is not authenticated', () => {
    useSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    render(<Home />);
    expect(screen.getByText('loading...')).toBeInTheDocument();
  });

  test('displays user info and logout button when authenticated', () => {
    useSession.mockReturnValue({ data: { user: { email: 'test@example.com' } }, status: 'authenticated' });
    render(<Home />);
    expect(screen.getByText('Welcome, test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('calls signOut and redirects to login on logout', () => {
    useSession.mockReturnValue({ data: { user: { email: 'test@example.com' } }, status: 'authenticated' });
    signOut.mockImplementation(jest.fn());
    render(<Home />);
    fireEvent.click(screen.getByText('Logout'));
    expect(signOut).toHaveBeenCalled();
    // Optionally, check if redirection logic after logout is as expected
    // This might require additional logic to simulate or wait for asynchronous actions
  });
});