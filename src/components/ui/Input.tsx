import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors, radii, typeStyles } from '../../theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  isPassword = false,
  containerStyle,
  editable = true,
  ...textInputProps
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const borderColor = error ? '#EF4444' : isFocused ? colors.navyLight : colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputShell,
          { borderColor },
          isFocused && styles.focused,
          !editable && styles.disabled,
        ]}
      >
        {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
        <TextInput
          {...textInputProps}
          accessibilityLabel={textInputProps.accessibilityLabel ?? label}
          accessibilityHint={error ?? hint}
          editable={editable}
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={(event) => {
            setIsFocused(true);
            textInputProps.onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            textInputProps.onBlur?.(event);
          }}
          placeholderTextColor={colors.textSoft}
          style={styles.input}
        />
        {isPassword ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            onPress={() => setIsPasswordVisible((visible) => !visible)}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={colors.textMuted} />
            ) : (
              <Eye size={20} color={colors.textMuted} />
            )}
          </Pressable>
        ) : rightIcon ? (
          <View style={styles.rightIcon}>{rightIcon}</View>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { ...typeStyles.caption, color: colors.text, marginBottom: 7, fontWeight: '700' },
  inputShell: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.25,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    paddingLeft: 14,
  },
  focused: {
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 2,
  },
  disabled: { opacity: 0.58, backgroundColor: colors.surfaceMuted },
  input: { flex: 1, minHeight: 50, paddingVertical: 12, paddingRight: 12, fontSize: 15, color: colors.text },
  leftIcon: { marginRight: 10 },
  rightIcon: { marginRight: 14, marginLeft: 6 },
  iconButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.5 },
  error: { ...typeStyles.caption, color: colors.danger, marginTop: 5, marginLeft: 3 },
  hint: { ...typeStyles.caption, color: colors.textMuted, marginTop: 5, marginLeft: 3 },
});
