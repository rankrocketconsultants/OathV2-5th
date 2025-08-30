import { FlatList, View } from "react-native";
import { useSafeTokens } from "../design/safeTokens";
import Card from "./base/Card";

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
    <Card padded={false} style={style}>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View style={{ height: t.hairlineWidth, backgroundColor: t.palette.hairline }} />
        )}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      />
    </Card>
  );
}