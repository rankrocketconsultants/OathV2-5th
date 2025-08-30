import { View, ViewProps } from "react-native";
import { useSafeTokens } from "../../design/safeTokens";

type Props = ViewProps & {
  padded?: boolean;   // true = default inner padding
  elevated?: boolean; // true = add a mild shadow
};

export default function Card({ padded = true, elevated = false, style, children, ...rest }: Props) {
  const t = useSafeTokens();
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: t.palette.surface,
          borderWidth: t.hairlineWidth,
          borderColor: t.palette.hairline,
          borderRadius: t.radii.lg,          // lock 16
          padding: padded ? t.spacing.lg : 0,
          // Mild cross-platform elevation ONLY when elevated
          shadowColor: t.shadowColor,
          shadowOpacity: elevated ? t.shadowOpacity : 0,
          shadowRadius: elevated ? 8 : 0,
          shadowOffset: elevated ? { width: 0, height: 4 } : { width: 0, height: 0 }
        },
        style
      ]}
    >
      {children}
    </View>
  );
}