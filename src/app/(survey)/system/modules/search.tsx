'use client';

import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <Input
        size="large"
        placeholder={placeholder}
        defaultValue={searchParams.get('search') || ''}
        onChange={e => {
          handleSearch(e.target.value);
        }}
        prefix={<SearchOutlined />}
      />
    </div>
  );
}
