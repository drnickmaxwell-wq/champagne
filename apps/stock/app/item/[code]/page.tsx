import type { StockItem } from "@champagne/stock-shared";

type ItemPageProps = {
  params: {
    code: string;
  };
};

const demoItem: StockItem = {
  code: "DEMO-001",
  name: "Sample Item",
  quantity: 0
};

export default function ItemPage({ params }: ItemPageProps) {
  const isDemo = params.code === demoItem.code;
  const item = isDemo ? demoItem : { ...demoItem, code: params.code };

  return (
    <section>
      <h1>Item</h1>
      <p>Code: {item.code}</p>
      <p>Name: {item.name}</p>
      <p>Quantity on hand: {item.quantity}</p>
    </section>
  );
}
