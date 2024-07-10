import { render, screen, fireEvent } from '@testing-library/react';
import { useSession, signOut } from 'next-auth/react';
import Home from '../app/page'; // Adjust the import path as necessary
import Dashboard from '@/components/Dashboard/Dashboard'; // Ensure this path matches your project structure

// Mocking necessary modules and components
jest.mock('next-auth/react');
jest.mock('next/link', () => ({ children }) => children);
jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('@/components/Dashboard/Dashboard', () => () => <div>Dashboard Component</div>);

describe('Home Component', () => {
  it('renders loading state when user is not authenticated', () => {
    useSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    render(<Home />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('renders the dashboard, header, and footer when user is authenticated', () => {
    useSession.mockReturnValue({ data: { user: { email: 'test@example.com' } }, status: 'authenticated' });
    render(<Home />);
    expect(screen.getByText('Harvard Admissions Portal')).toBeInTheDocument();
    expect(screen.getByText('Dashboard Component')).toBeInTheDocument(); // Checking for mocked Dashboard component
    expect(screen.getByText(/Welcome, test@example.com/i)).toBeInTheDocument();
  });

  it('calls handleLogout and redirects to login on logout button click', () => {
    const mockSignOut = jest.fn();
    signOut.mockImplementation(mockSignOut);

    useSession.mockReturnValue({ data: { user: { email: 'test@example.com' } }, status: 'authenticated' });
    render(<Home />);
    fireEvent.click(screen.getByText(/Logout/i));
    expect(mockSignOut).toHaveBeenCalled();
    // Note: Testing the redirect to '/login' after logout would require mocking useRouter or a similar approach
  });
});