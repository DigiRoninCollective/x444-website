import { X444Theme } from '../types';

/**
 * Default X4 Dark Theme - Premium brand colors
 * Primary: Gold (#F3BA2F)
 * Secondary: Silver (#C4C4C4)
 * Background: Dark slate
 */
export const DARK_THEME: X444Theme = {
  primaryColor: '#F3BA2F', // X4 Gold
  secondaryColor: '#C4C4C4', // X4 Silver
  backgroundColor: '#0f172a', // Slate-950
  surfaceColor: '#1e293b', // Slate-900
  textColor: '#ffffff', // White
  textSecondary: '#cbd5e1', // Slate-300
  borderColor: '#334155', // Slate-700
  successColor: '#10b981', // Emerald
  errorColor: '#ef4444', // Red
  warningColor: '#f59e0b', // Amber
  borderRadius: '12px',
  fontSize: '14px',
};

/**
 * Light Theme - Professional white
 */
export const LIGHT_THEME: X444Theme = {
  primaryColor: '#F3BA2F', // X4 Gold
  secondaryColor: '#6b7280', // Gray-500
  backgroundColor: '#ffffff', // White
  surfaceColor: '#f9fafb', // Gray-50
  textColor: '#111827', // Gray-900
  textSecondary: '#6b7280', // Gray-500
  borderColor: '#e5e7eb', // Gray-200
  successColor: '#10b981', // Emerald
  errorColor: '#ef4444', // Red
  warningColor: '#f59e0b', // Amber
  borderRadius: '12px',
  fontSize: '14px',
};

/**
 * Minimal Theme - Clean and simple
 */
export const MINIMAL_THEME: X444Theme = {
  primaryColor: '#000000',
  secondaryColor: '#666666',
  backgroundColor: '#ffffff',
  surfaceColor: '#f5f5f5',
  textColor: '#000000',
  textSecondary: '#666666',
  borderColor: '#e0e0e0',
  successColor: '#4caf50',
  errorColor: '#f44336',
  warningColor: '#ff9800',
  borderRadius: '8px',
  fontSize: '14px',
};

/**
 * Get theme by name or return custom theme
 */
export function getTheme(
  themeName: 'dark' | 'light' | 'minimal' = 'dark',
  customOverrides?: Partial<X444Theme>
): X444Theme {
  const baseTheme =
    themeName === 'light'
      ? LIGHT_THEME
      : themeName === 'minimal'
        ? MINIMAL_THEME
        : DARK_THEME;

  return { ...baseTheme, ...customOverrides };
}

/**
 * Create CSS variables for theme
 */
export function generateThemeCSS(theme: X444Theme): string {
  return `
    --x444-primary: ${theme.primaryColor};
    --x444-secondary: ${theme.secondaryColor};
    --x444-background: ${theme.backgroundColor};
    --x444-surface: ${theme.surfaceColor};
    --x444-text: ${theme.textColor};
    --x444-text-secondary: ${theme.textSecondary};
    --x444-border: ${theme.borderColor};
    --x444-success: ${theme.successColor};
    --x444-error: ${theme.errorColor};
    --x444-warning: ${theme.warningColor};
    --x444-border-radius: ${theme.borderRadius};
    --x444-font-size: ${theme.fontSize};
  `;
}
