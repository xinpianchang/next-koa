import React from 'react'

export default (props: { children: React.ReactNode }) => <div style={{ fontStyle: 'italic' }}>
  {props.children}
</div>