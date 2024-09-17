export default [
  { heading: 'Entity Management' },
  {
    title: 'Directory',
    icon: { icon: 'tabler-home-2' },
    children: [
      { title: 'Customer', to: 'entity-customer-list' },
      { title: 'Employee', to: 'entity-employee-list' },
      { title: 'Vendor', to: 'entity-vendor-list' },
    ],
  },
  {
    title: 'Classification',
    icon: { icon: 'tabler-home-2' },
    to: 'entity-classification',
  },
]
  