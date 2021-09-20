import React, { useState } from 'react';
import styled from "styled-components";
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { Row } from './row';
import { CompleteModal } from './completeModal';
import { useSquareList } from "../context/squareListProvider";
import { UserSection } from "./userSection";
import { jadge } from "../common/jadge";
import { useAxiosClient } from '../../common/context/axiosClientProvider';
import { useQuery } from '../../common/hooks/useQuery';
import { GlobalSpinner, GlobalOverray } from "../../common/components";

export type CurrentUser = 0 | 1;
export type CurrentStatus = 0 | 1 | null;

export const Board: React.FC = () => {
  const client = useAxiosClient();
  const query = useQuery();
  const userId1 = query.get("user_id_1");
  const userId2 = query.get("user_id_2");

  const [showOverray, setShowOverray] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser>(0);

  const squareList = useSquareList();
  const [currentSquareList, setCurrentSquareaist] =
    useState<CurrentStatus[][]>(squareList);

  const onClickHandle = async (e: any) => {
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    // イベント中は画面を操作できないようにする
    setShowOverray(true);

    const clickedX: number = e.target.dataset.x;
    const clickedY: number = e.target.dataset.y;

    // 碁が置かれていない時のみ有効
    if (
      clickedX &&
      clickedY &&
      currentSquareList[clickedX][clickedY] === null
    ) {
      let nextCurrentSquareList = currentSquareList;
      nextCurrentSquareList[clickedX][clickedY] = currentUser;
      setCurrentSquareaist(nextCurrentSquareList);
      let isJadge: boolean = false;

      await Promise.all([jadge(currentSquareList), delay(200)]).then((v) => {
        isJadge = v[0];
      });

      if (isJadge) {
        try {
          if (userId2 === "-1") {
            await client.post("/game_logs", {
              user_id: userId1,
              win_user: currentUser + 1,
            });
          } else {
            await client.post("/game_logs", {
              user_id_1: userId1,
              user_id_2: userId2,
              win_user: currentUser + 1,
            });
          }
          setShowOverray(false);
          setShowModal(true);
        } catch {
          // ゲームログが正常に保存できなかった場合でも処理は変わらない
          setShowOverray(false);
          setShowModal(true);
        }
      } else {
        const nextCurrentUser: CurrentUser = currentUser === 0 ? 1 : 0;
        setCurrentUser(nextCurrentUser);
      }
    }

    setShowOverray(false);
  };
  return (
    <>
      {" "}
      <GomokuBoard
        onClick={(e: React.MouseEvent<HTMLInputElement>) => onClickHandle(e)}
      >
        {showOverray && <GlobalOverray />}
        {showOverray && <GlobalSpinner animation="border" />}
        {currentSquareList.map((v, x) => {
          return <Row currentSquareRow={v} x={x} key={x} />;
        })}
      </GomokuBoard>
      <UserSection currentUser={currentUser} />
      <FinishButton>
        <Link to="/">
          <Button variant="dark">ゲームを終了する</Button>
        </Link>
      </FinishButton>
      <CompleteModal show={showModal} currentUser={currentUser} />
    </>
  );
};

const GomokuBoard = styled(Card)`
  background: url(${process.env.PUBLIC_URL}/gomoku-background.jpg);
  margin: 0 auto;
  max-width: 1000px;
  max-height: 1000px;
  border: 2px #000000 solid;
  border-radius: 10px;
`;

const FinishButton = styled.div`
  margin: 15px;
  text-align: right;
`;