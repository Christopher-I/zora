import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import SearchPage from './SearchPage';

describe('SearchPage', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('renders search input and buttons', () => {
    render(<SearchPage />);
    expect(screen.getByPlaceholderText(/Search for images.../i)).toBeInTheDocument();
    expect(screen.getByText(/Search/i)).toBeInTheDocument();
  });

  test('handles successful search', async () => {
    const mockImages = [{ id: '1', alt_description: 'A nice fish', urls: { small: 'image_url' }, color: 'red', created_at: '2024-01-01' }];
    fetchMock.mockResponseOnce(JSON.stringify({ results: mockImages }));

    render(<SearchPage />);

    fireEvent.change(screen.getByPlaceholderText(/Search for images.../i), { target: { value: 'fish' } });
    fireEvent.click(screen.getByText(/Search/i));

    await waitFor(() => {
      expect(screen.getByAltText(/A nice fish/i)).toBeInTheDocument();
    });
  });

  test('handles rate limit error', async () => {
    fetchMock.mockResponseOnce('Rate Limit Exceeded', { status: 403 });

    render(<SearchPage />);

    fireEvent.change(screen.getByPlaceholderText(/Search for images.../i), { target: { value: 'fish' } });
    fireEvent.click(screen.getByText(/Search/i));

    await waitFor(() => {
      expect(screen.getByText(/Rate limit exceeded. Please try again later./i)).toBeInTheDocument();
    });
  });
});
