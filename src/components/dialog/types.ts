export interface DialogProps {
  /** Two-way visibility (`v-model`). */
  modelValue?: boolean
  /** Heading text. Also supplies the accessible name via aria-labelledby. */
  title?: string
  /** Panel width — a number is read as px, a string is used verbatim. */
  width?: string | number
  closable?: boolean
  /** Clicking the scrim closes the dialog. Escape is controlled separately. */
  maskClosable?: boolean
  closeOnEsc?: boolean
  /** Render the default confirm/cancel footer. */
  showFooter?: boolean
  okText?: string
  cancelText?: string
  /** Teleport to <body> (on). Turn off only when the dialog must stay in place. */
  appendToBody?: boolean
}
