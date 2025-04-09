# Zurich Perspectives: Economy, Equity, and Influence

## Project Documentation

### Overview
"Zurich Perspectives: Economy, Equity, and Influence" is an interactive web pilot exploring how residents with different incomes experience taxation, benefit from public spending, and navigate the political system in Zurich, Switzerland.

This project aims to illustrate how economic inequality translates into political inequality through multiple reinforcing mechanisms, creating a cycle that affects democratic participation and representation.

### Project Structure

The application is built using Next.js with TypeScript and Tailwind CSS. It follows a persona-based approach, allowing users to explore Zurich's democratic systems through the eyes of three different residents:

1. **Anna**: Middle-income employee living in Zurich City
2. **Leo**: Lower-income service worker living in Schlieren
3. **Thomas**: High-income finance professional living in Küsnacht

Each persona journey includes six sections:

1. **Welcome & Persona Selection**: Introduction and persona profiles
2. **Taxation & Income Inequality**: Tax calculator and comparison
3. **Government Spending**: Budget breakdown and benefit analysis
4. **Wealth & Political Influence**: Political access and lobbying mechanisms
5. **Voter Engagement**: Participation barriers and representation effects
6. **Synthesis & Reflection**: Summary of insights and reflection questions

### Data Sources

The application uses data from the following sources:

- Federal Tax Administration (ESTV)
- Canton Zurich Finanzdirektion
- Swiss Federal Statistical Office
- Academic research on political participation and representation
- Credit Suisse Global Wealth Report
- Swiss National Bank

### Technical Implementation

#### Technologies Used
- Next.js 15.2.5
- TypeScript
- Tailwind CSS
- D3.js for data visualizations

#### Key Components
- Persona Context for state management
- Dynamic routing for persona-specific content
- Interactive D3.js visualizations
- Responsive design for desktop and mobile

#### Data Files
- `personas.json`: Persona profiles and characteristics
- `tax-data.json`: Tax brackets, rates, and multipliers
- `spending-data.json`: Government budget and benefit data
- `influence-data.json`: Political access and lobbying data
- `engagement-data.json`: Voter turnout and participation data

### Installation and Setup

#### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

#### Installation Steps
1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

#### Deployment
To deploy the application to a production environment:

1. Build the application:
   ```
   npm run build
   ```
2. Start the production server:
   ```
   npm start
   ```

Alternatively, you can deploy to Vercel or Netlify for simplified hosting.

### Future Enhancements

Potential areas for future development:

1. **Additional Personas**: Expand the range of perspectives with more diverse personas
2. **Interactive Simulations**: Allow users to modify parameters and see effects
3. **Localization**: Add support for multiple languages (German, French, Italian)
4. **Comparative Analysis**: Include data from other Swiss cantons or international cities
5. **User Contributions**: Allow users to share their own experiences and perspectives

### Contact

For questions or feedback about this project, please contact the project team.

---

© 2025 Zurich Perspectives Project
