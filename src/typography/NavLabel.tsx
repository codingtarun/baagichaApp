import React from 'react';
import { TextProps } from 'react-native';
import Typography from './Typography';

interface NavLabelProps extends Omit<TextProps, 'children'> {
  /** English label */
  label: string;
  /** Optional Hindi label */
  labelHi?: string;
  /** Whether this tab is active */
  active?: boolean;
}

/**
 * Navigation Label — English + Hindi labels for bottom nav.
 *
 * Usage:
 *   <NavLabel label="Home" labelHi="होम" active />
 *   <NavLabel label="Spray" labelHi="स्प्रे" />
 */
export default function NavLabel({
  label,
  labelHi,
  active = false,
  ...rest
}: NavLabelProps) {
  return (
    <>
      <Typography
        variant={active ? 'navLabelActive' : 'navLabel'}
        {...rest}
      >
        {label}
      </Typography>
      {labelHi ? (
        <Typography variant="hindiNavLabel">
          {labelHi}
        </Typography>
      ) : null}
    </>
  );
}
