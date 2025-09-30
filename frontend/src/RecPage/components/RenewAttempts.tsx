import React from 'react';

interface Props {
  message: string,
  price: number,
  onClickBuy: () => void,
}

export default function RenewAttempts(props: Props) {
  return (
    <div style={{ margin: 16, paddingBottom: 16, borderBottom: '1px solid gray', background: "white", color: 'black'}}>
      <div style={{ display: 'flex', flexDirection: 'row', color: 'black' }}></div>
      <div style={{textAlign: 'center', marginBottom: 8}}>
        <strong>Renew Attempts</strong> <br />
        <button onClick={props.onClickBuy}>{props.price} Test-π</button>
      </div>
    </div>
  )
}