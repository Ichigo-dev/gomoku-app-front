import React, { useState } from 'react';
import { Button, Modal, Tabs, Tab, Form } from 'react-bootstrap';

const Home = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const startBtnDisabled: boolean = true;

  return (
    <>
      <div className="us-center">
        <Button variant="success" className="us-l-btn" onClick={ () => handleShow() }>
          ゲームを始める
        </Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>ゲームを始める</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tabs defaultActiveKey="single" id="uncontrolled-tab-example" className="mb-3">
              <Tab eventKey="single" title="1人で遊ぶ">
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>ニックネーム</Form.Label>
                  <Form.Control type="text" placeholder="例）太郎" />
                  <Form.Text className="alert-text">
                    すでに存在するニックネームです。あなたは太郎ですか？
                  </Form.Text>
                </Form.Group>
              </Tab>
              <Tab eventKey="doubles" title="2人で遊ぶ">
                <Form.Group className="mb-3" controlId="formName1">
                  <Form.Label>ニックネーム（1人目）</Form.Label>
                  <Form.Control type="text" placeholder="例）太郎" />
                  <Form.Text className="alert-text">
                    すでに存在する名前です。あなたは太郎ですか？
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formName2">
                  <Form.Label>ニックネーム（2人目）</Form.Label>
                  <Form.Control type="text" placeholder="例）太郎" />
                  <Form.Text className="alert-text">
                    すでに存在する名前です。あなたは太郎ですか？
                  </Form.Text>
                </Form.Group>
              </Tab>
            </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              閉じる
            </Button>
            <Button variant="primary" onClick={handleClose} disabled={startBtnDisabled}>
              スタート
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Home;
