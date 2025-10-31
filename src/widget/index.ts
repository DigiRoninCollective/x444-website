// Main entry point for X444 Widget package

export { default as X444PaymentWidget } from './components/X444PaymentWidget';
export { DARK_THEME, LIGHT_THEME, MINIMAL_THEME, getTheme, generateThemeCSS } from './config/themes';

// Types
export type { X444Theme, X444PaymentWidgetProps } from './types';

// Styles
import './styles/widget.css';
