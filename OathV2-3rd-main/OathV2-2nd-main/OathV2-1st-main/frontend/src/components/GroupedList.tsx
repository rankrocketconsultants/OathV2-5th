import { FlatList, View } from "react-native";
import { useSafeTokens } from "../design/safeTokens";

type AnyItem = any;

export default function GroupedList<T extends AnyItem>({
  data,
  keyExtractor,
  renderItem,
  style
}: {
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  renderItem: ({ item, index }: { item: T; index: number }) => JSX.Element;
  style?: any;
}) {
  const t = useSafeTokens();
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: t.palette.surface,
          borderWidth: t.hairlineWidth,
          borderColor: t.palette.hairlineColor,
          borderRadius: t.radii.lg,
          overflow: "hidden"
        },
        style
      ]}
    >
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: t.hairlineWidth, backgroundColor: t.palette.hairlineColor }} />}
        style={{ flex: 1 }}
        contentContainerStyle={{}}
      />
    </View>
  );
}