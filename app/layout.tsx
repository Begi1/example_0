"use client";
import "./globals.css";
import { Providers } from "./providers"; // Import Providers

import { Provider } from 'react-redux';
import store from './lib/store/store';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>  {/* Ensure Redux context is provided here */}
          <Providers>
            {children}  {/* Children are passed here */}
          </Providers>
        </Provider>
      </body>
    </html>
  );
}
