import { Space, Button } from 'antd';
import { useEffect, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';

interface QuantityInputProps {
  onChange: (newValue: number) => void;
  quantity: number;
  loading: boolean;
  initValue: number;
}
export default function QuantityInput(props: QuantityInputProps) {
  const [initQuantity, setQuantity] = useState<number>(props.quantity);
  const debouncedQuantity = useDebounce(initQuantity);

  useEffect(() => {
    setQuantity(props.initValue);
  }, [props.initValue]);

  useEffect(() => {
    props.onChange(debouncedQuantity as number);
  }, [debouncedQuantity]);

  const onDecrease = () => {
    if (props.initValue === 0) return;
    setQuantity(prev => (prev - 1 < 0 ? 0 : prev - 1));
  };
  const onIncrease = () => {
    if (props.initValue === 0) return;
    setQuantity(prev => prev + 1);
  };
  return (
    <Space.Compact className="item-quantity">
      <Button disabled={props.loading || props.initValue === 0} type="text" onClick={onDecrease}>
        -
      </Button>
      <span>{initQuantity}</span>
      <Button disabled={props.loading || props.initValue === 0} type="text" onClick={onIncrease}>
        +
      </Button>
    </Space.Compact>
  );
}
