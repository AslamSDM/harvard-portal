# Harvard Admissions Portal

This is an administration portal for Harvard's admissions department.

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run lint`: Runs ESLint

## Deployment

The application is automatically deployed via GitLab CI/CD when changes are pushed to the main branch.

## Directories


/src/app/api : all the apis 

    /api/applicants : gets all applications 
    /api/applicant?id= : give specific applicants 
    /api/applicant/update : updates status
    /api/file/download : download csv
    /api/file/upload : upload csv
    /api/user/add : for signup

/src/app/(auth)/ : has the login and signup forms

/src/components/ : all the components 

/src/lib/ : has the utils 

## Technologies Used

- Nextjs
- Nextauth
- Prisma
- TypeScript
- D3.js
- Jest
- ESLint
- Prettier
- SASS

## Accessibility

This application aims to meet WCAG 2.1 AA standards. If you encounter any accessibility issues, please report them.