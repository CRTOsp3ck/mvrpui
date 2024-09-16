export default [
  { heading: 'Document Management' },
  {
    title: 'Inventory',
    icon: { icon: 'tabler-home-2' },
    children: [
      { title: 'Goods Issue Note', icon: 'none', to: 'documents-inventory-goods-issue-note-list' },
      { title: 'Return Merchandise Authorization', icon: 'none', to: 'documents-inventory-return-merchandise-authorization-list' },
      { title: 'Stock Count Sheet', icon: 'none', to: 'documents-inventory-stock-count-sheet-list' },
    ],
  },
  {
    title: 'Sales',
    icon: { icon: 'tabler-home-2' },
    children: [
      { title: 'Credit Note', icon: 'none', to: 'documents-sales-credit-note-list' },
      { title: 'Debit Note', icon: 'none', to: 'documents-sales-debit-note-list' },
      { title: 'Delivery Note', icon: 'none', to: 'documents-sales-delivery-note-list' },
      { title: 'Goods Return Note', icon: 'none', to: 'documents-sales-goods-return-note-list' },
      { title: 'Payment Receipt', icon: 'none', to: 'documents-sales-payment-receipt-list' },
      { title: 'Sales Invoice', icon: 'none', to: 'documents-sales-sales-invoice-list' },
      { title: 'Sales Order', icon: 'none', to: 'documents-sales-sales-order-list' },
      { title: 'Sales Quotation', icon: 'none', to: 'documents-sales-sales-quotation-list' },
    ],
  },
  {
    title: 'Purchase',
    icon: { icon: 'tabler-home-2' },
    children: [
      { title: 'Goods Receipt Note', icon: 'none', to: 'documents-purchase-goods-receipt-note-list' },
    ],
  }
]
    