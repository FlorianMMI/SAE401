import React, { useEffect, useState, useCallback } from 'react';
import DynamicSelect from '../ui/select';

export default function Admin() {
  return (
    <div>
      <h1>Admin</h1>
      <DynamicSelect
      fetchOptions={() => Promise.resolve([
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3' }
      ])}
      />
    </div>
  );
}
