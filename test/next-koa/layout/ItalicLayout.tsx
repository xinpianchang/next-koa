import React from 'react'

const ItalicLayout = (props: { children: React.ReactNode }) => <div style={{ fontStyle: 'italic' }}>
  {props.children}
</div>

export default ItalicLayout