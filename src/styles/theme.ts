export const theme = {
  colors: {
    // Paleta principal (Roxo / Lilás)
    primary: '#5E5A9A', // Roxo principal - marcador roxo / cartão digital
    primaryLight: '#BEB9D0', // Lilás claro 75%
    primaryLighter: '#D2CDE4', // Lilás ainda mais claro (50–25%)

    // Laranjas elegantes
    accentOrange: '#E98A46', // Laranja quente elegante
    accentOrangeDeep: '#E96A42', // Laranja mais intenso

    // Neutros suaves
    background: '#F7F5F2',
    surface: '#FFFFFF',
    borderSoft: '#E3DFEF',
    textPrimary: '#3F3A60', // Roxo escuro suave
    textSecondary: '#6B678C',
  },
  fonts: {
    body: `'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    heading: `'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  },
} as const;

export type ThemeColors = typeof theme.colors;
export type ThemeColorKey = keyof ThemeColors;


