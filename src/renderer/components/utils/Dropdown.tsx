import { useEffect, useState } from 'react';
import { Dropdown as BDropdown } from 'react-bootstrap';

interface IBDropdownProps {
  active: boolean;
  currentValue: string;
  setCurrentValue: (value: string) => void;
  fetchContents: (callback: (store: string[]) => void) => void;
}

const Dropdown = ({
  active,
  currentValue,
  setCurrentValue,
  fetchContents,
}: IBDropdownProps) => {
  const [items, setItems] = useState<string[]>(['']);

  useEffect(() => {
    fetchContents(setItems);
  }, [fetchContents]);

  return (
    <BDropdown className="dropdown">
      <BDropdown.Toggle variant="primary" className={active ? '' : 'disabled'}>
        {currentValue}
      </BDropdown.Toggle>

      <BDropdown.Menu>
        {items.map((item: string) => {
          const dbKey = `dropdown- + ${item}`;
          return (
            <BDropdown.Item key={dbKey} onClick={() => setCurrentValue(item)}>
              {item}
            </BDropdown.Item>
          );
        })}
      </BDropdown.Menu>
    </BDropdown>
  );
};

export default Dropdown;
