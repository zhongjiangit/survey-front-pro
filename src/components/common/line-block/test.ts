const treeData = {
  name: 'Root',
  children: [
    {
      name: 'Child 1',
      children: [
        {
          name: 'Grandchild 1.1',
        },
        {
          name: 'Grandchild 1.2',
          children: [
            {
              name: 'Great Grandchild 1.2.1',
              children: [
                {
                  name: 'Great Great Grandchild',
                },
              ],
            },
            {
              name: 'Great Grandchild 1.2.2',
            },
          ],
        },
      ],
    },
    {
      name: 'Child 2',
    },
  ],
};
