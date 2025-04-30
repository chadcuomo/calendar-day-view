# Calendar Day View

A modern calendar day view application built with React, TypeScript, and Vite. This application allows users to create, update, and delete events in a day calendar view.

![Calendar Day View](https://via.placeholder.com/800x400?text=Calendar+Day+View)

## Features

- 📅 Day view calendar with hour divisions
- ✨ Create, edit, and delete events
- 🎨 Visual representation of events with proper positioning
- ⏰ Time validation (end time must be after start time)
- 🚨 Toast notifications for operation status
- 🧪 Comprehensive test suite

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **TanStack Query (React Query)** - Data fetching and state management
- **React Hook Form** - Form handling
- **Zod** - Form validation
- **date-fns** - Date formatting
- **Sonner** - Toast notifications
- **Tailwind CSS** - Styling
- **Jest & React Testing Library** - Testing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn or pnpm

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/calendar-day-view.git
cd calendar-day-view
```

2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:5173](http://localhost:5173) to view the app in your browser

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

## Project Structure

```
calendar-day-view/
├── src/
│   ├── Calendar/            # Calendar-specific components
│   │   ├── components/      # Calendar sub-components
│   │   └── calendar.queries.ts  # API functions
│   ├── components/          # Shared components
│   │   ├── ui/              # UI components
│   │   └── Header.tsx       # Main header with form
│   ├── lib/                 # Utilities and types
│   │   ├── constants.ts     # Constants like hours
│   │   ├── types.ts         # TypeScript interfaces
│   │   └── utils.ts         # Helper functions
│   ├── jest/                # Jest test files
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
└── vite.config.ts           # Vite configuration
```

## Features in Detail

### Event Creation

Users can create events by filling out the form at the top of the page. Events require a name, start time, and end time. Time validation ensures the end time is after the start time.

### Event Editing

Clicking on an event in the calendar will load its details into the form for editing. Users can modify the event details and click "Update Event" to save changes.

### Event Deletion

When an event is selected, a "Delete" button appears, allowing users to remove the event from the calendar.

### Toast Notifications

The application uses toast notifications to provide feedback on operations:

- "Saving event..." during creation/update
- "Deleting event..." during deletion
- Success messages after successful operations
- Error messages if operations fail

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
